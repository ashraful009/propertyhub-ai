import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      await axiosInstance.post('/auth/register', payload);
      
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        bg-accent-500/10 rounded-full blur-[100px]" />
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

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-3">Full name</label>
              <input
                id="name" name="name" type="text"
                autoComplete="name" required minLength={2}
                value={form.name} onChange={handleChange}
                className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300" 
                placeholder="Md Ashraful Islam"
              />
            </div>

            
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-3">Email address</label>
              <input
                id="email" name="email" type="email"
                autoComplete="email" required
                value={form.email} onChange={handleChange}
                className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300" 
                placeholder="you@gmail.com"
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-3">Password</label>
                <div className="relative">
                  <input
                    id="password" name="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password" required minLength={6}
                    value={form.password} onChange={handleChange}
                    className="form-input text-lg px-6 py-5 pr-14 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300" 
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                    aria-label="Toggle password"
                  >
                    {showPass ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7 a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-3 flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${form.password.length > i * 2 + 2 ? (i < 2 ? 'bg-red-500' : i < 3 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-blue-50'}`} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-700 mb-3">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword" name="confirmPassword"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password" required minLength={6}
                    value={form.confirmPassword} onChange={handleChange}
                    className="form-input text-lg px-6 py-5 rounded-2xl w-full border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300" 
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 py-5 text-xl rounded-2xl">
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6 mr-3 inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-lg mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
