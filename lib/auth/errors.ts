export class AuthError extends Error {
    constructor(message: string, public status: 401 | 403) {
        super(message)
        this.name = "AuthError"
    }
}
export class UnauthorizedError extends AuthError {
    constructor(msg = "Unauthorized") { super(msg, 401); }
}

export class ForbiddenError extends AuthError {
    constructor(msg = "Forbidden") { super(msg, 403); }
}