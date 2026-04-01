/**
 * SpokeChat Tools — barrel export
 */

export { createChannel, listChannels, getChannel, updateChannel, deleteChannel, joinChannel, leaveChannel } from "./channels";
export { sendMessage, listMessages, editMessage, deleteMessage, getThread, searchMessages } from "./messages";
export { addReaction, removeReaction, getReactions } from "./reactions";
export { setPresence, getUserPresence, getOnlineUsers } from "./presence";
export { pinMessage, unpinMessage, getPinnedMessages } from "./pins";
export { createDM, listDMs } from "./dms";

import { createChannel, listChannels, getChannel, updateChannel, deleteChannel, joinChannel, leaveChannel } from "./channels";
import { sendMessage, listMessages, editMessage, deleteMessage, getThread, searchMessages } from "./messages";
import { addReaction, removeReaction, getReactions } from "./reactions";
import { setPresence, getUserPresence, getOnlineUsers } from "./presence";
import { pinMessage, unpinMessage, getPinnedMessages } from "./pins";
import { createDM, listDMs } from "./dms";
import type { ToolDefinition } from "../../../../sdk/types/index";

export const allSpokechatTools: ToolDefinition[] = [
  createChannel, listChannels, getChannel, updateChannel, deleteChannel, joinChannel, leaveChannel,
  sendMessage, listMessages, editMessage, deleteMessage, getThread, searchMessages,
  addReaction, removeReaction, getReactions,
  setPresence, getUserPresence, getOnlineUsers,
  pinMessage, unpinMessage, getPinnedMessages,
  createDM, listDMs,
];

export const allToolNames: string[] = allSpokechatTools.map((t) => t.name);
