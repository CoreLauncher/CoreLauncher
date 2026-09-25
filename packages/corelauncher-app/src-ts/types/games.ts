export type GameProvider = {
	id: string;
	pluginId: string;

	name: string;
};

export type GameInstance = {
	id: string;
	pluginId: string;

	name: string;
	icon: string | null;
	capsule: string | null;
	banner: string | null;
};

export type GameProfile = {
	id: string;
	pluginId: string;

	name: string;
};
