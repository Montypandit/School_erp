import { Users, CheckCircle, XCircle, GraduationCap, Calendar, FileText, BarChart3 } from "lucide-react"
import TeacherNavbar from "./TeacherNavbar"

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <p className="text-lg font-bold text-gray-900">{value}</p>
    {typeof value === "string" && value.includes("/") && (
      <p className={`text-sm font-medium ${color}`}>{Math.round((+value.split("/")[0] / +value.split("/")[1]) * 100)}%</p>
    )}
  </div>
)

const ActionButton = ({ href, icon, label }) => (
  <a
    href={href}
    className="bg-white p-4 rounded text-center shadow hover:shadow-md transition transform hover:scale-105 flex flex-col items-center min-h-[100px]"
  >
    <div className="text-2xl text-gray-600 mb-2">{icon}</div>
    <div className="text-gray-700 font-medium">{label}</div>
  </a>
)

const TeacherHome = () => {
  const stats = {
    totalStudents: 10,
    totalTeachers: 20,
    presentStudents: 8,
    absentStudents: 2,
    presentTeachers: 18,
  }

  return (
    <div>
    <TeacherNavbar/>
    <div className="min-h-screen bg-gray-50 p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-600" />
        <StatCard title="Present" value={`${stats.presentStudents}/${stats.totalStudents}`} icon={<CheckCircle />} color="text-green-600" />
        <StatCard title="Absent" value={`${stats.absentStudents}/${stats.totalStudents}`} icon={<XCircle />} color="text-red-600" />
        <StatCard title="Teachers Present" value={`${stats.presentTeachers}/${stats.totalTeachers}`} icon={<GraduationCap />} color="text-purple-600" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ActionButton href="/teacher/attendence" icon={<Calendar />} label="Attendance" />
          <ActionButton href="/teacher/result" icon={<BarChart3 />} label="Results" />
          <ActionButton href="/teacher/report" icon={<FileText />} label="Reports" />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Activity</h2>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>✔️ New student enrolled</li>
          <li>🕘 Attendance submitted</li>
          <li>📢 Assignment reminder sent</li>
        </ul>
      </div>
    </div>
    </div>
  )
}

export default TeacherHome;
