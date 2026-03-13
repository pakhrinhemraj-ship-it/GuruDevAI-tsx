import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function NavbarBeforeLogin() {
  type NavItem = {
    title: string;
    path: string;
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { title: "Home", path: "/" },
    { title: "Features", path: "/about" },
    { title: "Pricing", path: "/contact" },
  ];

  return (
    <> 
      <div className="h-[60px] bg-[#E0E1EB] fixed w-full z-50">
        <div className="flex justify-between items-center p-1 pl-[22px] space-x-[80px] pr-3 sm:pr-[30px]">

          {/* Logo + Desktop Menu */}
          <div className="flex space-x-10 items-center">
            <img
              src={logo}
              alt="my logo"
              className="h-[40.5px] mt-1 w-[165px] sm:h-[52.5px] sm:w-[185px]"
            />

            {/* Desktop menu */}
            <ul className="hidden md:flex space-x-6 items-center text-center">
              {navItems.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.path}
                    className="text-[16px] font-semibold hover:text-blue-600"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">

            {/* Desktop login button */}
           <Link to = "/login"> <button className="hidden md:block bg-[#7D66BD] text-white h-[40px] w-[116px] rounded-[10px] cursor-pointer">
             Login
            </button></Link>

            {/* Mobile hamburger */}
            <div className="md:hidden" onClick={()=> setIsOpen(!isOpen)}>
            {isOpen ? (
              <p className="text-[30px] cursor-pointer">✕</p>
            ):(
              <p className="text-[30px] cursor-pointer">☰</p>
            )
          }
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Menu */}
       {isOpen && (
          <div className="md:hidden bg-[#E0E1EB] shadow-md h-[200px] mt-[-7px]">
            <ul className="flex flex-col items-center gap-4 py-4">
              {navItems.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.path}
                    className="text-[16px] font-semibold hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}

              <Link to = "/login"><button className="cursor-pointer bg-[#7D66BD] text-white h-[40px] w-[116px] rounded-[10px]">
                Login
              </button></Link>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default NavbarBeforeLogin;