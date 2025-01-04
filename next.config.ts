import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Credentials",
						value: "true"
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*"
					}
				]
			}
		];
	}
};

module.exports = nextConfig;

export default nextConfig;
