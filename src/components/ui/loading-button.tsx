"use client";

import { Loader2 } from "lucide-react";

import LoadingBoundary from "@/components/ui/loading-boundary";

import { Button, ButtonProps } from "./button";

type LoadingButtonProps = ButtonProps & {
	isLoading: boolean;
	children: React.ReactNode;
	loadingText: string;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
	isLoading,
	children,
	loadingText,
	className,
	...rest
}) => {
	return (
		<Button type="submit" className={className} disabled={isLoading} {...rest}>
			<LoadingBoundary
				isLoading={isLoading}
				fallback={
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{loadingText}
					</>
				}
			>
				{children}
			</LoadingBoundary>
		</Button>
	);
};
