import { PuffLoader } from "react-spinners";

interface LoaderProps {
	height?: number;
}

export default function Loader({ height }: LoaderProps) {
	return (
		<div
			className="flex h-96 w-full items-center justify-center"
			style={{
				height: height ? `${height}rem` : "24rem"
			}}
		>
			<PuffLoader />
		</div>
	);
}
