import Avatar from '@components/avatar/Avatar';
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaHeart,
  FaComment,
  FaDownload,
  FaTrash,
} from 'react-icons/fa';
import { Utils } from '@services/utils/utils.services';
import CommentsSection from '@components/posts/comments/CommentsSection';
import '@components/gallery/MediaModal.scss';
import { PostUtils } from '@services/utils/post.utils';
import { imageService } from '@services/api/image/image.service';
import { ToastUtils } from '@services/utils/toast-utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '@redux/reducers/user/user.reducer';

const ImageModal = ({
  file, // current post or image object
  onClose,
  onNext,
  onPrev,
  showArrows,
  isPost = true,
  rmeoveImageFromList
}) => {
  const { profile } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const reactionsLength = isPost ? PostUtils.sumAllReactions(file.reactions) : 0;
  const fileUrl = Utils.appResourceUrl(file.version, file.publicId, 'image');

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    try {
        await imageService.removeImage(file._id);

        rmeoveImageFromList(file._id);

        if(file.type === 'profile' && profile.profilePicture === fileUrl) {
          dispatch(updateUserProfile({ ...profile, profilePicture: '' }));
          profile.profilePicture = '';
        } else if(file.type === 'background' && file.version === profile.bgImageVersion && file.publicId === profile.bgImageId) {
          dispatch(updateUserProfile({ ...profile, bgImageId: '', bgImageVersion: '' }));
        }

        ToastUtils.success('Image deleted successfully');
        onClose();
    } catch (error) {
        ToastUtils.error(error.response?.data?.message || 'Error deleting image');
    }
  };

  const renderMedia = () => {
      if (file.videoId) {
          return (
              <video
                  controls
                  autoPlay
                  className="full-video"
                  src={Utils.appResourceUrl(file.videoVersion, file.videoId, 'video')}
                  style={{ width: '100%', outline: 'none', maxHeight: '90vh' }}
              />
          );
      }
      // Default: Image
      let imageUrl;

      if(isPost) {
        imageUrl = file.gifUrl ? file.gifUrl : Utils.appResourceUrl(file.imgVersion, file.imgId, 'image');
      } else {
        imageUrl = Utils.appResourceUrl(file.version, file.publicId, 'image');
      }

      return <img src={imageUrl} alt="post media" className="full-image" />;
  };

  return (
    <div className="modal-overlay">
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      {/* --- 1. Left Side: Media Viewer --- */}
      <div className="modal-media-container">
        {showArrows && (
          <button className="arrow-btn left" onClick={onPrev}>
            <FaArrowLeft />
          </button>
        )}

        <div className="media-wrapper">
          {renderMedia()}
        </div>

        {showArrows && (
          <button className="arrow-btn right" onClick={onNext}>
            <FaArrowRight />
          </button>
        )}

        {!isPost && (
          <div className="image-actions">
                <a
                    href={fileUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn download-btn"
                    title="Download Image"
                >
                    <FaDownload />
                </a>

                {!file.postId && file.userId === profile._id && (
                  <button
                    className="action-btn delete-btn"
                    onClick={handleDelete}
                    title="Delete Image"
                  >
                    <FaTrash />
                  </button>
              )}
            </div>
        )}
      </div>

      {/* --- 2. Right Side: Details & Comments (Reusable) --- */}
      {isPost && (
        <div className="modal-info-container">
        <div className="modal-header">
          <Avatar
            name={file.username}
            bgColor={file.avatarColor}
            textColor="#ffffff"
            size={40}
            avatarSrc={file.profilePicture}
          />
          <div className="header-info">
            <span className="username">{file.username}</span>
            <span className="date">{Utils.timeAgo(file.createdAt)}</span>
          </div>
        </div>

        <div className="modal-body">
          <p className="post-text">{file.post}</p>
          <div className="comments-section-wrapper">
            <CommentsSection postId={file._id} />
          </div>
        </div>

        <div className="modal-footer">
          <div className="stats">
            <span>
              <FaHeart className="icon" />{' '}
              {Utils.shortenLargeNumbers(reactionsLength)}
            </span>
            <span>
              <FaComment className="icon" />{' '}
              {Utils.shortenLargeNumbers(file.commentsCount)}
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ImageModal;
