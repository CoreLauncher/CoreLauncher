export type AccountProvider = {
	id: string;
	pluginId: string;

	name: string;
	description: string | null;
	color: string;
	icon: string;
};

export type AccountInstance = {
	id: string;
	pluginId: string;
	providerId: string;

	name: string;
	avatar: string | null;
};
