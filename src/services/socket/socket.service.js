import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection(token) {
    // 1. Singleton Check
    if (this.socket && this.socket.connected) {
      return;
    }

    // 2. Create Connection
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      transports: ['websocket'],
      secure: true,
      auth: {
        token: token,
      },
    });

    this.socketConnectionEvents();
  }

  socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('Connected to socket server ✅');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected from socket: ${reason} ❌`);
      // SocketIO Will Reconnect
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Socket connection error: ${error} ⚠️`);
      // SocketIO Will Reconnect
    });
  }

  listenForNotifications(
    dispatch,
    addNotificationAction,
    updateNotificationAction,
    removeNotificationAction
  ) {
    if (!this.socket) return;

    this.socket.on('insert notification', (data) => {
      dispatch(addNotificationAction(data));
    });

    this.socket.on('update notification', (data) => {
      dispatch(updateNotificationAction(data));
    });

    this.socket.on('delete notification', (data) => {
      dispatch(removeNotificationAction(data));
    });
  }

  listenForPosts(dispatch, addToNewPostsAction, userId) {
    if (!this.socket) return;

    this.socket.off('add post');

    this.socket.on('add post', (post) => {
      if(post.userId.toString() !== userId) {
        dispatch(addToNewPostsAction(post));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
