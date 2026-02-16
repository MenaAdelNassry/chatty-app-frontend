import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerSchema } from '@services/utils/validators/auth.schema';
import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.services';
import useLocalStorage from '@hooks/useLocalStorage';
import { addUser } from '@redux/reducers/user/user.reducer';
import { ROUTES } from '@root/constants';

export const inputKeys = {
  username: '',
  email: '',
  password: '',
};

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({}); // frontend validation errors

  // State
  const [values, setValues] = useState(inputKeys);

  const [setStoredEmail] = useLocalStorage('email', 'set');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // We hide the error as soon as the user types a letter
    setErrors({ ...errors, [name]: '' });
  };

  const registerUser = async (event) => {
    event.preventDefault();
    setApiError('');

    // 1. Validation Logic with Joi
    const { error } = registerSchema.validate(values, { abortEarly: false });

    if (error) {
      // ex: { username: "msg", email: "msg" }
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return newErrors;
    }

    // 2. Backend Logic
    setIsLoading(true);
    try {
      const avatarColor = Utils.getRandomAvatarColor();
      const avatarImage = Utils.generateAvatarImage(
        values.username[0].toUpperCase(),
        avatarColor
      );

      const result = await authService.signUp({
        username: values.username,
        email: values.email,
        password: values.password,
        avatarColor,
        avatarImage,
      });

      // Success Logic
      setStoredEmail(values.email);

      // Redux Update
      dispatch(
        addUser({ token: result.data.token, profile: result.data.user })
      );
      
      navigate(ROUTES.VERIFY_EMAIL);
    } catch (error) {
      // Backend Error
      setApiError(error?.response?.data.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    errors,
    apiError,
    isLoading,
    handleChange,
    registerUser,
  };
};

export default useRegister;
