import { FaArrowLeft, FaTimes } from 'react-icons/fa';

const ModalBoxHeader = ({ showGiphy, toggleGiphy, handleClose }) => {
  return (
    <div className="modal-header">
      {showGiphy && (
        <button className="back-btn" onClick={() => toggleGiphy(false)}>
          <FaArrowLeft />
        </button>
      )}
      <h2>{showGiphy ? 'Select GIF' : 'Create Post'}</h2>
      <button className="close-btn" onClick={handleClose}>
        <FaTimes />
      </button>
    </div>
  );
};
export default ModalBoxHeader;
