"use client";

import { useEffect, useState } from "react";

import { useSocket } from "@/hooks/use-socket";

export interface Message {
	id: number;
	sender: string;
	content: string;
	timestamp: string;
	isYou: boolean;
}

export function useMessages(initialMessages: Message[] = []) {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const { socket } = useSocket();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (message: any) => {
			const newMsg: Message = {
				id: messages.length + 1,
				sender: "Alice",
				content: message.content,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				isYou: false
			};
			setMessages(prev => [...prev, newMsg]);
		};

		socket.on("message", handleNewMessage);

		return () => {
			socket.off("message", handleNewMessage);
		};
	}, [socket, messages.length]);

	const sendMessage = (content: string) => {
		if (!socket || content.trim() === "") return;

		const message: Message = {
			id: messages.length + 1,
			sender: "You",
			content,
			timestamp: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}),
			isYou: true
		};

		socket.emit("message", { content });
		setMessages(prev => [...prev, message]);
	};

	return { messages, sendMessage };
}
