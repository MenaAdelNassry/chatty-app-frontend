import { FaSmile, FaTimes } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { bgColors } from '@root/constants';

const ModalBoxInput = ({
  state,
  handlePostTextChange,
  postInputRef,
  toggleEmoji,
  addEmoji,
  toggleColors,
  setBgColor,
  profile
}) => {
  const MAX_CHARS = 1000;
  const charsLeft = MAX_CHARS - state.post.length;

  return (
    <>
      {/* 1. Input Area */}
      <div
        className={`modal-input-wrapper ${
          state.bgColor !== '#ffffff' ? 'has-background' : ''
        }`}
        style={{ backgroundColor: state.bgColor }}
      >
        <textarea
          className="post-input"
          value={state.post}
          onChange={handlePostTextChange}
          maxLength={MAX_CHARS}
          placeholder={`What's on your mind, ${profile?.username}?`}
          style={{
            color: state.bgColor !== '#ffffff' ? 'white' : 'var(--gray-2)',
            textAlign: state.bgColor !== '#ffffff' ? 'center' : 'left',
          }}
          ref={postInputRef}
        />
        {state.bgColor === '#ffffff' && (
          <div className="input-options">

            {/* Character Countdown */}
            {state.post.length > 0 && (
              <span
                className={`char-counter ${charsLeft < 50 ? 'danger' : ''}`}
              >
                {charsLeft}/{MAX_CHARS}
              </span>
            )}

            {/* Emoji Picker Logic */}
            <div className="emoji-trigger">
              <FaSmile className="emoji-icon" onClick={toggleEmoji} />
              {state.showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker
                    onEmojiClick={addEmoji}
                    theme="light"
                    width="100%"
                    height="350px"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Media Preview */}
      {(state.gifUrl || state.image || state.video) && (
        <div className="modal-media-preview">
          {state.image && <img src={state.image} alt="preview" />}
          {state.video && <video src={state.video} controls />}
          {state.gifUrl && <img src={state.gifUrl} alt="gif" />}
          <button
            className="clear-media-btn"
            onClick={() => setBgColor('#ffffff')}
          >
            {' '}
            <FaTimes />{' '}
          </button>
        </div>
      )}

      {/* 3. Colors Palette */}
      {!state.image && !state.video && !state.gifUrl && (
        <div className="colors-toggle-wrapper">
          <div
            className="color-gradient-icon"
            onClick={toggleColors}
            style={{ display: state.showColors ? 'none' : 'block' }}
          ></div>
          {state.showColors && (
            <div className="bg-colors-list">
              <span
                className="close-colors"
                onClick={() => {
                  toggleColors();
                  setBgColor('#ffffff');
                }}
              >
                {' '}
                <FaTimes />{' '}
              </span>
              {bgColors.map((color, index) => (
                <div
                  key={index}
                  className={`color-item ${
                    state.bgColor === color ? 'active' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBgColor(color)}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ModalBoxInput;
