"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

import { apiRoutePrefix } from "@/core/constant";
import { apiRoute } from "@/routes/routes";

async function setCookies(cookieArray: string[]) {
	const cookieStore = await cookies();

	cookieArray.forEach(cookieString => {
		// Parse each cookie string to extract key components
		const [name, ...parts] = cookieString.split("=");
		const value = parts.join("="); // Rejoin in case value contains '=' characters

		// Extract cookie options using regex
		const maxAgeMatch = value.match(/Max-Age=(\d+)/);
		const pathMatch = value.match(/Path=([^;]+)/);
		const expiresMatch = value.match(/Expires=([^;]+)/);

		const cookieValues = {
			name: name,
			value: value.split(";")[0], // Get the actual value before options
			httpOnly: value.includes("HttpOnly"),
			secure: value.includes("Secure"),
			sameSite: (value.includes("SameSite=None") ? "none" : "lax") as ResponseCookie["sameSite"],
			path: pathMatch ? pathMatch[1] : "/",
			maxAge: maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined,
			expires: expiresMatch ? new Date(expiresMatch[1]) : undefined
		};

		cookieStore.set(cookieValues);
	});
}

export const requestUser = async (username: string, password: string) => {
	let cookieCSRFToken: string | null = null;
	let CSRFToken: string | null = null;
	const csrfRoute = apiRoutePrefix + apiRoute.csrfToken;

	await fetch(csrfRoute, { method: "GET" })
		.then(async response => {
			cookieCSRFToken = response.headers.get("set-cookie")?.split(";")[0].split("=")[1]!;
			const data = await response.json();
			CSRFToken = data.data;
		})
		.catch(error => {
			console.error("Error fetching CSRF token:", error);
			return null;
		});

	if (!CSRFToken) {
		console.error("CSRF token not found");
		return null;
	}

	const data = { username, password };
	const cookieHeader = new Headers();
	cookieHeader.append("Cookie", `csrf-token=${cookieCSRFToken}`);
	cookieHeader.append("Content-Type", "application/json");
	cookieHeader.append("X-CSRF-Token", CSRFToken);

	const route = apiRoutePrefix + apiRoute.login;

	const user = await fetch(route, {
		method: "POST",
		body: JSON.stringify(data),
		headers: cookieHeader
	})
		.then(async response => {
			if (response.status === 401) {
				return null;
			}
			const data = await response.json();
			await setCookies(response.headers.getSetCookie());
			const user = data.data.user as User;
			return user;
		})
		.catch(error => {
			console.error("Error fetching user:", error);
			return null;
		});

	// if (jwtToken) cookieHeader.append("Cookie", `jwt-token=${jwtToken}`);
	// if (sessionId) cookieHeader.append("Cookie", `session-id=${sessionId}`);

	return user;
};
