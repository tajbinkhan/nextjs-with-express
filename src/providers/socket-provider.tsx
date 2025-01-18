"use client";

import { ReactNode, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import { SocketContext } from "@/context/socket-context";

interface SocketProviderProps {
	children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
			withCredentials: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000
		});

		socketInstance.on("connect", () => {
			setIsConnected(true);
			console.log("Connected to socket server");
		});

		socketInstance.on("disconnect", () => {
			setIsConnected(false);
			console.log("Disconnected from socket server");
		});

		socketInstance.on("connect_error", error => {
			console.log("Socket connection error:", error);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
}
