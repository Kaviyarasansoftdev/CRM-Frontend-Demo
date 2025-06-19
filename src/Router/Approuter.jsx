import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Main } from "../core/Main/Main";
import SigninPage from "../components/SignIn/SigninPage";
import { Dashboardpage } from "../components/DashboardPage/Dashboardpage";
import LeadsandWipPage from "../components/LeadsandWipPage/LeadsandWipPage";
import Userpage from "../components/UsersPage/Userpage";
import { TeamPage } from "../components/TeamPage/TeamPage";
import UnallocationPage from "../components/UnallocationPage/UnallocationPage";
import ProtectedRoute from "../shared/services/token/ProtectedRoute";
import { TelecallerleadsPage } from "../components/TelecallerleadsPage/TelecallerleadsPage";
import { ProductivityPage } from "../components/ProductivityPage/ProductivityPage";
import AllocationPage from "../components/AllocationPage/AllocationPage";
import SettingsPage from "../components/Settings/SettingsPage";
import DocCenterPage from "../components/DocCenterPage/DocCenterPage";
import DocumentsPage from "../components/DocumentsPage/DocumentsPage";
import OutlookPage from "../components/OutlookPage/OutlookPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route element={<Main />}>
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader","Telecaller"]}> <Dashboardpage /> </ProtectedRoute>} />
          <Route path="/productivity" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}> <ProductivityPage /></ProtectedRoute>}/>
          <Route path="/users" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}> <Userpage /></ProtectedRoute>} />
          <Route path="/unallocation" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}><UnallocationPage /></ProtectedRoute>} />
          <Route path="/allocation" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}><AllocationPage /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}><TeamPage /></ProtectedRoute>} />
          <Route path="/telecallerleads" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader","Telecaller"]}><TelecallerleadsPage /></ProtectedRoute>} />
          <Route path="/doc-center" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}><DocCenterPage /></ProtectedRoute>} />
          <Route path="/documents/:id" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader"]}><DocumentsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}><SettingsPage /></ProtectedRoute>} />
          <Route path="/outlook" element={<ProtectedRoute allowedRoles={["SuperAdmin","TeamLeader","Telecaller"]}> <OutlookPage /> </ProtectedRoute>} />
          {/* <Route path="/myaccount" element={<ProtectedRoute><MyaccountPage /></ProtectedRoute>} /> */}
          {/* <Route path="/leadsandwip" element={ <ProtectedRoute> <LeadsandWipPage /> </ProtectedRoute>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
