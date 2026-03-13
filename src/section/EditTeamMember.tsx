import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OnlyTeamMemberEdit from "./OnlyTeamMemberEdit";

type TeamMember = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  role: string;
  image: string;
};

export default function EditTeamMember() {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const [form, setForm] = useState<TeamMember>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    position: "",
    gender: "",
    role: "user",
    image: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  /* ---------------- Permission Check ---------------- */

  useEffect(() => {
    if (!currentUser || !email) {
      toast.error("Access denied!");
      navigate("/team");
      return;
    }

    const adminCheck = currentUser.role === "admin";
    const ownProfileCheck = currentUser.email === email;

    setIsAdmin(adminCheck); 

    if (!adminCheck && !ownProfileCheck) {
      toast.error("You do not have permission!");
      navigate("/team");
    } else {
      setIsAuthorized(true);
    }
  }, [currentUser, email, navigate]);

  /* ---------------- Load Member Data ---------------- */

  useEffect(() => {
    if (!isAuthorized) return;

    const members: TeamMember[] = JSON.parse(
      localStorage.getItem("teamMembers") || "[]"
    );

    const member = members.find((m) => m.email === email);

    if (!member) {
      toast.error("Team member not found!");
      navigate("/team");
      return;
    }

    // prevent extra fields like DOB from entering form state
    setForm({
      firstname: member.firstname || "",
      lastname: member.lastname || "",
      email: member.email || "",
      phone: member.phone || "",
      position: member.position || "",
      gender: member.gender || "",
      role: member.role || "user",
      image: member.image || "",
    });
  }, [email, isAuthorized, navigate]);

  /* ---------------- Handle Input Change ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- Handle Image Upload ---------------- */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ---------------- Form Submit ---------------- */

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  /* Required Fields */
  const requiredFields = ["firstname", "lastname", "phone", "position", "gender"];
  for (const field of requiredFields) {
    if (!form[field as keyof TeamMember].trim()) {
      toast.warning(`Please fill the ${field} field`);
      return;
    }
  }

  /* Phone Validation */
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(form.phone)) {
    toast.warning("Phone number must be 10 digits");
    return;
  }

  /* Email Validation */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) {
    toast.warning("Invalid email format");
    return;
  }

  /* Load team members from localStorage */
  const members: TeamMember[] = JSON.parse(localStorage.getItem("teamMembers") || "[]");
  const index = members.findIndex((m) => m.email === email);

  if (index === -1) {
    toast.error("Team member not found!");
    return;
  }

  /* Duplicate Email Check */
  if (
    email !== form.email &&
    members.some((m) => m.email === form.email)
  ) {
    toast.warning("Email already exists!");
    return;
  }

  /* Merge old member with updated form */
  members[index] = {
    ...members[index], // keep old fields
    ...form,           // update with new fields
  };

  localStorage.setItem("teamMembers", JSON.stringify(members));

  /* Update loggedInUser if editing own profile */
  if (currentUser.email === email) {
    const updatedUser = {
      ...currentUser,
      ...form, // merge updates
    };
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
  }

  toast.success("Team Member Updated Successfully");

  navigate(`/team/profile/${form.email}`);
};

  /* ---------------- Prevent Unauthorized Render ---------------- */

  if (!isAuthorized) return null;

  /* ---------------- UI ---------------- */

  return (
    <>
      {isAdmin  ? (
        <div className="pt-[82px] min-h-screen w-full bg-white">
          <div className="flex h-full">
            <div className="lg:w-[240px] p-4 h-full bg-white"></div>

            <div className="lg:w-[82%] px-8 overflow-y-auto">

              <button
                onClick={() => navigate(`/team/profile/${email}`)}
                className="cursor-pointer text-4xl font-bold mt-6 hover:text-blue-600"
              >
                ←
              </button>

              <h2 className="font-semibold text-2xl mt-6 mb-6">
                Edit Team Member
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image */}

                <div className="flex flex-col items-center">
                  <img
                    src={form.image || "src/assets/p15.png"}
                    alt="profile"
                    className="h-36 w-36 rounded-full object-cover"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="upload-photo"
                  />

                  <label
                    htmlFor="upload-photo"
                    className="mt-2 text-[#6E54B5] font-semibold cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>

                {/* First & Last Name */}

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    placeholder="Firstname"
                    className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4" />
                  </div>
                  <div className="flex-1">
                   <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    placeholder="Lastname"
                    className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4" />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex-1">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4" />
                 </div>
                {/* Position */}
                 <label htmlFor="">Position</label>
                <select
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                >
                  <option value="">Select Position</option>
                  <option>Software Developer</option>
                  <option>Project Manager</option>
                  <option>HR Manager</option>
                  <option>Accountant</option>
                  <option>Graphic Designer</option>
                </select>

                {/* Gender */}
                 <label htmlFor="">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                {/* Submit */}

                <div className="flex justify-end mb-6">
                  <button
                    type="submit"
                    className="cursor-pointer bg-[#6E54B5] text-white rounded-xl h-12 w-44 hover:bg-[#593eb5]"
                  >
                    Update Profile
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      ) : (
        <OnlyTeamMemberEdit />
      )}
    </>
  );
}