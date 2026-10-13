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

let pool: sql.ConnectionPool | null = null;

export async function getDb(): Promise<sql.ConnectionPool> {
    // Còn sống → dùng lại
    if (pool?.connected) {
        return pool;
    }

    // Pool cũ chết → đóng sạch trước khi tạo mới
    if (pool) {
        try {
            await pool.close();
        } catch {
            // bỏ qua — pool đã hỏng, chỉ cần dọn
        }
        pool = null;
    }

    // Tạo pool mới
    const newPool = new sql.ConnectionPool(config);

    // Bắt event error để không crash process
    newPool.on("error", (err) => {
        console.error("[db] pool error:", err);
        // Đánh dấu pool hỏng để lần sau tạo mới
        if (pool === newPool) {
            pool = null;
        }
    });

    await newPool.connect();
    pool = newPool;
    return pool;
}

export async function closeDb(): Promise<void> {
    if (!pool) return;
    try {
        await pool.close();
    } finally {
        pool = null;
    }
}