import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSchema } from '@services/utils/validators/auth.schema';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addUser } from '@redux/reducers/user/user.reducer';
import { ROUTES } from '@root/constants';

export const inputFields = {
  email: '',
  password: '',
  keepLoggedIn: false,
};

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState(inputFields);

  const [setStoredEmail] = useLocalStorage('email', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const loginUser = async (event) => {
    event.preventDefault();
    setApiError('');

    // Joi Validation
    const { error } = loginSchema.validate(values, { abortEarly: false });
    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return newErrors;
    }

    setIsLoading(true);
    try {
      const result = await authService.signIn(values);

      setStoredEmail(values.email);
      setLoggedIn(values.keepLoggedIn);

      dispatch(
        addUser({ token: result.data.token, profile: result.data.user })
      );

      navigate(ROUTES.SOCIAL_STREAMS);
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Error occurred');
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
    loginUser,
  };
};

export default useLogin;
