import { Routes, Route} from "react-router-dom";
import Login from "../page/auth/Login";
import Register from "../page/auth/Register";
import TeamPage from "../section/TeamPage";
import Layout from "../section/Layout";
import ProtectedRoute from "../store/ProtectedRoute";
import type { JSX } from "react";
import AddTeamMember from "../section/AddTeamMember";
import EditTeamMember from "../section/EditTeamMember";
import OnlyTeamMemberEdit from "../section/OnlyTeamMemberEdit";

export default function AppRoutes(): JSX.Element {
  return (

    <Routes>
      {/* Wrap everything in single Layout */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/team/*" element={<TeamPage />} />
          <Route path="/team/addteammember" element={<AddTeamMember />} />            
          <Route path="/team/profile/editprofile/:email" element={<EditTeamMember/>} />
          <Route path="/team/profile/editprofile/:email" element={<OnlyTeamMemberEdit/>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
}