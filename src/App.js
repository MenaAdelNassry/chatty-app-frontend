import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/routes';
import { useEffect } from 'react';
import { socketService } from '@services/socket/socket.service';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import {
  addNotificationFromSocket,
  updateNotificationFromSocket,
  deleteNotificationFromSocket,
} from '@redux/reducers/notifications/notifications.reducer';
import { getUserFollowing } from '@redux/api/follower';
import { getConversationList } from '@redux/api/chat';

const App = () => {
  const dispatch = useDispatch();
  const { token, profile } = useSelector((state) => state.user);

  useEffect(() => {
    const isVerified = profile?.emailVerified;
    const userId = profile?._id;

    if (token && userId && isVerified) {
      // 1. Establish Connection
      socketService.setupSocketConnection(token);

      // 2. Listen for Events
      socketService.listenForNotifications(
        dispatch,
        addNotificationFromSocket,
        updateNotificationFromSocket,
        deleteNotificationFromSocket
      );

      // 3. Get following list
      dispatch(getUserFollowing({userId}));

      // 4. Get Chat list
      dispatch(getConversationList());
    }

    // Cleanup Function
    return () => {
      socketService.disconnect();
    };
  }, [token, profile?._id, profile?.emailVerified, dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
