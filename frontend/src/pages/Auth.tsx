import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  // এই State-টি নির্ধারণ করবে এখন লগইন ফর্ম দেখাবে নাকি রেজিস্ট্রেশন ফর্ম
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form সেটআপ
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(isLogin ? "Login Data:" : "Register Data:", data);
    // পরবর্তীতে এখানে API কল করবো
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div
        className={`relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex transition-all duration-700 ease-in-out ${
          isLogin ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* ================= FORM PANEL (White Side) ================= */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-white transition-all duration-500 relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Sign in to PropertyHub" : "Create an Account"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin
                ? "Welcome back! Please enter your details."
                : "Join us today to manage your properties."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field (Only for Registration) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register("name", { required: !isLogin })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153B28] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153B28] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153B28] focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password (Only for Login) */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-[#153B28] focus:ring-[#153B28]"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="font-semibold text-[#153B28] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#153B28] hover:bg-[#112d1e] text-white font-semibold py-3 rounded-lg transition-colors mt-4"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition-colors text-gray-700 font-medium">
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

        {/* ================= INFO PANEL (Dark Green Side) ================= */}
        <div className="w-1/2 bg-[#153B28] text-white p-12 flex flex-col justify-center items-center text-center relative z-20">
          {isLogin ? (
            <>
              <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-8 text-gray-300 text-lg">
                Enter your personal details and start your journey with us.
                Don't have an account yet?
              </p>
              <button
                onClick={() => setIsLogin(false)}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#153B28] transition-colors duration-300"
              >
                Sign Up Now
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-8 text-gray-300 text-lg">
                To keep connected with us please login with your personal info.
                Already have an account?
              </p>
              <button
                onClick={() => setIsLogin(true)}
                className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#153B28] transition-colors duration-300"
              >
                Sign In
              </button>
            </>
          )}

          {/* Decorative Elements for the dark side */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
