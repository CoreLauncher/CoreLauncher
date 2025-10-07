export type ClassProperties<C> = {
	// biome-ignore lint/complexity/noBannedTypes: This is some crazy type wizardry
	[Key in keyof C as C[Key] extends Function ? never : Key]: C[Key];
};
