import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import '@components/posts/post-modal/AddPostModal.scss';
import Giphy from '@components/giphy/Giphy';
import { createPost, updatePost } from '@redux/api/post';
import usePostForm from '@hooks/social/post/usePostForm';
import ModalBoxHeader from '@components/posts/post-modal/ModalBoxHeader';
import ModalBoxSelection from '@components/posts/post-modal/ModalBoxSelection';
import ModalBoxInput from '@components/posts/post-modal/ModalBoxInput';
import ModalBoxFooter from '@components/posts/post-modal/ModalBoxFooter';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { privacyList } from '@root/constants';
import { Utils } from '@services/utils/utils.services';
import { ToastUtils } from '@services/utils/toast-utils.service';

const AddPostModal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector((state) => state.modal);
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.post);

  // 1. States And Methods
  const {
    state,
    handlePostTextChange, // Auto-Resize Textarea
    handleFileChange, // Handle File Selection 📸
    addEmoji, // Add Emoji
    setPrivacy,
    setFeeling,
    setBgColor, // Background Selection Logic
    setGif, // Giphy Click
    toggleGiphy,
    toggleEmoji,
    toggleColors,
    resetForm,
    setPostToEdit,
  } = usePostForm();

  // 2. Refs
  const modalRef = useRef();
  const postInputRef = useRef(null);
  const fileInputRef = useRef();
  const feelingsRef = useRef(null);

  const [isFeelingsOpen, setIsFeelingsOpen] = useDetectOutsideClick(
    feelingsRef,
    false
  );

  // 3. Close Modal
  const handleClose = useCallback(() => {
    dispatch(closeModal());
    resetForm();
    setIsFeelingsOpen(false);
  }, [dispatch, resetForm, setIsFeelingsOpen]);

  const handleUpdatePost = async () => {
    const payload = {
      post: state.post,
      bgColor: state.bgColor,
      privacy: state.privacy?.topText,
      feelings: state.feelings?.name,
      gifUrl: state.gifUrl || undefined,
    };

    if (state.image) {
      if (state.image.startsWith('data:')) {
        payload.image = state.image;
      } else {
        payload.image = undefined;
      }
    } else {
      if (data.imgId) {
        payload.image = '';
      }
    }

    if (state.video) {
      if (state.video.startsWith('data:')) {
        payload.video = state.video;
      } else {
        payload.video = undefined;
      }
    } else {
      if (data.videoId) {
        payload.video = '';
      }
    }

    if (!state.gifUrl && data.gifUrl) {
      payload.gifUrl = '';
    }

    const result = await dispatch(
      updatePost({ postId: data._id, body: payload })
    );

    if (updatePost.fulfilled.match(result)) {
      handleClose();
    }
  };

  // 4. Create And Update Post Handler
  const handleSubmit = async () => {
    try {
      if (type === 'add') {
        const postData = {
          post: state.post,
          bgColor: state.bgColor,
          privacy: state.privacy?.topText || 'Public',
          feelings: state.feelings?.name || '',
          gifUrl: state.gifUrl || undefined,
          image: state.image || undefined,
          video: state.video || undefined,
        };

        const result = await dispatch(createPost(postData));
        if (createPost.fulfilled.match(result)) {
          handleClose();
        }
      } else if (type === 'edit') {
        await handleUpdatePost();
      }
    } catch (error) {
      ToastUtils.error(error);
    }
  };

  // Auto-Focus Logic
  useEffect(() => {
    if (isOpen && postInputRef.current && !state.showGiphy) {
      setTimeout(() => {
        postInputRef.current?.focus();
      }, 10);
    }
  }, [isOpen, state.showGiphy]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    const dashboardContent = document.querySelector('.dashboard-content');

    if (isOpen && dashboardContent) {
      dashboardContent.style.overflow = 'hidden';
    } else if (dashboardContent) {
      dashboardContent.style.overflow = 'auto';
    }

    return () => {
      if (dashboardContent) {
        dashboardContent.style.overflow = 'auto';
      }
    };
  }, [isOpen]);

  // Close the module using the Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dispatch, handleClose]);

  // Smart Triggers (data from Redux)
  useEffect(() => {
    if (isOpen && type === 'add' && data) {
      if (data === 'image')
        setTimeout(() => fileInputRef.current?.click(), 500);
      else if (data === 'gif') toggleGiphy(true);
      else if (data === 'feeling') setIsFeelingsOpen(true);
    }
  }, [isOpen, type, data, toggleGiphy, setIsFeelingsOpen]);

  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && data) {
        const privacyObj =
          privacyList.find((p) => p.topText === data.privacy) || privacyList[0];

        let imagePreview = '';
        if (data.imgId && data.imgVersion) {
          imagePreview = Utils.appResourceUrl(
            data.imgVersion,
            data.imgId,
            'image'
          );
        }

        let videoPreview = '';
        if (data.videoId && data.videoVersion) {
          videoPreview = Utils.appResourceUrl(
            data.imgVersion,
            data.imgId,
            'video'
          );
        }

        setPostToEdit({
          ...data,
          privacy: privacyObj,
          image: imagePreview || undefined,
          video: videoPreview || undefined,
        });
      }
    }
  }, [isOpen, type, data, setPostToEdit, resetForm]);

  if (!isOpen || (type !== 'add' && type !== 'edit')) return null;

  return (
    <div className="post-modal-overlay" onClick={handleClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // I'm preventing the click here; it will lead to the overlay and close the modal.
        ref={modalRef}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="modal-loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* 1. Header */}
        <ModalBoxHeader
          showGiphy={state.showGiphy}
          toggleGiphy={toggleGiphy}
          handleClose={handleClose}
        />

        {/* 2. Body */}
        <div className="modal-body">
          {state.showGiphy ? (
            <Giphy handleGiphyClick={(url) => setGif(url)} />
          ) : (
            <>
              {/* A. User Info & Privacy & Feelings Display */}
              <ModalBoxSelection
                profile={profile}
                state={state}
                setPrivacy={setPrivacy}
              />

              {/* B. Post Input */}
              <ModalBoxInput
                state={state}
                handlePostTextChange={handlePostTextChange}
                postInputRef={postInputRef}
                toggleEmoji={toggleEmoji}
                addEmoji={addEmoji}
                toggleColors={toggleColors}
                setBgColor={setBgColor}
                profile={profile}
              />

              {/* Error Message Display */}
              {state.validationError && (
                <div className="validation-error">{state.validationError}</div>
              )}

              {/* C. Footer Actions */}
              <ModalBoxFooter
                state={state}
                handleFileChange={handleFileChange}
                toggleGiphy={toggleGiphy}
                setFeeling={setFeeling}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                fileInputRef={fileInputRef}
                feelingsRef={feelingsRef}
                isFeelingsOpen={isFeelingsOpen}
                setIsFeelingsOpen={setIsFeelingsOpen}
                type={type}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
