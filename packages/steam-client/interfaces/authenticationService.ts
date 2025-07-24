import { request } from "../util/request";

export async function beginAuthSessionViaQR(options: {
	device_friendly_name: string;
	platform_type: number;
	device_details?: string;
	website_id?: string;
}) {
	return (await request({
		interface: "IAuthenticationService",
		method: "BeginAuthSessionViaQR",
		httpMethod: "POST",
		data: {
			device_friendly_name: options.device_friendly_name,
			platform_type: options.platform_type,
			device_details: options.device_details ?? "",
			website_id: options.website_id ?? "",
		},
	})) as {
		client_id: string;
		challenge_url: string;
		request_id: string;
		interval: 5;
		allowed_confirmations: {
			confirmation_type: number;
		}[];
		version: number;
	};
}

export async function pollAuthSessionStatus(options: {
	client_id: string;
	request_id: string;
	token_to_revoke?: string;
}) {
	return (await request({
		interface: "IAuthenticationService",
		method: "PollAuthSessionStatus",
		httpMethod: "POST",
		data: {
			client_id: options.client_id,
			request_id: options.request_id,
			token_to_revoke: options.token_to_revoke,
		},
	})) as
		| { had_remote_interaction: boolean }
		| {
				new_client_id: string;
				new_challenge_url: string;
				had_remote_interaction: boolean;
		  }
		| Record<string, never>;
}
