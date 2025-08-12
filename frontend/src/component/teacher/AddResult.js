import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Plus,
  Eye,
  FileText,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ExamResultPage() {
  const [admissionId, setAdmissionId] = useState("");
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completeResult, setCompleteResult] = useState(null);
  const [viewingResult, setViewingResult] = useState(false);
  const [resultIdToUpdate, setResultIdToUpdate] = useState(null);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [showAddResultFor, setShowAddResultFor] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [empId, setEmpId] = useState("");
  const [currTeacherClasses, setCurrTeacherClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const navigate = useNavigate();

  // Predefined foundational skill subjects
  const predefinedSubjects = [
    { id: "eng-skill", name: "English Skill", code: "ENGSK" },
    { id: "num-skill", name: "Number Skill", code: "NUMSK" },
    { id: "hin-skill", name: "Hindi Skill", code: "HINSK" },
    { id: "evs-gk-fm-skill", name: "EVS/GK/Fine Motor Skill", code: "EVSGKFM" },
    { id: "gross-motor-skill", name: "Gross Motor Skill", code: "GMSK" },
    { id: "self-learning-skill", name: "Self Learning Skill", code: "SLSK" },
    { id: "social-skill", name: "Social Skill", code: "SOCSK" },
  ];

  // Fetch employee ID
  const fetchEmpId = useCallback(async () => {
    const startData = sessionStorage.getItem("teacherToken");
    const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
    const email = sessionStorage.getItem("email");
    if (!token || !email) {
      toast.info("Please login to continue");
      navigate("/");
      return null;
    }
    try {
      const res = await fetch(
        `https://school-erp-11-mr7k.onrender.com/api/employees/get/employee/email/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch empId");
      const data = await res.json();
      setEmpId(data.empId);
      return data.empId;
    } catch (err) {
      toast.error("Failed to fetch employee ID");
      return null;
    }
  }, [navigate]);

  // Fetch teacher's assigned classes
  const fetchCurrTeacherClasses = useCallback(
    async (empIdParam) => {
      const startData = sessionStorage.getItem("teacherToken");
      const token = startData ? JSON.parse(startData).token : null;

      if (!token || !empIdParam) {
        toast.info("Please login to continue");
        navigate("/");
        return [];
      }
      try {
        const res = await fetch(
          `https://school-erp-11-mr7k.onrender.com/api/teaching/schedule/get/teaching/schedule/${empIdParam}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch teacher classes");
        const data = await res.json();
        setCurrTeacherClasses(data);
        return data;
      } catch (err) {
        toast.error("Failed to fetch teacher classes");
        return [];
      }
    },
    [navigate]
  );

  // Fetch all students
  const fetchAllStudents = useCallback(async () => {
    const startData = sessionStorage.getItem("teacherToken");
    const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
    if (!token) {
      toast.info("Please login to continue");
      navigate("/");
      return [];
    }
    try {
      const res = await fetch(
        "https://school-erp-11-mr7k.onrender.com/api/final/admission/get/all/admissions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setAllStudents(data.data);
      return data.data;
    } catch (error) {
      toast.error("Failed to fetch students. Please try again later");
      return [];
    }
  }, [navigate]);

  // Filter students assigned to this teacher
  const filterTeacherStudents = useCallback(() => {
    if (!currTeacherClasses.length || !allStudents.length) {
      setTeacherStudents([]);
      return;
    }
    const filtered = allStudents.filter((stu) =>
      currTeacherClasses.some(
        (cls) => stu.class === cls.class && stu.section === cls.section
      )
    );
    setTeacherStudents(filtered);
  }, [currTeacherClasses, allStudents]);

  // Initial data fetch
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setError("");
      const id = await fetchEmpId();
      if (!id) {
        setLoading(false);
        return;
      }
      const classes = await fetchCurrTeacherClasses(id);
      await fetchAllStudents();
      setLoading(false);
    };
    initialize();
    // eslint-disable-next-line
  }, []);

  // Filter students whenever teacher classes or all students change
  useEffect(() => {
    filterTeacherStudents();
  }, [currTeacherClasses, allStudents, filterTeacherStudents]);

  // Set predefined subjects on mount
  useEffect(() => {
    setSubjects(predefinedSubjects);
  }, []);

  const [newSubject, setNewSubject] = useState({ name: "" });
  const [newResult, setNewResult] = useState({
    subjectId: "",
    grade: "",
    examDate: "",
    examType: "",
  });

  const searchStudent = async () => {
    if (!admissionId.trim()) return;
    setLoading(true);
    setError("");
    setCompleteResult(null);

    try {
      const found = teacherStudents.find(
        (stu) => stu.admissionId === admissionId.trim()
      );
      if (!found) {
        setError("Student not found.");
        setStudent(null);
        setShowAddResultFor(null);
      } else {
        setStudent(found);
        setShowAddResultFor(found.admissionId);
        setSubjects(predefinedSubjects);
        setResults([]);
        setCompleteResult(null);
      }
    } catch (err) {
      setError("Something went wrong while fetching student data.");
      setStudent(null);
      setShowAddResultFor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareResult = (stu) => {
    setStudent(stu);
    setAdmissionId(stu.admissionId);
    setShowAddResultFor(stu.admissionId);
    setSubjects(predefinedSubjects);
    setResults([]);
    setCompleteResult(null);
  };

  const addSubject = () => {
    if (!newSubject.name) return;
    const id = Date.now().toString();
    setSubjects([...subjects, { id, name: newSubject.name }]);
    setNewSubject({ name: "" });
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setResults(results.filter((r) => r.subjectId !== id));
  };

  const addResult = () => {
    const { subjectId, grade, examDate, examType } = newResult;
    if (!subjectId || !grade || !examDate || !examType) return;

    const subject = subjects.find((s) => s.id === subjectId);
    const id = Date.now().toString();
    setResults([
      ...results,
      {
        id,
        subjectId,
        subjectName: subject.name,
        grade,
        examDate,
        examType,
      },
    ]);

    setNewResult({
      subjectId: "",
      grade: "",
      examDate: "",
      examType: "",
    });
  };

  const removeResult = (id) => {
    setResults(results.filter((r) => r.id !== id));
  };

  const handleViewResult = async () => {
    if (!student) {
      setError("Please search for a student first.");
      return;
    }

    setViewingResult(true);
    try {
      // API call would go here
      setCompleteResult(null);
    } catch (err) {
      setError("Something went wrong while fetching results.");
      setCompleteResult(null);
    } finally {
      setViewingResult(false);
    }
  };

  const handleSubmitResult = async () => {
    if (!student || !results.length) {
      setError("Missing student data or results.");
      return;
    }

    setSubmitLoading(true);
    try {
      // API call would go here
      setSubjects(predefinedSubjects);
      setResults([]);
      setError("");
    } catch (err) {
      setError("Something went wrong while submitting results.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Exam Result Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage and track student examination results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">
                Your Students
              </h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400 animate-spin" />
                  <span className="text-gray-600">Loading students...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : teacherStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No students found in your schedule.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Admission ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Class
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Section
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherStudents.map((stu) => (
                      <tr
                        key={stu.admissionId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-900">{stu.name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {stu.admissionId}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{stu.class}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {stu.section}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                            onClick={() => handleDeclareResult(stu)}
                          >
                            Declare Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Student Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">
                Search Student
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Admission ID"
                  value={admissionId}
                  onChange={(e) => setAdmissionId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={searchStudent}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Student Details */}
        {student && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Student Details
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Student Name
                  </p>
                  <p className="text-lg text-gray-900">{student.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Father's Name
                  </p>
                  <p className="text-lg text-gray-900">{student.fatherName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Class</p>
                  <p className="text-lg text-gray-900">{student.class}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Section</p>
                  <p className="text-lg text-gray-900">{student.section}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Roll Number
                  </p>
                  <p className="text-lg text-gray-900">{student.rollNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Admission ID
                  </p>
                  <p className="text-lg text-gray-900">{student.admissionId}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complete Result Display */}
        {completeResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">
                  Complete Result Summary
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Student Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {completeResult.student?.name || student?.name}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Total Marks
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {completeResult.totalObtained || 0}/
                      {completeResult.totalMaximum || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      Percentage
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {completeResult.overallPercentage || 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Grade</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeBadgeColor(
                        completeResult.overallGrade
                      )}`}
                    >
                      {completeResult.overallGrade || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {completeResult.subjectSummaries &&
              completeResult.subjectSummaries.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subject-wise Performance
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Subject
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Mid Term
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Final Exam
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Total
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Percentage
                          </th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {completeResult.subjectSummaries.map((sub, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {sub.subjectName}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {sub.midTermMarks || 0}/{sub.midTermTotal || 0}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {sub.finalMarks || 0}/{sub.finalTotal || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-gray-900">
                              {sub.totalObtained || 0}/{sub.totalMaximum || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-gray-900">
                              {sub.percentage || 0}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getGradeBadgeColor(
                                  sub.grade
                                )}`}
                              >
                                {sub.grade || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No subject results found for this student.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subject and Result Management */}
        {student && showAddResultFor === student.admissionId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Subject Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Manage Subjects
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter subject name"
                      value={newSubject.name}
                      onChange={(e) =>
                        setNewSubject({ name: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={addSubject}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {subjects.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Available Subjects
                      </h3>
                      <div className="space-y-1">
                        {subjects.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {s.name}
                              </p>
                              {s.code && (
                                <p className="text-sm text-gray-500">
                                  {s.code}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeSubject(s.id)}
                              className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Result Entry */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add Exam Result
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={newResult.subjectId}
                      onChange={(e) =>
                        setNewResult({ ...newResult, subjectId: e.target.value })
                      }
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={newResult.grade}
                      onChange={(e) =>
                        setNewResult({ ...newResult, grade: e.target.value })
                      }
                    >
                      <option value="">Select Grade</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={newResult.examType}
                      onChange={(e) =>
                        setNewResult({ ...newResult, examType: e.target.value })
                      }
                    >
                      <option value="">Select Exam Type</option>
                      <option value="Monthly Test">Monthly Test</option>
                      <option value="Mid Term">Mid Term</option>
                      <option value="Final Exam">Final Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={newResult.examDate}
                        onChange={(e) =>
                          setNewResult({
                            ...newResult,
                            examDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      onClick={addResult}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Result</span>
                    </button>

                    <button
                      onClick={handleSubmitResult}
                      disabled={!results.length || submitLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {submitLoading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Submit All Results ({results.length})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleViewResult}
                      disabled={viewingResult}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {viewingResult ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>View Result</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Results Preview */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Results to Submit
                  </h2>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {results.length} {results.length === 1 ? "Result" : "Results"}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Subject
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Grade
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Exam Type
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {result.subjectName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getGradeBadgeColor(
                              result.grade
                            )}`}
                          >
                            {result.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {result.examType}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {new Date(result.examDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => removeResult(result.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                            title="Remove result"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}