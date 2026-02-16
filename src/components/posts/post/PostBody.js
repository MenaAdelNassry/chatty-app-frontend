import { openModal } from '@redux/reducers/modal/modal.reducer';
import { Utils } from '@services/utils/utils.services';
import { useDispatch } from 'react-redux';

const PostBody = ({ post }) => {
  const dispatch = useDispatch();

  const openImage = (imageUrl) => {
    dispatch(openModal({ type: 'image', data: imageUrl }));
  };

  if (post?.bgColor && post?.bgColor !== '#ffffff') {
    return (
      <div className="post-bg-text" style={{ backgroundColor: post?.bgColor }}>
        {post?.post}
      </div>
    );
  }

  return (
    <>
      {post?.post && <div className="post-text">{post?.post}</div>}

      {post?.imgVersion && post?.imgId && (
        <img
          className="post-image"
          src={Utils.appResourceUrl(post.imgVersion, post.imgId, 'image')}
          alt=""
          onClick={() => openImage(Utils.appResourceUrl(post.imgVersion, post.imgId, 'image'))}
          style={{ cursor: 'pointer' }}
        />
      )}

      {post?.videoId && (
        <video className="post-video" controls src={Utils.appResourceUrl(post.videoVersion, post.videoId, 'video')} />
      )}

      {post?.gifUrl && (
        <img
          className="post-image"
          src={post.gifUrl}
          alt="gif"
          onClick={() => openImage(post.gifUrl)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </>
  );
};
export default PostBody;
