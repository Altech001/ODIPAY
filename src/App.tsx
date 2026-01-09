import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Dashboard from "./pages/Home/Dashboard";
import Staff from "./pages/managment/staff";
import Settings from "./pages/managment/settings";
import TwoFactorAuth from "./pages/2authF/2fauth";
import TwoFactorGuard from "./components/TwoFactorGuard";
import Wallets from "./pages/managment/wallet";
import WalletStatement from "./pages/Payments/walletstatment";
import Beneficiaries from "./pages/Payments/Beneficaries";
import Reports from "./pages/Home/Reports";
import Liquidation from "./pages/Payments/Liquidation";
import Marketplace from "./pages/Payments/Marketplace";
import Disbursements from "./pages/Payments/Disbursements";
import Collection from "./pages/Payments/Collection";
import Images from "./pages/UiElements/Images"; // Added import for Images

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
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
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
