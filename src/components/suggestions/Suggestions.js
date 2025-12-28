import '@components/suggestions/Suggestions.scss';
import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';

const Suggestions = () => {
  const { users, isLoading } = useSelector((state) => state.suggestions);
  const navigate = useNavigate();

  return (
    <div
      className="suggestions-list-container"
      data-testid="suggestions-container"
    >
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div
              data-testid="suggestions-item"
              className="suggestions-item"
              key={user._id}
            >
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                />
              </div>
            </div>
          ))}

          {!isLoading && users?.length === 0 && (
            <div className="no-suggestions">No suggestions available</div>
          )}
        </div>
        {users.length >= 8 && (
          <div className="view-more" onClick={() => navigate(ROUTES.SOCIAL_PEOPLE)}>View More</div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
