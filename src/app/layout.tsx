import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import SessionProvider from "@/providers/session-provider";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin", "latin-ext"],
	variable: "--font-poppins",
	display: "swap",
	preload: true,
	adjustFontFallback: true,
	fallback: ["sans-serif"],
	style: "normal"
});

export const metadata: Metadata = {
	title: "Authentication With Express",
	description: "Authentication With Express"
};

export default async function RootLayout({ children }: Readonly<GlobalLayoutProps>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(poppins.variable, "antialiased")} suppressHydrationWarning>
				<SessionProvider>
					{children}
					{/* <SocketProvider>{children}</SocketProvider> */}
				</SessionProvider>
			</body>
		</html>
	);
}
