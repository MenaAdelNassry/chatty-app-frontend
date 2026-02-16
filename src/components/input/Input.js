import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Input.scss';

const Input = forwardRef((props, ref) => {
  const {
    id,
    name,
    type = 'text',
    value,
    labelText,
    placeholder,
    className,
    handleChange,
    style,
    errorMessage
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const hasError = errorMessage ? 'input-error' : '';

  return (
    <div className="form-row">
      {labelText && (
        <label htmlFor={id} className="form-label">
          {labelText}
        </label>
      )}

      <div className="input-wrapper">
        <input
          ref={ref}
          id={id}
          name={name}
          type={inputType}
          value={type !== 'checkbox' ? value : undefined}
          checked={type === 'checkbox' ? value : undefined}
          
          placeholder={placeholder}
          className={`form-input ${hasError} ${className || ''}`}
          onChange={handleChange}
          autoComplete="off"
          style={style}
        />

        {type === 'password' && (
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>

      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.string,
  labelText: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  style: PropTypes.object,
  errorMessage: PropTypes.string
};

export default Input;
