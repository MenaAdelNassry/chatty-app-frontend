import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@root/constants';
import '@components/posts/reaction-modal/ReactionsModal.scss';
import { PostUtils } from '@services/utils/post.utils';

const ReactionsModal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector((state) => state.modal); // data ==> (postId)

  const [reactions, setReactions] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [tabs, setTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Reactions on Open
  useEffect(() => {
    if (isOpen && type === 'reactions' && data) {
      const fetchReactions = async () => {
        setIsLoading(true);
        try {
          const response = await postService.getPostReactions(data);
          const allReactions = response.data.reactions;

          setReactions(allReactions);
          setTabs(PostUtils.getFormattedReactionTabs(allReactions));
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
      };
      fetchReactions();
    }
  }, [isOpen, type, data]);

  // 2. Filter Logic
  const filteredReactions =
    activeTab === 'All'
      ? reactions
      : reactions.filter((r) => r.type === activeTab);

  const handleClose = () => {
    dispatch(closeModal());
    setReactions([]);
    setActiveTab('All');
  };

  if (!isOpen || type !== 'reactions') return null;

  return (
    <div className="modal-wrapper">
      <div className="modal-box-reactions">
        {/* Header */}
        <div className="modal-header">
          <h2>Reactions</h2>
          <button onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.type}
              className={`tab-item ${activeTab === tab.type ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.type)}
            >
              {tab.type !== 'All' && <img src={tab.image} alt="" />}
              <span>{tab.type === 'All' ? 'All' : ''}</span>
              <span className="count">({tab.count})</span>
            </div>
          ))}
        </div>

        {/* List Body */}
        <div className="modal-body">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <ul className="user-list">
              {filteredReactions.map((reaction) => (
                <li key={reaction._id} className="user-list-item">
                  <div className="user-info">
                    <Avatar
                      name={reaction.username}
                      avatarSrc={reaction.profilePicture}
                      bgColor={reaction.avatarColor}
                      size={40}
                    />
                    <span className="username">{reaction.username}</span>
                  </div>
                  <div className="reaction-type-icon">
                    <img src={reactionsMap[reaction.type]} alt="" />
                  </div>
                </li>
              ))}
              {filteredReactions.length === 0 && (
                <p className="empty-msg">No reactions yet.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionsModal;
