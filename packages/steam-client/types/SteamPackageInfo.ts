/**
 * This type is intended to be used by the decoded buffer from the CMsgClientPICSProductInfoResponse message
 */
export type SteamPackageInfo = {
	packageid: number;
	billingtype: number;
	licensetype: number;
	status: number;
	extended: unknown;
	appids: number[];
	depotids: number[];
	appitems: number[];
};
