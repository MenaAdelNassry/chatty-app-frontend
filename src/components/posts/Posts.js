import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '@components/posts/post/Post';
import { getPosts } from '@redux/api/post';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import '@components/posts/Posts.scss';
import { socketService } from '@services/socket/socket.service';
import {
  addToNewPosts,
  emptyNewPosts,
} from '@redux/reducers/post/post.reducer';
import { FaArrowUp } from 'react-icons/fa';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, totalPostsCount, newPosts } = useSelector(
    (state) => state.post
  );
  const { profile } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);

  // 1. Initial Load
  useEffect(() => {
    dispatch(getPosts({ page: 1 }));
  }, [dispatch]);

  // 2. Logic to load more posts
  const loadMorePosts = () => {
    if (!isLoading && posts.length < totalPostsCount) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(getPosts({ page: nextPage }));
    }
  };

  // 3. Hook Integration
  const lastPostElementRef = useInfiniteScroll(loadMorePosts);

  // 4. Socket Listener Setup
  useEffect(() => {
    socketService.listenForPosts(dispatch, addToNewPosts, profile._id);

    return () => {
      socketService.socket?.off('add post');
    };
  }, [dispatch, profile._id]);

  // 5. Handle "Show New Posts" Click
  const showNewPosts = () => {
    dispatch(emptyNewPosts());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="posts-container">
      {newPosts.length > 0 && (
        <div className="new-posts-toast" onClick={showNewPosts}>
          <FaArrowUp className="arrow-icon" />
          <span>New posts available</span>
        </div>
      )}

      {posts.map((post, index) => {
        const isLastPost = posts.length === index + 1;

        return (
          <Post
            key={post._id}
            post={post}
            ref={isLastPost ? lastPostElementRef : null}
          />
        );
      })}

      {/* Loading Spinner for Infinite Scroll */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading more posts...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="no-posts-message">
          No posts available. Be the first to create one!
        </div>
      )}
    </div>
  );
};

export default Posts;
