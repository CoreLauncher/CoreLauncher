import type {
	PluginExport,
	PluginShape,
	PluginShapeEvents,
} from "@corelauncher/sdk";
import { TypedEmitter } from "@corelauncher/typed-emitter";
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

		this.instance.on("game_providers_updated", () => {
			this.emit("game_providers_updated");
		});

		this.instance.on("game_instances_updated", () => {
			this.emit("game_instances_updated");
		});

		this.instance.on("game_profiles_updated", () => {
			this.emit("game_profiles_updated");
		});

		this.instance.on("account_providers_updated", () => {
			this.emit("account_providers_updated");
		});

		this.instance.on("account_instances_updated", () => {
			this.emit("account_instances_updated");
		});
	}

	get gameProviders() {
		return this.instance?.gameProviders || [];
	}

	get gameInstances() {
		return this.instance?.gameInstances || [];
	}

	get gameProfiles() {
		return this.instance?.gameProfiles || [];
	}

	get accountProviders() {
		return this.instance?.accountProviders || [];
	}

	get accountInstances() {
		return this.instance?.accountInstances || [];
	}
}
