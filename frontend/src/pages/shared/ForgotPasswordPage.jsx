import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    try {
      const { data } = await axiosInstance.post('/auth/forgot-password', { email });
      setSuccessMsg(data.message || 'OTP sent successfully!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await axiosInstance.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setSuccessMsg(data.message || 'Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        bg-primary-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-3xl relative z-10 animate-slideUp">
        
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700
                            flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-3xl font-blackops">F</span>
            </div>
            <span className="text-4xl font-black text-gray-900 font-blackops tracking-wider">
              Flat<span className="text-gradient">Sell</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Reset Password</h1>
          <p className="text-gray-500 text-lg mt-2">
            {step === 1 ? "Enter your email to receive an OTP." : "Check your email for the OTP and set a new password."}
          </p>
        </div>

        <div className="glass-card p-10 sm:p-14 shadow-xl border-[4px] border-white/50 rounded-[2rem]">
          {error && (
            <div className="mb-6 px-6 py-4 bg-red-500/10 border border-red-500/30
                            rounded-xl text-red-600 text-lg animate-fadeIn text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 px-6 py-4 bg-green-500/10 border border-green-500/30
                            rounded-xl text-green-700 text-lg animate-fadeIn text-center">
              {successMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-8">
              <div>
                <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-3">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                  placeholder="you@gmail.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 text-xl rounded-2xl mt-4"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-xl font-medium text-gray-700 mb-3">Verification Code (OTP)</label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-center tracking-[1em]"
                  placeholder="------"
                  maxLength={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-xl font-medium text-gray-700 mb-3">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-700 mb-3">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 text-xl rounded-2xl mt-4"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-lg">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
