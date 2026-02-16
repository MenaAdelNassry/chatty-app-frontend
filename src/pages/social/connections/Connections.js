import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFollowing, getUserFollowers, getBlockedUsers } from '@redux/api/follower';
import UserCard from '@components/user-card/UserCard';
import PeopleSkeleton from '@pages/social/people/PeopleSkeleton';
import { FaSearch } from 'react-icons/fa';
import '@pages/social/connections/Connections.scss';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

const Connections = () => {
  const dispatch = useDispatch();
  const { following, followers, blocked, totalFollowing, totalFollowers, totalBlocked, isLoading } = useSelector((state) => state.followers);
  const { profile } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('following');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const listFromRedux = activeTab === 'following' ? following : activeTab === 'followers' ? followers : blocked;
  const totalCount = activeTab === 'following' ? totalFollowing : activeTab === 'followers' ? totalFollowers : totalBlocked;

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    if(!profile?._id) return;

    if (activeTab === 'following') dispatch(getUserFollowing({userId: profile._id, page}));
    if (activeTab === 'followers') dispatch(getUserFollowers({userId: profile._id, page}));
    if (activeTab === 'blocked') dispatch(getBlockedUsers({page}));
  }, [page, activeTab, dispatch, profile._id]);

  useEffect(() => {
    if (listFromRedux && listFromRedux.length > 0) {
        setUsers((prev) => {
            if (page === 1) return listFromRedux;

            const allUsers = [...prev, ...listFromRedux];
            const uniqueUsers = [...new Map(allUsers.map((item) => [item._id, item])).values()];

            return uniqueUsers;
        });
    }
  }, [listFromRedux, page]);

  const loadMore = useCallback(() => {
      if (users.length < totalCount && !isLoading) {
        setPage((prev) => prev + 1);
      }
  }, [users.length, totalCount, isLoading]);

  const bottomLineRef = useInfiniteScroll(loadMore);

  const usersToDisplay = searchQuery
      ? users.filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
      : users;

  return (
    <div className="connections-container">
      {/* --- Header & Tabs --- */}
      <div className="connections-header">
        <h2 className="title">Connections</h2>

        <div className="tabs-wrapper">
            <button
                className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                onClick={() => setActiveTab('following')}
            >
                Following <span className="count">{totalFollowing || profile.followingCount}</span>
            </button>
            <button
                className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
                onClick={() => setActiveTab('followers')}
            >
                Followers <span className="count">{totalFollowers || profile.followersCount}</span>
            </button>
            <button
                className={`tab ${activeTab === 'blocked' ? 'active' : ''}`}
                onClick={() => setActiveTab('blocked')}
            >
                Blocked <span className="count">{totalBlocked || "?"}</span>
            </button>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* --- Content Grid --- */}
      {isLoading && usersToDisplay.length === 0 ? (
          <PeopleSkeleton />
      ) : (
          <div className="users-grid">
              {usersToDisplay.length > 0 ? (
                  usersToDisplay.map((user) => (
                      <UserCard
                          key={user._id}
                          user={user}
                          type={activeTab === 'following' ? 'following' : activeTab === 'followers' ? 'follower' : 'blocked'}
                      />
                  ))
              ) : (
                  <div className="empty-state">No users found here.</div>
              )}
          </div>
      )}

      {!searchQuery && (
          <div ref={bottomLineRef} style={{ height: '20px', marginBottom: '20px' }} />
      )}
    </div>
  );
};

export default Connections;
