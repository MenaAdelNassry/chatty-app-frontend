import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { FaTimes } from 'react-icons/fa';
import '@components/posts/image-modal/ImageModal.scss';

const ImageModal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector((state) => state.modal);

  if (!isOpen || type !== 'image') return null;

  return (
    <div className="image-modal-overlay" onClick={() => dispatch(closeModal())}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={data} alt="Full view" className="modal-image" />
        <button className="close-btn" onClick={() => dispatch(closeModal())}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
