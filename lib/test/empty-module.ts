// Placeholder cho "server-only" trong môi trường test.
// Trong production, Next.js resolve "server-only" thành module sentinel
// để throw khi bị bundle vào client. Vitest không có cơ chế đó, nên alias
// về file rỗng này để test import được server-side modules.
export {};
