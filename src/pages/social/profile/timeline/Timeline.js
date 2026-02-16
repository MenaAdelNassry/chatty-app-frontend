import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPostsByUserId } from '@redux/api/post';
import { getUserFollowing, getUserFollowers } from '@redux/api/follower';
import PostForm from '@components/posts/post-form/PostForm';
import Post from '@components/posts/post/Post';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FaImage, FaRegNewspaper, FaVideo } from 'react-icons/fa';
import '@pages/social/profile/timeline/Timeline.scss';
import ProfileSideBar from '@pages/social/profile/profile-sidebar/ProfileSideBar';
import { clearProfilePosts } from '@redux/reducers/post/post.reducer';

const Timeline = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  // 1. Selectors
  const { profile, selectedUserProfile } = useSelector((state) => state.user);
  const { profilePosts, totalProfilePostsCount, isLoading } = useSelector((state) => state.post);

  // 2. Local State
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'photo' | 'video'

  const isCurrentUser = userId === profile?._id;
  const userProfile = isCurrentUser ? profile : selectedUserProfile;

  // 3. Initial Fetch
  useEffect(() => {
    dispatch(getPostsByUserId({ userId, page }));

    dispatch(getUserFollowing({userId}));
    dispatch(getUserFollowers({userId}));

  }, [dispatch, userId, page]);

  useEffect(() => {
    return () => {
      dispatch(clearProfilePosts());
      setPage(1);
    };
  }, [dispatch, userId]);


  // 4. Infinite Scroll Logic
  const bottomLineRef = useInfiniteScroll(() => {
    if (!isLoading && profilePosts.length < totalProfilePostsCount) {
      setPage((prev) => prev + 1);
    }
  });


  // 5. Frontend Filtering Logic 🔥
  const getFilteredPosts = () => {
      if (filterType === 'photo') {
          return profilePosts.filter(post => post.imgId || post.gifUrl);
      }
      if (filterType === 'video') {
          return profilePosts.filter(post => post.videoId);
      }
      return profilePosts; // 'all'
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="timeline-wrapper">

        {/* --- Left Column: Sidebar (Sticky) --- */}
        <ProfileSideBar userId={userId} user={userProfile} />

        {/* --- Right Column: Feed --- */}
        <div className="timeline-feed">

            {/* 1. Post Form (Only for owner) */}
            {isCurrentUser && <PostForm />}

            {/* 2. Filters Bar */}
            <div className="timeline-filters">
                <button
                    className={filterType === 'all' ? 'active' : ''}
                    onClick={() => setFilterType('all')}
                >
                    <FaRegNewspaper /> All
                </button>
                <button
                    className={filterType === 'photo' ? 'active' : ''}
                    onClick={() => setFilterType('photo')}
                >
                    <FaImage /> Photos
                </button>
                <button
                    className={filterType === 'video' ? 'active' : ''}
                    onClick={() => setFilterType('video')}
                >
                    <FaVideo /> Videos
                </button>
            </div>

            {/* 3. Posts List */}
            <div className="posts-container">
                {filteredPosts.map((post) => (
                    <Post key={post._id} post={post} showIcons={false} />
                ))}
            </div>

            {/* Loading / Infinite Scroll Trigger */}
            <div ref={bottomLineRef} style={{marginBottom: '50px', height: '20px'}}>
                {isLoading && <div className="loading-dots">Loading...</div>}
            </div>

            {/* Empty State */}
            {!isLoading && filteredPosts.length === 0 && (
                <div className="empty-feed">
                    No posts to show
                </div>
            )}
        </div>

    </div>
  );
};

export default Timeline;
