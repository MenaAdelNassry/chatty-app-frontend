import PropTypes from 'prop-types';
import './Button.scss'; 

const Button = ({ label, className, disabled, handleClick, type = 'button', style }) => {
  return (
    <button
      type={type}
      className={`auth-button ${className || ''}`}
      onClick={handleClick}
      disabled={disabled}
      style={style}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.any.isRequired,
  handleClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default Button;
