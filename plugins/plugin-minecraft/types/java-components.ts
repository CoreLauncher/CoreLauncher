type Download = {
	sha1: string;
	size: number;
	url: string;
};

export type JavaComponentIndex = {
	[key: string]: {
		[key: string]: [
			{
				availablity: { group: number; progress: number };
				manifest: Download;
				version: { name: string; released: string };
			},
		];
	};
};

export type JavaComponentManifest = {
	files: {
		[key: string]:
			| {
					type: "directory";
			  }
			| {
					type: "file";
					executable: boolean;
					downloads: {
						lzma: Download;
						raw: Download;
					};
			  };
	};
};
