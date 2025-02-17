import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleLogo } from "../assets";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isBtnEnable, setIsBtnEnable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsBtnEnable(
      form.email.trim() !== "" &&
      form.username.trim() !== "" &&
      form.password.trim() !== "" &&
      form.confirmPassword.trim() !== ""
    );
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isBtnEnable) {
      handleSignUp();
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignUp = () => {
    if (!validateEmail(form.email)) {
      setError("Invalid email format!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    navigate("/home");
  };

  return (
    <div className="flex h-screen">
      {/* Phần bên trái */}
      <div className="w-1/2 hidden lg:flex items-center justify-center bg-black">
        <img src="https://media.istockphoto.com/id/1346575545/vi/anh/k%E1%BA%BFt-xu%E1%BA%A5t-3d-c%E1%BB%A7a-kh%C3%A1i-ni%E1%BB%87m-kinh-doanh-truy%E1%BB%81n-th%C3%B4ng-x%C3%A3-h%E1%BB%99i.jpg?b=1&s=612x612&w=0&k=20&c=AZWfoxCc47VUYSKjhSwebw_QBo_AaTreGB8li0IZkU8=" alt="Login" className="w-full h-full object-cover" />
      </div>

      {/* Phần bên phải */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-500 text-white">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl font-bold text-center text-blue-500">PULSE</h1>
          <p className="text-center text-xl mt-2">Create your account</p>
          <p className="text-center text-sm mt-2 text-gray-400">To use Pulse! Please inter your details</p>
          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
          
          <div className="relative mt-6">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="relative mt-4">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={form.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="relative mt-4">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 pl-10 pr-10 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>

          <div className="relative mt-4">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 pl-10 pr-10 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={form.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>

          <button
            onClick={handleSignUp}
            className={`w-full mt-6 py-3 text-white font-bold rounded-full ${
              isBtnEnable ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!isBtnEnable}
          >
            Sign Up
          </button>

          <button className="w-full flex items-center justify-center mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700">
            <img src={GoogleLogo} alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/")}>
              Sign in here!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
