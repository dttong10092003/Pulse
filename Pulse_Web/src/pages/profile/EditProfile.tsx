import { useState } from "react";
import { ArrowLeft, Camera, Save, Trash2, User, AtSign, Link, Pencil, CircleCheck, PhoneCallIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface ProfileFormData {
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    link: string;
}

export default function EditProfile() {
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: "200Lab",
        lastName: "Guest",
        username: "guest",
        bio: "Hello, I'm using this app!",
        link: "sad",
    });
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState("https://picsum.photos/800/300");
    const [avatarImage, setAvatarImage] = useState("https://i.pravatar.cc/300");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("Saving profile:", formData);
        alert("Profile saved successfully!");
    };

    // Handle background image change
    const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setBackgroundImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle avatar image change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setAvatarImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    // Hàm quay lại trang My Profile khi nhấn vào nút quay lại
    const handleBack = () => {
        navigate("/home/my-profile"); // Điều hướng về trang /my-profile
    };
    return (
        <div className="flex-1 bg-[#1F1F1F] text-white">
            {/* Header */}
            <div
                className="relative w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <button className="p-3 rounded-full text-white hover:bg-white/20 transition" onClick={handleBack}>
                        <ArrowLeft size={28} />
                    </button>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button className="p-3 rounded-full text-white hover:bg-white/20 transition">
                        <Trash2 size={22} />
                    </button>
                    {/* Change Background Image */}
                    <label htmlFor="background-image" className="p-3 rounded-full text-white hover:bg-white/20 transition cursor-pointer">
                        <Camera size={22} />
                    </label>
                    <input
                        id="background-image"
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundChange}
                        className="hidden"
                    />
                    <button onClick={handleSave} className="px-4 py-2 text-white hover:bg-white/20 rounded-md transition flex items-center gap-2">
                        <Save size={18} />
                    </button>
                </div>
                {/* Avatar */}
                <div className="absolute -bottom-16 left-6">
                    <div className="relative">
                        <img
                            src={avatarImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-[#1F1F1F] bg-zinc-800"
                        />
                        <label htmlFor="avatar-image" className="absolute bottom-0 right-0 rounded-full bg-zinc-800 p-2 text-white hover:bg-zinc-700 transition cursor-pointer">
                            <Camera size={18} />
                        </label>
                        {/* Input file để thay đổi avatar */}
                        <input
                            id="avatar-image"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                </div>

            </div>

            {/* Form chỉnh sửa */}
            <div className="container mx-auto px-4 pt-20 max-w-3xl">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase mb-4 text-left">Edit Profile</h3>

                <div className="bg-[#181818] p-6 rounded-lg shadow-md space-y-4">
                    {[
                        { label: "Phone Number", name: "firstName", type: "text", icon: <PhoneCallIcon size={18} /> },
                        { label: "First Name", name: "firstName", type: "text", icon: <User size={18} /> },
                        { label: "Last Name", name: "lastName", type: "text", icon: <User size={18} /> },
                        { label: "Username", name: "username", type: "text", icon: <AtSign size={18} /> },
                        { label: "Bio", name: "bio", type: "text", icon: <Pencil size={18} /> },
                        { label: "Link", name: "link", type: "text", icon: <Link size={18} /> },
                    ].map(({ label, name, type, icon }) => (
                        <div key={name} className="flex items-center gap-4  border-zinc-700 pb-4">
                            <div className="flex items-center gap-2 text-zinc-400 w-1/3">
                                {icon}
                                <label className="text-sm">{label}</label>
                            </div>
                            <div className="w-2/3 flex items-center gap-2">
                                <input
                                    id={name}
                                    name={name}
                                    type={type}
                                    value={formData[name as keyof ProfileFormData]}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-white border-zinc-600 px-3 py-2 rounded-md outline-none focus:border-[#00FF7F]"
                                />
                                <CircleCheck size={20} className="text-[#00FF7F]" />
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}
