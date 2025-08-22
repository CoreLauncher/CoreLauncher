import type {
	AccountInstanceShape,
	AccountProviderShape,
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
	accountProviders: InstanceType<typeof AccountProviderShape>[] = [];
	accountInstances: InstanceType<typeof AccountInstanceShape>[] = [];

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

		this.instance.on("ready", () => {
			this.emit("ready");
		});

		this.instance.on("games", (games) => {
			this.games = games;
			this.emit("games", games);
		});

		this.instance.on("account_providers", (providers) => {
			this.accountProviders = providers;
			this.emit("account_providers", providers);
		});

		this.instance.on("account_instances", (instances) => {
			this.accountInstances = instances;
			this.emit("account_instances", instances);
		});
	}
}
