import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import '@pages/social/search/Search.scss';
import { searchUsers } from '@redux/api/user';
import { ToastUtils } from '@services/utils/toast-utils.service';
import FollowerCard from '../profile/followers/FollowerCard';

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);

  const performSearch = useCallback(async () => {
    if (!query) return;

    try {
      setLoading(true);
      const response = await dispatch(searchUsers({ query, page })).unwrap();

      const { users, total } = response;
      console.log(users)

      setTotalUsers(total);

      if (page === 1) {
          setUsers(users);
      } else {
          setUsers((prev) => [...prev, ...users]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastUtils.error(error.message);
    }
  }, [query, page, dispatch]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  useEffect(() => {
      setUsers([]);
      setPage(1);
      setTotalUsers(0);
  }, [query]);

  // Infinite Scroll Logic
  const bottomLineRef = useInfiniteScroll(() => {
      if (!loading && users.length < totalUsers) {
          setPage((prev) => prev + 1);
      }
  });

  return (
    <div className="search-page-container">
        <div className="search-content">
            {users.length > 0 && (
                <h3 className="search-result-title">
                    We found {totalUsers} results for "{query}"
                </h3>
            )}

            <div className="search-grid">
                {users.map((user) => (
                    <FollowerCard
                        key={user._id}
                        person={user}
                    />
                ))}
            </div>

            {loading && <div className="loading-msg">Searching...</div>}

            {!loading && users.length === 0 && query && (
                <div className="empty-search">
                    <div className="icon">🔍</div>
                    <h3>No results found for "{query}"</h3>
                    <p>Try searching for a different name or keyword.</p>
                </div>
            )}

             {/* Scroll Trigger */}
            <div ref={bottomLineRef} style={{ height: '20px', marginBottom: '50px' }}></div>
        </div>
    </div>
  );
};

export default Search;
