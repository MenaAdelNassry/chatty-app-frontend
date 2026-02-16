import { FaUserPlus, FaUserTimes, FaBan, FaUnlock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { followUser, unfollowUser, blockUser, unblockUser } from '@redux/api/follower';
import { useEffect, useState } from 'react';
import '@components/user-card/UserCard.scss';

const CardActions = ({ user, type, decrementFollowersHandler, incrementFollowersHandler }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [hasActionCompleted, setHasActionCompleted] = useState(false);

  // --- Handlers ---

  const handleFollow = async () => {
    setLoading(true);
    await dispatch(followUser(user._id));
    setLoading(false);
    incrementFollowersHandler();
    setHasActionCompleted(true);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    await dispatch(unfollowUser(user._id));
    setLoading(false);
    decrementFollowersHandler();
    setHasActionCompleted(true);
  };

  const handleBlock = async () => {
    setLoading(true);
    await dispatch(blockUser(user._id));
    setLoading(false);
    setHasActionCompleted(true);
  };

  const handleUnblock = async () => {
    setLoading(true);
    await dispatch(unblockUser(user._id));
    setLoading(false);
    setHasActionCompleted(true);
  };

  useEffect(() => {
    setHasActionCompleted(false);
  }, [type, user._id]);

  // --- Render Logic ---

  if (hasActionCompleted) {
    // Creative state: When you perform an action, the card doesn't suddenly disappear.
    return <div className="action-completed">Done!</div>;
  }

  // 1. Suggestions Tab (Follow Button)
  if (type === 'suggestions') {
    return (
      <button className="follow-btn" onClick={handleFollow} disabled={loading}>
        {loading ? 'Wait...' : <><FaUserPlus /> Follow</>}
      </button>
    );
  }

  // 2. Following Tab (Unfollow Button)
  if (type === 'following') {
    return (
      <button className="unfollow-btn warning" onClick={handleUnfollow} disabled={loading}>
        {loading ? 'Wait...' : <><FaUserTimes /> Unfollow</>}
      </button>
    );
  }

  // 3. Followers Tab (Block Button + Follow Back if not following)
  if (type === 'follower') {
    return (
      <div className="double-actions">
        {!user.isFollowing && (
          <button onClick={handleFollow} disabled={loading}>
            {loading ? 'Wait...' : <><FaUserPlus /> Follow Back</>}
          </button>
        )}
        <button className="block-btn danger" onClick={handleBlock} disabled={loading}>
          {loading ? 'Wait...' : <><FaBan /> Block</>}
        </button>
      </div>
    );
  }

  // 4. Blocked Tab (Unblock Button)
  if (type === 'blocked') {
    return (
      <button className="unblock-btn" onClick={handleUnblock} disabled={loading}>
        {loading ? 'Wait...' : <><FaUnlock /> Unblock</>}
      </button>
    );
  }

  return null;
};

export default CardActions;
