import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@services/socket/socket.service';
import reactionSoundFile from '@assets/audio/like-sound-effect.mp3';
import {
  addMessage,
  addUserToOnline,
  deleteMessageFromState,
  removeUserFromOnline,
  setOnlineUsers,
  setTyping,
  updateConversationFromSocket,
  updateMessageDeliveredStatus,
  updateMessageReaction,
  updateMessageReadStatus,
} from '@redux/reducers/chat/chat.reducer';
import { ToastUtils } from '@services/utils/toast-utils.service';
import '@pages/social/chat/Chat.scss';
import ChatList from './chat-list/ChatList';
import ChatWindow from './chat-window/ChatWindow';
import { chatService } from '@services/api/chat/chat.service';

const Chat = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { selectedChat, conversations } = useSelector((state) => state.chat);

  const selectedChatRef = useRef(selectedChat);
  const conversationsRef = useRef(conversations);
  const hasDeliveredScanned = useRef(false);

  useEffect(() => {
    // We're checking that there are conversations, that the socket is connected, and that we haven't finished this scan yet.
    if (
      conversations.length > 0 &&
      socketService.socket?.connected &&
      !hasDeliveredScanned.current
    ) {
      conversations.forEach((convo) => {
        // 1. Check if the last message is not mine (it came to me from someone else)
        const isLastMsgFromOther = convo.lastMessageSenderId !== profile._id;

        // 2. Check if this message has not yet been delivered to me (meaning the lastDelivered is still old)
        const myLastDeliveredId = convo.lastDelivered?.[profile._id];
        const isNotDeliveredYet = myLastDeliveredId !== convo.lastMessageId;

        if (isLastMsgFromOther && isNotDeliveredYet) {
          socketService.socket.emit('mark as delivered', {
            conversationId: convo._id,
            messageId: convo.lastMessageId,
            senderId: convo.lastMessageSenderId,
          });
        }
      });

      // We are announcing that we have finished scanning the "first time"
      // so that the emits are not repeated with every new message.
      hasDeliveredScanned.current = true;
    }
  }, [conversations.length, profile._id]); // eslint-disable-line

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    conversationsRef.current = conversations;
  }, [selectedChat, conversations]);

  useEffect(() => {
    if (!socketService.socket) return;

    socketService.socket.on('connected', () => {
      console.log(
        `${socketService.socket.id} Successfully connected to chat system`
      );
    });

    // 1. Emit Setup
    socketService.socket.emit('setup chat');

    // 2. Listen for Online Users
    socketService.socket.on('get online users', (users) => {
      dispatch(setOnlineUsers(users));
    });

    socketService.socket.on('user online', (userId) => {
      dispatch(addUserToOnline(userId));
    });

    socketService.socket.on('user offline', (userId) => {
      dispatch(removeUserFromOnline(userId));
    });

    // 3. Listen for Incoming Messages
    socketService.socket.on('sendMessage', (newMessage) => {
      const currentSelectedChat = selectedChatRef.current;

      // We join the room immediately so we can receive typing indicators or more messages in this room
      socketService.socket.emit('join chat', newMessage.conversationId);

      // We inform the server that the message has been delivered by the user.
      socketService.socket.emit('mark as delivered', {
        conversationId: newMessage.conversationId,
        messageId: newMessage._id,
        senderId: newMessage.senderId,
      });

      // Logic: If I'm currently looking at this
      if (currentSelectedChat?._id === newMessage.conversationId) {
        dispatch(addMessage(newMessage));

        // Since I'm in the chat, mark it as read immediately
        chatService.markAsRead({
          conversationId: currentSelectedChat._id,
          socketId: socketService.socket.id,
          messageId: newMessage._id,
        });
      }

      // Always update sidebar (Conversation List)
      dispatch(
        updateConversationFromSocket({
          message: newMessage,
          profile: profile,
        })
      );

      ToastUtils.info(`new message from ${newMessage.senderData?.username}💬`);
    });

    // 4. Listen for 'message read' (The Blue Ticks event)
    socketService.socket.on('message read', (data) => {
      // data contains: { conversationId, unreadCounts, lastRead, readMessageId }
      dispatch(updateMessageReadStatus(data));
    });

    // 5. Listen for Typing...
    socketService.socket.on('typing', (data) => {
      const { senderId, roomId } = data;
      dispatch(
        setTyping({ conversationId: roomId, userId: senderId, isTyping: true })
      );
    });

    socketService.socket.on('stop typing', (data) => {
      const { senderId, roomId } = data;
      dispatch(
        setTyping({ conversationId: roomId, userId: senderId, isTyping: false })
      );
    });

    // 6. Deliver Message with double grey sign
    socketService.socket.on('message delivered', (data) => {
      // data = { conversationId, userId, messageId }
      dispatch(updateMessageDeliveredStatus(data));
    });

    // 7. Listen for 'message delete' (me | everyone)
    socketService.socket.on('message deleted', (data) => {
      // data = { messageId, conversationId, type }
      dispatch(deleteMessageFromState(data));
    });

    socketService.socket.on('message reaction', (data) => {
      const { messageId, senderId, reaction } = data;

      const audio = new Audio(reactionSoundFile);
      audio.play().catch((e) => console.log('Sound play failed', e));

      dispatch(
        updateMessageReaction({
          messageId,
          senderId,
          reaction,
        })
      );
    });

    return () => {
      socketService.socket.off('user online');
      socketService.socket.off('sendMessage');
      socketService.socket.off('stop typing');
      socketService.socket.off('typing');
      socketService.socket.off('message delivered');
    };
  }, [dispatch, profile]); // eslint-disable-line

  return (
    <div className="chat-page-container">
      <div className="chat-sidebar">
        <ChatList />
      </div>
      <div className="chat-window-area">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
