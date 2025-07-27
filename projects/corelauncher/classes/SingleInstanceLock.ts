import { join } from "node:path";
import getPort from "get-port";
import { TypedEmitter } from "tiny-typed-emitter";
import { applicationDirectory } from "../util/directories";

const listenPort = await getPort();

interface SingleInstanceLockEvents {
	instance: (args: string[]) => void;
}

/**
 * This class makes it only one instance of the application running at a time and forwards new instances to the existing instance.
 */
export default class SingleInstanceLock extends TypedEmitter<SingleInstanceLockEvents> {
	private static lockfile = join(applicationDirectory(), "CoreLauncher.lock");

	static async check() {
		const file = await Bun.file(SingleInstanceLock.lockfile);
		const exists = await file.exists();
		if (!exists) return;
		const port = await file.text();

		try {
			await fetch(`http://localhost:${port}`, {
				method: "POST",
				body: JSON.stringify(Bun.argv.splice(2)),
			});
			process.exit(0);
		} catch {
			console.log("err");
		}
	}

	constructor() {
		super();
		Bun.serve({
			hostname: "127.0.0.1",
			port: listenPort,
			fetch: async (request) => {
				console.log(request);
				const args = await request.json();
				this.emit("instance", args);
				return new Response("OK");
			},
		}).unref();

		Bun.write(SingleInstanceLock.lockfile, listenPort.toString());
	}
}
