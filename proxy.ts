import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAuth, ForbiddenError, AuthError } from '@/lib/auth';
import { userRole } from './constants/roles';

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    const isAdminRoute = pathName.startsWith('/admin');
    const isTasksRoute = pathName.startsWith('/tasks');
    const isLoginRoute = pathName === '/login';

    if (!isAdminRoute && !isTasksRoute && !isLoginRoute) {
        return NextResponse.next();
    }

    if (isLoginRoute) {
        try {
            await requireAuth(request);
            return NextResponse.redirect(new URL("/", request.url));
        } catch {
            return NextResponse.next();
        }
    }

    try {
        const payload = await requireAuth(request);

        if (isAdminRoute && payload.roleId !== userRole.ADMIN) {
            throw new ForbiddenError();
        }

        return NextResponse.next();

    } catch (err) {
        if (err instanceof AuthError) {
            const isForbidden = err.status === 403;
            const response = NextResponse.redirect(
                new URL(isForbidden ? "/403" : "/login", request.url)
            );
            if (!isForbidden) {
                response.cookies.delete("token");
            }
            return response;
        }

        console.error("Middleware error:", err);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}
export const config = {
    matcher: ['/admin/:path*', '/tasks/:path*', '/login'],
};