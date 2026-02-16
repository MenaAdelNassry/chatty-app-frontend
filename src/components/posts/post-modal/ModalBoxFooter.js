import { FaImage, FaVideo, FaSmile } from 'react-icons/fa';
import { feelingsList } from '@root/constants';

const ModalBoxFooter = ({
    state,
    handleFileChange,
    toggleGiphy,
    setFeeling,
    handleSubmit,
    isLoading,
    fileInputRef,
    feelingsRef,
    isFeelingsOpen,
    setIsFeelingsOpen,
    type
}) => {

    return (
        <>
            <div className="add-to-your-post">
                <span>Add to your post</span>
                <div className="icons-wrapper">
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" />

                    <div className="icon-item image" onClick={() => fileInputRef.current.click()}> <FaImage className="icon" /> </div>
                    <div className="icon-item video" onClick={() => fileInputRef.current.click()}> <FaVideo className="icon" /> </div>

                    <div className="icon-item feeling" onClick={() => setIsFeelingsOpen(!isFeelingsOpen)} ref={feelingsRef}>
                        <FaSmile className="icon" />
                        {isFeelingsOpen && (
                            <div className="feelings-dropdown">
                                {feelingsList.map((feeling) => (
                                    <div key={feeling.index} className="feeling-item" onClick={() => { setFeeling(feeling); setIsFeelingsOpen(false); }}>
                                        <img src={feeling.image} alt={feeling.name} /> <span>{feeling.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="icon-item gif" onClick={() => toggleGiphy(true)}> <span className="gif-icon">GIF</span> </div>
                </div>
            </div>

            <div className="modal-footer">
                <button className="post-submit-btn"
                    disabled={(!state.post.trim() && !state.image && !state.video && !state.gifUrl) || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Submitting...' : type === 'edit' ? 'Update' : 'Post'}
                </button>
            </div>
        </>
    );
};
export default ModalBoxFooter;
