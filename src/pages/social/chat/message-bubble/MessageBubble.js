import { FaCheck, FaCheckDouble, FaChevronDown, FaPause, FaPlay, FaReply } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.services';
import '@pages/social/chat/message-bubble/MessageBubble.scss';
import { socketService } from '@services/socket/socket.service';
import { chatService } from '@services/api/chat/chat.service';
import { useDispatch } from 'react-redux';
import { deleteMessageFromState, updateMessageReaction } from '@redux/reducers/chat/chat.reducer';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { useEffect, useRef, useState } from 'react';
import { reactionIcons } from '@root/constants';
import moment from 'moment';

const MessageBubble = ({
  message,
  profileId,
  conversation,
  setReplyingMessage,
}) => {
  const dispatch = useDispatch();
  const isMe = message.senderId === profileId;

  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const longPressTimer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReaction = async (reactionType) => {
    try {
      const body = {
        conversationId: conversation._id,
        messageId: message._id,
        reaction: reactionType,
        socketId: socketService.socket.id
      };

      // Optimistic Update
      dispatch(updateMessageReaction({
        messageId: message._id,
        senderId: profileId,
        reaction: reactionType
      }));

      await chatService.updateMessageReaction(body);
      setShowReactions(false);
    } catch (error) {
      ToastUtils.error("Failed to react");
    }
  };

  // --- 2. Right Click (Desktop) ---
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!message.isDeleted) setShowReactions(true);
  };

  // --- 3. Long Press (Mobile) ---
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      if (!message.isDeleted) setShowReactions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleAction = (type) => {
    onDelete(type);
    setShowOptions(false);
  };

  const receiver = conversation.participants.find(
    (p) => p._id !== message.senderId
  );
  const receiverId = receiver?._id;

  // Delete Message
  const onDelete = async (type) => {
    try {
      const body = {
        messageId: message._id,
        conversationId: conversation._id,
        type, // 'me' or 'everyone'
        socketId: socketService.socket.id,
      };

      await chatService.deleteMessage(body);

      dispatch(
        deleteMessageFromState({
          messageId: message._id,
          conversationId: conversation._id,
          type,
        })
      );
    } catch (error) {
      console.error(error);
      ToastUtils.error('Some Error happen. Cannot delete this message');
    }
  };

  // Logic of check marks
  const renderStatus = () => {
    if (!isMe) return null;

    const isRead = conversation?.lastRead?.[receiverId] >= message._id;
    const isDelivered =
      conversation?.lastDelivered?.[receiverId] >= message._id;

    if (isRead) return <FaCheckDouble className="status-icon read" />; // Double blue
    if (isDelivered) return <FaCheckDouble className="status-icon delivered" />; // Double grey
    return <FaCheck className="status-icon sent" />; // Single grey
  };

  const handleScrollToOriginal = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };

  const getSenderName = (id) => {
    if (id === profileId) return 'You';
    const sender = conversation.participants.find((p) => p._id === id);
    return sender ? sender.username : 'User';
  };

  useEffect(() => {
  if (!showOptions) return;

  const handleClickOutside = (event) => {
    if (!event.target.closest('.custom-dropdown-menu') && !event.target.closest('.options-trigger')) {
      setShowOptions(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  useEffect(() => {
  if (!showReactions) return;

  const closePickers = (e) => {
    // لو الضغطة مش جوه بار الريأكشنات، اقفلها
    if (!e.target.closest('.reaction-picker-bar')) {
      setShowReactions(false);
    }
  };

  document.addEventListener('mousedown', closePickers);
  return () => document.removeEventListener('mousedown', closePickers);
  }, [showReactions]);

  // If the message is deleted for this user (it's in the deletedFor field)
  if (message.deletedFor?.includes(profileId)) return null;

  return (
  <div
    id={message._id}
    className={`message-bubble-wrapper ${isMe ? 'me' : 'them'} ${message.isDeleted ? 'deleted' : ''}`}
    onContextMenu={handleContextMenu} // Right Click
    onTouchStart={handleTouchStart}   // Mobile Start
    onTouchEnd={handleTouchEnd}       // Mobile End
  >
      {/* 1. Reply button - appears next to the bubble */}
      {!message.isDeleted && (
        <button className="side-reply-btn" onClick={() => setReplyingMessage(message)}>
          <FaReply />
        </button>
      )}

      {/* 2. Message bubble */}
      <div className="bubble-content">

        {/* --- Reaction Picker Bar --- */}
        {!message.isDeleted && showReactions && (
          <div className="reaction-picker-bar">
            {Object.entries(reactionIcons).map(([type, emoji]) => (
              <span key={type} onClick={() => handleReaction(type)}>{emoji}</span>
            ))}
          </div>
        )}

        {/* The small options share inside the bubble */}
        {!message.isDeleted && (
          <div className={`options-trigger ${showOptions ? 'active' : ''}`} onClick={toggleOptions}>
            <FaChevronDown />
          </div>
        )}

        {message.isDeleted ? (
          <p className="message-deleted-text">🚫 This message was deleted</p>
        ) : (
          <div className="message-body-container">
            {/* View reply */}
            {message.replyTo && (
              <div className="replied-message-box" onClick={() => handleScrollToOriginal(message.replyTo._id)}>
                <span className="replied-user">{getSenderName(message.replyTo.senderId)}</span>
                <p className="replied-text">
                  {message.replyTo.body ||
                  (message.replyTo.type === 'image' ? '📷 Image' :
                    message.replyTo.type === 'video' ? '🎥 Video' : '🎤 Voice Note')}
                </p>
              </div>
            )}

            {/* --- أضف الـ Audio Player هنا --- */}
            {message.type === 'audio' && (
              <div className="custom-audio-player">
                <audio
                  ref={audioRef}
                  src={message.selectedAudio}
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={onLoadedMetadata}
                  onEnded={onEnded}
                  hidden
                />
                <button type="button" className="play-btn" onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <div className="player-controls">
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                  </div>
                  <div className="player-info">
                    <span>{moment.utc(currentTime * 1000).format('mm:ss')}</span>
                    <span>{moment.utc(duration * 1000).format('mm:ss')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* View photos/videos */}
            {message.type === 'image' && <div className="message-image"><img src={message.selectedImage} alt="sent" /></div>}
            {message.type === 'video' && <div className="message-video"><video src={message.selectedVideo} controls /></div>}

            {/* Message text */}
            {message.body && <p className="message-text">{message.body}</p>}
          </div>
        )}

        {/* Message information */}
        <div className="message-info">
          <span className="time">{Utils.formatTime(message.createdAt)}</span>
          {renderStatus()}
        </div>

        {/* --- Display Reactions Badge --- */}
        {message.reaction && message.reaction.length > 0 && (
          <div className="reactions-display-badge">
            {Array.from(new Set(message.reaction.map(r => r.type))).map(type => (
              <span key={type}>{reactionIcons[type]}</span>
            ))}
            <span className="reaction-count">{message.reaction.length}</span>
          </div>
        )}

        {/* (Dropdown) */}
        {!message.isDeleted && showOptions && (
          <div className="custom-dropdown-menu">
            <button className="menu-item" onClick={() => handleAction('me')}>Delete for me</button>
            {isMe && <button className="menu-item danger" onClick={() => handleAction('everyone')}>Delete for everyone</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
