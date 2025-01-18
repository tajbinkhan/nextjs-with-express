export const route = {
	public: {
		home: "/",
		blogId: (id: string) => `/blog/${id}`
	},
	private: {
		dashboard: "/dashboard",
		profile: "/profile",
		blogId: (id: string) => `/blog/${id}`
	},
	protected: {
		login: "/login",
		register: "/register"
	}
};

export const apiRoute = {
	login: "/auth/login",
	googleLogin: "/auth/login/google",
	register: "/auth/register",
	logout: "/auth/logout",
	me: "/auth/me",
	csrfToken: "/csrf-token"
} as const;
