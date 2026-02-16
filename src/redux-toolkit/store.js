import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@redux/reducers/user/user.reducer"
import suggestionSlice from "@redux/reducers/suggestions/suggestions.reducer"
import notificationsSlice from "@redux/reducers/notifications/notifications.reducer"
import postSlice from "@redux/reducers/post/post.reducer"
import followerSlice from "@redux/reducers/follower/follower.reducer"
import modalSlice from "@redux/reducers/modal/modal.reducer"
import chatSlice from "@redux/reducers/chat/chat.reducer"

export const store = configureStore({
  reducer: {
    user: userSlice,
    suggestions: suggestionSlice,
    notifications: notificationsSlice,
    post: postSlice,
    followers: followerSlice,
    modal: modalSlice,
    chat: chatSlice,
  }
});

