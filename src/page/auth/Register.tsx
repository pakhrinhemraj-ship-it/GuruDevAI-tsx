import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import GenericInput from "./GenericFormPage";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

type User = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    return <Navigate to="/team" replace />;
  }

  const handleChange = (name: keyof SignupForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password } = form;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const isUserExist = users.find((user) => user.email === email);

    if (isUserExist) {
      setError("User already exists with this email");
      return;
    }

    const newUser: User = {
      name,
      email,
      password,
      role,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Account Created Successfully!");

    navigate("/login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#CACACA] px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold">Create an Account</p>
          <p className="text-sm text-[#333] mt-2">
            Create an account to continue
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handlerSignup}>
          <GenericInput<SignupForm>
            label="Username"
            name="name"
            type="text"
            value={form.name}
            placeholder="Username"
            onChange={handleChange}
          />

          <GenericInput<SignupForm>
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            placeholder="example@gmail.com"
            onChange={handleChange}
          />

          <div className="relative">
            <GenericInput<SignupForm>
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="••••••••"
              onChange={handleChange}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-3 px-4 py-2 border rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" required className="cursor-pointer" />
            <label className="text-sm text-[#4D4D4D]">
              I accept terms and conditions
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-[#7d65bc] cursor-pointer text-white rounded-md w-full h-[2.5rem] hover:bg-[#6a55a8] transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7D66BD] font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}