import { useDispatch } from 'react-redux';
import { showNotification } from '../store/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch();

  const notify = (message, type = 'info') => {
    dispatch(showNotification({ message, type }));
  };

  return {
    success: (message) => notify(message, 'success'),
    error: (message) => notify(message, 'error'),
    warning: (message) => notify(message, 'warning'),
    info: (message) => notify(message, 'info'),
  };
}; 