import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.services';
import { useState } from 'react';
import '@components/user-card/UserCard.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import CardActions from './CardActions';

// type = 'suggestions' | 'following' | 'follower' | 'blocked'
const UserCard = ({ user, type='suggestions' }) => {
  const [userFollowersCount, setUserFollowersCount] = useState(user.followersCount);

  const formatCount = (count) => {
    return Utils.shortenLargeNumbers(count);
  };

  const incrementFollowersHandler = () => {
    setUserFollowersCount(prev => prev + 1);
  }

  const decrementFollowersHandler = () => {
    setUserFollowersCount(prev => prev - 1);
  }

  const renderMutualFollowers = () => {
    const { mutualFollowers, mutualFollowersCount } = user;
    if (!mutualFollowers || mutualFollowers.length === 0) return null;

    const firstUserName = mutualFollowers[0].username;
    const remainingCount = mutualFollowersCount - 1;

    return (
      <div className="mutual-followers">
        <div className="mutual-avatars">
          {mutualFollowers.map((mutualUser, index) => (
            <div
                key={mutualUser._id || index}
                className="mutual-avatar-item"
                style={{ zIndex: mutualFollowers.length - index }}
            >
              <Avatar
                name={mutualUser.username}
                bgColor={mutualUser.avatarColor}
                textColor="#ffffff"
                size={20}
                avatarSrc={mutualUser.profilePicture}
              />
            </div>
          ))}
        </div>
        <span className="mutual-text">
          Followed by <strong>{firstUserName}</strong>
          {remainingCount > 0 && ` and ${Utils.shortenLargeNumbers(remainingCount)} others`}
        </span>
      </div>
    );
  };

  return (
    <div className={`user-card ${type === 'blocked' ? 'blocked-card' : ''}`}>
      {/* 1. Cover Image Area */}
      <div className="card-cover"
          style={{
              backgroundImage: user.bgImageId
                ? `url(${Utils.appResourceUrl(user.bgImageVersion, user.bgImageId, 'image')})`
                : 'none',
              backgroundColor: user.bgImageId ? 'transparent' : user.avatarColor,
              filter: type === 'blocked' ? 'grayscale(100%)' : 'none'
          }}
      ></div>

      {/* 2. Avatar & Name */}
      <div className="card-avatar-wrapper">
        <Link className="profile-link" to={`${ROUTES.SOCIAL}/profile/${user.username}/${user._id}`}>
          <Avatar
              name={user.username}
              bgColor={user.avatarColor}
              textColor="#ffffff"
              size={80}
              avatarSrc={user.profilePicture}
          />
          <h3 className="card-username">{user.username}</h3>
        </Link>
        <span className="card-job">{user.work || '---'}</span>
        {type !== 'blocked' && renderMutualFollowers()}
      </div>

      {/* 3. Stats Section */}
      <div className="card-stats">
          <div className="stat-box">
            <span className="stat-value">{formatCount(user.postsCount)}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{formatCount(userFollowersCount)}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{formatCount(user.followingCount)}</span>
            <span className="stat-label">Following</span>
          </div>
      </div>

      {/* 4. Action Buttons (Separated) */}
      <div className="card-actions">
        <CardActions
          user={user}
          type={type}
          incrementFollowersHandler={incrementFollowersHandler}
          decrementFollowersHandler={decrementFollowersHandler}
        />
      </div>
    </div>
  );
};

export default UserCard;
