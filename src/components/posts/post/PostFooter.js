import { openModal } from '@redux/reducers/modal/modal.reducer';
import { updatePostReaction } from '@redux/reducers/post/post.reducer';
import { reactionsItems, reactionsMap } from '@root/constants';
import { postService } from '@services/api/post/post.service';
import { PostUtils } from '@services/utils/post.utils';
import { FaRegCommentAlt, FaRegThumbsUp, FaShare } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

const PostFooter = ({ post, toggleComments }) => {
  const dispatch = useDispatch();

  const reactionsCount = PostUtils.sumAllReactions(post?.reactions);
  const topReactions = PostUtils.getPostReactions(post?.reactions);

  const reactionDetails = PostUtils.getReactionFormattedDetails(
    post?.currentUserReaction
  );

  const openReactionsModal = () => {
    dispatch(openModal({ type: 'reactions', data: post._id }));
  };

  const onReactionClick = async (reactionType) => {
    try {
      let actionType = 'add';

      if (post?.currentUserReaction === reactionType) {
        actionType = 'remove';
      }

      // 1. Optimistic UI Update
      dispatch(
        updatePostReaction({
          _id: post._id,
          reaction: reactionType,
          type: actionType,
        })
      );

      // 2. Call Backend
      if (actionType === 'add') {
        await postService.addReaction({
          postId: post._id,
          type: reactionType,
        });
      } else {
        await postService.removeReaction(post._id);
      }
    } catch (error) {
      // لو حصل إيرور، المفروض نرجع التغيير (Rollback)
      // بس للتبسيط دلوقتي هنطلع Alert
      console.error(error);
    }
  };

  return (
    <div className="post-footer">
      {/* 1. Number and icons area */}
      <div className="post-counts">
        <div className="reactions-count-wrapper" onClick={openReactionsModal} style={{ cursor: 'pointer' }}>
          {reactionsCount > 0 && (
            <div className="reactions-display">
              {/* Displaying Top 3 Images */}
              {topReactions.map((reactionImg, index) => (
                <img
                  key={index}
                  src={reactionImg}
                  alt="reaction"
                  className="reaction-icon-display"
                  style={{ zIndex: 3 - index }} // عشان يركبوا فوق بعض شوية
                />
              ))}

              {/* Show number*/}
              <span className="reactions-number">{reactionsCount}</span>
            </div>
          )}
        </div>

        <div className="comments-count-wrapper">
          {post?.commentsCount > 0 && (
            <span>{post?.commentsCount} Comments</span>
          )}
        </div>
      </div>

      {/* 2. Buttons Area */}
      <div className="post-actions">
        <div className="reaction-wrapper-container">
          {' '}
          <div
            className="action-btn"
            style={{ color: reactionDetails.color }}
            onClick={() =>
              onReactionClick(
                post?.currentUserReaction ? post.currentUserReaction : 'like'
              )
            }
          >
            {post?.currentUserReaction ? (
              <img
                src={reactionsMap[post?.currentUserReaction]}
                alt=""
                className="reaction-icon"
              />
            ) : (
              <FaRegThumbsUp className="icon" />
            )}
            <span
              className={post?.currentUserReaction ? 'active-reaction' : ''}
            >
              {reactionDetails.text}
            </span>
          </div>
          {/* 2. (The Selector Popup) */}
          <div className="reactions-container-box">
            {reactionsItems.map((reaction) => (
              <div
                key={reaction.name}
                className="reaction-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onReactionClick(reaction.name);
                }}
              >
                <img src={reaction.image} alt={reaction.name} />
              </div>
            ))}
          </div>
        </div>

        <div className="action-btn" onClick={toggleComments}>
          <FaRegCommentAlt className="icon" /> <span>Comment</span>
        </div>
        <div className="action-btn">
          <FaShare className="icon" /> <span>Share</span>
        </div>
      </div>
    </div>
  );
};
export default PostFooter;
