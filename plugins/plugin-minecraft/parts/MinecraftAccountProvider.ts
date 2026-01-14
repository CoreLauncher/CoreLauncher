import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { AccountProviderShape } from "@corelauncher/types";
import { live } from "@xboxreplay/xboxlive-auth";
import type { Kysely } from "kysely";
import open from "open";
import { noop } from "../../../packages/noop";
import iconSVG from "../assets/minecraft-account-logo.svg";
import { CLIENT_ID, REDIRECT_URI, SCOPE } from "../constants";
import type { Database } from "../types/database";
import MinecraftAccountInstance from "./MinecraftAccountInstance";

interface MinecraftAccountProviderEvents {
	instances_updated: (instances: MinecraftAccountInstance[]) => void;
}

export default class MinecraftAccountProvider extends AccountProviderShape<MinecraftAccountProviderEvents> {
	id = "minecraft";
	name = "Minecraft";
	color = "#52a535";
	logoUrl = dataToDataURL(readFileSync(iconSVG, "utf-8"), "image/svg+xml");

	private database: Kysely<Database>;
	private instances: MinecraftAccountInstance[];

	constructor(database: Kysely<Database>) {
		super();

		this.database = database;
		this.instances = [];

		noop().then(async () => {
			const rows = await this.database
				.selectFrom("accounts")
				.selectAll()
				.execute();

			const instances = await Promise.all(
				rows.map((data) => MinecraftAccountInstance.fromDatabase(data)),
			);

			instances.forEach((instance) => {
				instance.on("disconnect", () => {
					this.disconnect(instance);
				});
			});

			this.instances.push(...instances);
			this.emit("instances_updated", this.instances);
		});
	}

	async handleCode(code: string) {
		const instance = await MinecraftAccountInstance.fromCode(code);
		if (this.instances.find((i) => i.id === instance.id)) return;

		await this.database
			.insertInto("accounts")
			.values(instance.export())
			.execute();

		instance.on("disconnect", () => {
			this.disconnect(instance);
		});

		this.instances.push(instance);
		this.emit("instances_updated", this.instances);
	}

	async connect() {
		console.log("Connecting to Minecraft account provider...");

		console.log(await live.preAuth());

		const authorizeUrl = live.getAuthorizeUrl(
			CLIENT_ID,
			SCOPE.join(" "),
			"code",
			REDIRECT_URI,
		);

		console.log("Authorize URL:", `${authorizeUrl}&prompt=select_account`);
		open(`${authorizeUrl}&prompt=select_account`);
		return true;
	}

	async disconnect(instance: MinecraftAccountInstance) {
		instance.removeAllListeners("disconnect");
		this.instances = this.instances.filter((i) => i.id !== instance.id);
		this.emit("instances_updated", this.instances);

		await this.database
			.deleteFrom("accounts")
			.where("id", "=", instance.rawId)
			.execute();
	}
}
