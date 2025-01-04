"use client";

import { useEffect, useState } from "react";

import axiosApi from "@/lib/axios-config";

import { AuthContext } from "@/context/auth-context";
import { apiRoute } from "@/routes/routes";
import { fetchUser } from "@/server/fetch-auth";

export const AuthProvider = ({ children }: GlobalLayoutProps) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const user = await fetchUser();
			setUser(user);
		};

		fetchUserData();
	}, []);

	const logout = async () => {
		await axiosApi
			.post(apiRoute.logout)
			.then(() => {
				setUser(null);
			})
			.catch(error => {
				console.error("Error logging out:", error);
			});
	};

	return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};
