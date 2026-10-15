import sql from "mssql";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

const config: sql.config = {
    server: requireEnv("DB_SERVER"),
    port: Number(process.env.DB_PORT || 1433),
    database: requireEnv("DB_DATABASE"),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30_000,
    },
};

// Cache PROMISE thay vì cache pool.
// - Nhiều request đến cùng lúc sẽ cùng await MỘT promise → cùng nhận MỘT pool.
// - `if (!poolPromise)` và `poolPromise = ...` nằm sát nhau, không có `await`
//   xen giữa → không request nào chen vào được → không race.
let poolPromise: Promise<sql.ConnectionPool> | null;

async function createPool(): Promise<sql.ConnectionPool> {
    const pool = new sql.ConnectionPool(config);

    // Guard: chỉ đóng pool một lần dù event "error" fire nhiều lần.
    let closing = false;

    pool.on("error", (err: Error) => {
        console.error("[db] pool error:", err);

        if (closing) return;
        closing = true;

        // Đóng pool để giải phóng connection.
        // Nuốt lỗi vì pool đã hỏng, close() có thể throw.
        pool.close().catch(() => {
            // bỏ qua — pool đã hỏng, chỉ cần dọn
        });

        // Reset cache CHỈ khi promise hiện tại vẫn là promise của pool này.
        // Nếu request khác đã thay poolPromise bằng promise mới, không đụng vào.
        if (poolPromise) {
            poolPromise.catch(() => { /* nuốt lỗi cũ nếu có */ });
            poolPromise = null;
        }
    });
    await pool.connect();
    return pool;
}

export async function getDb(): Promise<sql.ConnectionPool> {
    if (poolPromise) return poolPromise;

    // Gán promise NGAY LẬP TỨC — không await giữa check và gán.
    // Reset CHỈ khi fail — giữ cache khi thành công để không race.

    poolPromise = createPool().catch((err) => {
        // Nếu không reset: promise rejected bị cache vĩnh viễn, mọi request sau đều nhận cùng lỗi cũ dù DB đã hoạt động lại
        poolPromise = null;
        throw err;
    });

    return poolPromise;
}

export async function closeDb(): Promise<void> {
    if (!poolPromise) return;

    // Lấy promise ra biến local rồi mới set null:
    // tránh trường hợp getDb() được gọi xen vào giữa 2 dòng và gán
    // poolPromise mới, rồi dòng dưới xoá mất promise mới đó.
    const promise = poolPromise;
    poolPromise = null;

    try {
        const pool = await promise;
        await pool.close();
    } catch {
        // pool có thể đã hỏng trước khi closeDb() gọi — không cần xử lý.
    }
}