import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import TwoFactorGuard from "./components/TwoFactorGuard";
import AppLayout from "./layout/AppLayout";
import TwoFactorAuth from "./pages/2authF/2fauth";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import FormElements from "./pages/Forms/FormElements";
import Dashboard from "./pages/Home/Dashboard";
import Reports from "./pages/Home/Reports";
import Settings from "./pages/managment/settings";
import Staff from "./pages/managment/staff";
import Wallets from "./pages/managment/wallet";
import NotFound from "./pages/OtherPage/NotFound";
import Beneficiaries from "./pages/Payments/Beneficaries";
import Collection from "./pages/Payments/Collection";
import Disbursements from "./pages/Payments/Disbursements";
import Liquidation from "./pages/Payments/Liquidation";
import Marketplace from "./pages/Payments/Marketplace";
import WalletStatement from "./pages/Payments/walletstatment";
import Ipwhitelist from "./pages/System/Ipwhitelist";
import SysLogs from "./pages/System/syslogs";
import SystemCheck from "./pages/System/systemcheck";
import BasicTables from "./pages/Tables/BasicTables";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images"; // Added import for Images
import UserProfiles from "./pages/UserProfiles";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/report" element={<Reports />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/staff" element={<Staff />} />
            <Route path="/system" element={<SystemCheck />} />
            <Route path="/logs" element={<SysLogs />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/settings" element={<TwoFactorGuard><Settings /></TwoFactorGuard>} />
            <Route path="/setup-2fa" element={<TwoFactorAuth />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/wallet-statement" element={<WalletStatement />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/liquidations" element={<Liquidation />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/disbursements" element={<Disbursements />} />
            <Route path="/collections" element={<Collection />} />
            <Route path="/ip-whitelist" element={<Ipwhitelist />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
