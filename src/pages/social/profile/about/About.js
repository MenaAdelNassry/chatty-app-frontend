import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaQuoteLeft, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import '@pages/social/profile/about/About.scss';

const About = ({ user }) => {
  return (
    <div className="about-tab-container">

        {/* Section 1: Overview */}
        <div className="about-card">
            <h3>Overview</h3>
            <div className="info-list">
                {user?.quote && (
                    <div className="info-item">
                        <FaQuoteLeft className="icon" />
                        <span>{user.quote}</span>
                    </div>
                )}
                {user?.work && (
                    <div className="info-item">
                        <FaBriefcase className="icon" />
                        <span>Works at <strong>{user.work}</strong></span>
                    </div>
                )}
                {user?.school && (
                    <div className="info-item">
                        <FaGraduationCap className="icon" />
                        <span>Studied at <strong>{user.school}</strong></span>
                    </div>
                )}
                {user?.location && (
                    <div className="info-item">
                        <FaMapMarkerAlt className="icon" />
                        <span>Lives in <strong>{user.location}</strong></span>
                    </div>
                )}
                {/* Email (If you have it in schema) */}
                <div className="info-item">
                    <FaEnvelope className="icon" />
                    <span>{user?.email}</span>
                </div>
            </div>
        </div>

        {/* Section 2: Contact & Social */}
        <div className="about-card">
            <h3>Contact and Basic Info</h3>
            <div className="social-links">
                {user?.social?.facebook && (
                    <a href={user.social.facebook} target="_blank" rel="noreferrer" className="social-item fb">
                        <FaFacebook /> <span>Facebook</span>
                    </a>
                )}
                {user?.social?.twitter && (
                    <a href={user.social.twitter} target="_blank" rel="noreferrer" className="social-item tw">
                        <FaTwitter /> <span>Twitter</span>
                    </a>
                )}
                {user?.social?.instagram && (
                    <a href={user.social.instagram} target="_blank" rel="noreferrer" className="social-item insta">
                        <FaInstagram /> <span>Instagram</span>
                    </a>
                )}
                {user?.social?.youtube && (
                    <a href={user.social.youtube} target="_blank" rel="noreferrer" className="social-item yt">
                        <FaYoutube /> <span>YouTube</span>
                    </a>
                )}
                {/* لو مفيش لينكات */}
                {!user?.social?.facebook && !user?.social?.twitter && !user?.social?.instagram && !user?.social?.youtube && (
                    <p className="no-data">No social links added.</p>
                )}
            </div>
        </div>

    </div>
  );
};

export default About;
