import React from 'react';
import { Outlet } from 'react-router-dom';
import '@pages/social/Social.scss';
import Header from '@components/header/Header';
import Sidebar from '@components/sidebar/Sidebar';
import AddPostModal from '@components/posts/post-modal/AddPostModal';
import ReactionsModal from '@components/posts/reaction-modal/ReactionsModal';
import ImageModal from '@components/posts/image-modal/ImageModal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '@redux/reducers/user/user.reducer';

const Social = () => {
  const dispatch = useDispatch();

  const { isSidebarActive } = useSelector((state) => state.user);
  console.log(`sidebar social: ${isSidebarActive}`)

  return (
    <div className="social-app-container">
      <Header />
      <AddPostModal />
      <ReactionsModal />
      <ImageModal />

      <div className="dashboard">

        <Sidebar isSidebarActive={isSidebarActive} />
        {isSidebarActive && <div className="sidebar-overlay" onClick={() => dispatch(toggleSidebar(false))}></div>}

        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Social;
