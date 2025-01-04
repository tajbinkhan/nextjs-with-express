import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

const PasswordInput = forwardRef<
	HTMLInputElement,
	Omit<React.ComponentProps<typeof Input>, "type">
>(({ ...props }, ref) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				type={visible ? "text" : "password"}
				ref={ref}
				{...props}
				className={cn("pr-10", props.className)}
			/>
			<div className="absolute right-4 top-1/2 -translate-y-1/2">
				{visible ? (
					<FaEye className="cursor-pointer" onClick={() => setVisible(!visible)} />
				) : (
					<FaEyeSlash className="cursor-pointer" onClick={() => setVisible(!visible)} />
				)}
			</div>
		</div>
	);
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
