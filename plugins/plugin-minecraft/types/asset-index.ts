export type AssetIndex = {
	objects: {
		[key: string]: {
			hash: string;
			size: number;
		};
	};
};
