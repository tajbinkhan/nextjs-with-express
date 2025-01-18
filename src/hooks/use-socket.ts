import { useContext } from "react";

import { SocketContext } from "@/context/socket-context";

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};
