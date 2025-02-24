import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleLogo } from "../../assets";
import { InputField } from "./components";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [isBtnEnable, setIsBtnEnable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        setIsBtnEnable(
            form.email.trim() !== "" &&
            form.username.trim() !== "" &&
            form.password.trim() !== "" &&
            form.confirmPassword.trim() !== ""
        );
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
        <div className="relative w-full h-screen flex items-center justify-center">
            {/* Hiệu ứng nền sao */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

            {/* Khối đăng ký */}
            <div className="relative z-10 w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white border border-gray-700">
                <h1 className="text-3xl font-bold text-center text-blue-500">PULSE</h1>
                <p className="text-center text-xl mt-2">Create your account</p>
                <p className="text-center text-sm mt-2 text-gray-400">
                    To use Pulse! Please enter your details
                </p>
                {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

                <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
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
    );
};

export default Register;
