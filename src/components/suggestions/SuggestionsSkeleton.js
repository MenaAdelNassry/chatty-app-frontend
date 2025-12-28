import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '@components/suggestions/Suggestions.scss';

const SuggestionsSkeletons = () => {
  return (
    <div data-testid="suggestions" className="suggestions-list-container">
      <SkeletonTheme baseColor="#EFF1F6" highlightColor="#e0e3eb">

        <div className="suggestions-header">
          <div className="title-text">
            <Skeleton width={100} />
          </div>
        </div>

        <hr />

        <div className="suggestions-container">
          <div className="suggestions">
            {[1, 2, 3, 4, 5].map((data, index) => (
              <div className="suggestions-item" key={index}>
                <Skeleton circle height={40} width={40} containerClassName="avatar-skeleton" />

                <div className="title-text">
                  <Skeleton style={{ marginLeft: '10px' }} width={100} />
                </div>

                <div className="add-icon">
                  <Skeleton style={{ width: '55px', height: '32px' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="view-more" style={{ marginTop: '10px' }}>
             <Skeleton width={80} height={15} />
          </div>

        </div>
      </SkeletonTheme>
    </div>
  );
};

export default SuggestionsSkeletons;
