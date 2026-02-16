import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imageService } from '@services/api/image/image.service';
import { Utils } from '@services/utils/utils.services';
import '@pages/social/profile/profile-sidebar/ProfileSideBar.scss';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaQuoteLeft } from 'react-icons/fa';

const ProfileSideBar = ({ userId, user }) => {
  const { following } = useSelector((state) => state.followers);
  const [photos, setPhotos] = useState([]);

  // 🔥 Fetch User Photos for the Widget
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await imageService.getImages(userId, 1, 'all');
        setPhotos(response.data.images.slice(0, 9));
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) fetchPhotos();
  }, [userId]);

  return (
    <div className="profile-sidebar">

      {/* 1. About / Intro Widget */}
      <div className="sidebar-box">
        <h3>Intro</h3>
        <div className="bio-content">

            {/* Quote */}
            {user?.quote && (
                <div className="bio-item quote">
                    <FaQuoteLeft className="icon" />
                    <span>{user.quote}</span>
                </div>
            )}

            {/* Work */}
            {user?.work && (
                <div className="bio-item">
                    <FaBriefcase className="icon" />
                    <span>Works at <strong>{user.work}</strong></span>
                </div>
            )}

            {/* School */}
            {user?.school && (
                <div className="bio-item">
                    <FaGraduationCap className="icon" />
                    <span>Studied at <strong>{user.school}</strong></span>
                </div>
            )}

            {/* Location */}
            {user?.location && (
                <div className="bio-item">
                    <FaMapMarkerAlt className="icon" />
                    <span>Lives in <strong>{user.location}</strong></span>
                </div>
            )}

            {!user?.quote && !user?.work && !user?.school && !user?.location && (
                <p className="no-data">No info available to show.</p>
            )}
        </div>
      </div>

      {/* 2. Photos Widget 🖼️ */}
      <div className="sidebar-box">
        <h3>
            Photos
            <Link to={`?tab=photos`} className="see-all">See All</Link>
        </h3>

        {photos.length > 0 ? (
            <div className="photos-grid">
                {photos.map((img) => (
                    <div key={img._id} className="photo-item">
                        <img
                            src={Utils.appResourceUrl(img.version, img.publicId, 'image')}
                            alt=""
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        ) : (
            <div className="empty-widget">No photos yet</div>
        )}
      </div>

      {/* 3. Friends Widget 👥 */}
      <div className="sidebar-box">
        <h3>
            Following
            <span className="count">{following.length}</span>
            <Link to={`?tab=following`} className="see-all">See All</Link>
        </h3>
        <div className="friends-grid">
            {following.slice(0, 9).map((user) => (
                <div key={user._id} className="friend-item">
                    <img src={user.profilePicture} alt={user.username} />
                    <span>{user.username}</span>
                </div>
            ))}
            {following.length === 0 && <div className="empty-widget">Not following anyone</div>}
        </div>
      </div>

    </div>
  );
};

export default ProfileSideBar;
