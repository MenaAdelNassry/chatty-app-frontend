import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '@components/otp-input/OTPInput.scss';

const OTPInput = ({ value, onChange, numInputs = 6, autoFocus = true }) => {
  const inputRefs = useRef([]);

  // 1. Setup Refs Array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  // 2. Auto Focus on first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // --- Handlers ---

  const handleChange = (idx, e) => {
    const val = e.target.value;
    if (isNaN(val)) return; // allow numbers only

    const newOTP = [...value];
    newOTP[idx] = val.substring(val.length - 1);
    onChange(newOTP);

    if (val && idx < numInputs - 1 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (!value[idx] && idx > 0 && inputRefs.current[idx - 1]) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (isNaN(pastedData)) return;

    const newOTP = [...value];
    const chars = pastedData.split('').slice(0, numInputs);

    chars.forEach((char, index) => {
      newOTP[index] = char;
    });

    onChange(newOTP);

    const focusIndex = Math.min(chars.length, numInputs - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className="otp-input-container">
      {Array.from({ length: numInputs }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined} // Paste is working only in the first box (UX standard).
          className={`otp-field ${value[index] ? 'filled' : ''}`}
        />
      ))}
    </div>
  );
};

OTPInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  numInputs: PropTypes.number,
  autoFocus: PropTypes.bool,
};

export default OTPInput;
