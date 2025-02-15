import { AuthProvider } from "@/providers/auth-provider";
import { fetchUser } from "@/server/fetch-auth";

export default async function SessionProvider({ children }: GlobalLayoutProps) {
	const user = await fetchUser();
	console.log(`\n---------- ${new Date().toLocaleTimeString()} ----------`);
	console.log("user", user);
	return <AuthProvider userData={user}>{children}</AuthProvider>;
}
