"use client";

import { createContext } from "react";

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
