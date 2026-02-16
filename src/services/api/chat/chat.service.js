import axios from '@services/axios';

class ChatService {
  async getConversationList() {
    const response = await axios.get('/chat/conversation-list');
    return response;
  }

  async getChatMessages(receiverId, page = 1, limit = 15, conversationId) {
    let response;
    if(receiverId) {
      response = await axios.get(`/chat/user/${receiverId}?page=${page}&limit=${limit}`);
    } else {
      response = await axios.get(`/chat/user?page=${page}&limit=${limit}&conversationId=${conversationId}`);
    }
    return response;
  }

  async sendMessage(body) {
    const response = await axios.post('/chat/message', body);
    return response;
  }

  async markAsRead(body) {
    const response = await axios.put('/chat/mark-as-read', body);
    return response;
  }

  async deleteMessage(body) {
    const response = await axios.delete('/chat/message', { data: body });
    return response;
  }

  async updateMessageReaction(body) {
    const response = await axios.put('/chat/reaction', body);
    return response;
  }
}

export const chatService = new ChatService();
