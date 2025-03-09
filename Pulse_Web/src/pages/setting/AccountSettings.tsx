import { useState } from "react";
import {
  ChevronRight, Eye, Heart, Lock, Mail, Trash2, QrCode, ShieldCheck, MessageCircleQuestion,
  X, Smartphone, Globe, Bell, Gift, Monitor, Moon, Sun, Loader, ImageUp, Play
} from "lucide-react";

export default function AccountSettings() {
  const [activeSection, setActiveSection] = useState("main");
  const [appearance, setAppearance] = useState("light");
  const [accentColor, setAccentColor] = useState("blue");
  const [textSize, setTextSize] = useState(16);
  const [brightness, setBrightness] = useState(50);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [highQualityPhoto, setHighQualityPhoto] = useState(true);

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 p-4 space-y-4" >
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${activeSection === "main" ? "bg-[#1F1F1F]" : "hover:bg-[#1F1F1F]"}`}
          onClick={() => setActiveSection("main")}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1F1F1F]">
            <img src="https://i.pravatar.cc/300" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">200Lab Guest</h3>
            <p className="text-sm text-zinc-400">@guest</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-zinc-400" />
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${activeSection === "notifications" ? "bg-[#1F1F1F]" : "hover:bg-[#1F1F1F]"}`}
          onClick={() => setActiveSection("notifications")}
        >
          <Heart className="h-5 w-5" />
          <span>Notifications</span>
          <ChevronRight className="ml-auto h-5 w-5 text-zinc-400" />
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${activeSection === "preferences" ? "bg-zinc-700" : "hover:bg-zinc-800"}`}
          onClick={() => setActiveSection("preferences")}
        >
          <Eye className="h-5 w-5" />
          <span>Preferences</span>
          <ChevronRight className="ml-auto h-5 w-5 text-zinc-400" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {activeSection === "main" && (
          <>
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4 p-6 bg-[#1F1F1F] rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1F1F1F]">
                <img src="https://i.pravatar.cc/300" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">200Lab Guest</h2>
                <p className="text-zinc-400">@guest</p>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <div className="border border-zinc-800 rounded-lg">
                <button
                  className="w-full flex justify-between items-center p-4 text-lg hover:bg-[#1F1F1F] "
                  onClick={(e) => {
                    const content = e.currentTarget.nextElementSibling;
                    if (content) {
                      content.classList.toggle("hidden");
                    }
                  }}
                >
                  <button className="cursor-pointer">Account Settings</button>
                  <ChevronRight className="h-5 w-5 cursor-pointer" />
                </button>
                <div className="p-4 space-y-4 hidden">
                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-zinc-400">guest@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-sm text-zinc-400">••••••••</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 hover:bg-zinc-700 rounded-lg text-zinc-400 cursor-pointer">Change Password</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-5 w-5" />
                      <p className="text-sm font-medium">2FA</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      <p className="text-sm font-medium text-red-500 cursor-pointer">Delete account</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Section */}
              <div className="border border-zinc-800 rounded-lg">
                <button
                  className="w-full flex justify-between items-center p-4 text-lg hover:bg-zinc-800/50"
                  onClick={(e) => {
                    const content = e.currentTarget.nextElementSibling;
                    if (content) {
                      content.classList.toggle("hidden");
                    }
                  }}
                >
                  <button className="cursor-pointer">Privacy</button>
                  <ChevronRight className="h-5 w-5 cursor-pointer" />
                </button>
                <div className="p-4 space-y-4 hidden">
                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5" />
                      <p className="text-sm font-medium">Private profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5" />
                      <p className="text-sm font-medium">Cookie settings</p>
                    </div>
                    <button className="px-4 py-2 hover:bg-zinc-700 rounded-lg text-zinc-400 cursor-pointer">Customize</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircleQuestion className="h-5 w-5" />
                      <p className="text-sm font-medium">Direct messages</p>
                    </div>
                    <button className="px-4 py-2 hover:bg-zinc-700 rounded-lg text-zinc-400 cursor-pointer">Everyone</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "notifications" && (
          <div className="p-4 space-y-4">
            {/* Browser Notifications Banner */}
            <div className="bg-[#1F1F1F] rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <img
                      src="https://byvn.net/ynJE"
                      alt="Laptop"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-medium">Browser notifications are off.</h2>
                    <p className="text-sm text-zinc-400">
                      Turn on notifications to get notified of new responses on your device.
                    </p>
                    <button className="text-xs text-white-400 hover:text-white-300 mt-2 underline">
                      Turn on now
                    </button>
                  </div>
                </div>
                <button className="p-1 hover:bg-zinc-700 rounded">
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>
            </div>
            {/* Notification Settings */}
            <div className="space-y-3">
              {[
                { icon: Mail, text: "Email" },
                { icon: Smartphone, text: "SMS" },
                { icon: Globe, text: "Browser" },
                { icon: Bell, text: "News and Programs" },
                { icon: Gift, text: "Product updates" },
              ].map(({ icon: Icon, text }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1F1F1F] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{text}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "preferences" && (
          <div className="space-y-6 rounded-lg bg-[#1F1F1F] p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Sun className="h-4 w-4" />
                  <span>Appearance</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: "light", icon: Sun },
                    { value: "dark", icon: Moon },
                    { value: "auto", icon: Monitor },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setAppearance(value)}
                      className={`flex h-20 w-24 flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 text-xs transition-all cursor-pointer ${appearance === value
                        ? "border-white bg-zinc-800 text-white"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800"
                        }`}
                    >
                      <div className={`flex h-10 w-full items-center justify-center rounded ${appearance === value ? "bg-zinc-700" : "bg-zinc-800"
                        }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-zinc-300">
                  <span className="h-4 w-4 rounded-full bg-current" />
                  Accent color
                </label>
                <div className="flex gap-2">
                  {["blue", "yellow", "green", "purple", "pink"].map((color) => (
                    <button
                      key={color}
                      className={`h-6 w-6 rounded-full transition-all cursor-pointer ${color === "blue" ? "bg-blue-500" :
                        color === "yellow" ? "bg-yellow-500" :
                          color === "green" ? "bg-green-500" :
                            color === "purple" ? "bg-purple-500" :
                              "bg-pink-500"
                        } ${accentColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900" : ""
                        }`}
                      onClick={() => setAccentColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-zinc-300">
                  <span className="text-lg font-semibold">A</span>
                  Text size
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-[180px]"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-zinc-300">
                  <Sun className="h-4 w-4" />
                  Brightness
                </label>
                <div className="flex w-[180px] items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="bg-zinc-700"
                  />
                  <span className="w-8 text-sm text-zinc-400 ">{brightness}%</span>
                </div>
              </div>

              {[
                {
                  label: "Reduce motion",
                  icon: <Loader className="w-4 h-4" />,
                  checked: reduceMotion,
                  onChange: () => setReduceMotion(!reduceMotion),
                },
                {
                  label: "Auto play",
                  icon: <Play className="w-4 h-4" />,
                  checked: autoPlay,
                  onChange: () => setAutoPlay(!autoPlay),
                },
                {
                  label: "High quality photo",
                  icon: <ImageUp className="w-4 h-4" />,
                  checked: highQualityPhoto,
                  onChange: () => setHighQualityPhoto(!highQualityPhoto),
                },
              ].map(({ label, icon, checked, onChange }) => (
                <div key={label} className="flex items-center justify-between py-1.5">
                  <label className="text-zinc-300 flex items-center cursor-pointer">
                    {icon}
                    <span className="ml-2">{label}</span>
                  </label>
                  <button
                    onClick={onChange}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${checked ? 'bg-zinc-700' : 'bg-zinc-700'
                      }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${checked ? 'bg-zinc-700' : 'bg-zinc-700'
                        }`} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}