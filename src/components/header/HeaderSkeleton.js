import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HeaderSkeleton = () => {
  return (
    // 1. Theme Wrapper
    <SkeletonTheme baseColor="#EFF1F6" highlightColor="#e0e3eb">
      <div className="header-nav-wrapper" data-testid="header-skeleton">
        <div className="header-navbar">

          {/* Logo Section */}
          <div className="header-image">
            {/* Logo Circle */}
            <Skeleton circle height={50} width={50} containerClassName="img-fluid" />
            {/* App Name */}
            <Skeleton
              width={80}
              height={20}
              style={{ marginLeft: '5px' }}
              containerClassName="app-name-skeleton"
            />
          </div>

          {/* Navigation Icons */}
          <ul className="header-nav" style={{ gap: "15px" }}>
            <li className="header-nav-item active-item">
              <Skeleton circle height={20} width={20} />
            </li>
            <li className="header-nav-item active-item">
              <Skeleton circle height={20} width={20} />
            </li>

            {/* Profile Section */}
            <li className="header-nav-item">
              <span className="header-list-name profile-image">
                <Skeleton circle height={40} width={40} containerClassName="avatar-skeleton" />
              </span>
              <span className="header-list-name profile-name">
                <Skeleton width={80} height={20} style={{ marginLeft: '5px' }} />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default HeaderSkeleton;
