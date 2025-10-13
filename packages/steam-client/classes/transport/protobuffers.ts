import {
	CMsgClientAccountInfo,
	CMsgClientClanState,
	CMsgClientEmailAddrInfo,
	CMsgClientFriendsGroupsList,
	CMsgClientFriendsList,
	CMsgClientGameConnectTokens,
	CMsgClientHeartBeat,
	CMsgClientIsLimitedAccount,
	CMsgClientLicenseList,
	CMsgClientLogon,
	CMsgClientLogonResponse,
	CMsgClientPlayerNicknameList,
	CMsgClientPlayingSessionState,
	CMsgClientServersAvailable,
	CMsgClientWalletInfoUpdate,
	CMsgMulti,
	CMsgProtoBufHeader,
	EMsg,
} from "../../protobuf/compiled";

export const PROTOBUFFERS = {
	[EMsg.k_EMsgMulti]: CMsgMulti,

	[EMsg.k_EMsgClientHeartBeat]: CMsgClientHeartBeat,

	[EMsg.k_EMsgClientLogOnResponse]: CMsgClientLogonResponse,
	[EMsg.k_EMsgClientFriendsList]: CMsgClientFriendsList,
	[EMsg.k_EMsgClientAccountInfo]: CMsgClientAccountInfo,
	[EMsg.k_EMsgClientClanState]: CMsgClientClanState,
	[EMsg.k_EMsgClientGameConnectTokens]: CMsgClientGameConnectTokens,
	[EMsg.k_EMsgClientLicenseList]: CMsgClientLicenseList,
	[EMsg.k_EMsgClientLogon]: CMsgClientLogon,
	[EMsg.k_EMsgClientWalletInfoUpdate]: CMsgClientWalletInfoUpdate,

	[EMsg.k_EMsgClientIsLimitedAccount]: CMsgClientIsLimitedAccount,
	[EMsg.k_EMsgClientEmailAddrInfo]: CMsgClientEmailAddrInfo,
	[EMsg.k_EMsgClientServersAvailable]: CMsgClientServersAvailable,
	[EMsg.k_EMsgClientFriendsGroupsList]: CMsgClientFriendsGroupsList,
	[EMsg.k_EMsgClientPlayerNicknameList]: CMsgClientPlayerNicknameList,

	[EMsg.k_EMsgClientPlayingSessionState]: CMsgClientPlayingSessionState,

	CMsgProtoBufHeader: CMsgProtoBufHeader,
};
