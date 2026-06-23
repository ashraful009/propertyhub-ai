import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

interface GoogleAuthProps {
  onSuccessCallback?: () => void;
}

export default function GoogleAuth({ onSuccessCallback }: GoogleAuthProps) {
  const navigate = useNavigate();
  const loginAuth = useAuthStore((state) => state.login);

  const handleSuccess = async (credentialResponse: Record<string, unknown>) => {
    try {
      if (!credentialResponse.credential) {
        toast.error('Google login failed: No credential received');
        return;
      }


      const response = await apiClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });


      const user = response.data.data.user;
      loginAuth(user, response.data.data.accessToken);
      
      toast.success('Successfully authenticated with Google!');

      if (onSuccessCallback) {
        onSuccessCallback();
      }


      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');

    } catch (error: unknown) {
      console.error('Google Auth Error:', error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to authenticate with Google');
    }
  };

  const handleError = () => {
    toast.error('Google authentication was unsuccessful. Please try again.');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
