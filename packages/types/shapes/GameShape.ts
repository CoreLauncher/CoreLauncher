export abstract class GameShape {
	abstract id: string;
	abstract name: string;

	abstract launch(): boolean | string | Promise<boolean | string>;
}
