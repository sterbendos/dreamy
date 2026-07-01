import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Only protect the editor and account pages
	const isProtectedRoute = 
		request.nextUrl.pathname.startsWith("/editor") || 
		request.nextUrl.pathname.startsWith("/account");

	if (isProtectedRoute) {
		// Better Auth uses different cookie names in dev vs prod
		const sessionToken = 
			request.cookies.get("better-auth.session_token")?.value ||
			request.cookies.get("__Secure-better-auth.session_token")?.value;
		
		if (!sessionToken) {
			const loginUrl = new URL("/", request.url);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/editor/:path*", "/account/:path*"],
};
