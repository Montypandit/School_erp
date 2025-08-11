import React, { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    Download,
    Filter,
    Search,
    Users,
    BookOpen,
    MapPin
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export default function ExamSchedule() {
    const [exams, setExams] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchExams = async () => {
        try {
            const token = sessionStorage.getItem("adminToken");
            console.log("Token:", token);

            if (!token) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }

            const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/exams/get/all/exams", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Response status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to fetch exams");
            }

            const data = await res.json();
            console.log("Exams:", data);
            setExams(data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch exams:", err);
            setError(err.message || "Something went wrong while fetching exams.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const filteredExams = exams.filter((exam) => {
        const matchesSearch =
            exam.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSemester =
            selectedSemester === "all" || exam.semester === selectedSemester;

        const matchesType = selectedType === "all" || exam.type === selectedType;

        return matchesSearch && matchesSemester && matchesType;
    });

    const handleExport = () => {
        console.log("Exporting exam schedule...");
        // Add export logic if needed
    };

    return (
        <div>
        <AdminNavbar/>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-blue-600 text-white p-4 shadow">
                    <h1 className="text-xl font-bold">Welcome</h1>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Exam Schedule
                        </h2>
                        <p className="text-gray-600">
                            Manage and view examination schedules for all departments
                        </p>
                    </div>

                    {loading && (
                        <p className="text-center text-gray-500">Loading exams...</p>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {!loading && !error && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <StatCard label="Total Exams" value={exams.length} Icon={Calendar} />
                                <StatCard
                                    label="Total Students"
                                    value={exams.reduce((sum, exam) => sum + (exam.students || 0), 0)}
                                    Icon={Users}
                                />
                                <StatCard label="Departments" value="1" Icon={BookOpen} footer="Computer Science" />
                                <StatCard label="Exam Halls" value="6" Icon={MapPin} footer="Available venues" />
                            </div>

                            {/* Filters */}
                            <div className="bg-white p-6 rounded shadow mb-8">
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                    <Filter className="h-5 w-5" /> Filters & Search
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="col-span-2 relative">
                                        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by subject, code, or instructor..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 py-2 border rounded w-full"
                                        />
                                    </div>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="border rounded py-2 px-3"
                                    >
                                        <option value="all">All Classes</option>
                                        {["nursery", "lkg", "ukg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((cls) => (
                                            <option key={cls} value={cls}>
                                                {cls.toUpperCase()} Class
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="border rounded py-2 px-3"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Theory">Theory</option>
                                        <option value="Practical">Practical</option>
                                    </select>
                                    <button
                                        onClick={handleExport}
                                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-700"
                                    >
                                        <Download className="h-4 w-4 mr-2" /> Export
                                    </button>
                                </div>
                            </div>

                            {/* Exam Table */}
                            <div className="bg-white rounded shadow p-6">
                                <h3 className="text-lg font-semibold mb-2">Examination Schedule</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Showing {filteredExams.length} of {exams.length} scheduled exams
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="text-left p-2">Subject</th>
                                                <th className="text-left p-2">Date</th>
                                                <th className="text-left p-2">Time</th>
                                                <th className="text-left p-2">Duration</th>
                                                <th className="text-left p-2">Room</th>
                                                <th className="text-left p-2">Class</th>
                                                <th className="text-left p-2">Instructor</th>
                                                <th className="text-left p-2">Students</th>
                                                <th className="text-left p-2">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredExams.map((exam) => (
                                                <tr key={exam._id} className="border-b">
                                                    <td className="p-2 font-medium">{exam.subject}</td>

                                                    {/* ✅ Date column (formatted only date) */}
                                                    <td className="p-2 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        {new Date(exam.date).toLocaleDateString()}
                                                    </td>

                                                    {/* ✅ Time column (use direct time field) */}
                                                    <td className="p-2 flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        {exam.time}
                                                    </td>

                                                    <td className="p-2">{exam.duration}</td>
                                                    <td className="p-2 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        {exam.room}
                                                    </td>
                                                    <td className="p-2">
                                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{exam.class}</span>
                                                    </td>
                                                    <td className="p-2">{exam.instructor}</td>
                                                    <td className="p-2 flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        {exam.students}
                                                    </td>
                                                    <td className="p-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-sm ${exam.type === "Theory"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-purple-100 text-purple-800"
                                                                }`}
                                                        >
                                                            {exam.type}
                                                        </span>
                                                    </td>
                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredExams.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">
                                                No exams found matching your criteria.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

function StatCard({ label, value, Icon, footer }) {
    return (
        <div className="bg-white p-4 shadow rounded">
            <div className="flex justify-between">
                <p className="text-sm font-medium">{label}</p>
                <Icon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{value}</div>
            <p className="text-xs text-gray-500">{footer || ""}</p>
        </div>
    );
}
