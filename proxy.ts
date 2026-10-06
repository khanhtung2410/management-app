import { NextResponse } from 'next/server'; 
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathName = request.nextUrl.pathname;

    const isAdminRoute = pathName.startsWith('/admin');
    const isProtected = pathName.startsWith('/tasks');
    const isLoginRoute = pathName === '/login';

    if (!token) {
        if (isAdminRoute || isProtected) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        return NextResponse.next();
    }

    try {
        const payload = await verifyToken(token);
        const roleId = Number(payload.roleId);
        if (isLoginRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        if (isAdminRoute && roleId !== 2) {
            return NextResponse.redirect(new URL("/403", request.url));
        }

        return NextResponse.next();
    } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
    }
}
export const config = {
    matcher: ['/admin/:path*', '/tasks/:path*','/login'],
};