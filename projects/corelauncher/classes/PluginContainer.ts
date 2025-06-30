import type {
	GameShape,
	PluginExport,
	PluginShape,
	PluginShapeEvents,
} from "@corelauncher/types";
import { TypedEmitter } from "tiny-typed-emitter";
import type PluginManager from "./PluginManager";
import PluginPortal from "./PluginPortal";

interface PluginContainerEvents extends PluginShapeEvents {}

export default class PluginContainer extends TypedEmitter<PluginContainerEvents> {
	id: string;
	name: string;
	description: string;
	plugin: new (
		...args: ConstructorParameters<typeof PluginShape>
	) => PluginShape;

	games: InstanceType<typeof GameShape>[] = [];

	instance: InstanceType<typeof PluginShape> | null = null;

	portal: PluginPortal;
	pluginManager: PluginManager;
	constructor(pluginManager: PluginManager, data: PluginExport) {
		super();
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.plugin = data.Plugin;

		this.pluginManager = pluginManager;
		this.portal = new PluginPortal(this);

		this.enable();
	}

	enable() {
		this.instance = new this.plugin(this.portal);

		this.instance.on("games", (games) => {
			this.games = games;
			this.emit("games", games);
		});

		this.instance.on("ready", () => {
			this.emit("ready");
		});
	}
}
