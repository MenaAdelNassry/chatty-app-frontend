import PropTypes from 'prop-types';
import Avatar from '@components/avatar/Avatar';
import { FaCircle, FaRegComment, FaRegUser } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.services';
import '@components/NotificationPreview/NotificationPreview.scss';
import { notificationTypes, reactionsMap } from '@root/constants';
import { useDispatch } from 'react-redux';
import { followUser, unfollowUser } from '@redux/api/follower';
import { useNavigate } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import { useState } from 'react';
import ImageModal from '@components/gallery/MediaModal';

const NotificationPreview = ({
  notification,
  onMarkAsRead,
  children,
  isDropdown = true,
}) => {
  const {
    userFrom,
    read,
    notificationType,
    imgId,
    imgVersion,
    gifUrl,
    reaction,
    comment,
    message,
    createdAt,
    isFollowing,
  } = notification;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const postMedia = Utils.appResourceUrl(imgVersion, imgId, 'image') || gifUrl;

  const toggleFollow = (e) => {
    e.stopPropagation();

    try {
      onMarkAsRead();
      if (isFollowing) {
        dispatch(unfollowUser(userFrom._id));
      } else {
        dispatch(followUser(userFrom._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const NotificationClickHandler = async () => {
    onMarkAsRead();
    console.log(notificationType);
    console.log(notification);
    if (notificationType === notificationTypes.FOLLOW) {
      navigate(`/app/social/profile/${userFrom.username}/${userFrom._id}`);
    } else if (
      notificationType === notificationTypes.REACTION ||
      notificationType === notificationTypes.COMMENT
    ) {
      try {
        const response = await postService.getPostById(notification.entityId);
        setSelectedPost(response.data.post);
        setShowPostModal(true);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }
  };

  return (
    <>
      <div
        className={`notification-preview-item ${!read ? 'unread' : ''} ${
          !isDropdown ? 'is-page' : ''
        }`}
        onClick={NotificationClickHandler}
      >
        {/* --- Left: Avatar & Reaction Icon --- */}
        <div className="author-avatar">
          <Avatar
            name={userFrom.username}
            avatarSrc={userFrom.profilePicture}
            bgColor={userFrom.avatarColor}
            textColor="#ffffff"
            size={isDropdown ? 40 : 60}
          />

          {/* Display the reaction icon as a small image above the avatar */}
          <div
            className="type-icon"
            style={
              notificationType === notificationTypes.REACTION
                ? { background: 'transparent' }
                : undefined
            }
          >
            {notificationType === notificationTypes.REACTION &&
              reaction &&
              reactionsMap[reaction] && (
                <img
                  src={reactionsMap[reaction]}
                  alt={reaction}
                  className="reaction-img"
                />
              )}

            {notificationType === notificationTypes.COMMENT && (
              <FaRegComment className="icon comment" />
            )}

            {notificationType === notificationTypes.FOLLOW && (
              <FaRegUser className="icon follow" />
            )}
          </div>
        </div>

        {/* --- Center: Content --- */}
        <div className="notification-content">
          <div className="notification-text">
            <span className="username">{userFrom.username}</span>
            <span className="message">
              {notificationType === notificationTypes.REACTION && reaction ? (
                <span className="reaction-text">
                  reacted with{' '}
                  <img
                    src={reactionsMap[reaction]}
                    alt=""
                    className="inline-reaction"
                  />{' '}
                  to your post
                </span>
              ) : notificationType === notificationTypes.COMMENT && comment ? (
                `commented: "${comment}"`
              ) : (
                message
              )}
            </span>
          </div>
          <div className="notification-time">
            <small>
              {isDropdown
                ? Utils.timeAgo(createdAt)
                : Utils.formatNotificationDate(createdAt)}
            </small>
          </div>
        </div>

        {/* --- Right: Action --- */}
        <div className="notification-action">
          {notificationType === notificationTypes.FOLLOW && (
            <button
              className={`action-btn ${
                isFollowing ? 'btn-secondary' : 'btn-primary'
              }`}
              onClick={toggleFollow}
            >
              {isFollowing ? 'Following' : 'Follow Back'}
            </button>
          )}

          {(notificationType === notificationTypes.REACTION ||
            notificationType === notificationTypes.COMMENT) &&
            postMedia && (
              <img src={postMedia} alt="Post" className="post-thumbnail" />
            )}

          {children}

          {!read && <FaCircle className="read-indicator-icon" />}
        </div>
      </div>

      {/* 🔥🔥 Popup Modal Component 🔥🔥 */}
      {showPostModal && selectedPost && (
        <ImageModal
          file={selectedPost}
          onClose={() => setShowPostModal(false)}
          showArrows={false}
          isPost={true}
        />
      )}
    </>
  );
};

NotificationPreview.propTypes = {
  notification: PropTypes.object.isRequired,
  onMarkAsRead: PropTypes.func,
  children: PropTypes.node,
  isDropdown: PropTypes.bool,
};

NotificationPreview.defaultProps = {
  isDropdown: true,
  children: null,
};

export default NotificationPreview;
