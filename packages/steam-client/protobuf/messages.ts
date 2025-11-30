import { EMsg } from "./generated/enums_clientserver";
import { CMsgMulti } from "./generated/steammessages_base";
import { CMsgClientLicenseList } from "./generated/steammessages_clientserver";
import {
	CMsgClientPICSProductInfoRequest,
	CMsgClientPICSProductInfoResponse,
} from "./generated/steammessages_clientserver_appinfo";
import {
	CMsgClientHeartBeat,
	CMsgClientLoggedOff,
	CMsgClientLogon,
	CMsgClientLogonResponse,
} from "./generated/steammessages_clientserver_login";

export const PROTOBUF_MESSAGES = {
	// 1+
	[EMsg.k_EMsgMulti]: CMsgMulti,

	// 700+
	[EMsg.k_EMsgClientHeartBeat]: CMsgClientHeartBeat,
	[EMsg.k_EMsgClientLogOnResponse]: CMsgClientLogonResponse,
	// [EMsg.k_EMsgClientPersonaState]: CMsgClientPersonaState,
	[EMsg.k_EMsgClientLoggedOff]: CMsgClientLoggedOff,
	// [EMsg.k_EMsgClientFriendsList]: CMsgClientFriendsList,
	// [EMsg.k_EMsgClientAccountInfo]: CMsgClientAccountInfo,
	// [EMsg.k_EMsgClientGameConnectTokens]: CMsgClientGameConnectTokens,
	[EMsg.k_EMsgClientLicenseList]: CMsgClientLicenseList,

	// 800+
	// [EMsg.k_EMsgClientChatInvite]: CMsgClientChatInvite,
	// [EMsg.k_EMsgClientClanState]: CMsgClientClanState,

	// 5000+
	// [EMsg.k_EMsgClientIsLimitedAccount]: CMsgClientIsLimitedAccount,
	// [EMsg.k_EMsgClientEmailAddrInfo]: CMsgClientEmailAddrInfo,
	// [EMsg.k_EMsgClientServersAvailable]: CMsgClientServersAvailable,
	[EMsg.k_EMsgClientLogon]: CMsgClientLogon,
	// [EMsg.k_EMsgClientWalletInfoUpdate]: CMsgClientWalletInfoUpdate,
	// [EMsg.k_EMsgClientFriendsGroupsList]: CMsgClientFriendsGroupsList,
	// [EMsg.k_EMsgClientPlayerNicknameList]: CMsgClientPlayerNicknameList,

	// 7000+
	// [EMsg.k_EMsgClientChatOfflineMessageNotification]:
	// 	CMsgClientOfflineMessageNotification,

	// 8000+
	[EMsg.k_EMsgClientPICSProductInfoRequest]: CMsgClientPICSProductInfoRequest,
	[EMsg.k_EMsgClientPICSProductInfoResponse]: CMsgClientPICSProductInfoResponse,

	// 9000+
	// [EMsg.k_EMsgClientPlayingSessionState]: CMsgClientPlayingSessionState,
	// [EMsg.k_EMsgClientEmoticonList]: CMsgClientEmoticonList,

	// Interfaces
	// "ChatRoomClient.NotifyChatGroupUserStateChanged#1":
	// 	ChatRoomClient_NotifyChatGroupUserStateChanged_Notification,

	// "CloudConfigStoreClient.NotifyChange#1":
	// 	CCloud_AppCloudStateChange_Notification,

	// "PlayerClient.NotifyLastPlayedTimes#1": CPlayer_LastPlayedTimes_Notification,

	// "FamilyGroupsClient.NotifyRunningApps#1":
	// 	CFamilyGroupsClient_NotifyRunningApps_Notification,

	// "FriendMessagesClient.IncomingMessage#1":
	// 	CFriendMessages_IncomingMessage_Notification,
	// "FriendMessagesClient.NotifyAckMessageEcho#1":
	// 	CFriendMessages_AckMessage_Notification,
};
