import React from "react";
import useAuthStore from "../store/AuthStore";
import NavbarAfterLogin from "../section/NavbarAfterLogin";
import NavbarBeforeLogin from "../section/NavbarBeforeLogin";

const Header: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return <>
  {isLoggedIn ? <NavbarAfterLogin /> : <NavbarBeforeLogin />}</>;
};

export default Header;