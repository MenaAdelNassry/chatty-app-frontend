import PropTypes from 'prop-types';
import Dropdown from '@components/dropdown/Dropdown';
import MessageItem from '@components/message-sidebar/message-item/MessageItem';
import '@components/message-sidebar/MessageSidebar.scss';

const MessageSidebar = ({ profile, messageCount, messageNotifications, openChatPage }) => {
  return (
    <div className="message-dropdown" data-testid="message-sidebar">
      <Dropdown
        title="Messages"
        subTitle={messageCount}
        height={window.innerHeight - 100}
        style={{ width: '100%', border: 'none', boxShadow: 'none' }} // Override styles
      >
        {messageNotifications.length > 0 ? (
          messageNotifications.map((notification) => (
            <MessageItem
              key={notification._id}
              notification={notification}
              profile={profile}
              onClick={() => openChatPage(notification)}
            />
          ))
        ) : (
          <p className="empty-message">No messages yet</p>
        )}
      </Dropdown>
    </div>
  );
};

MessageSidebar.propTypes = {
  profile: PropTypes.object.isRequired,
  messageCount: PropTypes.number.isRequired,
  messageNotifications: PropTypes.array.isRequired,
  openChatPage: PropTypes.func.isRequired
};

export default MessageSidebar;
