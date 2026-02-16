import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import SuggestionsSkeleton from '@components/suggestions/SuggestionsSkeleton';
import '@components/suggestions/Suggestions.scss';
import { followUser } from '@redux/api/follower';
import { removeFromSuggestions } from '@redux/reducers/suggestions/suggestions.reducer';

const Suggestions = () => {
  const dispatch = useDispatch();

  const { users, isLoading } = useSelector((state) => state.suggestions);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(users);
  }, [users]);

  if (isLoading) {
    return <SuggestionsSkeleton />;
  }

  const handleFollow = (user) => {
    // 1. Optimistic UI
    dispatch(removeFromSuggestions(user));

    // 2. API Call
    dispatch(followUser(user._id));
  };

  return (
    <div className="suggestions-list-container">
      <div className="suggestions-header">
        <span className="title">Suggestions</span>
      </div>
      <hr />
      <div className="suggestions-list">
        {suggestions.map((user) => (
          <div className="suggestions-item" key={user._id}>
            <div className="avatar-wrapper">
              <Avatar
                name={user.username}
                bgColor={user.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user.profilePicture}
              />
              <div className="title-text">
                <span className="name">{user.username}</span>
              </div>
            </div>

            <div className="add-icon">
              <Button
                label="Follow"
                className="button follow"
                disabled={false}
                handleClick={() => handleFollow(user)}
              />
            </div>
          </div>
        ))}
        {suggestions.length === 0 && (
          <div className="no-suggestions">No suggestions available</div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
