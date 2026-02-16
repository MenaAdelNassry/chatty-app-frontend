import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsWithImages } from '@redux/api/post';
import Masonry from 'react-masonry-css';
import ImageModal from '@components/gallery/MediaModal';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.services';
import '@pages/social/photos/Photos.scss';
import { PostUtils } from '@services/utils/post.utils';
import { clearGallery } from '@redux/reducers/post/post.reducer';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { imageService } from '@services/api/image/image.service';

const Photos = ({ userId }) => {
  const dispatch = useDispatch();

  // 1. Redux State (For Global Posts)
  const {
    galleryPosts,
    isLoading: isPostLoading,
    galleryPostsCount,
  } = useSelector((state) => state.post);

  // 2. Local State (For User Images)
  const [userImages, setUserImages] = useState([]);
  const [loadingUserImages, setLoadingUserImages] = useState(false);
  const [userImagesCount, setUserImagesCount] = useState(0);

  // Common State
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);

  // 🔥 Specify the type of data we will display
  const itemsToDisplay = userId ? userImages : galleryPosts;
  const loading = userId ? loadingUserImages : isPostLoading;
  const totalCount = userId ? userImagesCount : galleryPostsCount;

  // --- Pagination Logic ---
  const bottomLineRef = useInfiniteScroll(() => {
    if (!loading && itemsToDisplay.length < totalCount) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  // --- Fetch Logic ---
  useEffect(() => {
    if (userId) {
      // Case A: User Profile (Fetch Images Only)
      const fetchUserImages = async () => {
        try {
          setLoadingUserImages(true);
          const response = await imageService.getImages(userId, page, 'all');
          const { images, total } = response.data;

          setUserImagesCount(total || 0);
          if (page === 1) setUserImages(images);
          else setUserImages((prev) => [...prev, ...images]);

          setLoadingUserImages(false);
        } catch (error) {
          setLoadingUserImages(false);
        }
      };
      fetchUserImages();
    } else {
      // Case B: Global Gallery (Fetch Posts)
      dispatch(getPostsWithImages(page));
    }
  }, [dispatch, page, userId]);

  const rmeoveImageFromList = (imgId) => {
    setUserImages(prev => prev.filter(img => img._id !== imgId));
  }

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearGallery());
      setUserImages([]);
      setPage(1);
    };
  }, [dispatch, userId]);

  // --- Helper to normalize Data ---
  const getImageUrl = (item) => {
    if (item.imgId || item.gifUrl)
      return item.gifUrl
        ? item.gifUrl
        : Utils.appResourceUrl(item.imgVersion, item.imgId, 'image');
    return Utils.appResourceUrl(item.version, item.publicId, 'image');
  };

  // --- Modal Navigation ---
  const getSelectedIndex = () =>
    itemsToDisplay.findIndex((p) => p._id === selectedItem?._id);

  const handleNext = () => {
    const idx = getSelectedIndex();
    if (idx < itemsToDisplay.length - 1)
      setSelectedItem(itemsToDisplay[idx + 1]);
  };

  const handlePrev = () => {
    const idx = getSelectedIndex();
    if (idx > 0) setSelectedItem(itemsToDisplay[idx - 1]);
  };

  const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

  return (
    <div className="photos-container">
      {/* --- Gallery Grid --- */}
      {!userId && <div className="gallery-header">Photos</div>}

      {loading && itemsToDisplay.length === 0 ? (
        <div className="loading" style={{textAlign: 'center', padding: '20px'}}>Loading...</div>
      ) : (
          <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
            {itemsToDisplay.map((item) => {
                const imageUrl = getImageUrl(item);
                const isPost = !!item.imgId;

                return (
                    <div key={item._id} className="gallery-item" onClick={() => setSelectedItem(item)}>
                        <img src={imageUrl} alt="" loading="lazy" />

                        {isPost && (
                            <div className="hover-overlay">
                              <span className="stat"><FaHeart /> {PostUtils.sumAllReactions(item?.reactions)}</span>
                              <span className="stat"><FaComment /> {item.commentsCount}</span>
                            </div>
                        )}
                    </div>
                );
            })}
          </Masonry>
      )}

      {itemsToDisplay.length > 0 && <div ref={bottomLineRef} style={{ height: '50px' }}></div>}

      {/* --- Modal --- */}
      {selectedItem && (
          <ImageModal
            file={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            showArrows={itemsToDisplay.length > 1}
            isPost={!!selectedItem.reactions}
            rmeoveImageFromList={rmeoveImageFromList}
          />
      )}
    </div>
  );
};

export default Photos;
