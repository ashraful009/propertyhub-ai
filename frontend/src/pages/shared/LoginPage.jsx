import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate      = useNavigate();
  const { login }     = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/auth/login', form);
      login(data.data.user);       
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      
      if (err.response?.data?.data?.needsVerification) {
        navigate(`/verify-otp?email=${form.email}`);
        return;
      }
      setError(msg);
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
        </div>

        
        <div className="glass-card p-10 sm:p-14 shadow-xl border-[4px] border-white/50 rounded-[2rem]">
          
          {error && (
            <div className="mb-6 px-6 py-4 bg-red-500/10 border border-red-500/30
                            rounded-xl text-red-600 text-lg animate-fadeIn text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-3">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                placeholder="you@gmail.com"
              />
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="password" className="block text-xl font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium text-lg transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="form-input text-lg px-6 py-5 pr-14 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors p-2"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                           a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878
                           9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3
                           3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543
                           7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
                           9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl rounded-2xl mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          
          <p className="text-center text-gray-500 text-lg mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700
                                            font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
