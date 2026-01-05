import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      {/* Common dashboard UI (sidebar, navbar, etc.) */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
