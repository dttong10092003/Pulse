import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleLogo } from "../../assets";
import { InputField } from "./components";
import { useGoogleLogin } from "@react-oauth/google";

const users = [
  { username: "admin", password: "admin123" },
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  { username: "test", password: "test123" },
  { username: "tong", password: "tong123" },
];

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [error, setError] = useState("");
  const [isBtnEnable, setIsBtnEnable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setIsBtnEnable(form.username.trim() !== "" && form.password.trim() !== "");
  }, [form]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 299 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const drawStars = () => {
      // Tạo gradient dọc từ trên xuống dưới
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e293b");

      // Fill background với gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vẽ các ngôi sao
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };


    drawStars();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isBtnEnable) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!isBtnEnable) return;

    const userExists = users.find(
      (user) => user.username === form.username && user.password === form.password
    );

    if (!userExists) {
      setError("Invalid username or password. Please try again!");
      return;
    }

    navigate("/home");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await res.json();
        console.log("Google User Info:", userInfo);

        navigate("/home");
      } catch (error) {
        console.error("Error fetching Google user info:", error);
        setError("Google login failed");
      }
    },
    onError: () => setError("Google login failed"),
  });

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Hiệu ứng nền sao */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Khối đăng nhập */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-green-400">PULSE</h1>
        <p className="text-center text-xl mt-2">Log in to your account</p>
        <p className="text-center text-sm mt-2 text-gray-400">Welcome back! Please enter your details</p>
        <p className="h-4 text-red-500 text-sm text-center mt-2">{error}</p>

        <InputField
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <InputField
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          showPassword={showPassword}
          onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
        />

        <p className="mt-4 text-sm text-blue-400 hover:text-gray-200 cursor-pointer inline-block float-right">
          Forgot Password?
        </p>

        <button
          onClick={handleLogin}
          className={`w-full mt-6 py-3 text-white font-bold rounded-full 
          ${isBtnEnable ? "bg-green-400 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
          disabled={!isBtnEnable}
        >
          Log in
        </button>

        <button 
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700">
          <img src={GoogleLogo} alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Don’t have an account?{" "}
          <span className="text-green-400 cursor-pointer" onClick={() => navigate("/register")}>
            Sign up, it’s free!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
