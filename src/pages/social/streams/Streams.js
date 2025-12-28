import { useRef, useState } from 'react'
import "@pages/social/streams/Streams.scss"
import Suggestions from '@components/suggestions/Suggestions';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import useEffectOnce from '@hooks/useEffectOnce';
import { useDispatch } from 'react-redux';
import { getUserSuggestions } from '@redux/api/suggestions';

const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  console.log(loading)

  useEffectOnce(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getUserSuggestions()),
          new Promise((resolve) => setTimeout(resolve, 3000))
        ]);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  });

  console.log(loading)
  if(loading) {
    return <StreamsSkeleton />
  }

  return (
    <div className='streams' data-testid="streams">
      <div className='streams-content'>
        <div className='streams-post' ref={bodyRef} style={{ backgroundColor: "white" }}>
          <div>Post Form</div>
          <div>Post Items</div>
          <div ref={bottomLineRef} style={{ marginBottom: "50px", height: "50px" }}></div>
        </div>
        <div className='streams-suggestions'>
          <Suggestions />
        </div>
      </div>
    </div>
  )
}

export default Streams
