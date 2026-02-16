import { useEffect, useState, useCallback } from 'react';
import { followerService } from '@services/api/followers/follower.service';
import FollowerCard from '@pages/social/profile/followers/FollowerCard';
import '@pages/social/profile/followers/Followers.scss';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ToastUtils } from '@services/utils/toast-utils.service';

const Followers = ({ userId, type }) => {
  // type = 'followers' | 'following'

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // --- 1. Fetch Function ---
  const getUserData = useCallback(async () => {
    try {
        setLoading(true);
        let response;

        if (type === 'following') {
          response = await followerService.getUserFollowing(userId, page);
        } else {
          response = await followerService.getUserFollowers(userId, page);
        }

        const dataList = type === 'following' ? response.data.following : response.data.followers;
        const count = type === 'following' ? response.data.totalFollowing : response.data.totalFollowers;

        setTotalCount(count);

        if (page === 1) {
          setPeople(dataList);
        } else {
          setPeople((prev) => [...prev, ...dataList]); // Append Data
        }

        setLoading(false);
    } catch (error) {
        setLoading(false);
        ToastUtils.error(error.response.data.message);
    }
  }, [userId, type, page]);

  // --- 2. Initial Fetch & Page Change ---
  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // --- 3. Reset on Type Change ---
  useEffect(() => {
      setPage(1);
      setPeople([]);
      setTotalCount(0);
  }, [type, userId]);


  // --- 4. Infinite Scroll Logic ---
  const bottomLineRef = useInfiniteScroll(() => {
    if (!loading && people.length < totalCount) {
      setPage((prev) => prev + 1);
    }
  });

  return (
    <div className="followers-wrapper">
        <h3 className="tab-title">
            {type === 'following' ? 'Following' : 'Followers'}
            <span className="count">({totalCount})</span>
        </h3>

        <div className="followers-grid">
            {people.length > 0 && people.map((person) => (
              <FollowerCard key={person._id} person={person} />
            ))}
        </div>

        {/* Loading / Scroll Trigger */}
        <div ref={bottomLineRef} style={{marginBottom: '50px', height: '20px', textAlign: 'center'}}>
          {loading && <span>Loading...</span>}
        </div>

        {/* Empty State */}
        {!loading && people.length === 0 && (
            <div className="empty-state">
                {type === 'following' ? 'Not following anyone' : 'No followers yet'}
            </div>
        )}
    </div>
  );
};

export default Followers;
