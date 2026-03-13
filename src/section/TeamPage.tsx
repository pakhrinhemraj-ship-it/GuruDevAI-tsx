import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Define the shape of a team member
interface TeamMember {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  position: string;
  gender?: string;
  image?: string;
  permanentaddress?: string;
  presentaddress?: string;
  city?: string;
  country?: string;
  pincode?: string;
  dateofbirth?: string;
}

// Define the current user type
interface User {
  email: string;
  role: string;
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );

  // Load members from localStorage
  useEffect(() => {
    const storedMembers: TeamMember[] =
      JSON.parse(localStorage.getItem("teamMembers") || "[]");
    setMembers(storedMembers);
  }, []);

  // Detect URL change and open modal if needed
  useEffect(() => {
    const pathParts = location.pathname.split("/");

    // /team/profile/email
    if (pathParts[2] === "profile" && pathParts[3]) {
      const email = decodeURIComponent(pathParts[3]);
      const found = members.find((m) => m.email === email);
      setSelectedMember(found || null);
    } else {
      setSelectedMember(null);
    }
  }, [location.pathname, members]);

  // Open profile modal + update URL
  const openProfile = (member: TeamMember) => {
    navigate(`/team/profile/${encodeURIComponent(member.email)}`);
  };

  // Close profile modal + reset URL
  const closeProfile = () => {
    navigate("/team");
  };

  return (
    <div className="pt-[82px] h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="lg:w-[240px] xl:w-[240px] 2xl:w-[240px] h-full bg-white shadow">
          {/* Sidebar content */}
        </div>

        {/* Team List */}
        <div className="w-full lg:w-[82%] xl:w-[82%] 2xl:w-[82%] px-4 sm:px-6 md:px-8 overflow-y-auto">
          <div className="sm:pl-8 mt-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="sm:text-[24px] sm:font-bold text-[18px] font-bold">
                Team
              </h2>

              {currentUser?.role === "admin" && (
                <Link to="/team/addteammember">
                  <button className="cursor-pointer h-[42px] w-[110px] font-semibold text-[10px] sm:text-[14px] 2xl:text-[18px] sm:h-[42px] sm:w-[130px] text-[#6E54B5] border border-[#6E54B5] rounded-[10px] hover:bg-purple-50 transition-all duration-300">
                    Invite Admin
                  </button>
                </Link>
              )}
            </div>

            {members.length === 0 ? (
              <p className="text-gray-500">No team members yet.</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center items-center sm:justify-center sm:items-center xl:justify-start 2xl:items-center">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    onClick={() => openProfile(member)}
                    className="shadow p-4 h-[205.26px] w-[145.98px] sm:h-[235.26px] sm:w-[193.98px] md:h-[250.26px] md:w-[233.98px] lg:h-[281.26px] lg:w-[254.98px] xl:h-[281.26px] xl:w-[254.98px] 2xl:h-[281.26px] 2xl:w-[254.98px] rounded-lg shadow cursor-pointer flex flex-col items-center hover:bg-purple-50 bg-white mb-4"
                  >
                    <img
                      src={member.image || "/default-profile.png"}
                      alt="Profile"
                      className="rounded-full h-[65px] w-[65px] sm:h-[80px] sm:w-[80px] md:h-[107px] md:w-[107px] sm:mb-4 mb-3"
                    />
                    <div className="text-center mt-2 space-y-2 mb-2">
                      <h3 className="text-[12px] font-bold sm:text-[14px] 2xl:text-[16px] text-[#202224]">
                        {member.firstname} {member.lastname}
                      </h3>
                      <p className="font-semibold text-[10px] sm:text-[12px] 2xl:text-[14px] text-[#202224]">
                        {member.position}
                      </p>
                      <p className="font-medium text-[10px] sm:text-[12px] 2xl:text-[14px] text-[#202224]">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Overlay */}
          {selectedMember && (
            <div
              className="fixed inset-0 bg-black/40 flex justify-center items-start sm:items-center z-50 overflow-y-auto p-4"
              onClick={closeProfile}
            >
              <div
                className="max-w-[532px] sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[45%] 2xl:w-[35%] bg-white rounded-2xl shadow-2xl
                 p-6 relative mt-20 sm:mt-20 h-full h-[640px] sm:max-h-[953px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMember.image || "/default-profile.png"}
                      alt="Profile"
                      className="rounded-full h-20 w-20 sm:h-24 sm:w-24 object-cover"
                    />
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#202224]">
                        {selectedMember.firstname} {selectedMember.lastname}
                      </h2>
                      <p className="text-sm sm:text-base font-semibold text-[#6E54B5]">
                        • Free Plan
                      </p>
                    </div>
                  </div>

                  {(currentUser?.role === "admin" ||
                    currentUser?.email === selectedMember.email) && (
                    <Link
                      to={`/team/profile//editprofile/${selectedMember.email}`}
                    >
                      <button className="cursor-pointer bg-[#EAE2FF] text-[#6E54B5] px-4 py-2 rounded-lg text-sm hover:bg-purple-100 transition">
                        Edit Profile
                      </button>
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-[#202224]">
                  <p>
                    <strong>Phone:</strong> {selectedMember.phone || "-"}
                  </p>
                  <p>
                    <strong>Position:</strong> {selectedMember.position}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedMember.gender || "-"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedMember.email || "-"}
                  </p>
                  <p>
                    <strong>Permanent Address:</strong>{" "}
                    {selectedMember.permanentaddress || "-"}
                  </p>
                  <p>
                    <strong>Present Address:</strong>{" "}
                    {selectedMember.presentaddress || "-"}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedMember.city || "-"}
                  </p>
                  <p>
                    <strong>Country:</strong> {selectedMember.country || "-"}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {selectedMember.pincode || "-"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {selectedMember.dateofbirth || "-"}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeProfile}
                  className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}