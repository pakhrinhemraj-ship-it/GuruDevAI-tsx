import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NotificationSettings = {
  digitalCurrency: boolean;
  merchantOrder: boolean;
  recommendation: boolean;
};

type TeamMember = {
  firstname: string;
  lastname: string;
  email: string;
  dateofbirth: string;
  presentaddress: string;
  permanentaddress: string;
  city: string;
  pincode: string;
  country: string;
  image: string;
  role: string;
  timezone: string;
  currency: string;
  notificationSettings: NotificationSettings;
  twoFactorAuth: boolean;
  password?: string;
};

export default function EditTeamMember() {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();

  const currentUser: any =
    JSON.parse(localStorage.getItem("loggedInUser") || "null") || {};

  const [activeTab, setActiveTab] = useState<string>("edit");

  const [form, setForm] = useState<TeamMember>({
    firstname: "",
    lastname: "",
    email: "",
    dateofbirth: "",
    presentaddress: "",
    permanentaddress: "",
    city: "",
    pincode: "",
    country: "",
    image: "",
    role: "user",
    timezone: "",
    currency: "",
    notificationSettings: {
      digitalCurrency: false,
      merchantOrder: false,
      recommendation: false,
    },
    twoFactorAuth: false,
  });

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  /* ================= ACCESS CONTROL ================= */
  useEffect(() => {
    if (!email) return;

    if (!currentUser?.email) {
      toast.error("Access denied!");
      navigate("/team");
      return;
    }

    const isAdmin = currentUser.role === "admin";
    const isOwnProfile = currentUser.email === email;

    if (!isAdmin && !isOwnProfile) {
      toast.error("No permission!");
      navigate("/team");
    }
  }, [email, currentUser, navigate]);

  /* ================= LOAD MEMBER ================= */
  useEffect(() => {
    const members: TeamMember[] = JSON.parse(
      localStorage.getItem("teamMembers") || "[]"
    );

    const member = members.find((m) => m.email === email);

    if (!member) {
      navigate("/team");
      return;
    }

const cleanedMember: TeamMember = {
  firstname: member.firstname || "",
  lastname: member.lastname || "",
  email: member.email || "",
  dateofbirth: member.dateofbirth
    ? new Date(member.dateofbirth).toISOString().split("T")[0]
    : "",
  presentaddress: member.presentaddress || "",
  permanentaddress: member.permanentaddress || "",
  city: member.city || "",
  pincode: member.pincode || "",
  country: member.country || "",
  image: member.image || "",
  role: member.role || "user",
  timezone: member.timezone || "",
  currency: member.currency || "",

  notificationSettings: {
    digitalCurrency: member.notificationSettings?.digitalCurrency ?? false,
    merchantOrder: member.notificationSettings?.merchantOrder ?? false,
    recommendation: member.notificationSettings?.recommendation ?? false,
  },

  twoFactorAuth: member.twoFactorAuth ?? false,
};

    setForm(cleanedMember);
  }, [email, navigate]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTwoFactor = () => {
    const updatedForm = {
      ...form,
      twoFactorAuth: !form.twoFactorAuth,
    };

    setForm(updatedForm);

    const members: TeamMember[] = JSON.parse(
      localStorage.getItem("teamMembers") || "[]"
    );

    const updatedMembers = members.map((m) =>
      m.email === email ? updatedForm : m
    );

    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ================= TOGGLE SWITCH ================= */
  const toggleSwitch = (key: keyof NotificationSettings) => {
    setForm((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: !prev.notificationSettings[key],
      },
    }));
  };

  /* ================= SAVE PROFILE ================= */
const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const members: TeamMember[] = JSON.parse(
    localStorage.getItem("teamMembers") || "[]"
  );

  const index = members.findIndex((m) => m.email === email);

  if (index === -1) {
    toast.error("Member not found");
    return;
  }

  // Merge existing member with updated form to preserve old fields
  members[index] = {
    ...members[index], // keep all old fields
    ...form,           // overwrite with updated fields from form
  };

  localStorage.setItem("teamMembers", JSON.stringify(members));

  toast.success("Profile updated successfully");

  // If the logged-in user updated their own email, update localStorage
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (currentUser?.email === email) {
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ ...currentUser, ...form })
    );
  }

  navigate(`/team/profile/${form.email}`);
};

  /* ================= SAVE PREFERENCES ================= */
  const handlePreferenceSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const members: TeamMember[] = JSON.parse(
      localStorage.getItem("teamMembers") || "[]"
    );

    const updatedMembers = members.map((m) =>
      m.email === email
        ? {
            ...m,
            currency: form.currency,
            timezone: form.timezone,
            notificationSettings: form.notificationSettings,
          }
        : m
    );

    localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));

    toast.success("Preferences updated successfully");
  };

  /* ================= CHANGE PASSWORD ================= */
const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const members: any[] = JSON.parse(localStorage.getItem("teamMembers") || "[]");
  const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  if (!loggedUser) {
    setMessage("User not logged in.");
    return;
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    setMessage("Please fill in all fields.");
    return;
  }

  const memberIndex = members.findIndex((m) => m.email === loggedUser.email);
  const userIndex = users.findIndex((u) => u.email === loggedUser.email);

  if (userIndex === -1) {
    setMessage("User not found.");
    return;
  }

  const user = users[userIndex];

  // Check current password from users (login source)
  if (user.password !== currentPassword) {
    setMessage("Current password is incorrect.");
    return;
  }

  if (currentPassword === newPassword) {
    setMessage("New password must be different.");
    return;
  }

  if (newPassword.length < 6) {
    setMessage("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }

  // Update password in users
  users[userIndex].password = newPassword;

  // Update password in teamMembers if exists
  if (memberIndex !== -1) {
    members[memberIndex].password = newPassword;
  }

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("teamMembers", JSON.stringify(members));

  // Update session
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({
      email: loggedUser.email,
      role: loggedUser.role,
    })
  );

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");
  setMessage("");

  toast.success("Password changed successfully!");
};

  /* ================= SWITCH COMPONENT ================= */
  const Switch = ({
    isOn,
    onClick,
  }: {
    isOn: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${
        isOn ? "bg-teal-400" : "bg-gray-200"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );

  return (
<>
 
{/* team member edit for personal */}
 <div className="pt-[82px] min-h-screen w-full bg-[#FFFFFF]">
  <div className="flex flex-col md:flex-row h-full">
    
    {/* Sidebar */}
   <div className="lg:w-[240px] xl:w-[240px] 2xl:w-[240px] p-4 h-full">
          </div>
    {/* Main Content */}
    <div className="w-full lg:w-[82%] px-4 overflow-y-auto">
    <div className="flex-1 px-4 md:px-8 overflow-y-auto">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(`/team/profile/${email}`)}
        className="cursor-pointer text-gray-600 text-3xl md:text-4xl font-bold hover:text-blue-600 transition mt-2 md:mt-6"
      >
        ←
      </button>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-4">
        <ul className="flex space-x-1 sm:space-x-6">
          <li>
            <button
               onClick={() => {
                      setActiveTab("edit");        // visually highlight the tab
                      navigate(`/team/profile/editprofile/${email}?tab=edit`); // update URL
                    }}
              className={`cursor-pointer px-4 py-2 font-semibold focus:outline-none -mb-px ${
                activeTab === "edit"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-purple-600 hover:border-purple-600"
              }`}>
              Edit Profile
            </button>
          </li>
          <li>
            <button
               onClick={() => {
                      setActiveTab("preferences");        // visually highlight the tab
                      navigate(`/team/profile/editprofile/${email}?tab=preferences`); // update URL
                    }}
              className={`cursor-pointer px-4 py-2 font-semibold focus:outline-none -mb-px ${
                activeTab === "preferences"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-purple-600 hover:border-purple-600"
              }`}>
              Preferences
            </button>
          </li>
          <li>
            <button
                onClick={() => {
                      setActiveTab("security");        // visually highlight the tab
                      navigate(`/team/profile/editprofile/${email}?tab=security`); // update URL
                    }}
              className={`cursor-pointer px-4 py-2 font-semibold focus:outline-none -mb-px ${
                activeTab === "security"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-purple-600 hover:border-purple-600"
              }`}
            >
              Security
            </button>
          </li>
        </ul>
      </div>

      {/* Edit Profile Section */}
      {activeTab === "edit" && (
        <section id="editProfile" className="mt-12 sm:mt-20 mb-10">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Image Upload */}
        <div className="xl:flex flex-wrap xl:gap-[10rem]">
           
          <div className="flex flex-col justify-between items-center ">
          <div className="">

             {/* Profile Image */}
             <img  src={form.image || "src/assets/p15.png"}
              alt="profile"
              className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover mb-2" />

            {/* Upload Icon */}
            <label
              htmlFor="upload-photo"
              className="flex justify-center items-center text-sm md:text-base text-[#6E54B5] font-semibold cursor-pointer">
              Upload Photo
            </label>

            {/* Hidden File Input */}
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

        </div>
          <div className="mt-4 text-center flex gap-2 xl:hidden">
            <p className="text-lg md:text-xl font-semibold">{form.firstname }</p>
            <p className="text-lg md:text-xl font-semibold">{form.lastname }</p>
          </div>
        </div>
             <div>
            {/* Name */}
            <div className="mt-8 flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label>First Name</label>
                <input
                  type="text"
                  name="yourname"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder="yourname"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label>Last Name</label>
                <input
                  type="text"
                  name="username"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>

             <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="flex-1">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateofbirth"
                  value={form.dateofbirth}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label> Present Address</label>
                <input
                  type="text"
                  name="presentaddress"
                  value={form.presentaddress}
                  onChange={handleChange}
                  placeholder="presentaddress"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="flex-1">
                <label>Permanent Address</label>
                <input
                  type="text"
                  name="permanentaddress"
                  value={form.permanentaddress}
                  onChange={handleChange}
                  placeholder="permanentaddress"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="eg:Kathmandu"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>

               <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="flex-1">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Firstname"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Lastname"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>
            

            {/* Submit */}
            <div className="flex justify-center md:justify-end">
              <button
                type="submit"
                className="cursor-pointer mt-6 bg-[#6E54B5] text-white font-medium rounded-xl h-12 w-44 hover:bg-[#593eb5] transition">
                Update Profile
              </button>
            </div>
            </div>
            </div>
          </form>
        </section>
      )}

      {/* Preferences Section */}
      {activeTab === "preferences" && (
        <section id="Preferences" className="mt-6">
          <form onSubmit={handlePreferenceSave}>

            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex-1">
                <label className="text-[16px] block mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  placeholder="USD"
                  value={form.currency}
                  onChange={handleChange}
                  className="border border-[#DFEAF2] rounded-[15px] h-12 px-4 w-full focus:outline-none 
                  focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-normal text-[16px]">
                  Time Zone
                </label>
                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-[15px] h-12 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Time Zone</option>
                  <option value="Asia/Kathmandu">
                    Asia/Kathmandu (GMT+5:45)
                  </option>
                  <option value="Asia/Kolkata">
                    Asia/Kolkata (GMT+5:30)
                  </option>
                  <option value="UTC">
                    UTC (GMT+0)
                  </option>
                  <option value="America/New_York">
                    America/New_York (GMT-5)
                  </option>
                  <option value="Europe/London">
                    Europe/London (GMT+0)
                  </option>
                </select>
              </div>

            </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-6">
                    Notification
                  </h2>

                  <div className="flex items-center justify-between mb-5">
                    <Switch
                      isOn={form.notificationSettings?.digitalCurrency || false}
                      onClick={() => toggleSwitch("digitalCurrency")}
                    />
                    <span className="text-gray-600 ml-4 flex-1">
                      I send or receive digital currency
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <Switch
                      isOn={form.notificationSettings?.merchantOrder || false}
                      onClick={() => toggleSwitch("merchantOrder")}
                    />
                    <span className="text-gray-600 ml-4 flex-1">
                      I receive merchant order
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Switch
                      isOn={form.notificationSettings?.recommendation || false}
                      onClick={() => toggleSwitch("recommendation")}
                    />
                    <span className="text-gray-600 ml-4 flex-1">
                      There are recommendations for my account
                    </span>
                  </div>
                </div>

            <div className="flex justify-center md:justify-start">
              <button
                type="submit"
                className="cursor-pointer mt-6 bg-[#6E54B5] text-white font-medium rounded-xl h-12 w-44 hover:bg-[#593eb5] transition">
                Save
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Security Section */}
     {activeTab === "security" && (
        <section id="Security" className="mt-6">
      <div className="">
      {/* Two-factor Authentication */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[17px] font-semibold">Two-factor Authentication</h2>
          <div className="flex items-center justify-between mt-5 mb-5">
            <Switch
                isOn={form.twoFactorAuth}
                onClick={toggleTwoFactor}
            />
            <span className="text-gray-600 ml-4 flex-1">
              Enable or disable two factor authentication
            </span>
          </div>
        </div>
       
      </div>

      {/* Change Password */}
      <div>
        <h2 className="text-[#333B69] text-[17px] font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
           <div>
            <label className="block text-sm font-normal text-[16px] text-[#232323] mb-1">
             Current Password 
             </label> 
             <div className="relative w-full max-w-[510px]"> 
              <input type={showCurrentPassword ? "text" : "password"} 
              value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} 
              className="w-full h-12 border border-[#DFEAF2]  rounded-[15px] p-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
               placeholder="********" /> 
               <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700" > 
                {showCurrentPassword ? "🙈" : "👁️"}
                 </button>
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-normal text-[16px] text-[#232323] mb-1">
                    New Password
                    </label> 
                    <div className="relative w-full max-w-[510px]">
                        <input type={showNewPassword ? "text" : "password"} 
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                        className="w-full h-12 border border-[#DFEAF2]  rounded-[15px] p-2 pr-10 focus:ring-2 
                        focus:ring-purple-500 focus:outline-none" placeholder="********" /> 
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                     className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700" >
                  {showNewPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                </div>
                  <div>
              <label className="block text-sm font-normal text-[16px] text-[#232323] mb-1">
                Confirm Password
            </label> 
            <div className="relative w-full max-w-[510px]"> 
              <input type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full h-12 border border-[#DFEAF2] rounded-[15px] p-2 pr-10 focus:ring-2 
              focus:ring-purple-500 focus:outline-none" placeholder="********" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700" >
               {showConfirmPassword ? "🙈" : "👁️"}
              </button> 
              </div> 
              </div>
                {message && (
                  <p className="text-sm text-red-500 mt-1">{message}</p> )} 
                <div className="flex justify-center md:justify-start"> 
                <button type="submit" className="cursor-pointer mt-6 bg-[#6E54B5] text-white font-medium rounded-xl h-12 w-44 hover:bg-[#593eb5] transition">
              Save 
          </button>
          </div>
       </form>
      </div>
      </div>
    </section>
      )}
     </div>
    </div>
  </div>
</div>
    </>
  );
}