import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import About from './About';
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import InquiryForm from "./component/coordinator/InquiryForm";
import CoordinatorHome from './coordinator/CoordinatorHome';
import CoordinatorLogin from "./component/coordinator/CoordinatorLogin";
import EmployeeForm from "./admin/EmployeeForm";
import FeesGeneration from "./coordinator/feesGeneration";
import TeacherLogin from "./teacher/TeacherLogin";
import TeacherHome from "./teacher/TeacherHome";
import FeePaid from './coordinator/FeePaid'
import EnquiryStudent from "./coordinator/enquiryStudent";
import EmployeeLogin from "./admin/EmployeeLogin";
import PrincipalLogin from './principal/PrincipalLogin'
import PrincipalHome from "./component/principal/PrincipalHome";
import PrincipalAdmissionDetail from "./component/principal/PrincipalAdmissionDetail";
import GetAllTeacher from "./teacher/GetAllTeacher";
import GetAllStudent from "./component/Student/GetAllStudent";
import GetTeacher from "./teacher/GetTeacher";
import AdmissionForm from "./component/coordinator/Admission/AdmissionForm"
import AdmissionFees from './component/coordinator/Admission/AdmissionFees'
import Student from './component/coordinator/Student'
import ScheduleForm from "./component/admin/ScheduleForm";
import Attendence from "./admin/Attendence";
import StudentListPage from "./component/coordinator/StudentListPage";
import ExamSchedule from "./admin/ExamSchedule";
import LeaveApproval from "./admin/LeaveApproval";
import WeeklySchedule from "./admin/WeeklySchedule";
import Employee from "./component/admin/Employee"
import AdmissionApproval from "./component/principal/AdmissionApproval"
import StudentStatus from "./component/principal/StudentStatus";

// Coordinator Components
import UpdateStudentInfo from "./component/coordinator/UpdateStudentInfo";
import Allotments from "./component/coordinator/Allotments";
import ActivityPlanner from "./coordinator/ActivityPlanner";
import MonthlyPlanner from "./coordinator/monthlyPlanner";
import TeacherDashboard from "./component/teacher/TeacherDashboard";
import TeacherSchedulePage from "./teacher/TeachingSchedule";
import GetAttendence from "./component/teacher/GetAttendence";
import Results from "./component/teacher/AddResult";
import PTMManagement from "./component/teacher/PTMMangement";
import Homework from "./teacher/HomeWork";
import Report from "./component/teacher/Reports";
import EmployeeProfile from "./component/employee/EmployeeProfile";
import ViewStudentReport from "./component/principal/viewReport";
import MonthlyFeePaid from "./coordinator/MonthlyFeePaid";
import Teacher from "./component/coordinator/Teacher";
import Profile from "./component/teacher/ProfilePage";
import UpdateAdmissionFee from './coordinator/UpdateAdmissionFee';
import Announcement from "./admin/Messages";
import StudentPromotionPage from "./component/principal/StudentPromotionPage";
import Contact from "./Contact";



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path='/' element={<Home />} />
        <Route path="/final/admission/form/:inquiryId/:admissionId" element={<AdmissionForm />} />
        <Route path="/parent/inquiry/form" element={<InquiryForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Admin Module */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/home' element={<AdminHome />} />
        <Route path="/admin/employee/form" element={<EmployeeForm />} />
        <Route path="/admin/employee/status/:email" element={<EmployeeLogin />} />
        <Route path="/admin/allteachers" element={<GetAllTeacher />} />
        <Route path="/admin/allstudents" element={<GetAllStudent />} />
        <Route path="/admin/teacher/:empId" element={<GetTeacher />} />
        <Route path="/admin/examschedule" element={<ExamSchedule />} />
        <Route path="/admin/leaveapproval" element={<LeaveApproval />} />
        <Route path="/admin/weeklyschedule" element={<WeeklySchedule />} />
        <Route path="/admin/attendence" element={<Attendence />} />
        <Route path="/admin/employee/page" element={<Employee />} />
        <Route path="/admin/announcement" element={<Announcement />} />

        {/* Coordinator Module */}
        <Route path="/coordinator/home" element={<CoordinatorHome />} />
        <Route path="/coordinator/login" element={<CoordinatorLogin />} />
        <Route path="/coordinator/fees/generate/:admissionId" element={<FeesGeneration />} />
        <Route path="/coordinator/all/fee/details" element={<FeePaid />} />
        <Route path="/coordinator/enquiry/process/:inquiryId" element={<EnquiryStudent />} />
        <Route path="/coordinator/enquiry" element={<EnquiryStudent />} />
        <Route path="/coordinator/student" element={<Student />} />
        <Route path="/students/page" element={<StudentListPage />} />
        <Route path="/coordinator/update/student/:admissionId" element={<UpdateStudentInfo />} />
        <Route path="/coordinator/allotment" element={<Allotments />} />
        <Route path="/coordinator/activity/planner" element={<ActivityPlanner />} />
        <Route path="/coordinator/monthly/planner" element={<MonthlyPlanner />} />
        <Route path="/coordinator/teacher/page" element={<Teacher />} />
        <Route path="/coordinator/admission/fees/:admissionId" element={<AdmissionFees />} />
        <Route path="/coordinator/monthly-fees/:admissionId" element={<MonthlyFeePaid />} />
        <Route path="/coordinator/update/admission-fees/:admissionId" element={<UpdateAdmissionFee />} />



        {/* Teacher Module */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/home" element={<TeacherDashboard />} />
        <Route path="/teacher/attendence" element={<GetAttendence />} />
        <Route path="/teacher/results" element={<Results />} />
        <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />
        <Route path="/teacher/ptm" element={<PTMManagement />} />
        <Route path="/teacher/schedule/form" element={<ScheduleForm />} />
        <Route path="/teacher/homework" element={<Homework />} />
        <Route path="/teacher/report" element={<Report />} />
        <Route path="/teacher/profile" element={<Profile />} />

        {/* Principal Module */}
        <Route path="/principal/login" element={<PrincipalLogin />} />
        <Route path="/principal/home" element={<PrincipalHome />} />
        <Route path="/principal/admission/detail/:inquiryId" element={<PrincipalAdmissionDetail />} />
        <Route path="/principal/report" element={<ViewStudentReport />} />
        <Route path="/employee/profile/:email" element={<EmployeeProfile />} />
        <Route path="/principal/admission/approvals" element={<AdmissionApproval />} />
        <Route path="/student/status/page" element={<StudentStatus />} />
        <Route path="/student/promotion/page/:admissionId" element={<StudentPromotionPage />} />

      </Routes>
    </Router>
  );
};

export default App;

