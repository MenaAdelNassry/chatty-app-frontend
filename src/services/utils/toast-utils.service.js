import { toast } from 'react-toastify';

export class ToastUtils {
  static success(message) {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }

  static error(message) {
    toast.error(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  static info(message) {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  }
}
