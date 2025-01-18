"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axiosApi from "@/lib/axios-config";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";

import { apiRoutePrefix } from "@/core/constant";
import { useAuth } from "@/hooks/use-auth";
import { apiRoute } from "@/routes/routes";
import { requestUser } from "@/server/request-auth";

const LoginFormSchema = z.object({
	username: z.string().nonempty(),
	password: z.string().nonempty()
});

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
	const { setUser } = useAuth();

	const form = useForm<LoginFormSchemaType>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			username: "",
			password: ""
		}
	});

	const isSubmitting = form.formState.isSubmitting;

	const handleGoogleLogin = async () => {
		try {
			window.location.href = apiRoutePrefix + apiRoute.googleLogin;
		} catch (error: any) {
			console.log("Google login error:", error);
		}
	};

	const onSubmit = async (data: LoginFormSchemaType) => {
		await requestUser(data.username, data.password);
		await axiosApi
			.post(apiRoute.login, data, { withCredentials: true })
			.then(response => {
				setUser(response.data.data.user);
			})
			.catch(error => {
				console.log("error", error);
			});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
				<div className="grid gap-2">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username Or Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter your username or email address" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid gap-2">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center">
									<FormLabel>Password</FormLabel>
									<Link href="#" className="ml-auto inline-block text-sm underline">
										Forgot your password?
									</Link>
								</div>

								<FormControl>
									<PasswordInput placeholder="************" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<LoadingButton isLoading={isSubmitting} loadingText="Logging In..." className="w-full">
					Login
				</LoadingButton>
				<Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin}>
					Login with Google
				</Button>
			</form>
		</Form>
	);
}
