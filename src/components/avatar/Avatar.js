import PropTypes from 'prop-types';
import '@components/avatar/Avatar.scss';

const Avatar = ({ avatarSrc, name, bgColor = '#f33e58', textColor = '#ffffff', size = 50, round = true, onClick }) => {
  const textSizeRatio = 1.7;
  const fontSize = Math.floor(size / textSizeRatio);
  const firstNameCharacter = name?.charAt(0);

  const inlineStyles = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: round ? '50%' : '8px',
    backgroundColor: !avatarSrc ? bgColor : 'transparent',
    color: textColor,
    fontSize: `${fontSize}px`,
    cursor: onClick ? 'pointer' : ''
  };

  return (
    <div
      className="avatar-container"
      style={inlineStyles}
      data-testid="avatar-container"
      onClick={onClick}
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={`${name} Avatar`}
          className="avatar-content"
          data-testid="avatar-image"
        />
      ) : (
        <div data-testid="avatar-name" className="avatar-text">
          {firstNameCharacter}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  avatarSrc: PropTypes.string,
  name: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.number,
  round: PropTypes.bool,
  onClick: PropTypes.func
};

export default Avatar;
