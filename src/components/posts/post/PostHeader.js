import Avatar from '@components/avatar/Avatar';
import { FaEllipsisV, FaGlobe, FaLock, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { feelingsList } from '@root/constants';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@redux/reducers/modal/modal.reducer';
import Swal from 'sweetalert2';
import { deletePost } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { useNavigate } from 'react-router-dom';

const PostHeader = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.user);

  const optionsRef = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useDetectOutsideClick(optionsRef, false);

  const getFeeling = (name) => {
    const feeling = feelingsList.find((data) => data.name === name);
    return feeling?.image || '';
  };

  const PrivacyIcon = post?.privacy?.toLowerCase() === 'private' ? FaLock : FaGlobe;

  const handleEdit = () => {
    setIsOptionsOpen(false);
    dispatch(openModal({ type: 'edit', data: post }));
  };

  const navigateToProfileResult = () => {
    navigate(`/app/social/profile/${post.username}/${post.userId}`);
  };


  const handleDelete = async () => {
    setIsOptionsOpen(false);

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Optimistic UI
        dispatch(deletePost(post._id));

        // Call API
        await postService.deletePost(post._id);

        Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
      } catch (error) {
        ToastUtils.error(error?.response?.data?.message || 'Error deleting post');
      }
    }
  };

  return (
    <div className="post-header">
      {/* 1. Avatar */}
      <Avatar
        name={post?.username}
        bgColor={post?.avatarColor}
        textColor="#ffffff"
        size={40}
        avatarSrc={post?.profilePicture}
        onClick={navigateToProfileResult}
      />

      {/* 2. Details */}
      <div className="post-header-details">

        <div className="username-feeling">
          <span className="username">{post?.username}</span>
          {post?.feelings && (
            <span className="feeling">
              is feeling <img src={getFeeling(post.feelings)} alt="" />{' '}
              {post.feelings}
            </span>
          )}
        </div>

        <div className="time-privacy">
          {post?.createdAt &&
            formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
          <PrivacyIcon className="privacy-icon" />
        </div>

      </div>

      {/* 3. Options Menu (Right Aligned) */}
      {post?.userId === profile?._id && (
        <div className="post-options" ref={optionsRef}>
          <div
            className="options-trigger"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            <FaEllipsisV />
          </div>

          {isOptionsOpen && (
            <ul className="options-list">
              <li className="option-item" onClick={handleEdit}>
                <FaPencilAlt className="item-icon" />
                <span>Edit Post</span>
              </li>
              <li className="option-item delete" onClick={handleDelete}>
                <FaTrashAlt className="item-icon" />
                <span>Delete Post</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
export default PostHeader;
