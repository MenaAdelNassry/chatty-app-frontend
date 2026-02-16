import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import '@pages/social/chat/message-status/MessageStatus.scss';

// MessageStatus.jsx
const MessageStatus = ({ message, conversation, receiverId }) => {
  const isRead = conversation?.lastRead?.[receiverId] >= message._id;

  const isDelivered = conversation?.lastDelivered?.[receiverId] >= message._id;

  if (isRead) {
    return <FaCheckDouble className="status-icon read" />;
  }
  if (isDelivered) {
    return <FaCheckDouble className="status-icon delivered" />;
  }
  return <FaCheck className="status-icon sent" />;
};

export default MessageStatus;
