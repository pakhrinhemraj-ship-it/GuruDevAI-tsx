import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import iconStudent from "../assets/p10.png";
import iconInbox from "../assets/p11.png";
import iconAnalytics from "../assets/p12.png";
import iconDropdown from "../assets/p4.png";
import iconSupport from "../assets/p13.png";
import iconSettings from "../assets/p6.png";
import iconLogout from "../assets/p5.png";
import iconCourses from "../assets/p9.png";
import useAuthStore from "../store/AuthStore";


export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [isOpen, setIsOpen] = useState<boolean>(false); // Mobile sidebar
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    logout();
    window.location.href = "/login";
  };

  if (!isLoggedIn) return null;

  return (
<>
      {/* ☰ Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 text-3xl cursor-pointer "
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40  lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`shadow
        fixed top-0 left-0 h-full bg-[#F9F9F9] border-[F9F9F9F9]
        w-[50%] sm:w-[35%] md:w-[35%] lg:w-[240px] xl:w-[240px]
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Menu */}
        <ul className="mt-28 pl-4 sm:pl-6 md:pl-8 space-y-5">
          {/* Courses */}
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600  hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconCourses} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Courses
            </span>
          </li>

          {/* Students */}
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600  hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconStudent} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Students
            </span>
          </li>

          {/* Inbox */}
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600 hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconInbox} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Inbox
            </span>
          </li>

          {/* Analytics */}
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600 hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconAnalytics} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Analytics
            </span>
          </li>

          {/* Dropdown */}
          <li className="flex gap-4 cursor-pointer hover:text-purple-600 hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconDropdown} alt="" className="h-5 w-5 mt-1" />

            <div className="relative w-full" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex justify-between w-full font-semibold text-sm md:text-base cursor-pointer"
              >
                Our Team 
                <span
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={18} />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  dropdownOpen ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <ul className="pl-2 space-y-2 text-sm">
                  <Link to="/team">
                    <li className="hover:text-purple-600 hover:bg-gray-200 rounded-md duration-300 px-3 py-2">
                      Team
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </li>

          {/* Support */}
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600 hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconSupport} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Support
            </span>
          </li>
        </ul>

        {/* Footer */}
        <div className="absolute bottom-0 w-full shadow border-t-[#F9F9F9] py-4 pl-4 sm:pl-6 md:pl-8 space-y-4">
          <li className="flex items-center gap-4 cursor-pointer hover:text-purple-600  hover:bg-gray-100 rounded-md duration-300 px-3 py-2">
            <img src={iconSettings} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Settings
            </span>
          </li>

          <li
            className="flex items-center gap-4 cursor-pointer hover:text-purple-600  hover:bg-gray-100 rounded-md duration-300 px-3 py-2"
            onClick={handleLogout}
          >
            <img src={iconLogout} alt="" className="h-5 w-5" />
            <span className="font-semibold text-sm md:text-base">
              Logout
            </span>
          </li>
        </div>
      </div>
    </>
  );
}