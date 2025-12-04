import backgroundImage from '../../../assets/images/background.jpg';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ROUTES } from '../../../constants';
import './ResetPassword.scss'

const ResetPassword = () => {
  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="container-wrapper-auth">
        <div className="tabs reset-password-tabs">
            <div className="tabs-auth">
                <ul className="tab-group">
                    <li className="tab">
                        <div className="login reset-password">Reset Password</div>
                    </li>
                </ul>
                <div className="tab-item">
                    <div className="auth-inner">
                        <div className="alerts alert-error" role="alert">
                            Error message
                        </div>
                        <form className="reset-password-form">
                            <div className="form-input-container">
                                <Input id="password" name="password" type="password" value={""}
                                    labelText="New Password" placeholder="New Password" handleChange={()=> {}}
                                />
                                <Input id="cpassword" name="cpassword" type="password" value={""}
                                    labelText="Confirm Password" placeholder="Confirm Password" handleChange={()=> {}}
                                />
                            </div>
                            <Button label="RESET PASSWORD" className="auth-button button" disabled={false} />

                            <Link to={`${ROUTES.AUTH}`}>
                            <span className="login">
                                <FaArrowLeft className="arrow-left" /> Back to Login
                            </span>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default ResetPassword
