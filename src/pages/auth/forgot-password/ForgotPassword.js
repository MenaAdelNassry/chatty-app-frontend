import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ROUTES } from '@root/constants';
import useForgotPassword from '@hooks/auth/useForgotPassword';
import '@pages/auth/forgot-password/ForgotPassword.scss';
import EmailInput from './steps/EmailInput';
import NewPassword from './steps/NewPassword';
import SuccessStep from './steps/SuccessStep';
import OtpInput from './steps/OtpInput';
import AuthLayout from '../AuthLayout';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const { isLoading, sendOTP, verifyOTP, resetPassword } = useForgotPassword();

  // --- Handlers ---

  const handleEmailSubmit = async (inputEmail) => {
    const success = await sendOTP(inputEmail);
    if (success) {
      setEmail(inputEmail);
      setStep(2);
    }
  };

  const handleOtpSubmit = async (otp) => {
    const success = await verifyOTP(email, otp);
    if (success) {
      setStep(3);
    }
  };

  const handlePasswordSubmit = async (password, confirmPassword) => {
    const success = await resetPassword(password, confirmPassword);
    if (success) {
      setStep(4); // Success Step
    }
  };

  // --- Render Steps ---
  // We used Object Mapping instead of Switch Case to make the code cleaner
  const steps = {
    1: <EmailInput onSubmit={handleEmailSubmit} isLoading={isLoading} />,
    2: (
      <OtpInput
        email={email}
        onSubmit={handleOtpSubmit}
        onResend={sendOTP}
        isLoading={isLoading}
      />
    ),
    3: <NewPassword onSubmit={handlePasswordSubmit} isLoading={isLoading} />,
    4: <SuccessStep />,
  };

  return (
    <AuthLayout>
      <div className="forgot-password-card">
        {step < 4 && (
          <div className="back-arrow">
            {step === 1 ? (
              <Link to={ROUTES.AUTH}>
                <FaArrowLeft />
              </Link>
            ) : (
              <span onClick={() => setStep(step - 1)}>
                <FaArrowLeft />
              </span>
            )}
          </div>
        )}
        {steps[step]}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
