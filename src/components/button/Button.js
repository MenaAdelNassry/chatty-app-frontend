import PropTypes from 'prop-types';

const Button = (props) => {
  const { handleClick, label, className, disabled, type } = props;

  return (
    <button
      type={`${type || 'button'}`}
      className={className}
      onClick={handleClick}
      disabled={disabled}
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
};

export default Button;
