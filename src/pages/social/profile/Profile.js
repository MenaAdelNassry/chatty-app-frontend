import React, { useEffect, useState } from 'react';
import ProfileHeader from '@pages/social/profile/profile-header/ProfileHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { getUserProfileByUserId } from '@redux/api/user';
import Timeline from '@pages/social/profile/timeline/Timeline';
import Photos from '@pages/social/photos/Photos';
import TabItem from '@pages/social/profile/TabItem';
import { FaImages, FaInfoCircle, FaStream, FaUserFriends } from 'react-icons/fa';
import '@pages/social/profile/Profile.scss'
import About from '@pages/social/profile/about/About';
import Followers from './followers/Followers';

const Profile = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { userId } = useParams();

  const currentTab = searchParams.get('tab') || 'timeline';

  const { profile, selectedUserProfile, isLoading } = useSelector((state) => state.user);
  const isCurrentUser = userId === profile?._id;
  const userToDisplay = isCurrentUser ? profile : selectedUserProfile;

  const [userNotFound, setUserNotFound] = useState(false);

  // Fetch User Data
  useEffect(() => {
    if (userId && !isCurrentUser) {
      dispatch(getUserProfileByUserId(userId))
        .unwrap()
        .then((res) => {
        })
        .catch((error) => {
          console.log("Error fetching user:", error);
          setUserNotFound(true);
        });
    }
  }, [dispatch, userId, isCurrentUser]);

  const renderTabContent = () => {
      switch (currentTab) {
        case 'timeline': return <Timeline />;
        case 'about': return <About user={userToDisplay} />;
        case 'photos': return <div className="tab-container"><Photos userId={userToDisplay._id} /></div>;
        // case 'videos': return <div className="tab-container"><Videos /></div>; //TODO do this in backend
        case 'followers': return <Followers userId={userId} type="followers" />;
        case 'following': return <Followers userId={userId} type="following" />;
        default: return <Timeline />;
      }
  };

  if (isLoading && !userToDisplay) return <div className="page-loading">Loading profile...</div>;

  if (userNotFound) {
      return (
          <div className="profile-not-found">
              <div className="icon-container">😢</div>
              <h2>User Not Found</h2>
              <p>The user you are looking for might have been removed, or the link is broken.</p>
              <button onClick={() => window.history.back()} className="back-btn">Go Back</button>
          </div>
      );
  }

  return (
    <div className="profile-page">

      {/* 1. The Header */}
      <ProfileHeader user={userToDisplay} isCurrentUser={isCurrentUser} />

      {/* 2. The Navigation Bar (Sticky Menu) */}
      <div className="profile-navbar">
          <div className="nav-items">
              <TabItem name="Timeline" icon={<FaStream />} active={currentTab === 'timeline'} type="timeline" />
              <TabItem name="About" icon={<FaInfoCircle />} active={currentTab === 'about'} type="about" />
              <TabItem name="Photos" icon={<FaImages />} active={currentTab === 'photos'} type="photos" />
              {/* <TabItem name="Videos" icon={<FaVideo />} active={currentTab === 'videos'} type="videos" /> */}
              <TabItem name="Followers" icon={<FaUserFriends />} active={currentTab === 'followers'} type="followers" />
              <TabItem name="Following" icon={<FaUserFriends />} active={currentTab === 'following'} type="following" />
          </div>
      </div>

      {/* 3. The Content Area */}
      <div className="profile-content">
          {renderTabContent()}
      </div>

    </div>
  );};

export default Profile;
