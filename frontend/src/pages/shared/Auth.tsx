import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../config/axios';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: data.email,
          password: data.password,
        });
        
        setAuth(response.data.data.user, response.data.data.accessToken);
        toast.success('Successfully logged in!');
        navigate('/'); 
      } else {
        await api.post('/auth/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'CUSTOMER'
        });
        
        reset();
        setIsLogin(true);
        navigate('/login');
        toast.success('Registration successful! Please sign in.');
      }
    } catch (error) {
      console.error('Auth Error:', error);
      let message = 'Authentication failed. Please try again.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex transition-all duration-700 ease-in-out ${
          isLogin ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="w-1/2 p-12 flex flex-col justify-center bg-white transition-all duration-500 relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? "Sign in to PropertyHub" : "Create an Account"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin
                ? "Welcome back! Please enter your details."
                : "Join us today to manage your properties."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register("name", { required: !isLogin })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4 shadow-sm shadow-indigo-600/30"
            > 
              {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">OR</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 border border-slate-300 rounded-lg py-2.5 hover:bg-slate-50 transition-colors text-slate-700 font-medium">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-indigo-600 text-white p-12 flex flex-col justify-center items-center text-center relative z-20">
          {isLogin ? (
            <>
              <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-8 text-indigo-100 text-lg">
                Enter your personal details and start your journey with us.
                Don't have an account yet?
              </p>
              <button
                onClick={() => {
                  setIsLogin(false);
                  navigate('/register');
                }}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
              >
                Sign Up Now
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-8 text-indigo-100 text-lg">
                To keep connected with us please login with your personal info.
                Already have an account?
              </p>
              <button
                onClick={() => {
                  setIsLogin(true);
                  navigate('/login');
                }}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
              >
                Sign In
              </button>
            </>
          )}

          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
