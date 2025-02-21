import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleLogo } from "../../assets";
import { InputField } from "./components";


const users = [
    { username: "admin", password: "admin123" },
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "test", password: "test123" },
    { username: "tong", password: "tong123" },
];

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "admin", password: "admin123" }); // gán chạy cho lẹ
    const [error, setError] = useState("");
    const [isBtnEnable, setIsBtnEnable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setIsBtnEnable(form.username.trim() !== "" && form.password.trim() !== "");
    }, [form]);

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

        const userExists = users.find(user => user.username === form.username && user.password === form.password);

        if (!userExists) {
            setError("Invalid username or password. Please try again!");
            return;
        }

        navigate("/home");

    };

    return (
        <div className="h-screen flex">
            {/* Left Section - Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-500 p-8">
                <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg text-white">
                    <h1 className="text-3xl font-bold text-center text-green-400">PULSE</h1>
                    <p className="text-center text-xl mt-2">Log in to your account</p>
                    <p className="text-center text-sm mt-2 text-gray-400">Welcome back! Please inter your details</p>
                    {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

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

                    <p className="text-right mt-4 text-sm text-blue-400 hover:text-gray-200 cursor-pointer">
                        Forgot Password?
                    </p>

                    <button onClick={handleLogin} className={`w-full mt-6 py-3 text-white font-bold rounded-full 
              ${isBtnEnable ? "bg-green-400 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
                        disabled={!isBtnEnable}>
                        Log in
                    </button>

                    <button className="w-full flex items-center justify-center mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700">
                        <img src={GoogleLogo} alt="Google" className="w-5 h-5 mr-2" />
                        Sign in with Google
                    </button>

                    <p className="text-center mt-4 text-sm text-gray-400">
                        Don’t have an account? <span className="text-green-400 cursor-pointer" onClick={() => navigate("/register")}>Sign up, it’s free!</span>
                    </p>
                </div>
            </div>

            {/* Right Section - Image */}
            <div className="w-1/2 hidden lg:flex items-center justify-center bg-black">
                <img src="https://media.istockphoto.com/id/1346575545/vi/anh/k%E1%BA%BFt-xu%E1%BA%A5t-3d-c%E1%BB%A7a-kh%C3%A1i-ni%E1%BB%87m-kinh-doanh-truy%E1%BB%81n-th%C3%B4ng-x%C3%A3-h%E1%BB%99i.jpg?b=1&s=612x612&w=0&k=20&c=AZWfoxCc47VUYSKjhSwebw_QBo_AaTreGB8li0IZkU8=" alt="Login" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default Login;
