import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleLogo } from "../../assets";
import { InputField } from "./components";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, loginWithGoogle, getUserProfile} from '../../redux/slice/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ username: '', password: '' });
  const [errorText, setErrorText] = useState("");
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
    setErrorText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isBtnEnable) {
       handleLogin();
    }
  };

  const handleLogin = () => {
    if (!isBtnEnable) return;
    
    dispatch(loginUser(form))
    .unwrap()
    .then((res) => {
      localStorage.setItem('token', res.token);
      console.log("Login successful, token:", res.token);
      dispatch(getUserProfile(res.token)); // lấy profile
      navigate('/home');
    })
  
      .catch((err) => {
        console.error('Login Error: ', err);
        setErrorText('Invalid username or password. Please try again');
      });
  };
  
  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const res = await fetch(
  //         "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  //         {
  //           headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
  //         }
  //       );
  //       const userInfo = await res.json();
  //       console.log("Google User Info:", userInfo);

  //       dispatch(loginWithGoogle({ email: userInfo.email, googleId: userInfo.id }))
  //         .unwrap()
  //         .then(() => {
  //           navigate("/home");
  //         })
  //         .catch((err) => {
  //           console.error("Google login failed: ", err);
  //           setErrorText("Google login failed");
  //         });
  //     } catch (error) {
  //       console.error("Error fetching Google user info:", error);
  //       setErrorText("Google login failed");
  //     }
  //   },
  //   onError: () => setErrorText("Google login failed"),
  // });
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        console.log("Google User Info:", userInfo);
  
        // Gọi API đăng nhập với Google
        dispatch(loginWithGoogle({ email: userInfo.email, googleId: userInfo.id }))
          .unwrap()
          .then((response) => {
            const { token, isVerified, user } = response;
            
            // Thêm logging để debug
            console.log("API Response:", response);
            console.log("isVerified value:", isVerified);
            console.log("User data:", user);
            
            // Lưu token trước bất kể trường hợp nào
            localStorage.setItem('token', token);
            
            // Chỉ kiểm tra isVerified để quyết định điều hướng
            if (isVerified) {
              // Nếu đã xác thực đủ thông tin, chuyển hướng sang /home
              console.log("User verified, navigating to /home");
              navigate("/home");
            } else {
              // Nếu chưa xác thực đủ thông tin, chuyển hướng sang /userinfo
              console.log("User not verified, navigating to /userinfo");
              navigate("/userinfo", { state: { email: userInfo.email, googleId: userInfo.id } });
            }
          })
          .catch((err) => {
            console.error("Google login failed: ", err);
            setErrorText("Google login failed");
          });
      } catch (error) {
        console.error("Error fetching Google user info:", error);
        setErrorText("Google login failed");
      }
    },
    onError: () => setErrorText("Google login failed"),
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
        <p className="h-4 text-red-500 text-sm text-center mt-2">{errorText}</p>

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

        <button className="mt-4 text-sm text-blue-400 hover:text-gray-200 cursor-pointer inline-block float-right"
        onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>

        <button
          onClick={handleLogin}
          className={`w-full mt-6 py-3 text-white font-bold rounded-full 
          ${isBtnEnable ? "bg-green-400 hover:bg-green-700 cursor-pointer" : "bg-gray-600 cursor-not-allowed"}`}
          disabled={!isBtnEnable}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <button 
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 cursor-pointer">
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
