export type SteamLibraries = {
	libraryfolders: {
		path: string;
		label: string;
		contentid: number;
		totalsize: number;
		update_clean_bytes_tally: number;
		time_last_update_verified: number;
		apps: {
			[key: string]: number;
		};
	}[];
};
