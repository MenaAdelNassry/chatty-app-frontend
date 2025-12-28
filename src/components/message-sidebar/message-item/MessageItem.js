import PropTypes from 'prop-types';
import Avatar from '@components/avatar/Avatar';
import doubleCheckmark from '@assets/images/double-checkmark.png';
import { FaCheck, FaCircle } from 'react-icons/fa';

const MessageItem = ({ notification, profile, onClick }) => {
  const isSender = notification.senderUsername === profile?.username;

  const displayUser = {
    username: isSender ? notification.receiverUsername : notification.senderUsername,
    avatarColor: isSender ? notification.receiverAvatarColor : notification.senderAvatarColor,
    profilePicture: isSender ? notification.receiverProfilePicture : notification.senderProfilePicture
  };

  return (
    <div className="message-sub-card" onClick={onClick}>
      <div className="content-avatar">
        <Avatar
          name={displayUser.username}
          bgColor={displayUser.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={displayUser.profilePicture}
        />
      </div>

      <div className="content-body">
        <h6 className="title">{displayUser.username}</h6>
        <p className="subtext">
          {notification?.body || notification?.message}
        </p>
      </div>

      <div className="content-icons">
        {!notification?.isRead ? (
          <>
            {isSender ? (
               <FaCheck className="circle not-read" />
            ) : (
               <FaCircle className="circle" />
            )}
          </>
        ) : (
          <>
            {isSender && (
              <img src={doubleCheckmark} alt="" className="circle read" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

MessageItem.propTypes = {
  notification: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default MessageItem;
