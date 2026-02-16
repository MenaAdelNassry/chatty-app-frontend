import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.services';
import '@pages/social/profile/followers/FollowerCard.scss';
import { useNavigate } from 'react-router-dom';

const FollowerCard = ({ person }) => {
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate(`/app/social/profile/${person?.username}/${person?._id}`);
  };

  return (
    <div className="follower-card">
      <div className="card-avatar" onClick={navigateToProfile}>
        <Avatar
            name={person?.username}
            bgColor={person?.avatarColor}
            textColor="#ffffff"
            size={80}
            avatarSrc={person?.profilePicture}
        />
      </div>

      <div className="card-info">
        <h4 onClick={navigateToProfile}>{person?.username}</h4>
        <span className="count">{Utils.shortenLargeNumbers(person?.followersCount || 0)} Followers</span>
      </div>

      <div className="card-actions">
          <button className="view-profile-btn" onClick={navigateToProfile}>
              View Profile
          </button>
      </div>
    </div>
  );
};

export default FollowerCard;
