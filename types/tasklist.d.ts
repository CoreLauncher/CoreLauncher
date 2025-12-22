type TasklistProcess = {
	imageName: string;
	pid: number;
	sessionName: "Console" | "Services";
	sessionNumber: number;
	memUsage: number;
};

declare module "tasklist" {
	export function tasklist(): Promise<TasklistProcess[]>;
}
