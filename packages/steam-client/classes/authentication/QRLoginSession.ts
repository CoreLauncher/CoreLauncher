import { TypedEmitter } from "tiny-typed-emitter";
import {
	beginAuthSessionViaQR,
	pollAuthSessionStatus,
} from "../../interfaces/authenticationService";

interface QRLoginSessionEvents {
	change: () => void; // the qr changed
	interaction: (interaction: string) => void; // user interacted with the QR code
	complete: (session: QRLoginSession) => void; // the authentication is complete
}

type Options = {
	deviceName: string;
};

enum QRLoginSessionState {
	Initial = "initial",
	Active = "active",
	Interaction = "interaction",
	Complete = "complete",
}

export class QRLoginSession extends TypedEmitter<QRLoginSessionEvents> {
	deviceName: string;

	state: QRLoginSessionState = QRLoginSessionState.Initial;
	pollInterval: NodeJS.Timeout | null = null;

	clientId: string | null = null;
	challengeUrl: string | null = null;
	requestId: string | null = null;

	constructor(options: Options) {
		super();

		this.deviceName = options.deviceName;
		this.load();
	}

	private async load() {
		const data = await beginAuthSessionViaQR({
			device_friendly_name: this.deviceName,
			platform_type: 1, // 1 for desktop
		});
		console.log(data);

		this.clientId = data.client_id;
		this.challengeUrl = data.challenge_url;
		this.requestId = data.request_id;

		if (this.pollInterval) clearInterval(this.pollInterval);
		this.pollInterval = setInterval(
			this.poll.bind(this),
			// data.response.interval * 1000,
			1000,
		);

		this.state = QRLoginSessionState.Active;
		this.emit("change");
	}

	private async poll() {
		if (!this.clientId || !this.requestId)
			throw new Error("Authentication session not initialized");

		const data = await pollAuthSessionStatus({
			client_id: this.clientId,
			request_id: this.requestId,
		});

		if ("new_client_id" in data) {
			this.clientId = data.new_client_id;
			this.challengeUrl = data.new_challenge_url;
			this.emit("change");
		}

		if (!("had_remote_interaction" in data)) {
			return await this.load();
		}

		if (
			data.had_remote_interaction &&
			this.state !== QRLoginSessionState.Interaction
		) {
			this.state = QRLoginSessionState.Interaction;
			this.emit("interaction", this.challengeUrl!);
		}

		console.log(data);
	}

	destroy() {
		if (this.pollInterval) clearInterval(this.pollInterval);
		this.pollInterval = null;

		this.state = QRLoginSessionState.Initial;
		this.clientId = null;
		this.challengeUrl = null;
		this.requestId = null;

		this.emit("complete", this);
	}
}
