import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [isBtnEnable, setIsBtnEnable] = useState(false);
  const [loading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setIsBtnEnable(
      emailOrPhone.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  }, [emailOrPhone, password, confirmPassword]);

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
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e293b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    const { name, value } = e.target;
    if (name === "emailOrPhone") {
      setEmailOrPhone(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
    setErrorText("");
    setSuccessText("");
  };



  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div className="relative z-10 w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-green-400">PULSE</h1>
        <p className="text-center text-xl mt-2">Reset your password</p>
        <p className="text-center text-sm mt-2 text-gray-400">
          Enter your email address or phone number, and then create a new password
        </p>

        {errorText && <p className="h-4 text-red-500 text-sm text-center mt-2">{errorText}</p>}
        {successText && <p className="h-4 text-green-500 text-sm text-center mt-2">{successText}</p>}

        <div className="mt-6">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email address or phone number"
            value={emailOrPhone}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-700"
          />
        </div>

        <div className="mt-6">
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-700"
          />
        </div>

        <div className="mt-6">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-700"
          />
        </div>

        <button
          className={`w-full mt-6 py-3 text-white font-bold rounded-full cursor-pointer
          ${isBtnEnable ? "bg-green-400 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
          disabled={!isBtnEnable || loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Remember your password?{" "}
          <button className="text-green-400 hover:text-green-300 cursor-pointer" onClick={() => navigate("/")}>
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
