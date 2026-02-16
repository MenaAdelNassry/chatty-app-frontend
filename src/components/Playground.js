import Post from './posts/post/Post';

const Playground = () => {
  const post = {
    _id: '697240edc9312b7537db8433',
    userId: '69715191ecfc8fe47d27a877',
    username: 'Saraj',
    email: 'sara@test.com',
    avatarColor: '#ff0000',
    profilePicture:
      'https://res.cloudinary.com/dpjqyf1hm/image/upload/v1769034130/69715191ecfc8fe47d27a877',
    post: 'I love Math',
    bgColor: '#de3b3bff',
    imgVersion: '',
    imgId: '',
    videoVersion: '',
    videoId: '',
    feelings: '',
    gifUrl: '',
    privacy: 'public',
    commentsCount: 0,
    reactions: {
      like: 0,
      love: 2,
      happy: 3,
      sad: 1,
      wow: 3,
      angry: 0
    },
    createdAt: new Date(),
  };
  return <Post post={post} />;
};

export default Playground;
