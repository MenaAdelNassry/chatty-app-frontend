import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPalette } from 'react-icons/fa';
import { setChatTheme } from '@redux/reducers/chat/chat.reducer';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import '@pages/social/chat/theme-picker/ThemePicker.scss';

const ThemePicker = () => {
  const dispatch = useDispatch();
  const selectedTheme = useSelector((state) => state.chat.selectedTheme);
  const pickerRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(pickerRef, false);

  const themes = [
    { name: 'classic', color: '#50b5ff', label: 'Classic' },
    { name: 'dark', color: '#0b141a', label: 'Dark Doodle' },
    { name: 'natural', color: '#e3dec9', label: 'Natural' },
    { name: 'sweet', color: '#ff85a1', label: 'Sweet Pink' }
  ];

  const handleThemeChange = (themeName) => {
    dispatch(setChatTheme(themeName));
    setIsActive(false);
  };

  return (
    <div className="theme-picker-wrapper" ref={pickerRef}>
      <button
        className={`theme-trigger ${isActive ? 'active' : ''}`}
        onClick={() => setIsActive(!isActive)}
        title="Change Chat Theme"
      >
        <FaPalette />
      </button>

      {isActive && (
        <div className="theme-dropdown">
          <h4>Select Theme</h4>
          <div className="themes-grid">
            {themes.map((t) => (
              <div
                key={t.name}
                className={`theme-option ${selectedTheme === t.name ? 'selected' : ''}`}
                onClick={() => handleThemeChange(t.name)}
              >
                <span className="color-circle" style={{ backgroundColor: t.color }}></span>
                <span className="theme-label">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
