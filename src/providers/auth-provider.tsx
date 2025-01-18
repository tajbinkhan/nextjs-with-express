"use client";

import { useState } from "react";

import axiosApi from "@/lib/axios-config";

import { AuthContext } from "@/context/auth-context";
import { apiRoute } from "@/routes/routes";

interface AuthProviderProps extends GlobalLayoutProps {
	userData: User | null;
	children: React.ReactNode;
}

export const AuthProvider = ({ children, userData }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(userData);

	// useEffect(() => {
	// 	const fetchUserData = async () => {
	// 		const user = await fetchUser();
	// 		setUser(user);
	// 	};

	// 	fetchUserData();
	// }, []);

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
