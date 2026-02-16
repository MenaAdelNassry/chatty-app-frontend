import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SidebarSkeleton.scss';

const SidebarSkeleton = () => {
  return (
    // 🔥 التعديل هنا: غمقنا اللون الأساسي عشان يبان
    // baseColor: لون العضم وهو ثابت
    // highlightColor: لون اللمعة وهي بتتحرك
    <SkeletonTheme baseColor="#dbdbdb" highlightColor="#f5f5f5">
      <div className="sidebar-skeleton">
        <ul className="skeleton-list">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <li
              key={item}
              className={`skeleton-item ${index === 0 ? 'active-clone' : ''}`}
            >
              <div className="skeleton-icon">
                <Skeleton circle height={20} width={20} />
              </div>
              <div className="skeleton-text">
                <Skeleton height={15} width={`${index === 0 ? '60%' : '80%'}`} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SkeletonTheme>
  );
};

export default SidebarSkeleton;
