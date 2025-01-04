import { route } from "@/routes/routes";

const [dynamicPublicRoutes, dynamicPrivateRoutes, dynamicProtectedRoutes] = Object.values(
	route
).map(obj => {
	const dynamicRoute = Object.values(obj)
		.map(value => {
			// If the value is a function, dynamically generate the route pattern
			if (typeof value === "function") {
				// Extract the function's string representation
				const funcString = value.toString();

				// Use regex to extract the base path from the function body
				const basePathMatch = funcString.match(/`([^`]+)\//);

				// Extract the parameter name
				const paramMatch = funcString.match(/\(([^)]+)\)/);

				// If both matches are found, create a dynamic route pattern
				if (basePathMatch && paramMatch) {
					const basePath = basePathMatch[1];
					const paramName = paramMatch[1];
					return `${basePath}:${paramName}`;
				}
			}
			return value;
		})
		.flat()
		.filter((route): route is string => typeof route === "string" && route.includes(":"));
	return dynamicRoute;
});

const [staticPublicRoutes, staticPrivateRoutes, staticProtectedRoutes] = Object.values(route).map(
	obj => {
		const staticRoutes = Object.values(obj)
			.map(value => {
				return typeof value !== "function" && value;
			})
			.filter((route): route is string => typeof route === "string");
		return staticRoutes;
	}
);

const DEFAULT_HOMEPAGE = route.public.home;
const DEFAULT_LOGIN_URL = route.protected.login;
const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;

export {
	appRoutePrefix,
	DEFAULT_HOMEPAGE,
	DEFAULT_LOGIN_REDIRECT,
	DEFAULT_LOGIN_URL,
	dynamicPrivateRoutes,
	dynamicProtectedRoutes,
	dynamicPublicRoutes,
	staticPrivateRoutes,
	staticProtectedRoutes,
	staticPublicRoutes
};
