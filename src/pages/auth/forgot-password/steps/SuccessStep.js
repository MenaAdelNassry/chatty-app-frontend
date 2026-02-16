import Button from '@components/button/Button';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@root/constants';

const SuccessStep = () => {
  const navigate = useNavigate();

  return (
    <div className="forgot-password-step success">
      <FaCheckCircle className="success-icon" size={50} color="#5cb85c" />
      <h3>Password Changed!</h3>
      <p className="sub-text">Your password has been reset successfully.</p>

      <Button
        label="BACK TO LOGIN"
        className="auth-btn"
        handleClick={() => navigate(ROUTES.AUTH)}
      />
    </div>
  );
};
export default SuccessStep;
