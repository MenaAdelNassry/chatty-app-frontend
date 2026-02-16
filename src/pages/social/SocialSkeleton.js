import '@pages/social/SocialSkeleton.scss';
import HeaderSkeleton from '@components/header/HeaderSkeleton';
import SidebarSkeleton from '@components/sidebar/SidebarSkeleton';
import { FaSpinner } from 'react-icons/fa';

const SocialSkeleton = () => {
  return (
    <div className="social-skeleton-container">
      {/* 1. Header */}
      <div className="skeleton-header-wrapper">
        <HeaderSkeleton />
      </div>

      {/* 2. Dashboard Body */}
      <div className="skeleton-dashboard">
        {/* Sidebar: علي الشمال */}
        <div className="skeleton-sidebar-wrapper">
          <SidebarSkeleton />
        </div>

        {/* Content */}
        <div className="skeleton-content">
          <FaSpinner className="skeleton-spinner" />
        </div>
      </div>
    </div>
  );
};

export default SocialSkeleton;
