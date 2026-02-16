import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '@pages/social/people/PeopleSkeleton.scss';

const PeopleSkeleton = () => {
  const skeletonCards = Array(12).fill(0);

  return (
    <div className="people-skeleton-container">
      {skeletonCards.map((_, index) => (
        <div className="skeleton-card" key={index}>
          {/* 1. Cover */}
          <div className="skeleton-cover">
            <Skeleton height="100%" width="100%" />
          </div>

          {/* 2. Avatar & Info */}
          <div className="skeleton-avatar-wrapper">
            <div className="skeleton-avatar">
              <Skeleton circle height={80} width={80} />
            </div>
            <div className="skeleton-name">
              <Skeleton width={120} height={20} />
            </div>
            <div className="skeleton-job">
              <Skeleton width={80} height={15} />
            </div>
          </div>

          {/* 3. Stats */}
          <div className="skeleton-stats">
            <Skeleton width={60} height={40} />
            <Skeleton width={60} height={40} />
            <Skeleton width={60} height={40} />
          </div>

          {/* 4. Button */}
          <div className="skeleton-btn">
            <Skeleton height={35} width="100%" borderRadius={4} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeopleSkeleton;
