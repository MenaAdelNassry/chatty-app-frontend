import { useState, useEffect } from 'react';
import { userService } from '@services/api/user/user.service';
import UserCard from '@components/user-card/UserCard';
import { ToastUtils } from '@services/utils/toast-utils.service';
import '@pages/social/people/People.scss';
import PeopleSkeleton from '@pages/social/people/PeopleSkeleton';

const People = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserSuggestions();
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastUtils.error(error?.response?.data?.message || 'Error fetching users');
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="people-container">
      <div className="people-header">
        <h2>People</h2>
      </div>

      {loading ? (
        <PeopleSkeleton />
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <UserCard key={user._id} user={user} type='suggestions' />
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="empty-msg">No suggestions available right now.</div>
      )}
    </div>
  );
};

export default People;
