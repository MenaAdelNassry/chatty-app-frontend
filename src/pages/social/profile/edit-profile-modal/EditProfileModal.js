import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import '@pages/social/profile/edit-profile-modal/EditProfileModal.scss';
import { updateBasicInfo, updateSocialLinks } from '@redux/api/user';

const EditProfileModal = ({ currentUser, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'social'

  // State for Basic Info
  const [basicInfo, setBasicInfo] = useState({
    quote: '', work: '', school: '', location: ''
  });

  // State for Social Links
  const [socialLinks, setSocialLinks] = useState({
    facebook: '', twitter: '', instagram: '', youtube: ''
  });

  // Fill data on mount
  useEffect(() => {
      if (currentUser) {
          setBasicInfo({
              quote: currentUser.quote || '',
              work: currentUser.work || '',
              school: currentUser.school || '',
              location: currentUser.location || '',
          });
          setSocialLinks({
              facebook: currentUser.social?.facebook || '',
              twitter: currentUser.social?.twitter || '',
              instagram: currentUser.social?.instagram || '',
              youtube: currentUser.social?.youtube || '',
          });
      }
  }, [currentUser]);

  // Handle Input Changes
  const handleBasicChange = (e) => {
      const { name, value } = e.target;
      setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
      const { name, value } = e.target;
      setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Function
  const handleUpdate = async () => {
      try {
          if (activeTab === 'basic') {
              await dispatch(updateBasicInfo(basicInfo)).unwrap();
          } else {
              await dispatch(updateSocialLinks(socialLinks)).unwrap();
          }
          onClose();
      } catch (error) {
        console.log(error)
        // Error handled in reducer toast
      }
  };

  return (
    <div className="modal-overlay">
        <div className="modal-content edit-profile-modal">

            {/* Header */}
            <div className="modal-header">
                <h3>Edit Profile</h3>
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
            </div>

            {/* Tabs */}
            <div className="modal-tabs">
                <button
                    className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                >
                    Basic Info
                </button>
                <button
                    className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
                    onClick={() => setActiveTab('social')}
                >
                    Social Links
                </button>
            </div>

            {/* Body */}
            <div className="modal-body">

                {/* --- Tab 1: Basic Info --- */}
                {activeTab === 'basic' && (
                    <div className="form-container">
                        <div className="form-group">
                            <label>Bio / Quote</label>
                            <textarea
                                name="quote"
                                value={basicInfo.quote}
                                onChange={handleBasicChange}
                                placeholder="Add a short bio..."
                                maxLength="100"
                            />
                            <small>{basicInfo.quote.length}/100</small>
                        </div>
                        <div className="form-group">
                            <label>Work</label>
                            <input
                                type="text"
                                name="work"
                                value={basicInfo.work}
                                onChange={handleBasicChange}
                                placeholder="Where do you work?"
                            />
                        </div>
                        <div className="form-group">
                            <label>School</label>
                            <input
                                type="text"
                                name="school"
                                value={basicInfo.school}
                                onChange={handleBasicChange}
                                placeholder="Where did you study?"
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={basicInfo.location}
                                onChange={handleBasicChange}
                                placeholder="Where do you live?"
                            />
                        </div>
                    </div>
                )}

                {/* --- Tab 2: Social Links --- */}
                {activeTab === 'social' && (
                    <div className="form-container">
                        <div className="form-group social-input">
                            <FaFacebook className="icon fb" />
                            <input
                                type="text"
                                name="facebook"
                                value={socialLinks.facebook}
                                onChange={handleSocialChange}
                                placeholder="Facebook Profile URL"
                            />
                        </div>
                        <div className="form-group social-input">
                            <FaTwitter className="icon tw" />
                            <input
                                type="text"
                                name="twitter"
                                value={socialLinks.twitter}
                                onChange={handleSocialChange}
                                placeholder="Twitter Profile URL"
                            />
                        </div>
                        <div className="form-group social-input">
                            <FaInstagram className="icon insta" />
                            <input
                                type="text"
                                name="instagram"
                                value={socialLinks.instagram}
                                onChange={handleSocialChange}
                                placeholder="Instagram Profile URL"
                            />
                        </div>
                        <div className="form-group social-input">
                            <FaYoutube className="icon yt" />
                            <input
                                type="text"
                                name="youtube"
                                value={socialLinks.youtube}
                                onChange={handleSocialChange}
                                placeholder="YouTube Channel URL"
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="modal-footer">
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
                <button
                    className="save-btn"
                    onClick={handleUpdate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : `Save ${activeTab === 'basic' ? 'Info' : 'Links'}`}
                </button>
            </div>

        </div>
    </div>
  );
};

export default EditProfileModal;
