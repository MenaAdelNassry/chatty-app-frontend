import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Utils } from '@services/utils/utils.services';
import { postService } from '@services/api/post/post.service';
import { updatePostCommentCount } from '@redux/reducers/post/post.reducer';
import Avatar from '@components/avatar/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { FaPaperPlane, FaTrashAlt } from 'react-icons/fa';
import '@components/posts/comments/CommentsSection.scss'

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await postService.getPostComments(postId);
        setComments(response.data.comments);
      } catch (error) {
        ToastUtils.error('Failed to fetch comments.');
      }
      setLoading(false);
    };
    getComments();
  }, [postId]);

  // 2. Add Comment
  const addNewComment = async (event) => {
    event.preventDefault();
    if (!commentValue.trim()) return;

    const tempId = Utils.generateString(10);
    const newCommentBody = {
      _id: tempId,
      postId: postId,
      comment: commentValue,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      profilePicture: profile?.profilePicture,
      userId: profile?._id,
      createdAt: new Date(),
    };

    // Optimistic Update
    setComments([newCommentBody, ...comments]);
    setCommentValue('');
    dispatch(updatePostCommentCount({ _id: postId, method: 'add' }));

    try {
      await postService.addComment({
        postId,
        comment: newCommentBody.comment,
      });
    } catch (error) {
      setComments(comments.filter((c) => c._id !== tempId));
      dispatch(updatePostCommentCount({ _id: postId, method: 'remove' }));
      setCommentValue(newCommentBody.comment);
      ToastUtils.error('Failed to add comment.');
    }
  };

  // 3. Delete Comment
  const deletePostComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?'))
      return;

    const previousComments = [...comments];
    setComments(comments.filter((c) => c._id !== commentId));
    dispatch(updatePostCommentCount({ _id: postId, method: 'remove' }));

    try {
      await postService.deleteComment(postId, commentId);
    } catch (error) {
      setComments(previousComments);
      dispatch(updatePostCommentCount({ _id: postId, method: 'add' }));
      ToastUtils.error('Failed to delete comment.');
    }
  };

  return (
    <div className="comments-container">
      {/* 1. Input Area */}
      <div className="comment-input-area">
        <Avatar
          name={profile?.username}
          bgColor={profile?.avatarColor}
          avatarSrc={profile?.profilePicture}
          size={35}
        />
        <div className="comment-input-wrapper">
          <input
            className="comment-input"
            type="text"
            placeholder="Write a comment..."
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewComment(e)}
          />
          <div className="comment-submit-icon" onClick={addNewComment}>
            <FaPaperPlane />
          </div>
        </div>
      </div>

      {/* 2. Comments List */}
      <ul className="comments-list">
        {comments.map((data) => (
          <li className="comment-item" key={data._id}>
            <div className="avatar-wrapper">
              <Avatar
                name={data.username}
                bgColor={data.avatarColor}
                avatarSrc={data.profilePicture}
                size={35}
              />
            </div>

            <div className="comment-bubble-wrapper">
              <div className="comment-bubble">
                <div className="bubble-header">
                  <span className="username">{data.username}</span>
                  {data.userId === profile?._id && (
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => deletePostComment(data._id)}
                    />
                  )}
                </div>

                <p className="comment-text">{data.comment}</p>
              </div>

              <div className="comment-time">
                {data.createdAt &&
                  formatDistanceToNow(new Date(data.createdAt), {
                    addSuffix: true,
                  })}
              </div>
            </div>
          </li>
        ))}
        {!loading && comments.length === 0 && (
          <p className="empty-msg">No comments yet.</p>
        )}
      </ul>
    </div>
  );
};

export default CommentsSection;
