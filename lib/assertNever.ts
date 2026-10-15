export function assertNever(value: never): never {
    throw new Error(`Trạng thái chưa được xử lý: ${JSON.stringify(value)}`);
}