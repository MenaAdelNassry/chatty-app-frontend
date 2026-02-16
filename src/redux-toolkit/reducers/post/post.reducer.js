import { createSlice } from '@reduxjs/toolkit';
import {
  createPost,
  getPosts,
  getPostsByUserId,
  getPostsWithImages,
  getPostsWithVideos,
  updatePost,
} from '@redux/api/post';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { uniqBy } from 'lodash';

const initialState = {
  posts: [],
  newPosts: [],
  galleryPosts: [],
  videosPosts: [],
  profilePosts: [], // 🔥 Profile Timeline
  totalProfilePostsCount: 0,
  totalVideosCount: 0,
  galleryPostsCount: 0,
  totalPostsCount: 0,
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addToPosts: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },

    addToNewPosts: (state, action) => {
      state.newPosts = [...state.newPosts, action.payload];
    },

    emptyNewPosts: (state) => {
      state.posts = [...state.newPosts, ...state.posts];
      state.newPosts = [];
    },

    clearPosts: (state) => {
      state.posts = [];
      state.newPosts = [];
      state.totalPostsCount = 0;
      state.error = null;
    },

    clearGallery: (state) => {
      state.galleryPosts = [];
      state.galleryPostsCount = 0;
    },

    clearVideos: (state) => {
      state.videosPosts = [];
      state.totalVideosCount = 0;
    },

    clearProfilePosts: (state) => {
      state.profilePosts = [];
      state.totalProfilePostsCount = 0;
    },

    updatePostReaction: (state, action) => {
      const { _id, reaction, type } = action.payload; // type: 'add' or 'remove'

      const post =
        state.posts.find((p) => p._id === _id) ||
        state.newPosts.find((p) => p._id === _id);

      if (post) {
        const previousReaction = post.currentUserReaction;

        if (type === 'add') {
          if (previousReaction && previousReaction !== reaction) {
            post.reactions[previousReaction] -= 1;
          }

          if (previousReaction !== reaction) {
            post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
            post.currentUserReaction = reaction;
          }
        } else if (type === 'remove') {
          if (previousReaction) {
            post.reactions[previousReaction] -= 1;
            post.currentUserReaction = null;
          }
        }
      }
    },

    updatePostCommentCount: (state, action) => {
      const { _id, method } = action.payload; // method: 'add' | 'remove'

      const post =
        state.posts.find((p) => p._id === _id) ||
        state.newPosts.find((p) => p._id === _id);

      if (post) {
        if (method === 'add') {
          post.commentsCount += 1;
        } else if (method === 'remove') {
          post.commentsCount -= 1;
        }
      }

      const galleryPost = state.galleryPosts.find((p) => p._id === _id);
      if (galleryPost) {
        if (method === 'add') galleryPost.commentsCount += 1;
        else if (method === 'remove') galleryPost.commentsCount -= 1;
      }

      const videosPost = state.videosPosts.find((p) => p._id === _id);
      if (videosPost) {
        if (method === 'add') videosPost.commentsCount += 1;
        else if (method === 'remove') videosPost.commentsCount -= 1;
      }
    },

    deletePost: (state, action) => {
      const postId = action.payload;

      const filterList = (list) => list.filter((p) => p._id !== postId);

      state.posts = filterList(state.posts);
      state.newPosts = filterList(state.newPosts);

      state.totalPostsCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Create Post Handling ---
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = [action.payload.post, ...state.posts];
        ToastUtils.success('Post created successfully');
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastUtils.error(
          action.payload?.message || 'post was not created. Error occured.'
        );
      })

      // --- Get Posts Handling ---
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, totalPosts } = action.payload;

        state.totalPostsCount = totalPosts;

        const page = action.meta.arg.page;

        if (page === 1) {
          state.posts = posts;
        } else {
          state.posts = uniqBy([...state.posts, ...posts], '_id');
        }
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Edit Post Handling ---
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const { post: updatedPost } = action.payload;
        console.log(updatePost._id);

        const updateList = (list) => {
          const index = list.findIndex((p) => p._id === updatedPost._id);
          console.log(index);
          if (index !== -1) {
            list[index] = updatedPost;
          }
        };

        updateList(state.posts);
        updateList(state.newPosts);
        ToastUtils.success('Post updated successfully');
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastUtils.error(
          action.payload?.message || 'post was not updated. Error occured.'
        );
      });

    // --- Get Posts (Only With Images) ---
    builder.addCase(getPostsWithImages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPostsWithImages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.galleryPosts = [...state.galleryPosts, ...action.payload.posts];
      state.galleryPostsCount = action.payload.totalPosts;
    });
    builder.addCase(getPostsWithImages.rejected, (state) => {
      state.isLoading = false;
    });

    // --- Get Posts (Only With Videos) ---
    builder.addCase(getPostsWithVideos.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPostsWithVideos.fulfilled, (state, action) => {
      state.isLoading = false;
      state.videosPosts = [...state.videosPosts, ...action.payload.posts];
      state.totalVideosCount = action.payload.totalPosts;
    });
    builder.addCase(getPostsWithVideos.rejected, (state) => {
      state.isLoading = false;
    });

    // 🔥 Handle getPostsByUserId
    builder.addCase(getPostsByUserId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPostsByUserId.fulfilled, (state, action) => {
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.totalProfilePostsCount = totalPosts;

      const page = action.meta.arg.page;
      if (page === 1) {
        state.profilePosts = posts;
      } else {
        state.profilePosts = [...state.profilePosts, ...posts]; 
      }
    });
    builder.addCase(getPostsByUserId.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  addToPosts,
  clearPosts,
  addToNewPosts,
  emptyNewPosts,
  updatePostReaction,
  updatePostCommentCount,
  deletePost,
  clearGallery,
  clearVideos,
  clearProfilePosts,
} = postSlice.actions;
export default postSlice.reducer;
