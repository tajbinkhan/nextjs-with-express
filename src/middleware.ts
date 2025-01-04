import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
	DEFAULT_LOGIN_REDIRECT,
	DEFAULT_LOGIN_URL,
	appRoutePrefix,
	dynamicPrivateRoutes,
	staticPrivateRoutes,
	staticProtectedRoutes
} from "@/routes/middleware-routes";
import { fetchUser } from "@/server/fetch-auth";

function isPathMatch(path: string): boolean {
	// Regular expression to match a valid path
	const regex = /^\/[\w\/\-]+\/[\w\-=\d]+$/;

	// Ensure the path does not contain query parameters (like "?id=...")
	return regex.test(path) && !path.includes("?");
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const user = await fetchUser();
	const isLoggedIn = user !== null;
	const { nextUrl } = request;
	const appPrefixPathname = `${appRoutePrefix}${nextUrl.pathname}`;

	const isPrivateRoute = staticPrivateRoutes.includes(nextUrl.pathname);
	const isProtectedRoute = staticProtectedRoutes.includes(nextUrl.pathname);

	const getSearchParams = nextUrl.searchParams.get("redirect");

	/**
	 * if the route is private and the user is logged in, then allow access
	 * if the route is private and the user is not logged in, then redirect to the login page
	 */
	if (isPrivateRoute) {
		// redirect to the login page if the user is not logged in
		const accessedRoute = encodeURIComponent(appPrefixPathname);
		const redirect = new URL(`${DEFAULT_LOGIN_URL}?redirect=${accessedRoute}`, nextUrl);
		if (!isLoggedIn) return NextResponse.redirect(redirect);
	}

	/**
	 * if the route is protected and the user is logged in, then allow access
	 * if the route is protected and the user is not logged in, then redirect to the login page
	 */
	if (isProtectedRoute) {
		// redirect to DEFAULT_LOGIN_REDIRECT if the user is logged in
		if (isLoggedIn) return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

		// redirect to the login page with redirect url if the user is not logged in
		const redirectUrl = `${appRoutePrefix}${DEFAULT_LOGIN_REDIRECT}`;
		const accessedRoute = encodeURIComponent(redirectUrl);
		const redirect = new URL(`${nextUrl.pathname}?redirect=${accessedRoute}`, nextUrl);
		if (!getSearchParams) return NextResponse.redirect(redirect);
	}

	/**
	 * if the route is dynamic private and the user is logged in, then allow access
	 * if the route is dynamic private and the user is not logged in, then redirect to the login page
	 */
	dynamicPrivateRoutes.forEach(route => {
		const url = `${route.split(":")[0]}/`;
		// check if the route is dynamic and the user is not logged in
		if (nextUrl.pathname.startsWith(url) && isPathMatch(nextUrl.pathname)) {
			// redirect to the login page if the user is not logged in
			const accessedRoute = encodeURIComponent(appPrefixPathname);
			const redirect = new URL(`${DEFAULT_LOGIN_URL}?redirect=${accessedRoute}`, nextUrl);
			if (!isLoggedIn) return NextResponse.redirect(redirect);
		}
	});

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
	]
};
