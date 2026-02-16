import { useRef } from 'react';
import { FaGlobe, FaLock, FaCaretDown } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { privacyList } from '@root/constants';

const ModalBoxSelection = ({ profile, state, setPrivacy }) => {
  const privacyRef = useRef(null);

  const [isPrivacyOpen, setIsPrivacyOpen] = useDetectOutsideClick(privacyRef, false);

  return (
    <div className="user-privacy-wrapper">
      <div className="user-avatar">
        <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={50} avatarSrc={profile?.profilePicture} />
      </div>
      <div className="user-details">
        <div className="name-feeling-wrapper">
          <span className="username">{profile?.username}</span>
          {state.feelings && (
            <span className="feeling-text">
              is feeling <img src={state.feelings.image} alt={state.feelings.name} /> {state.feelings.name}
            </span>
          )}
        </div>
        <div className="privacy-selector" onClick={() => setIsPrivacyOpen(!isPrivacyOpen)} ref={privacyRef}>
          <span className="icon">{state.privacy.topText === 'Public' ? <FaGlobe /> : <FaLock />}</span>
          <span className="text">{state.privacy.topText}</span>
          <FaCaretDown className="caret" />
          {isPrivacyOpen && (
            <ul className="privacy-dropdown">
              {privacyList.map((item, index) => (
                <li key={index} className={`privacy-item ${state.privacy.topText.toLowerCase() === item.topText.toLowerCase() ? 'active' : ''}`}
                    onClick={() => { setPrivacy(item); setIsPrivacyOpen(false); }}>
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-info">
                    <span className="item-title">{item.topText}</span>
                    <span className="item-sub">{item.subText}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export default ModalBoxSelection;
