import type { JSX } from "react";
import logo from "../assets/logo.png";
import icon1 from "../assets/p7.png";
import icon2 from "../assets/p8.png";

export default function NavbarBeforeLogin(): JSX.Element {
  return (
    <div>
    <div className="pl-[37px] lg:pl-[23px] flex justify-between fixed w-full h-[82px]
     bg-[#FFFFFF] shadow  z-50">

        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="h-[40.5px] w-[150.86px] pl-[30px] sm:h-[52.5px] sm:w-[184.86px] lg:h-[52.5px] lg:w-[184.86px] mt-5 sm:mt-4 lg:mt-4 lg:pl-[23px]"
        />

        {/* Right Icons */}
        <div>
          <ul className="flex gap-[25px] sm:gap-[33px] font-medium w-full mt-6 pr-[24px] sm:pr-[28px] text-[16px] items-center">
            
            <img
              src={icon1}
              alt="icon1"
              className="h-[33.33px] w-[33.33px]"
            />

            <img
              src={icon2}
              alt="icon2"
              className="h-[33.33px] w-[33.33px]"
            />

          </ul>
        </div>

      </div>
    </div>
  );
}