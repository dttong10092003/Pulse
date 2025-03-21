import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { createUserDetail } from "../../redux/slice/userSlice";

export default function UserProfileForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber = "", email = "" } = location.state || {}; // Lấy thông tin khi điều hướng từ Register

  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    gender: "male",
    phoneNumber: phoneNumber || "",
    email: email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        dob: userDetails.dob,
        gender: userDetails.gender,
        phoneNumber: userDetails.phoneNumber,
        email: userDetails.email,
      }));
    }
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";

    if (!email && formData.phoneNumber && !/^(\+84|0)[3|5|7|8|9]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Vietnamese phone number format";
    }

    if (!phoneNumber && formData.email && !/^.+@.+\..+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const dataToSend = {
        ...formData,  // Truyền tất cả dữ liệu từ formData
        avatar: "",  // Thêm avatar mặc định nếu cần
        backgroundAvatar: "", // Thêm backgroundAvatar mặc định nếu cần
      };
      console.log(dataToSend); // Debug: Kiểm tra dữ liệu gửi đi
      // Tạo mới thông tin người dùng nếu chưa có
      dispatch(createUserDetail(dataToSend))
        .unwrap()
        .then((response) => {
          setIsSubmitting(false);
          setSubmitSuccess(true);
          setTimeout(() => setSubmitSuccess(false), 3000);
          navigate('/home'); // Điều hướng về trang chính
          console.log("User details created successfully:", response);
        })
        .catch((err) => {
          console.error("Error creating user details:", err);
          setIsSubmitting(false);
        });

    }
  };



  return (
    <div className="min-h-screen bg-[#0a1122] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-slate-900/70 rounded-lg border border-slate-800 shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center text-green-400 mb-2">PULSE</h1>
          <h2 className="text-xl font-semibold text-center text-white mb-1">User Profile</h2>
          <p className="text-slate-400 text-center mb-6">Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1">
                <label htmlFor="firstname" className="block text-sm font-medium text-slate-300">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    placeholder="John"
                    onChange={handleChange}
                    className={`w-full pl-9 py-2 bg-slate-800/50 border ${errors.firstname ? "border-red-500" : "border-slate-700"
                      } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>
                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label htmlFor="lastname" className="block text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    placeholder="Doe"
                    onChange={handleChange}
                    className={`w-full pl-9 py-2 bg-slate-800/50 border ${errors.lastname ? "border-red-500" : "border-slate-700"
                      } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>
                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1">
                <label htmlFor="dob" className="block text-sm font-medium text-slate-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-9 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label htmlFor="gender" className="block text-sm font-medium text-slate-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    placeholder="+84xxxxxxxxx or 0xxxxxxxxx"
                    readOnly={!!phoneNumber} // Không cho chỉnh sửa nếu đã nhập từ trước
                    onChange={handleChange}
                    className={`w-full pl-9 py-2 bg-slate-800/50 border ${errors.phoneNumber ? "border-red-500" : "border-slate-700"} rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>
                {errors.phoneNumber ? (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                ) : (
                  <p className="text-slate-500 text-xs mt-1">Vietnamese format: +84 or 0 followed by 9 digits</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    placeholder="explain@domain.com"
                    readOnly={!!email} // Không cho chỉnh sửa nếu đã nhập từ trước
                    onChange={handleChange}
                    className={`w-full pl-9 py-2 bg-slate-800/50 border ${errors.email ? "border-red-500" : "border-slate-700"} rounded-md text-white focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
              {submitSuccess && <p className="mt-2 text-center text-green-400">Profile saved successfully!</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
