import PropTypes from 'prop-types';
import './Input.scss';

const Input = (props) => {
  const {
    id,
    name,
    labelText,
    className,
    type,
    value,
    placeholder,
    handleChange,
  } = props;

  return (
      <div className="form-row">
        {labelText && (
          <label htmlFor={id} className="form-label">
            {labelText}
          </label>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={id !== 'checkbox' ? value : ''}
          checked={id === 'checkbox' ? value : ''}
          placeholder={placeholder}
          className={`form-input ${className}`} // if className exist will override
          onChange={handleChange}
          autoComplete="false"
        />
      </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  labelText: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func,
};

export default Input;
