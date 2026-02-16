import { getChatMessages, getConversationList } from '@redux/api/chat';
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: [],
    onlineUsers: [], // We will only store the IDs there
    isLoading: false,
    selectedChat: null, // { conversationId, username, ... }
    typingUsers: {}, // { [conversationId]: [userId1, userId2] }
    selectedTheme: localStorage.getItem('chat-theme') || 'classic',
  },
  reducers: {
    updateMessageDeliveredStatus: (state, action) => {
      const { conversationId, userId, messageId } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c._id === conversationId
      );
      if (index !== -1) {
        state.conversations[index].lastDelivered = {
          ...state.conversations[index].lastDelivered,
          [userId]: messageId,
        };
      }

      if (state.selectedChat?._id === conversationId) {
        state.selectedChat.lastDelivered = {
          ...state.selectedChat.lastDelivered,
          [userId]: messageId,
        };
      }
    },
    setChatTheme: (state, action) => {
      state.selectedTheme = action.payload;
      localStorage.setItem('chat-theme', action.payload);
    },
    setTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }

      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((id) => id !== userId);
      }
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedChat: (state, action) => {
      const { chat, myId } = action.payload;

      if (state.selectedChat?._id === chat._id) return;

      const index = state.conversations.findIndex((c) => c._id === chat._id);

      if (index !== -1 && chat._id !== '') {
        state.conversations[index].unreadCounts[myId] = 0;
        state.selectedChat = state.conversations[index];
      } else {
        state.selectedChat = chat;
        state.messages = [];
      }
    },
    incrementTotalMessages: (state, action) => {
      const convo = state.conversations.find((c) => c._id === action.payload);
      if (convo) convo.totalMessages += 1;
    },
    // Update the conversation in the list (move it to the first place and update the last message)
    updateConversationList: (state, action) => {
      const { message, senderData } = action.payload;
      const index = state.conversations.findIndex(
        (c) => c._id === message.conversationId
      );

      if (index !== -1) {
        const chat = state.conversations.splice(index, 1)[0];
        chat.lastMessage = message.body;
        chat.lastMessageType = message.type;
        chat.lastMessageId = message._id;
        chat.lastMessageSenderId = message.senderId;
        state.conversations.unshift(chat);
        state.totalMessages += 1;
      } else if (senderData) {
        // Brand new chat status (we used the senderData you sent in the socket)
        const newChat = {
          _id: message.conversationId,
          participants: [senderData],
          lastMessage: message.body,
          lastMessageType: message.type,
          unreadCounts: { [message.receiverId]: 1 },
        };
        state.conversations.unshift(newChat);
      }
    },
    updateMessageReadStatus: (state, action) => {
      const { conversationId, lastRead, unreadCounts } = action.payload;

      // 1. Update the conversation in the Sidebar list
      const convoIndex = state.conversations.findIndex(
        (c) => c._id === conversationId
      );
      if (convoIndex !== -1) {
        state.conversations[convoIndex].lastRead = lastRead;
        state.conversations[convoIndex].unreadCounts = unreadCounts;
      }

      // 2. If this is the active chat, update selectedChat as well
      if (state.selectedChat?._id === conversationId) {
        state.selectedChat.lastRead = lastRead;
        state.selectedChat.unreadCounts = unreadCounts;
      }
    },
    updateConversationFromSocket: (state, action) => {
      const { message, profile } = action.payload;

      // 1. Find the index of the conversation that needs updating
      const index = state.conversations.findIndex(
        (c) => c._id === message.conversationId
      );

      if (index !== -1) {
        // 2. Extract the existing conversation object
        const conversationToUpdate = state.conversations[index];

        // 3. Create an updated version with new message details
        const updatedConversation = {
          ...conversationToUpdate,
          lastMessage:
            message.body ||
            (message.type === 'image' ? '📷 Sent an image' : message.type === 'video' ? '🎥 Sent a video' : "🎤 Sent a voice"),
          lastMessageSenderId: message.senderId,
          updatedAt: message.createdAt,
          // Logic for Unread Counts:
          // Increment only if I am NOT the sender AND I am NOT currently viewing this chat
          unreadCounts: {
            ...conversationToUpdate.unreadCounts,
            [profile._id]:
              message.senderId !== profile._id &&
              state.selectedChat?._id !== message.conversationId
                ? (conversationToUpdate.unreadCounts[profile._id] || 0) + 1
                : 0,
          },
        };

        // 4. Remove the old conversation from its current position
        state.conversations.splice(index, 1);

        // 5. Move it to the very top (index 0)
        state.conversations.unshift(updatedConversation);
      } else {
        // 🔥 New Conversation Reconstruction (The "Skeleton")
        let skeletonConversation = {};

        skeletonConversation._id = message.conversationId;
        skeletonConversation.lastMessage =
          message.body ||
          (message.type === 'image' ? '📷 Sent an image' : '🎥 Sent a video');
        skeletonConversation.lastMessageType = message.type;
        skeletonConversation.lastMessageSenderId = message.senderId;
        skeletonConversation.lastMessageId = message._id;
        skeletonConversation.totalMessages = 1; // It's the first message!
        skeletonConversation.lastDelivered = {};
        skeletonConversation.lastRead = {};
        skeletonConversation.updatedAt = message.createdAt;
        skeletonConversation.groupAdminIds = [];
        skeletonConversation.groupAvatar = '';
        skeletonConversation.groupName = '';
        skeletonConversation.isGroup = false;
        skeletonConversation.createdAt = message.createdAt;
        skeletonConversation.unreadCounts = {};

        if (message.senderId === profile._id) {
          skeletonConversation.participants =
            state.selectedChat?.participants || [];
          skeletonConversation.unreadCounts[profile._id] = 0;
        } else {
          skeletonConversation.participants = [
            {
              _id: profile._id,
              username: profile.username,
              avatarColor: profile.avatarColor,
              profilePicture: profile.profilePicture,
            },
            {
              _id: message.senderId,
              username: message.senderData.username,
              avatarColor: message.senderData.avatarColor,
              profilePicture: message.senderData.profilePicture,
            },
          ];

          skeletonConversation.unreadCounts[profile._id] = 1;
        }

        // Add this "fake" conversation to the top of the sidebar
        state.conversations.unshift(skeletonConversation);

        if (state.selectedChat && state.selectedChat._id === '') {
          const isMatch = state.selectedChat.participants.some(
            (p) => p._id === message.senderId
          );
          if (isMatch) {
            state.selectedChat = skeletonConversation;
          }
        }
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addUserToOnline: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeUserFromOnline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const isDuplicate = state.messages.some(
        (m) => m._id === action.payload._id
      );
      if (!isDuplicate) {
        state.messages.push(action.payload);
      }
    },
    deleteMessageFromState: (state, action) => {
      const { messageId, conversationId, type } = action.payload;

      if (type === 'everyone') {
        const msgIndex = state.messages.findIndex((m) => m._id === messageId);
        if (msgIndex !== -1) {
          state.messages[msgIndex].isDeleted = true;
          state.messages[msgIndex].body = 'This message was deleted';
          state.messages[msgIndex].type = 'text';
          state.messages[msgIndex].selectedImage = '';
          state.messages[msgIndex].selectedVideo = '';
          state.messages[msgIndex].replyTo = '';
        }

        const convoIndex = state.conversations.findIndex(
          (c) => c._id === conversationId
        );
        if (
          convoIndex !== -1 &&
          state.conversations[convoIndex].lastMessageId === messageId
        ) {
          state.conversations[convoIndex].lastMessage =
            'This message was deleted';
        }
      } else if (type === 'me') {
        state.messages = state.messages.filter((m) => m._id !== messageId);
      }
    },
    updateMessageReaction: (state, action) => {
      const { messageId, senderId, reaction } = action.payload;

      const messageIndex = state.messages.findIndex((m) => m._id === messageId);

      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];

        const existingReactionIndex = message.reaction.findIndex(
          (r) => r.senderId === senderId
        );

        if (existingReactionIndex !== -1) {
          if (message.reaction[existingReactionIndex].type === reaction) {
            // (Toggle Off)
            message.reaction.splice(existingReactionIndex, 1);
          } else {
            message.reaction[existingReactionIndex].type = reaction;
          }
        } else {
          message.reaction.push({ senderId, type: reaction });
        }
      }
    },
  },
  extraReducers: (builder) => {
    // --- Get Conversation List ---
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    });

    // --- Get Chat Messages ---
    builder.addCase(getChatMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChatMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      const { messages, page } = action.payload;

      if (page === 1) {
        state.messages = messages;
      } else {
        state.messages = [...messages, ...state.messages];
      }
    });
    builder.addCase(getChatMessages.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  setConversations,
  updateConversationList,
  setOnlineUsers,
  addUserToOnline,
  removeUserFromOnline,
  setMessages,
  addMessage,
  setSelectedChat,
  incrementTotalMessages,
  updateMessageReadStatus,
  updateConversationFromSocket,
  setTyping,
  setChatTheme,
  updateMessageDeliveredStatus,
  deleteMessageFromState,
  updateMessageReaction
} = chatSlice.actions;

export default chatSlice.reducer;
