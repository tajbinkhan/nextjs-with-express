"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useSocket } from "@/hooks/use-socket";

interface Message {
	id: number;
	sender: string;
	content: string;
	timestamp: string;
	isYou: boolean;
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { socket } = useSocket();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (!socket) return;

		socket.on("message", message => {
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
		});

		return () => {
			socket.off("message");
		};
	}, [socket, messages.length]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = () => {
		if (newMessage.trim() === "" || !socket) return;

		const message: Message = {
			id: messages.length + 1,
			sender: "You",
			content: newMessage,
			timestamp: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}),
			isYou: true
		};

		socket.emit("message", {
			content: newMessage
		});

		setMessages(prev => [...prev, message]);
		setNewMessage("");
	};

	return (
		<div className="flex h-screen items-center justify-center">
			<Card className="mx-auto flex h-[600px] w-full max-w-md flex-col">
				<CardHeader className="border-b">
					<div className="flex items-center">
						<Avatar className="mr-3 h-10 w-10">
							<AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=Alice" />
							<AvatarFallback>A</AvatarFallback>
						</Avatar>
						<CardTitle>Alice</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex-grow overflow-hidden">
					<ScrollArea className="h-full pr-4 pt-2">
						{messages.map(message => (
							<div
								key={message.id}
								className={cn("mb-4 flex", message.isYou ? "justify-end" : "justify-start")}
							>
								<div
									className={cn(
										"max-w-[70%] break-all rounded-lg p-3",
										message.isYou ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
									)}
								>
									<p>{message.content}</p>
									<span
										className={cn(
											"text-xs",
											message.isYou ? "text-blue-100" : "text-gray-500",
											"mt-1 block text-right"
										)}
									>
										{message.timestamp}
									</span>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</ScrollArea>
				</CardContent>
				<CardFooter className="border-t">
					<form
						onSubmit={e => {
							e.preventDefault();
							handleSendMessage();
						}}
						className="mt-4 flex w-full items-center space-x-2"
					>
						<Input
							type="text"
							placeholder="Type a message..."
							value={newMessage}
							onChange={e => setNewMessage(e.target.value)}
							className="flex-grow"
						/>
						<Button type="submit" size="icon" className="shrink-0">
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</Button>
					</form>
				</CardFooter>
			</Card>
		</div>
	);
}
