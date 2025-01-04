"use server";

import { cookies } from "next/headers";

import { apiRoutePrefix } from "@/core/constant";
import { apiRoute } from "@/routes/routes";

export const fetchUser = async (): Promise<User | null> => {
	const cookieHeader = new Headers();
	const cookieStore = await cookies();
	const jwtToken = cookieStore.get("jwt-token")?.value;
	const sessionId = cookieStore.get("session-id")?.value;

	if (jwtToken) cookieHeader.append("Cookie", `jwt-token=${jwtToken}`);
	if (sessionId) cookieHeader.append("Cookie", `session-id=${sessionId}`);

	const route = apiRoutePrefix + apiRoute.me;
	const user = await fetch(route, {
		method: "GET",
		credentials: "include",
		headers: cookieHeader
	})
		.then(async response => {
			if (response.status === 401) {
				return null;
			}
			const data = await response.json();
			const user = data.data as User;
			return user;
		})
		.catch(error => {
			// console.error("Error fetching user:", error);
			return null;
		});

	return user;
};
