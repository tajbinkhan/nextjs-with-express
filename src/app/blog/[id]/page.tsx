interface BlogDetailsProps {
	params: Promise<{ id: string }>;
}

export default async function BlogDetails({ params }: BlogDetailsProps) {
	const { id } = await params;
	return <div>{id}</div>;
}
