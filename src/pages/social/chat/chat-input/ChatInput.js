import { useState, useRef, useEffect } from 'react';
import { FaRegImage, FaRegFileVideo, FaPaperPlane, FaTimes, FaRegSmile, FaTrashAlt, FaMicrophone } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@services/socket/socket.service';
import { chatService } from '@services/api/chat/chat.service';
import { ImageUtils } from '@services/utils/image.utils';
import '@pages/social/chat/chat-input/ChatInput.scss';
import { addMessage, updateConversationFromSocket } from '@redux/reducers/chat/chat.reducer';
import { ToastUtils } from '@services/utils/toast-utils.service';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import EmojiPicker from 'emoji-picker-react';
import { useAudioRecorder } from '@hooks/useAudioRecorder';
import moment from 'moment';

const ChatInput = ({ receiverId, conversationId, replyingMessage, setReplyingMessage, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null); // { data: base64, type: 'image'|'video' }
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();
  const displayTime = moment.utc(recordingTime * 1000).format('mm:ss');

  const fileInputRef = useRef();
  const videoInputRef = useRef();
  const isTypingRef = useRef(false);
  const textInputRef = useRef();
  const emojiRef = useRef(null);

  const dispatch = useDispatch();

  const { profile } = useSelector(state => state.user);

  const [showEmojiPicker, setShowEmojiPicker] = useDetectOutsideClick(emojiRef, false);

  const handleSendVoiceNote = async () => {
    const base64Audio = await stopRecording();
    if (!base64Audio) return;

    const body = {
      conversationId: conversationId || undefined,
      receiverId: conversationId ? undefined : receiverId,
      type: 'audio',
      body: '',
      replyTo: replyingMessage ? replyingMessage._id : undefined,
      selectedAudio: base64Audio,
      socketId: socketService.socket.id
    };

    try {
      setLoading(true);
      const response = await chatService.sendMessage(body);
      const newMessage = response.data.messageData;

      dispatch(addMessage(newMessage));
      dispatch(updateConversationFromSocket({ message: newMessage, profile }));
      setReplyingMessage(null);
    } catch (err) {
      ToastUtils.error("Failed to upload voice note.");
    } finally {
      setLoading(false);
    }
  };

  // Utility to read file as Base64 for preview
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Size check (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large! Max 10MB.");
      return;
    }

    const convertedFile = await ImageUtils.readFileToBase64(file);

    setFilePreview({ data: convertedFile, type });
    e.target.value = null; // Reset input
  };

  const onSend = async (e) => {
    if (e) e.preventDefault();
    if (loading || (!message.trim() && !filePreview)) return;

    const body = {
      conversationId: conversationId || undefined,
      receiverId: conversationId ? undefined : receiverId,
      type: filePreview ? filePreview.type : 'text',
      body: message,
      replyTo: replyingMessage ? replyingMessage._id : undefined,
      [filePreview?.type === 'image' ? 'selectedImage' : 'selectedVideo']: filePreview?.data,
      socketId: socketService.socket.id
    };

    try {
      setLoading(true); // Start the loader
      const response = await chatService.sendMessage(body);
      const newMessage = response.data.messageData;

      if (!conversationId && newMessage.conversationId) {
        socketService.socket.emit('join chat', newMessage.conversationId);
      }

      // Update UI only after server confirms upload
      dispatch(addMessage(newMessage));

      dispatch(updateConversationFromSocket({
        message: newMessage,
        profile: profile
      }));

      // Reset everything
      setReplyingMessage(null);
      setMessage('');
      setFilePreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      ToastUtils.error("Some error happend in upload. try again.");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const input = textInputRef.current;

    // Cursor legacy: We split the text in half and put the emoji in the middle.
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    const start = message.substring(0, selectionStart);
    const end = message.substring(selectionEnd);
    const newMessage = start + emoji + end;

    setMessage(newMessage);

    // We're switching the focus back to the input so the user can continue typing.
    input.focus();

    setTimeout(() => {
      input.setSelectionRange(selectionStart + emoji.length, selectionStart + emoji.length);
    }, 0);
  };

  useEffect(() => {
    // If there's no text or no conversation, we'll leave.
    if (!message.trim() || !conversationId) {
      if (isTypingRef.current) {
        socketService.socket.emit('stop typing', conversationId);
        isTypingRef.current = false;
      }
      return;
    }

    // 1. Send "Started writing" if the current state is false
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.socket.emit('typing', conversationId);
    }

    // 2. Send "stop" two seconds after the last character
    const timer = setTimeout(() => {
      socketService.socket.emit('stop typing', conversationId);
      isTypingRef.current = false;
    }, 2000);

    // 3. Cleaning: The timer will be cleared if the user presses a new letter.
    return () => clearTimeout(timer);
  }, [message, conversationId]);

  return (
    <div className="chat-input-wrapper">
      {/* --- 1. File Preview Area --- */}
      {filePreview && (
        <div className="file-preview-container">
          <div className="preview-card">
            {loading && (
              <div className="preview-loader">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            )}
            <button className="close-btn" onClick={() => setFilePreview(null)} disabled={loading}>
              <FaTimes />
            </button>
            {filePreview.type === 'image' ? (
              <img src={filePreview.data} alt="preview" />
            ) : (
              <video src={filePreview.data} />
            )}
          </div>
        </div>
      )}

      {/* The preview that appears above the input */}
      {replyingMessage && (
        <div className="reply-preview-container">
          <div className="reply-content">
            <span className="user-name">
              {replyingMessage.senderId === profile._id ? 'You' : replyingMessage.senderData?.username}
            </span>
            <p className="msg-text">
              {replyingMessage.body ||
              (replyingMessage.type === 'image' ? '📷 Image' :
              replyingMessage.type === 'image' ? '🎥 Video' : '🎤 Voice Note'
              )}
            </p>
          </div>
          <button className="close-reply" onClick={() => setReplyingMessage(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* --- 3. Input / Recording Area --- */}
      {isRecording ? (
        // واجهة التسجيل المباشر
        <div className="voice-recording-container">
          <div className="recording-info">
            <div className="pulse-dot"></div>
            <span className="timer">{displayTime}</span>
          </div>
          <div className="recording-actions">
            <button type="button" className="action-btn delete" onClick={() => stopRecording()}>
              <FaTrashAlt />
            </button>
            <button type="button" className="send-voice-btn" onClick={handleSendVoiceNote}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <form className="chat-input-form" onSubmit={onSend}>
          <div className="input-actions">
            <div className="emoji-container" ref={emojiRef}>
              <button type="button" className={`action-btn ${showEmojiPicker ? 'active' : ''}`} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <FaRegSmile />
              </button>
              {showEmojiPicker && <div className="emoji-picker-container"><EmojiPicker onEmojiClick={onEmojiClick} /></div>}
            </div>

            <button type="button" className="action-btn" onClick={() => fileInputRef.current.click()}><FaRegImage /></button>
            <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={(e) => handleFileChange(e, 'image')} />

            <button type="button" className="action-btn" onClick={() => videoInputRef.current.click()}><FaRegFileVideo /></button>
            <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={(e) => handleFileChange(e, 'video')} />
          </div>

          <input
            ref={textInputRef}
            className='text-input'
            type="text"
            placeholder={loading ? "Uploading..." : "Type a message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />

          {message.trim() || filePreview ? (
            <button type="submit" className="send-btn" disabled={loading}>
              <FaPaperPlane />
            </button>
          ) : (
            <button type="button" className="mic-btn" onClick={startRecording} disabled={loading}>
              <FaMicrophone />
            </button>
          )}
        </form>
      )}

    </div>
  );
};

export default ChatInput;
