import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImg from "../assets/p15.png"; 

// ✅ Define the form type
type TeamMemberForm = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  role: string;
  image: string;
};

export default function AddTeamMember() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const [form, setForm] = useState<TeamMemberForm>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    position: "",
    gender: "",
    role: "user",
    image: "",
  });

  // ✅ Redirect non-admins immediately
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      toast.warning("You do not have permission to access this page!");
      navigate("/team");
    }
  }, [currentUser, navigate]);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload and convert to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "admin") {
      toast.warning("You are not allowed to add a team member.");
      return;
    }

    // Validation
    for (const key in form) {
      if ((form as any)[key].trim() === "") {
        alert(`Please fill the ${key} field`);
        return;
      }
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(form.phone)) {
      toast.warning("Phone number must be 10 digits");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      toast.warning("Please enter a valid email address");
      return;
    }

    // Save to localStorage
    const existingMembers: TeamMemberForm[] = JSON.parse(localStorage.getItem("teamMembers") || "[]");
    const isExist = existingMembers.find((m) => m.email === form.email);
    if (isExist) {
      toast.warning("This email already exists in team members!");
      return;
    }

    existingMembers.push(form);
    localStorage.setItem("teamMembers", JSON.stringify(existingMembers));

    toast.success("Team Member Added Successfully");

    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      position: "",
      gender: "",
      role: "user",
      image: "",
    });

    navigate("/team");
  };

  return (
     <div className="pt-[82px] h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
         <div className="lg:w-[240px] p-4 h-full bg-white">
          </div>
          
        <div className="w-full lg:w-[82%] px-4 overflow-y-auto sm:pl-12">
            <button
          onClick={() => navigate("/team")}
          className="cursor-pointer text-4xl font-bold mt-6 hover:text-blue-600" >
          ← 
        </button>
          <h2 className="font-semibold text-[24px] mt-[30px] pl-4">Add Team Member</h2>
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-4">
              <div className="flex justify-center items-center mt-[40px]">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="profile"
                    className="h-[137.53px] w-[137.53px] rounded-full"
                  />
                ) : (
                  <img
                    src={UploadImg}
                    alt=""
                    className="h-[137.53px] w-[137.53px]"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="upload-photo"
              />
              <label
                htmlFor="upload-photo"
                className="text-[14px] text-center text-[#6E54B5] cursor-pointer font-semibold block mt-2"
              >
                Upload Photo
              </label>
            </div>

            {/* Firstname & Lastname */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 ">
                <label>Firstname</label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder="Firstname"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label>Lastname</label>
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="Lastname"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
              <div className="flex-1">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="98********"
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                />
              </div>
            </div>

            {/* Position & Gender */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label>Position</label>
                <select
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                >
                  <option value="">-- Select Position --</option>
                  {/* Add your optgroups and options here */}
                  <option>Chief Executive Officer (CEO)</option>
                   <optgroup label="Top Management / Executive">
      <option>Chief Executive Officer (CEO)</option>
      <option>Chief Operating Officer (COO)</option>
      <option>Chief Financial Officer (CFO)</option>
      <option>Chief Technology Officer (CTO)</option>
      <option>Chief Marketing Officer (CMO)</option>
      <option>President</option>
      <option>Vice President (VP)</option>
    </optgroup>

    {/* Middle Management */}
    <optgroup label="Middle Management">
      <option>General Manager (GM)</option>
      <option>Operations Manager</option>
      <option>Project Manager</option>
      <option>HR Manager</option>
      <option>Sales Manager</option>
      <option>IT Manager</option>
      <option>Team Lead</option>
      <option>Team Supervisor</option>
    </optgroup>

    {/* Administrative */}
    <optgroup label="Administrative & Support Staff">
      <option>Executive Assistant</option>
      <option>Personal Assistant</option>
      <option>Office Administrator</option>
      <option>Receptionist</option>
      <option>Secretary</option>
      <option>Data Entry Operator</option>
      <option>Office Clerk</option>
    </optgroup>

    {/* Finance */}
    <optgroup label="Finance / Accounting">
      <option>Accountant</option>
      <option>Finance Officer</option>
      <option>Accounts Payable Officer</option>
      <option>Accounts Receivable Officer</option>
      <option>Payroll Specialist</option>
      <option>Financial Analyst</option>
    </optgroup>

    {/* HR */}
    <optgroup label="Human Resources (HR)">
      <option>HR Manager</option>
      <option>HR Executive</option>
      <option>HR Officer</option>
      <option>Recruitment Officer</option>
      <option>Training & Development Officer</option>
      <option>Employee Relations Specialist</option>
    </optgroup>

    {/* Sales */}
    <optgroup label="Sales & Marketing">
      <option>Sales Manager</option>
      <option>Marketing Manager</option>
      <option>Sales Executive</option>
      <option>Marketing Executive</option>
      <option>Business Development Manager</option>
      <option>Social Media Manager</option>
    </optgroup>

    {/* IT */}
    <optgroup label="IT / Technical">
      <option>IT Manager</option>
      <option>Network Administrator</option>
      <option>System Administrator</option>
      <option>Software Developer</option>
      <option>Software Engineer</option>
      <option>Technical Support</option>
      <option>Helpdesk</option>
      <option>Web Designer</option>
      <option>Web Developer</option>
    </optgroup>

    {/* Operations */}
    <optgroup label="Operations / Logistics">
      <option>Operations Executive</option>
      <option>Logistics Manager</option>
      <option>Procurement Officer</option>
      <option>Buyer</option>
      <option>Inventory Manager</option>
    </optgroup>

    {/* Creative */}
    <optgroup label="Creative / Design">
      <option>Graphic Designer</option>
      <option>Content Writer</option>
      <option>Copywriter</option>
      <option>Creative Director</option>
      <option>UX/UI Designer</option>
    </optgroup>

    {/* Other */}
    <optgroup label="Other Common Roles">
      <option>Customer Service Representative</option>
      <option>Call Center Executive</option>
      <option>Legal Officer</option>
      <option>Legal Advisor</option>
      <option>Quality Assurance Officer</option>
      <option>Quality Control Officer</option>
    </optgroup>
                </select>
              </div>

               <div className="flex-1">
                <label>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-[#DFEAF2] rounded-xl h-12 px-4"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-[30px] mb-6 flex justify-end pr-10">
              <button
                type="submit"
                className="cursor-pointer rounded-[15px] h-[50px] w-[190px] bg-[#6E54B5] font-medium text-white"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}