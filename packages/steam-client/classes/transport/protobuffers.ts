import {
	CFriendMessages_AckMessage_Notification,
	CFriendMessages_IncomingMessage_Notification,
	CMsgClientAccountInfo,
	CMsgClientChatInvite,
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
	CMsgClientOfflineMessageNotification,
	CMsgClientPlayerNicknameList,
	CMsgClientPlayingSessionState,
	CMsgClientServersAvailable,
	CMsgClientWalletInfoUpdate,
	CMsgMulti,
	CMsgProtoBufHeader,
	EMsg,
} from "../../protobuf/compiled";

export const PROTOBUFFERS = {
	CMsgProtoBufHeader: CMsgProtoBufHeader,

	// 1+
	[EMsg.k_EMsgMulti]: CMsgMulti,

	// 700+
	[EMsg.k_EMsgClientHeartBeat]: CMsgClientHeartBeat,
	[EMsg.k_EMsgClientLogOnResponse]: CMsgClientLogonResponse,
	[EMsg.k_EMsgClientFriendsList]: CMsgClientFriendsList,
	[EMsg.k_EMsgClientAccountInfo]: CMsgClientAccountInfo,
	[EMsg.k_EMsgClientGameConnectTokens]: CMsgClientGameConnectTokens,
	[EMsg.k_EMsgClientLicenseList]: CMsgClientLicenseList,

	// 800+
	[EMsg.k_EMsgClientChatInvite]: CMsgClientChatInvite,
	[EMsg.k_EMsgClientClanState]: CMsgClientClanState,

	// 5000+
	[EMsg.k_EMsgClientIsLimitedAccount]: CMsgClientIsLimitedAccount,
	[EMsg.k_EMsgClientEmailAddrInfo]: CMsgClientEmailAddrInfo,
	[EMsg.k_EMsgClientServersAvailable]: CMsgClientServersAvailable,
	[EMsg.k_EMsgClientLogon]: CMsgClientLogon,
	[EMsg.k_EMsgClientWalletInfoUpdate]: CMsgClientWalletInfoUpdate,
	[EMsg.k_EMsgClientFriendsGroupsList]: CMsgClientFriendsGroupsList,
	[EMsg.k_EMsgClientPlayerNicknameList]: CMsgClientPlayerNicknameList,

	// 7000+
	[EMsg.k_EMsgClientChatOfflineMessageNotification]:
		CMsgClientOfflineMessageNotification,

	// 9000+
	[EMsg.k_EMsgClientPlayingSessionState]: CMsgClientPlayingSessionState,

	// Interfaces
	"FriendMessagesClient.IncomingMessage#1":
		CFriendMessages_IncomingMessage_Notification,
	"FriendMessagesClient.NotifyAckMessageEcho#1":
		CFriendMessages_AckMessage_Notification,
};
