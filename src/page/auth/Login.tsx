import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";// Make sure path is correct
import useAuthStore from "../../store/AuthStore";
import GenericInput from "./GenericFormPage";

// Type for users stored in localStorage
interface StoredUser {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Type for logged-in user object
interface LoggedUser {
  name: string;
  email: string;
  role: string;
}

// Form type
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage1() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Redirect if already logged in
  if (isLoggedIn) return <Navigate to="/team" replace />;

  // GenericInput change handler
  const handleChange = (name: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password");
      toast.error("Login Failed!");
      return;
    }

    const loggedUser: LoggedUser = {
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role || "user",
    };

    // Save login state in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

    // Update Zustand store
    login(loggedUser);

    // Remember Me logic
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    toast.success("Login Success!");
    navigate("/team");
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-[#CACACA] px-4">
        <img
          src="src/assets/p2.png"
          alt=""
          className="hidden lg:block h-[220px] w-[230px] absolute right-0 bottom-0"
        />

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md mt-10">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Login to Account
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Please enter your email and password
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <GenericInput<LoginForm>
              label="Email"
              name="email"
              type="email"
              value={form.email}
              placeholder="example@gmail.com"
              onChange={handleChange}
            />

            {/* Password */}
            <div className="mb-4 relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm opacity-70">Password</span>
                <span className="text-xs opacity-70 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-[#DFEAF2] rounded-md focus:ring-2 focus:ring-purple-500 pr-10"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[33px] cursor-pointer"
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 cursor-pointer"
              />
              <label className="text-sm opacity-70">Remember Password</label>
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full cursor-pointer h-[2.5rem] bg-[#6E54B5] text-white rounded-md hover:bg-[#5b45a0]"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            <span className="opacity-70">Don’t have an account?</span>{" "}
            <Link
              to="/register"
              className="text-[#6E54B5] font-bold underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}