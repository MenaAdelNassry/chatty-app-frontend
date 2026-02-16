import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '@pages/social/notifications/NotificationSkeleton.scss';

const NotificationSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#EFF1F6" highlightColor="#FFFFFF">
      <div className="notification-skeleton-container">
        {/* 1. Page Title Skeleton */}
        <div className="skeleton-header">
          <Skeleton height={30} width={150} />
        </div>

        {/* 2. Notifications List */}
        <div className="skeleton-list">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="skeleton-item" key={item}>
              {/* A. Avatar (Left) */}
              <div className="item-left">
                <Skeleton circle height={40} width={40} />
              </div>

              {/* B. Content (Middle) */}
              <div className="item-content">
                {/* Top line (Username + Action) */}
                <Skeleton height={15} width="60%" style={{ marginBottom: '8px' }} />
                {/* Bottom line (Time) */}
                <Skeleton height={12} width="20%" />
              </div>

              {/* C. Post Preview (Right - Optional) */}
              <div className="item-right">
                <Skeleton height={40} width={40} borderRadius={5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NotificationSkeleton;
