import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsWithVideos } from '@redux/api/post';
import { clearVideos } from '@redux/reducers/post/post.reducer';
import Masonry from 'react-masonry-css';
import MediaModel from '@components/gallery/MediaModal';
import { FaHeart, FaComment, FaPlayCircle } from 'react-icons/fa'; // 🔥 Play Icon
import { Utils } from '@services/utils/utils.services';
import '@pages/social/photos/Photos.scss';
import { PostUtils } from '@services/utils/post.utils';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

const Videos = () => {
  const dispatch = useDispatch();
  const { videosPosts, isLoading, totalVideosCount } = useSelector((state) => state.post);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(1);

  // Pagination Logic
  const bottomLineRef = useInfiniteScroll(() => {
    if (!isLoading && videosPosts.length < totalVideosCount) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  useEffect(() => { dispatch(getPostsWithVideos(page)); }, [dispatch, page]);

  useEffect(() => { return () => { dispatch(clearVideos()); }; }, [dispatch]);

  // Modal Logic
  const getSelectedPostIndex = () => videosPosts.findIndex(p => p._id === selectedPostId);
  const currentPost = videosPosts.find(p => p._id === selectedPostId);

  const handleNext = () => {
    const idx = getSelectedPostIndex();
    if (idx < videosPosts.length - 1) setSelectedPostId(videosPosts[idx + 1]._id);
  };
  const handlePrev = () => {
    const idx = getSelectedPostIndex();
    if (idx > 0) setSelectedPostId(videosPosts[idx - 1]._id);
  };

  const breakpointColumnsObj = { default: 3, 1100: 3, 700: 2, 500: 1 };

  return (
    <div className="photos-container">
      <div className="gallery-header">Videos</div>

      {videosPosts.length > 0 ? (
          <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
            {videosPosts.map((post) => {
                // 🔥 Thumbnail Logic
                const videoUrl = Utils.appResourceUrl(post.videoVersion, post.videoId, 'video');
                const thumbUrl = Utils.generateThumbnailUrl(videoUrl);
                return (
                    <div key={post._id} className="gallery-item" onClick={() => setSelectedPostId(post._id)}>
                        <img src={thumbUrl} alt="" loading="lazy" />

                        {/* 🔥 Play Icon Overlay */}
                        <div className="play-icon">
                          <FaPlayCircle />
                        </div>

                        <div className="hover-overlay">
                          <span className="stat"><FaHeart /> {PostUtils.sumAllReactions(post?.reactions)}</span>
                          <span className="stat"><FaComment /> {post.commentsCount}</span>
                        </div>
                    </div>
                );
            })}
          </Masonry>
      ) : (
        isLoading && <div className="loading" style={{textAlign: 'center', padding: '20px'}}>Loading videos...</div>
      )}

      {videosPosts.length > 0 && <div ref={bottomLineRef} style={{ height: '50px', marginBottom: '20px' }}></div>}

      {currentPost && (
          <MediaModel
            file={currentPost}
            onClose={() => setSelectedPostId(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            showArrows={videosPosts.length > 1}
          />
      )}
    </div>
  );
};
export default Videos;
