import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleLogo } from "../../assets";
import { InputField } from "./components";
import { useGoogleLogin } from "@react-oauth/google";

import { auth } from "../../firebase/setup";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult  } from "firebase/auth";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ phone: "", username: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [isBtnEnable, setIsBtnEnable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        setIsBtnEnable(
            form.phone.trim() !== "" &&
            form.username.trim() !== "" &&
            form.password.trim() !== "" &&
            form.confirmPassword.trim() !== ""
        );
    }, [form]);

    useEffect(() => {
        if (isOtpModalOpen) {
            // Reset OTP về rỗng khi mở modal
            setOtp(["", "", "", "", "", ""]);
            
            // Focus vào ô đầu tiên sau khi reset
            setTimeout(() => {
                document.getElementById("otp-0")?.focus();
            }, 100); // Delay nhẹ để tránh lỗi re-render ngay lập tức
        }
    }, [isOtpModalOpen]);

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
            // Gradient background
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
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && isBtnEnable) {
            handleSignUp();
        }
    };

    // const validatePhone = (phone: string) => {
    //     return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone);
    // };

    const validatePhone = (phone: string) => {
        return /^(0[3-9])\d{8}$/.test(phone);
    };

    const handleSignUp = async () => {
        if (!validatePhone(form.phone)) {
            setError("Invalid phone number format!");
            return;
        }
        console.log(form.phone);
        if (form.password.length < 6) {
            setError("Invalid phone number format!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            setError("");
    
            // Kiểm tra và chỉ khởi tạo reCAPTCHA nếu chưa tồn tại
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "invisible",
                    callback: (response: string) => {
                        console.log("reCAPTCHA solved:", response);
                    }
                });
            }
    
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, "+84" + form.phone.slice(1), appVerifier);
            setConfirmationResult(result);
            setIsOtpModalOpen(true);

            console.log("OTP sent successfully");
            console.log("Confirmation result:", result);
            console.log("isOtpModalOpen set to true");
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError("Failed to send OTP. Try again!");
        }

        // setError("");
        // navigate("/home");
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const otpCode = otp.join("");
    
            if (!confirmationResult) {
                setError("OTP verification failed. Please request a new OTP.");
                return;
            }
    
            await confirmationResult.confirm(otpCode);
            setIsOtpModalOpen(false);
            navigate("/home");
        } catch (error) {
            console.error("Invalid OTP:", error);
            setError("Invalid OTP! Please try again.");
        }
    };
    

    const handleGoogleRegister = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Gọi API của Google để lấy thông tin user
                const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                console.log("Google User Info:", userInfo);

                // Add data base

                navigate("/home");
            } catch (error) {
                console.error("Error fetching Google user info:", error);
                setError("Google registration failed");
            }
        },
        onError: () => setError("Google registration failed"),
    });

    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            <div id="recaptcha-container"></div>
            {/* Hiệu ứng nền sao */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

            {/* Khối đăng ký */}
            <div className="relative z-10 w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white border border-gray-700">
                <h1 className="text-3xl font-bold text-center text-blue-500">PULSE</h1>
                <p className="text-center text-xl mt-2">Create your account</p>
                <p className="text-center text-sm mt-2 text-gray-400">
                    To use Pulse! Please enter your details
                </p>
                <p className="h-4 text-red-500 text-sm text-center mt-2">{error}</p>

                <InputField
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

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

                <InputField
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    showPassword={showConfirmPassword}
                    onTogglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <button
                    onClick={handleSignUp}
                    className={`w-full mt-6 py-3 text-white font-bold rounded-full ${isBtnEnable ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
                        }`}
                    disabled={!isBtnEnable}
                >
                    Sign Up
                </button>

                <button
                    onClick={() => handleGoogleRegister()}
                    className="w-full flex items-center justify-center mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700">
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
            {/* OTP Modal */}
            {/* {isOtpModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 text-center">
                        <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                        <p className="text-sm text-gray-500">We've sent a verification code to +84{form.phone.slice(1)}</p>
                        <div className="flex justify-center gap-2 mt-4">
                            {otp.map((num, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={num}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && index > 0) {
                                            handleVerifyOtp();
                                        }
                                    }}
                                    className="w-10 h-10 text-center border border-gray-300 rounded"
                                />
                            ))}
                        </div>
                        <button onClick={handleVerifyOtp} className="bg-green-500 text-white px-4 py-2 mt-4 mr-4 rounded cursor-pointer">Verify OTP</button>
                        <button onClick={() => setIsOtpModalOpen(false)} className="text-red-500 mt-4 ml-4 cursor-pointer">Cancel</button>
                    </div>
                </div>
            )} */}

{isOtpModalOpen && (
    <div 
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onKeyDown={(e) => {
            if (e.key === "Escape") setIsOtpModalOpen(false);
        }}
        tabIndex={-1} // Để có thể bắt sự kiện keydown trên div
    >
        <div className="bg-white p-6 rounded-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <p className="text-sm text-gray-500">We've sent a verification code to +84{form.phone.slice(1)}</p>
            <div className="flex justify-center gap-2 mt-4">
                {otp.map((num, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={num}
                        autoComplete="off"
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && index === otp.length - 1) {
                                handleVerifyOtp();
                            } else if (e.key === "ArrowRight" && index < otp.length - 1) {
                                document.getElementById(`otp-${index + 1}`)?.focus();
                            } else if (e.key === "ArrowLeft" && index > 0) {
                                document.getElementById(`otp-${index - 1}`)?.focus();
                            } else if (e.key === "Backspace" && !otp[index] && index > 0) {
                                document.getElementById(`otp-${index - 1}`)?.focus();
                            }
                        }}
                        className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>
            <button 
                onClick={handleVerifyOtp} 
                className="bg-green-500 text-white px-4 py-2 mt-4 mr-4 rounded cursor-pointer"
            >
                Verify OTP
            </button>
            <button 
                onClick={() => setIsOtpModalOpen(false)} 
                className="text-red-500 mt-4 ml-4 cursor-pointer"
            >
                Cancel
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default Register;