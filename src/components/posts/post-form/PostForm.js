import Avatar from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@redux/reducers/modal/modal.reducer';
import photoIcon from '@assets/images/photo.png';
import gifIcon from '@assets/images/gif.png';
import feelingIcon from '@assets/images/feeling.png';
import '@components/posts/post-form/PostForm.scss';

const PostForm = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  const openModalWithData = (data) => {
    dispatch(openModal({ type: 'add', data }));
  };

  return (
    <div className="post-form-card">
      {/* 1. Top Section: Avatar + Fake Input */}
      <div className="post-form-top">
        <div className="user-avatar">
          <Avatar
            name={profile?.username}
            bgColor={profile?.avatarColor}
            textColor="#ffffff"
            size={50}
            avatarSrc={profile?.profilePicture}
          />
        </div>

        {/* Fake Input Trigger */}
        <div
          className="post-form-input"
          onClick={() => openModalWithData()}
          data-placeholder={`What's on your mind, ${profile?.username}?`}
        ></div>
      </div>

      {/* 2. Divider */}
      <hr className="divider" />

      {/* 3. Bottom Section: Action Items */}
      <ul className="post-form-actions">
        <li className="action-item" onClick={() => openModalWithData('image')}>
          <img src={photoIcon} alt="user-photo" />
          <span className="action-text">Photo</span>
        </li>
        <li className="action-item" onClick={() => openModalWithData('gif')}>
          <img src={gifIcon} alt="GIF" />
          <span className="action-text">GIF</span>
        </li>
        <li
          className="action-item"
          onClick={() => openModalWithData('feeling')}
        >
          <img src={feelingIcon} alt="Feeling" />
          <span className="action-text">Feeling</span>
        </li>
      </ul>
    </div>
  );
};

export default PostForm;
