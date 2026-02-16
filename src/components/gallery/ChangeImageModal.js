import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import { FaCamera, FaRegImages, FaTimes } from 'react-icons/fa';
import '@components/gallery/ChangeImageModal.scss';
import { ImageUtils } from '@services/utils/image.utils';
import { imageService } from '@services/api/image/image.service';
import { Utils } from '@services/utils/utils.services';
import { addProfileImage } from '@redux/api/user';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

const ChangeImageModal = ({ onClose, type }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { profile } = useSelector((state) => state.user);

  // --- State ---
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'gallery'
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Cropper State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 🔥 Pagination State
  const [page, setPage] = useState(1);
  const [totalImagesCount, setTotalImagesCount] = useState(0);

  // --- 1. Infinite Scroll Hook ---
  const bottomLineRef = useInfiniteScroll(() => {
    if (!loading && galleryImages.length < totalImagesCount) {
      setPage((prev) => prev + 1);
    }
  });

  // --- 2. Reset Logic ---
  useEffect(() => {
    if (activeTab === 'gallery') {
        setPage(1);
        setGalleryImages([]);
        setTotalImagesCount(0);
    }
  }, [activeTab]);

  // --- 3. Fetch Logic ---
  useEffect(() => {
    if (activeTab === 'gallery') {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await imageService.getImages(profile._id, page, type);
                const { images, total } = response.data;

                setTotalImagesCount(total);

                if (page === 1) {
                  setGalleryImages(images);
                } else {
                  setGalleryImages((prev) => [...prev, ...images]);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                // Handle error
            }
        };
        fetchImages();
    }
  }, [activeTab, page, profile._id, type]);

  // --- 4. Save Logic (The Smart part) ---
  const saveImage = async () => {
    try {
        setLoading(true);
        let body = {};
        const url = type === 'profile' ? '/images/profile' : '/images/background';

        if (activeTab === 'upload' && image) {
            // Case A: New Upload -> Send Base64
            const croppedImageBase64 = await ImageUtils.getCroppedImg(image, croppedAreaPixels);
            body = { image: croppedImageBase64 };
        } else if (activeTab === 'gallery' && selectedGalleryImage) {
            // Case B: From Gallery -> Send ID & Version
            body = {
                existingPublicId: selectedGalleryImage.publicId,
                existingVersion: selectedGalleryImage.version
            };
        } else {
            setLoading(false);
            return;
        }

        await dispatch(addProfileImage({ url, data: body, type })).unwrap();

        setLoading(false);
        onClose();
    } catch (error) {
        setLoading(false);
    }
  };

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImage(reader.result);
        };
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
            <h3>Update {type} Photo</h3>
            <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* --- Tabs Header --- */}
        <div className="modal-tabs">
            <button
                className={activeTab === 'upload' ? 'active' : ''}
                onClick={() => setActiveTab('upload')}
            >
                Upload Photo
            </button>
            <button
                className={activeTab === 'gallery' ? 'active' : ''}
                onClick={() => setActiveTab('gallery')}
            >
                Select from Gallery
            </button>
        </div>

        <div className="modal-body">
          {activeTab === 'upload' && (
                !image ? (
                    <div className="upload-section">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={onSelectFile} hidden />
                        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
                            <FaCamera /> Upload Photo
                        </button>
                    </div>
                ) : (
                    <div className="cropper-container">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={type === 'profile' ? 1 : 16 / 9}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                )
            )}

            {/* --- Content: Gallery Tab --- */}
            {activeTab === 'gallery' && (
                <div className="gallery-grid">
                    {galleryImages.length > 0 ? (
                      <>
                        {galleryImages.map((img) => (
                            <div
                                key={img._id}
                                className={`gallery-image-item ${selectedGalleryImage?._id === img._id ? 'selected' : ''}`}
                                onClick={() => setSelectedGalleryImage(img)}
                            >
                                <img
                                    src={Utils.appResourceUrl(img.version, img.publicId, 'image')}
                                    alt=""
                                />
                            </div>
                        ))}

                        {/* Infinite Scroll */}
                        {galleryImages.length < totalImagesCount && (
                            <div ref={bottomLineRef} className="loading-trigger" style={{height: '20px', width: '100%'}}>
                                {loading && <span>Loading...</span>}
                            </div>
                        )}
                      </>
                    ) : (
                        <div className="empty-msg">
                          <FaRegImages className="icon" />
                          <span>No previous photos found</span>
                        </div>
                    )}
                </div>
            )}
        </div>

            <div className="modal-footer">
              {/* Slider only shows in upload mode */}
              {activeTab === 'upload' && image && (
                <div className="slider-container">
                    <span className="label">Zoom:</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="zoom-range"
                    />
                </div>
              )}

                <div className="actions">
                  <button className="cancel-btn" onClick={onClose}>Cancel</button>
                  <button
                      className="save-btn"
                      onClick={saveImage}
                      disabled={loading || (activeTab === 'upload' && !image) || (activeTab === 'gallery' && !selectedGalleryImage)}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
            </div>
      </div>
    </div>
  );
};

export default ChangeImageModal;
