export interface Database {
	accounts: {
		id: string;
		name: string;
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
	};
}
