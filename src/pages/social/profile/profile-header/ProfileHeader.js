import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import {
  FaCamera,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPen,
  FaUserCheck,
  FaUserPlus,
} from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import ChangeImageModal from '@components/gallery/ChangeImageModal';
import { Utils } from '@services/utils/utils.services';
import '@pages/social/profile/profile-header/ProfileHeader.scss';
import EditProfileModal from '../edit-profile-modal/EditProfileModal';
import { followUser, unfollowUser } from '@redux/api/follower';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from '@redux/reducers/chat/chat.reducer';
import { ROUTES } from '@root/constants';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ user, isCurrentUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalType, setImageModalType] = useState(''); // 'profile' | 'background'

  const [showEditModal, setShowEditModal] = useState(false);
  const { conversations } = useSelector((state) => state.chat);
  const { profile } = useSelector((state) => state.user);

  const openModal = (type) => {
    setImageModalType(type);
    setShowImageModal(true);
  };

  const onSendMessage = () => {
    const existingChat = conversations.find((chat) =>
      !chat.isGroup && chat.participants.some((p) => p._id === user._id)
    );

    if (existingChat) {
      dispatch(setSelectedChat({ chat: existingChat, myId: profile._id }));
    } else {
      const skeletonChat = {
        _id: '',
        isGroup: false,
        groupAdminIds: [],
        groupAvatar: '',
        groupName: '',
        lastMessage: '',
        lastMessageType: '',
        unreadCounts: { [user._id]: 0, [profile._id]: 0 },
        totalMessages: 0,
        lastRead: {},
        lastDelivered: {},
        lastMessageSenderId: '',
        lastMessageId: '',
        createdAt: new Date().toISOString(),
        participants: [
          {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            avatarColor: user.avatarColor,
          },
          {
            _id: profile._id,
            username: profile.username,
            profilePicture: profile.profilePicture,
            avatarColor: profile.avatarColor,
          }
        ],
      };

      dispatch(setSelectedChat({ chat: skeletonChat, myId: profile._id }));
    }

    navigate(ROUTES.SOCIAL_CHAT_MESSAGES);
  };

  const coverImage = user?.bgImageVersion
    ? Utils.appResourceUrl(user.bgImageVersion, user.bgImageId, 'image')
    : 'https://via.placeholder.com/1200x400'; // Fallback Image

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow Logic
        setIsFollowing(false); // Optimistic Update
        await dispatch(unfollowUser(user._id)).unwrap();
      } else {
        // Follow Logic
        setIsFollowing(true);
        await dispatch(followUser(user._id)).unwrap();
      }
    } catch (error) {
      setIsFollowing(!isFollowing);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing);
    }
  }, [user]);

  return (
    <div className="profile-header-wrapper">
      {/* --- 1. Cover Section --- */}
      <div
        className="cover-container"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        {isCurrentUser && (
          <div
            className="edit-cover-btn"
            onClick={() => openModal('background')}
          >
            <FaCamera className="camera-icon" />
            <span className="btn-text">Edit Cover</span>
          </div>
        )}
      </div>

      {/* --- 2. Profile Info Section --- */}
      <div className="profile-info-container">
        {/* Avatar Wrapper */}
        <div className="avatar-wrapper">
          <div className="avatar-border">
            <Avatar
              name={user?.username}
              bgColor={user?.avatarColor}
              textColor="#ffffff"
              size={140}
              avatarSrc={user?.profilePicture}
            />
          </div>
          {isCurrentUser && (
            <div
              className="edit-avatar-btn"
              onClick={() => openModal('profile')}
            >
              <FaCamera />
            </div>
          )}
        </div>

        {/* Names & Quote */}
        <div className="name-section">
          <div className="name-row">
            <h2 className="fullname">{user?.username}</h2>

            {isCurrentUser ? (
              <button
                className="edit-profile-btn"
                onClick={() => setShowEditModal(true)}
              >
                <FaPen /> Edit Profile
              </button>
            ) : (
              <div className='btns-header'>
                <button
                  className={`btn-action ${
                    isFollowing ? 'btn-following' : 'btn-follow'
                  }`}
                  onClick={toggleFollow}
                  disabled={loading}
                >
                  {isFollowing ? (
                    <>
                      <FaUserCheck /> Following
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Follow
                    </>
                  )}
                </button>
                <button
                  className={`btn-action`}
                  onClick={onSendMessage}
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
          {user?.quote && <p className="quote">“{user.quote}”</p>}

          {/* Social Icons */}
          <div className="socials">
            {user?.social?.twitter && (
              <a
                href={user.social.twitter}
                target="_blank"
                className="social-icon twitter"
                rel="noreferrer noopener"
              >
                <FaTwitter />
              </a>
            )}
            {user?.social?.facebook && (
              <a
                href={user.social.facebook}
                target="_blank"
                className="social-icon facebook"
                rel="noreferrer noopener"
              >
                <FaFacebook />
              </a>
            )}
            {user?.social?.instagram && (
              <a
                href={user.social.instagram}
                target="_blank"
                className="social-icon instagram"
                rel="noreferrer noopener"
              >
                <FaInstagram />
              </a>
            )}
            {user?.social?.youtube && (
              <a
                href={user.social.youtube}
                target="_blank"
                className="social-icon youtube"
                rel="noreferrer noopener"
              >
                <FaYoutube />
              </a>
            )}
          </div>
        </div>

        {/* Details (Work, School, Location) */}
        <div className="details-section">
          {user?.work && (
            <div className="detail-item">
              <FaBriefcase className="icon" /> <span>{user.work}</span>
            </div>
          )}
          {user?.school && (
            <div className="detail-item">
              <FaGraduationCap className="icon" /> <span>{user.school}</span>
            </div>
          )}
          {user?.location && (
            <div className="detail-item">
              <FaMapMarkerAlt className="icon" /> <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}

      {/* 1. Image Modal */}
      {showImageModal && (
        <ChangeImageModal
          type={imageModalType}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* 2. 🔥 Edit Profile Modal (New) */}
      {showEditModal && (
        <EditProfileModal
          currentUser={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
