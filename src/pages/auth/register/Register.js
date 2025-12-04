import './Register.scss';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';

const Register = () => {
  return (
    <div className="auth-inner">
      <div className="alerts alert-error" role="alert">
        Error message
      </div>

      <form className="auth-form">
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value=""
            labelText="Username"
            placeholder="Enter Username"
            handleChange={() => {}}
          />
          <Input
            id="email"
            name="email"
            type="email"
            value=""
            labelText="Email"
            placeholder="Enter Email"
            handleChange={() => {}}
          />
          <Input
            id="password"
            name="password"
            type="text"
            value=""
            labelText="Password"
            placeholder="Enter Password"
            handleChange={() => {}}
          />
        </div>

        <Button label="SIGNUP" className='auth-button button' disabled={true} />
      </form>
    </div>
  );
};

export default Register;
