// Modified App.jsx - keeps auth functionality but removes timeout UI components
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './components/login/AuthContext';
import RoleBasedRoute from './components/login/RoleBasedRoute';
import RoleRedirect from './components/login/RoleRedirect';
import LoginCard from './components/login/LoginCard';
// Removed ResetVerifyPage import
// Removed SessionTimeoutContainer import

// Import developer components
import DevHomePage from './components/developer/welcome/Welcome';
import DevReferralsPage from './components/developer/referrals/ReferralsPage';
import DevCreateNF from './components/developer/referrals/CreateNF/CreateNF';
import DevPatientsPage from './components/developer/patients/PatientsPage';
import DevPatientInfoPage from './components/developer/patients/Patients/InfoPaciente/PatientInfoPage';
import DevStaffingPage from './components/developer/patients/staffing/StaffingPage';
import DevAccounting from './components/developer/accounting/Accounting';
import DevUserProfile from './components/developer/profile/UserProfile';
import DevSettingsPage from './components/developer/settings/SettingsPage.jsx'; 

// Import administrator components
import AdminHomePage from './components/admin/welcome/Welcome';
import AdminSupportPage from './components/admin/support/SupportPage';
import AdminReferralsPage from './components/admin/referrals/ReferralsPage';
import AdminCreateNF from './components/admin/referrals/CreateNF/CreateNF';
import AdminPatientsPage from './components/admin/patients/PatientsPage';
import AdminPatientInfoPage from './components/admin/patients/Patients/InfoPaciente/PatientInfoPage';
import AdminStaffingPage from './components/admin/patients/staffing/StaffingPage';
import AdminAccounting from './components/admin/accounting/Accounting';
import AdminUserProfile from './components/admin/profile/UserProfile';
import AdminSettingsPage from './components/admin/settings/SettingsPage.jsx'; 

// Import therapist components
import TBHomePage from './components/pt-ot-st/welcome/Welcome';
import TBSupportPage from './components/pt-ot-st/support/SupportPage';
import TBPatientsPage from './components/pt-ot-st/patients/PatientsPage';
import TBPatientInfoPage from './components/pt-ot-st/patients/Patients/InfoPaciente/PatientInfoPage';
import TBUserProfile from './components/pt-ot-st/profile/UserProfile';
import TBReferralsPage from './components/pt-ot-st/referrals/ReferralsPage';
import TBSettingsPage from './components/pt-ot-st/settings/SettingsPage.jsx'; 

// Import new support modal components for Developer role
import FloatingSupportButton from './components/developer/support/FloatingSupportButton';

// Import styles
import './styles/Login/Login.scss';
import './styles/Login/AuthLoadingModal.scss';
import './styles/Login/PremiumLoadingModal.scss'; 
// Removed ResetPassword.scss import
// Removed SessionTimeout.scss import

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Define roles
const THERAPY_ROLES = ['PT', 'OT', 'ST', 'PTA', 'COTA', 'STA'];
const ADMIN_ROLES = ['Administrator', 'Developer'];
const ALL_ROLES = [...THERAPY_ROLES, ...ADMIN_ROLES, 'Supportive', 'Support', 'Agency'];

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginCard />} />

          {/* Main authenticated layout */}
          <Route element={<Outlet />}>
            <Route path="/home" element={<RoleRedirect />} />

            {/* Developer-specific routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Developer']} />}>
              <Route path="/developer/homePage" element={<><DevHomePage /><FloatingSupportButton /></>} />
              <Route path="/developer/referrals" element={<><DevReferralsPage /><FloatingSupportButton /></>} />
              <Route path="/developer/createNewReferral" element={<><DevCreateNF /><FloatingSupportButton /></>} />
              <Route path="/developer/patients" element={<><DevPatientsPage /><FloatingSupportButton /></>} />
              <Route path="/developer/paciente/:patientId" element={<><DevPatientInfoPage /><FloatingSupportButton /></>} />
              <Route path="/developer/staffing" element={<><DevStaffingPage /><FloatingSupportButton /></>} />
              <Route path="/developer/accounting" element={<><DevAccounting /><FloatingSupportButton /></>} />
              <Route path="/developer/profile" element={<><DevUserProfile /><FloatingSupportButton /></>} />
              <Route path="/developer/settings" element={<><DevSettingsPage /><FloatingSupportButton /></>} />
            </Route>

            {/* Administrator-specific routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Administrator']} />}>
              <Route path="/administrator/homePage" element={<AdminHomePage />} />
              <Route path="/administrator/referrals" element={<AdminReferralsPage />} />
              <Route path="/administrator/createNewReferral" element={<AdminCreateNF />} />
              <Route path="/administrator/patients" element={<AdminPatientsPage />} />
              <Route path="/administrator/paciente/:patientId" element={<AdminPatientInfoPage />} />
              <Route path="/administrator/staffing" element={<AdminStaffingPage />} />
              <Route path="/administrator/accounting" element={<AdminAccounting />} />
              <Route path="/administrator/profile" element={<AdminUserProfile />} />
              <Route path="/administrator/settings" element={<AdminSettingsPage />} />
              <Route path="/administrator/support" element={<AdminSupportPage />} />
            </Route>

            {/* Support and therapy roles */}
            <Route element={<RoleBasedRoute allowedRoles={[...THERAPY_ROLES, 'Administrator']} />}>
              <Route path="/support" element={<RoleRedirect />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={THERAPY_ROLES} />}>
              <Route path="/pt/support" element={<TBSupportPage />} />
              <Route path="/ot/support" element={<TBSupportPage />} />
              <Route path="/st/support" element={<TBSupportPage />} />
              <Route path="/pta/support" element={<TBSupportPage />} />
              <Route path="/cota/support" element={<TBSupportPage />} />
              <Route path="/sta/support" element={<TBSupportPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={ALL_ROLES} />}>
              <Route path="/settings" element={<RoleRedirect />} />
              <Route path="/accounting" element={<RoleRedirect />} />
              <Route path="/referrals" element={<RoleRedirect />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={ADMIN_ROLES} />}>
              <Route path="/createNewReferral" element={<RoleRedirect />} />
              <Route path="/staffing" element={<RoleRedirect />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['PT', 'PT - Administrator']} />}>
              <Route path="/pt/homePage" element={<TBHomePage />} />
              <Route path="/pt/patients" element={<TBPatientsPage />} />
              <Route path="/pt/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/pt/profile" element={<TBUserProfile />} />
              <Route path="/pt/referrals" element={<TBReferralsPage />} />
              <Route path="/pt/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['OT', 'OT - Administrator']} />}>
              <Route path="/ot/homePage" element={<TBHomePage />} />
              <Route path="/ot/patients" element={<TBPatientsPage />} />
              <Route path="/ot/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/ot/profile" element={<TBUserProfile />} />
              <Route path="/ot/referrals" element={<TBReferralsPage />} />
              <Route path="/ot/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['ST', 'ST - Administrator']} />}>
              <Route path="/st/homePage" element={<TBHomePage />} />
              <Route path="/st/patients" element={<TBPatientsPage />} />
              <Route path="/st/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/st/profile" element={<TBUserProfile />} />
              <Route path="/st/referrals" element={<TBReferralsPage />} />
              <Route path="/st/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['PTA']} />}>
              <Route path="/pta/homePage" element={<TBHomePage />} />
              <Route path="/pta/patients" element={<TBPatientsPage />} />
              <Route path="/pta/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/pta/profile" element={<TBUserProfile />} />
              <Route path="/pta/referrals" element={<TBReferralsPage />} />
              <Route path="/pta/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['COTA']} />}>
              <Route path="/cota/homePage" element={<TBHomePage />} />
              <Route path="/cota/patients" element={<TBPatientsPage />} />
              <Route path="/cota/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/cota/profile" element={<TBUserProfile />} />
              <Route path="/cota/referrals" element={<TBReferralsPage />} />
              <Route path="/cota/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['STA']} />}>
              <Route path="/sta/homePage" element={<TBHomePage />} />
              <Route path="/sta/patients" element={<TBPatientsPage />} />
              <Route path="/sta/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/sta/profile" element={<TBUserProfile />} />
              <Route path="/sta/referrals" element={<TBReferralsPage />} />
              <Route path="/sta/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['Supportive', 'Support']} />}>
              <Route path="/supportive/homePage" element={<TBHomePage />} />
              <Route path="/supportive/patients" element={<TBPatientsPage />} />
              <Route path="/supportive/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/supportive/profile" element={<TBUserProfile />} />
              <Route path="/supportive/referrals" element={<TBReferralsPage />} />
              <Route path="/supportive/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['Agency']} />}>
              <Route path="/agency/homePage" element={<TBHomePage />} />
              <Route path="/agency/patients" element={<TBPatientsPage />} />
              <Route path="/agency/paciente/:patientId" element={<TBPatientInfoPage />} />
              <Route path="/agency/profile" element={<TBUserProfile />} />
              <Route path="/agency/referrals" element={<TBReferralsPage />} />
              <Route path="/agency/settings" element={<TBSettingsPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={ALL_ROLES} />}>
              <Route path="/patients" element={<RoleRedirect />} />
              <Route path="/paciente/:patientId" element={<RoleRedirect />} />
              <Route path="/profile" element={<RoleRedirect />} />
            </Route>

            <Route path="/homePage" element={<RoleRedirect />} />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;