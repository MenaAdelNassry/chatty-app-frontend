import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '@services/api/chat/chat.service';

export const getConversationList = createAsyncThunk(
  'chat/getConversationList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversationList();
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getChatMessages = createAsyncThunk(
  'chat/getMessages',
  async ({ conversationId, page, receiverId, limit }, { rejectWithValue }) => {
    try {
      const response = await chatService.getChatMessages(receiverId, page, limit, conversationId);
      return {
        messages: response.data.messages,
        page,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
