import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { GiphyUtils } from '@services/api/giphy/giphy.service';
import '@components/giphy/Giphy.scss';
import useDebounce from '@hooks/useDebounce';

const Giphy = ({ handleGiphyClick }) => {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchGifs = async () => {
      setLoading(true);
      const data = debouncedSearchTerm
        ? await GiphyUtils.searchGifs(debouncedSearchTerm)
        : await GiphyUtils.getTrendingGifs();

      setGifs(data);
      setLoading(false);
    };

    fetchGifs();
  }, [debouncedSearchTerm]);

  return (
    <div className="giphy-container">
      <div className="giphy-search-input">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Giphy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Logic Update Here */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : gifs.length > 0 ? (
        <div className="giphy-list">
          {gifs.map((gif) => (
            <div
              className="giphy-item"
              key={gif.id}
              onClick={() => handleGiphyClick(gif.images.original.url)}
            >
              <img src={gif.images.preview_gif.url} alt="gif" />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-gifs-found">
          <FaSearch className="icon" />
          <h3>No GIFs found</h3>
          <p>Try searching for something else.</p>
        </div>
      )}
    </div>
  );
};

export default Giphy;
