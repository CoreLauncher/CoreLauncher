export type Game = {
	id: string;
	name: string;
};

export type AccountProvider = {
	id: string;
	name: string;
	color: string;
	logo: string;
};

export type AccountInstance = {
	id: string;
	name: string;
	providerId: string;
	icon?: string;
};
