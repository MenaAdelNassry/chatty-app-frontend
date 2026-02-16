import { useEffect } from 'react';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch } from 'react-redux';
import { getUserSuggestions } from '@redux/api/suggestions';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';

const Streams = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserSuggestions());
  }, [dispatch]);

  return (
    <div className="streams-container" data-testid="streams">
      {/* 1. Middle column: Posts (we're still working on them) */}
      <div className="streams-content">

        <PostForm />
        <Posts />

      </div>

      {/* 2. Right column: Suggestions */}
      <div className="streams-suggestions">
        <Suggestions />
      </div>
    </div>
  );
};

export default Streams;
