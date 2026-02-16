import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.service';

export const createPost = createAsyncThunk(
  'post/create',
  async (postData, { rejectWithValue }) => {
    try {
      let response;

      if (postData.image) {
        response = await postService.createPostWithImage(postData);
      }

      else if (postData.video) {
        response = await postService.createPostWithVideo(postData);
      }

      else {
        response = await postService.createPost(postData);
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating post';
      return rejectWithValue(message);
    }
  }
);

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts(page);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching posts';
      return rejectWithValue(message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/editPost',
  async ({postId, body}, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, body);
      console.log(response.data)
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error Editing post';
      return rejectWithValue(message);
    }
  }
);

export const getPostsWithImages = createAsyncThunk(
  'post/getPostsWithImages',
  async (page, { rejectWithValue }) => {
    try {
      const response = await postService.getPostsWithImages(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getPostsWithVideos = createAsyncThunk(
  'post/getPostsWithVideos',
  async (page, { rejectWithValue }) => {
    try {
      const response = await postService.getPostsWithVideos(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getPostsByUserId = createAsyncThunk(
  'post/getPostsByUserId',
  async ({ userId, page }, { rejectWithValue }) => {
    try {
      const response = await postService.getPostsByUserId(userId, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
