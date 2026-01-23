import { Route, Switch, Redirect } from "wouter";
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
import AppsViewPage from "./pages/Dashboard/Appsviewpage";
import Dashboard from "./pages/Home/Dashboard";
import Reports from "./pages/Home/Reports";
import AppSettings from "./pages/Dashboard/AppSettings";
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
import Images from "./pages/UiElements/Images";
import UserProfiles from "./pages/UserProfiles";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sonner";


function AppRoutes() {
  return (
    <Switch>
      {/* Root redirect to Dashboard */}
      <Route path="/">
        <Redirect to="/applications" />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth/sign-in" component={SignIn} />
      <Route path="/auth/sign-up" component={SignUp} />

      {/* Compatibility Routes */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      {/* Protected Routes */}
      <Route path="*">
        <ProtectedRoute>
          <Switch>
            {/* Standalone Protected Pages (No Sidebar) */}
            <Route path="/applications" component={AppsViewPage} />
            <Route path="/setup-2fa" component={TwoFactorAuth} />

            {/* Main Application with Layout */}
            <Route path="*">
              <AppLayout>
                <Switch>
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/settings">
                    <TwoFactorGuard>
                      <Settings />
                    </TwoFactorGuard>
                  </Route>
                  <Route path="/report" component={Reports} />
                  <Route path="/appsettings" component={AppSettings} />

                  <Route path="/profile" component={UserProfiles} />
                  <Route path="/calendar" component={Calendar} />
                  <Route path="/blank" component={Blank} />

                  <Route path="/form-elements" component={FormElements} />
                  <Route path="/basic-tables" component={BasicTables} />

                  <Route path="/staff" component={Staff} />
                  <Route path="/system" component={SystemCheck} />
                  <Route path="/logs" component={SysLogs} />
                  <Route path="/buttons" component={Buttons} />
                  <Route path="/images" component={Images} />

                  <Route path="/wallets" component={Wallets} />
                  <Route path="/wallet-statement" component={WalletStatement} />
                  <Route path="/beneficiaries" component={Beneficiaries} />
                  <Route path="/liquidations" component={Liquidation} />
                  <Route path="/marketplace" component={Marketplace} />
                  <Route path="/disbursements" component={Disbursements} />
                  <Route path="/collections" component={Collection} />
                  <Route path="/ip-whitelist" component={Ipwhitelist} />

                  <Route path="/line-chart" component={LineChart} />
                  <Route path="/bar-chart" component={BarChart} />

                  {/* Root redirect to Dashboard */}
                  <Route path="/" component={Dashboard} />

                  {/* Fallback */}
                  <Route component={NotFound} />
                </Switch>
              </AppLayout>
            </Route>
          </Switch>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}
