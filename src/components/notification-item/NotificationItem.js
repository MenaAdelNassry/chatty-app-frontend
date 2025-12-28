import PropTypes from 'prop-types';
import Avatar from '@components/avatar/Avatar';
import { FaCircle, FaRegCircle, FaTrashAlt } from 'react-icons/fa';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  return (
    <div className="social-sub-card">
      {/* 1. Avatar */}
      <div className="content-avatar">
        <Avatar
          name={notification?.username}
          bgColor={notification?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={notification?.profilePicture}
        />
      </div>

      {/* 2. Content Body */}
      <div
        className="content-body"
        onClick={() => onMarkAsRead(notification)}
      >
        <h6 className="title">{notification?.topText}</h6>
        <p className="subtext">{notification?.subText}</p>
      </div>

      {/* 3. Icons */}
      <div className="content-icons">
        <FaTrashAlt
          className="trash"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification?._id);
          }}
        />
        {notification?.read ? (
          <FaRegCircle className="circle" />
        ) : (
          <FaCircle className="circle" />
        )}
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default NotificationItem;
