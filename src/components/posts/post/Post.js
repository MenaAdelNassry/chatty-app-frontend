import { forwardRef, useState } from 'react';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostFooter from './PostFooter';
import '@components/posts/post/Post.scss';
import CommentsSection from '@components/posts/comments/CommentsSection';

const Post = forwardRef(({ post, showIcons=true }, ref) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="post-card" ref={ref}>
      <PostHeader post={post} />

      <div className="post-body">
        <PostBody post={post} />
      </div>

      {showIcons && <PostFooter post={post} toggleComments={() => setShowComments(!showComments)} />}
      {showComments && <CommentsSection postId={post._id} />}
    </div>
  );
});

export default Post;
