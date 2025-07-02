// import { useState } from "react";
import { useState } from "react";
import {
  Search,
  Trash2,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Plus,
  Eye,
} from "lucide-react";
import {toast}  from "react-toastify";

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


  const [newSubject, setNewSubject] = useState({ name: "", code: "" });
  const [newResult, setNewResult] = useState({
    subjectId: "",
    obtainedMarks: "",
    totalMarks: "",
    examDate: "",
    examType: "",
  });

  const searchStudent = async () => {
    if (!admissionId.trim()) return;
    setLoading(true);
    setError("");
    setCompleteResult(null); // Clear previous results

    try {
      const token = sessionStorage.getItem("teacherToken");
      if (!token) {
        setError("You must be logged in to perform this action.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/final/admission/get/student/${admissionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data?.data) {
        setStudent(data.data);
        setSubjects([]);
        setResults([]);
      } else {
        setError("Student not found.");
        setStudent(null);
      }
    } catch (err) {
      setError("Something went wrong while fetching student data.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    if (!newSubject.name || !newSubject.code) return;
    const id = Date.now().toString();
    setSubjects([...subjects, { id, ...newSubject }]);
    setNewSubject({ name: "", code: "" });
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setResults(results.filter((r) => r.subjectId !== id));
  };

  const addResult = () => {
    const { subjectId, obtainedMarks, totalMarks, examDate, examType } = newResult;
    if (!subjectId || !obtainedMarks || !totalMarks || !examDate || !examType) return;

    const subject = subjects.find((s) => s.id === subjectId);
    const id = Date.now().toString();
    setResults([
      ...results,
      {
        id,
        subjectId,
        subjectName: subject.name,
        obtainedMarks: +obtainedMarks,
        totalMarks: +totalMarks,
        examDate,
        examType,
      },
    ]);

    setNewResult({
      subjectId: "",
      obtainedMarks: "",
      totalMarks: "",
      examDate: "",
      examType: "",
    });
  };

  const removeResult = (id) => {
    setResults(results.filter((r) => r.id !== id));
  };

  const handleViewResult = async () => {
    if (!student) {
      toast.error("Please search for a student first.");
      return;
    }

    const token = sessionStorage.getItem("teacherToken");
    if (!token) {
      toast.error("You must be logged in to view results.");
      return;
    }

    setViewingResult(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/results/view/result/${student.admissionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
  console.log("Complete result data:", data); // Debug log
  setCompleteResult(data);

  // ⬇️ SET resultIdToUpdate from fetched result
  setResultIdToUpdate(data?._id || null);

  // Optional: Pre-fill subjects & results if you want to allow updating
  const preSubjects = [];
  const preResults = [];

  data?.exams?.forEach((exam) => {
    exam.subjects.forEach((subject, index) => {
      const id = `${exam.examType}-${index}`;
      preSubjects.push({
        id,
        name: subject.subjectName,
        code: subject.subjectCode,
      });
      preResults.push({
        id,
        subjectId: id,
        subjectName: subject.subjectName,
        obtainedMarks: subject.obtainedMarks,
        totalMarks: subject.totalMarks,
        examDate: exam.examDate,
        examType: exam.examType,
      });
    });
  });

  setSubjects(preSubjects);
  setResults(preResults);

  toast.success("Results fetched successfully!");
} else {
  toast.error(data.message || "Failed to fetch results.");
  setCompleteResult(null);
}
    } catch (err) {
      console.error("Error fetching results:", err);
      toast.error("Something went wrong while fetching results.");
      setCompleteResult(null);
    }
  };

  const handleSubmitResult = async () => {
    const token = sessionStorage.getItem("teacherToken");

    if (!student || !results.length || !token) {
     toast.error("Missing data or token.");
      return;
    }

    const payload = {
      student: {
        name: student.name,
        admissionId: student.admissionId,
        class: student.class,
        section: student.section,
      },
      exams: groupResultsByExam(),
    };

    try {
      const res = await fetch(
        "http://localhost:5000/api/teacher/results/create/result",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Result submitted successfully!");
        setSubjects([]);
        setResults([]);
      } else {
       toast.error(data.message || "Failed to submit result.");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      toast.error("Something went wrong.");
    }
  };

  const groupResultsByExam = () => {
    const exams = {};
    results.forEach((result) => {
      if (!exams[result.examType]) {
        exams[result.examType] = {
          examType: result.examType,
          examDate: result.examDate,
          subjects: [],
        };
      }
      exams[result.examType].subjects.push({
        subjectName: result.subjectName,
        subjectCode:
          subjects.find((s) => s.id === result.subjectId)?.code || "",
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks,
      });
    });

    return Object.values(exams);
  };


const UpdateResult = async () => {
  const token = sessionStorage.getItem("teacherToken");

  if (!student || !results.length || !token || !resultIdToUpdate) {
    toast.error("Missing student, result data, or token.");
    return;
  }

  const payload = {
    student: {
      name: student.name,
      admissionId: student.admissionId,
      class: student.class,
      section: student.section,
    },
    exams: groupResultsByExam(),
  };

  try {
    const res = await fetch(
      `http://localhost:5000/api/teacher/results/update/result/${resultIdToUpdate}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (res.ok) {
      toast.success("Result updated successfully!");
      setSubjects([]);
      setResults([]);
    } else {
      toast.error(data.message || "Failed to update result.");
    }
  } catch (err) {
    console.error("Error updating result:", err);
    toast.error("Something went wrong during update.");
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Exam Result Management</h1>

      {/* Student Search */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Search Student</h2>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Admission ID"
            value={admissionId}
            onChange={(e) => setAdmissionId(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={searchStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Student Info */}
      {student && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Student Details</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Father:</strong> {student.fatherName}
            </p>
            <p>
              <strong>Class:</strong> {student.class}
            </p>
            <p>
              <strong>Section:</strong> {student.section}
            </p>
            <p>
              <strong>Roll:</strong> {student.rollNumber}
            </p>
            <p>
              <strong>Admission ID:</strong> {student.admissionId}
            </p>
          </div>
        </div>
      )}

      {/* View Complete Result Section */}
      {completeResult && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" />
            <h2 className="text-2xl font-semibold">Complete Result Summary</h2>
          </div>
          
          {/* Student Summary */}
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <p><strong>Name:</strong> {completeResult.student?.name || student?.name}</p>
              <p><strong>Total Marks:</strong> {completeResult.totalObtained || 0}/{completeResult.totalMaximum || 0}</p>
              <p><strong>Percentage:</strong> {completeResult.overallPercentage || 0}%</p>
              <p><strong>Grade:</strong> {completeResult.overallGrade || 'N/A'}</p>
            </div>
          </div>

          {/* Subject-wise Results */}
          {completeResult.subjectSummaries && completeResult.subjectSummaries.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Subject-wise Breakdown:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border border-gray-300 text-left">Subject</th>
                      <th className="p-3 border border-gray-300 text-center">Mid Term</th>
                      <th className="p-3 border border-gray-300 text-center">Final Exam</th>
                      <th className="p-3 border border-gray-300 text-center">Total</th>
                      <th className="p-3 border border-gray-300 text-center">Percentage</th>
                      <th className="p-3 border border-gray-300 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completeResult.subjectSummaries.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-300">{sub.subjectName}</td>
                        <td className="p-3 border border-gray-300 text-center">
                          {sub.midTermMarks || 0}/{sub.midTermTotal || 0}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {sub.finalMarks || 0}/{sub.finalTotal || 0}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {sub.totalObtained || 0}/{sub.totalMaximum || 0}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {sub.percentage || 0}%
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            sub.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            sub.grade === 'A' ? 'bg-green-100 text-green-700' :
                            sub.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                            sub.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sub.grade || 'N/A'}
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
              <p>No subject results found for this student.</p>
            </div>
          )}


        </div>
      )}

      {/* Subject & Result Section */}
      {student && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Add Subject */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Add Subjects</h2>
            </div>
            <input
              className="border p-2 mb-2 w-full rounded"
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
            />
            <input
              className="border p-2 mb-2 w-full rounded"
              placeholder="Subject Code"
              value={newSubject.code}
              onChange={(e) =>
                setNewSubject({ ...newSubject, code: e.target.value })
              }
            />
            <button
              onClick={addSubject}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              <Plus className="inline w-4 h-4 mr-1" /> Add Subject
            </button>
            {subjects.length > 0 && (
              <ul className="mt-4 space-y-2">
                {subjects.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>
                      {s.name} ({s.code})
                    </span>
                    <button
                      onClick={() => removeSubject(s.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Result */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Add Exam Result</h2>
            </div>
            <select
              className="border p-2 mb-2 w-full rounded"
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
            <input
              type="number"
              placeholder="Obtained Marks"
              className="border p-2 mb-2 w-full rounded"
              value={newResult.obtainedMarks}
              onChange={(e) =>
                setNewResult({ ...newResult, obtainedMarks: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Total Marks"
              className="border p-2 mb-2 w-full rounded"
              value={newResult.totalMarks}
              onChange={(e) =>
                setNewResult({ ...newResult, totalMarks: e.target.value })
              }
            />
            <select
              className="border p-2 mb-2 w-full rounded"
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
            <div className="relative mb-2">
              <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="date"
                className="border pl-10 p-2 w-full rounded"
                value={newResult.examDate}
                onChange={(e) =>
                  setNewResult({ ...newResult, examDate: e.target.value })
                }
              />
            </div>
            <button
              onClick={addResult}
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full mb-2"
            >
              <Plus className="inline w-4 h-4 mr-1" /> Add Result
            </button>

            <button
              onClick={handleSubmitResult}
              className="bg-blue-700 text-white px-4 py-2 rounded w-full mb-2"
              disabled={!results.length}
            >
              Submit All Results ({results.length})
            </button>

            <button
              onClick={handleViewResult}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              disabled={viewingResult}
            >
              <Eye className="inline w-4 h-4 mr-1" />
              {viewingResult ? "Loading..." : "View Result"}
            </button>

          <button
  onClick={UpdateResult}
  className="bg-green-600 text-white px-4 py-2 rounded w-full"
  disabled={viewingResult}
>
  <Eye className="inline w-4 h-4 mr-1" />
  {viewingResult ? "Loading..." : "Update Result"}
</button>



          </div>
        </div>
      )}

      {/* Current Results Being Added */}
      {results.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Current Results to Submit:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300 text-left">Subject</th>
                  <th className="p-2 border border-gray-300 text-center">Marks</th>
                  <th className="p-2 border border-gray-300 text-center">Exam Type</th>
                  <th className="p-2 border border-gray-300 text-center">Date</th>
                  <th className="p-2 border border-gray-300 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="p-2 border border-gray-300">{result.subjectName}</td>
                    <td className="p-2 border border-gray-300 text-center">
                      {result.obtainedMarks}/{result.totalMarks}
                    </td>
                    <td className="p-2 border border-gray-300 text-center">{result.examType}</td>
                    <td className="p-2 border border-gray-300 text-center">{result.examDate}</td>
                    <td className="p-2 border border-gray-300 text-center">
                      <button
                        onClick={() => removeResult(result.id)}
                        className="text-red-600 hover:text-red-800"
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
      )}
    </div>
  );
}




// import {
//   Search,
//   Trash2,
//   BookOpen,
//   User,
//   GraduationCap,
//   Calendar,
//   Plus,
// } from "lucide-react";

// export default function ExamResultPage() {
//   const [admissionId, setAdmissionId] = useState("");
//   const [student, setStudent] = useState(null);
//   const [subjects, setSubjects] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [completeResult, setCompleteResult] = useState(null);


//   const [newSubject, setNewSubject] = useState({ name: "", code: "" });
//   const [newResult, setNewResult] = useState({
//     subjectId: "",
//     obtainedMarks: "",
//     totalMarks: "",
//     examDate: "",
//     examType: "",
//   });

//   const searchStudent = async () => {
//     if (!admissionId.trim()) return;
//     setLoading(true);
//     setError("");

//     try {
//       const token = sessionStorage.getItem("teacherToken");
//       if (!token) {
//         setError("You must be logged in to perform this action.");
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:5000/api/final/admission/get/student/${admissionId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (res.ok && data?.data) {
//         setStudent(data.data);
//         setSubjects([]);
//         setResults([]);
//       } else {
//         setError("Student not found.");
//         setStudent(null);
//       }
//     } catch (err) {
//       setError("Something went wrong while fetching student data.");
//       setStudent(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addSubject = () => {
//     if (!newSubject.name || !newSubject.code) return;
//     const id = Date.now().toString();
//     setSubjects([...subjects, { id, ...newSubject }]);
//     setNewSubject({ name: "", code: "" });
//   };

//   const removeSubject = (id) => {
//     setSubjects(subjects.filter((s) => s.id !== id));
//     setResults(results.filter((r) => r.subjectId !== id));
//   };

//   const addResult = () => {
//     const { subjectId, obtainedMarks, totalMarks, examDate, examType } = newResult;
//     if (!subjectId || !obtainedMarks || !totalMarks || !examDate || !examType) return;

//     const subject = subjects.find((s) => s.id === subjectId);
//     const id = Date.now().toString();
//     setResults([
//       ...results,
//       {
//         id,
//         subjectId,
//         subjectName: subject.name,
//         obtainedMarks: +obtainedMarks,
//         totalMarks: +totalMarks,
//         examDate,
//         examType,
//       },
//     ]);

//     setNewResult({
//       subjectId: "",
//       obtainedMarks: "",
//       totalMarks: "",
//       examDate: "",
//       examType: "",
//     });
//   };

//   const removeResult = (id) => {
//     setResults(results.filter((r) => r.id !== id));
//   };

//   const handleViewResult = async () => {
//   if (!student) {
//     alert("Please search for a student first.");
//     return;
//   }

//   const token = sessionStorage.getItem("teacherToken");
//   if (!token) {
//     alert("You must be logged in to view results.");
//     return;
//   }

//   try {
//     const res = await fetch(
//       `http://localhost:5000/api/teacher/results/view/result/${student.admissionId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       alert("Results fetched successfully!");
//       console.log(data);
//       setCompleteResult(data); // store the result in state to display in the UI
//     } else {
//       alert(data.message || "Failed to fetch results.");
//     }
//   } catch (err) {
//     console.error("Error fetching results:", err);
//     alert("Something went wrong while fetching results.");
//   }
// };

//   const handleSubmitResult = async () => {
//     const token = sessionStorage.getItem("teacherToken");

//     if (!student || !results.length || !token) {
//       alert("Missing data or token.");
//       return;
//     }

//     const payload = {
//       student: {
//         name: student.name,
//         admissionId: student.admissionId,
//         class: student.class,
//         section: student.section,
//       },
//       exams: groupResultsByExam(),
//     };

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/teacher/results/create/result",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();
//       if (res.ok) {
//         alert("Result submitted successfully!");
//         setSubjects([]);
//         setResults([]);
//       } else {
//         alert(data.message || "Failed to submit result.");
//       }
//     } catch (err) {
//       console.error("Error submitting:", err);
//       alert("Something went wrong.");
//     }
//   };

  

//   const groupResultsByExam = () => {
//     const exams = {};
//     results.forEach((result) => {
//       if (!exams[result.examType]) {
//         exams[result.examType] = {
//           examType: result.examType,
//           examDate: result.examDate,
//           subjects: [],
//         };
//       }
//       exams[result.examType].subjects.push({
//         subjectName: result.subjectName,
//         subjectCode:
//           subjects.find((s) => s.id === result.subjectId)?.code || "",
//         obtainedMarks: result.obtainedMarks,
//         totalMarks: result.totalMarks,
//       });
//     });

//     return Object.values(exams);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Exam Result Management</h1>

//       {/* Student Search */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <div className="flex items-center gap-2 mb-2">
//           <Search className="w-5 h-5" />
//           <h2 className="text-xl font-semibold">Search Student</h2>
//         </div>
//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Enter Admission ID"
//             value={admissionId}
//             onChange={(e) => setAdmissionId(e.target.value)}
//             className="flex-1 border p-2 rounded"
//           />
//           <button
//             onClick={searchStudent}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Loading..." : "Search"}
//           </button>
//         </div>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>

//       {/* Student Info */}
//       {student && (
//         <div className="bg-white p-4 rounded shadow mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <User className="w-5 h-5" />
//             <h2 className="text-xl font-semibold">Student Details</h2>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             <p>
//               <strong>Name:</strong> {student.name}
//             </p>
//             <p>
//               <strong>Father:</strong> {student.fatherName}
//             </p>
//             <p>
//               <strong>Class:</strong> {student.class}
//             </p>
//             <p>
//               <strong>Section:</strong> {student.section}
//             </p>
//             <p>
//               <strong>Roll:</strong> {student.rollNumber}
//             </p>
//             <p>
//               <strong>Admission ID:</strong> {student.admissionId}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Subject & Result Section */}
//       {student && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Add Subject */}
//           <div className="bg-white p-4 rounded shadow">
//             <div className="flex items-center gap-2 mb-4">
//               <BookOpen className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">Add Subjects</h2>
//             </div>
//             <input
//               className="border p-2 mb-2 w-full rounded"
//               placeholder="Subject Name"
//               value={newSubject.name}
//               onChange={(e) =>
//                 setNewSubject({ ...newSubject, name: e.target.value })
//               }
//             />
//             <input
//               className="border p-2 mb-2 w-full rounded"
//               placeholder="Subject Code"
//               value={newSubject.code}
//               onChange={(e) =>
//                 setNewSubject({ ...newSubject, code: e.target.value })
//               }
//             />
//             <button
//               onClick={addSubject}
//               className="bg-green-600 text-white px-4 py-2 rounded w-full"
//             >
//               <Plus className="inline w-4 h-4 mr-1" /> Add Subject
//             </button>
//             {subjects.length > 0 && (
//               <ul className="mt-4 space-y-2">
//                 {subjects.map((s) => (
//                   <li
//                     key={s.id}
//                     className="flex justify-between items-center border p-2 rounded"
//                   >
//                     <span>
//                       {s.name} ({s.code})
//                     </span>
//                     <button
//                       onClick={() => removeSubject(s.id)}
//                       className="text-red-600"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* View Result */}
// {completeResult?.subjectSummaries?.length > 0 && (
//   <div className="bg-white p-4 rounded shadow mt-6">
//     <h2 className="text-2xl font-semibold mb-4">Complete Result Summary</h2>
//     <p><strong>Name:</strong> {completeResult.student?.name}</p>
//     <p><strong>Total Marks:</strong> {completeResult.totalObtained}/{completeResult.totalMaximum}</p>
//     <p><strong>Percentage:</strong> {completeResult.overallPercentage}%</p>
//     <p><strong>Grade:</strong> {completeResult.overallGrade}</p>

//     <h3 className="text-lg mt-4 mb-2 font-medium">Subject-wise Breakdown:</h3>
//     <table className="w-full table-auto border">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="p-2 border">Subject</th>
//           <th className="p-2 border">Mid Term</th>
//           <th className="p-2 border">Final Exam</th>
//           <th className="p-2 border">Total</th>
//           <th className="p-2 border">Percentage</th>
//           <th className="p-2 border">Grade</th>
//         </tr>
//       </thead>
//       <tbody>
//         {completeResult.subjectSummaries.map((sub, idx) => (
//           <tr key={idx}>
//             <td className="p-2 border">{sub.subjectName}</td>
//             <td className="p-2 border">{sub.midTermMarks}/{sub.midTermTotal}</td>
//             <td className="p-2 border">{sub.finalMarks}/{sub.finalTotal}</td>
//             <td className="p-2 border">{sub.totalObtained}/{sub.totalMaximum}</td>
//             <td className="p-2 border">{sub.percentage}%</td>
//             <td className="p-2 border">{sub.grade}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}



//           {/* Add Result */}
//           <div className="bg-white p-4 rounded shadow">
//             <div className="flex items-center gap-2 mb-4">
//               <GraduationCap className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">Add Exam Result</h2>
//             </div>
//             <select
//               className="border p-2 mb-2 w-full rounded"
//               value={newResult.subjectId}
//               onChange={(e) =>
//                 setNewResult({ ...newResult, subjectId: e.target.value })
//               }
//             >
//               <option value="">Select Subject</option>
//               {subjects.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="number"
//               placeholder="Obtained Marks"
//               className="border p-2 mb-2 w-full rounded"
//               value={newResult.obtainedMarks}
//               onChange={(e) =>
//                 setNewResult({ ...newResult, obtainedMarks: e.target.value })
//               }
//             />
//             <input
//               type="number"
//               placeholder="Total Marks"
//               className="border p-2 mb-2 w-full rounded"
//               value={newResult.totalMarks}
//               onChange={(e) =>
//                 setNewResult({ ...newResult, totalMarks: e.target.value })
//               }
//             />
//             <select
//               className="border p-2 mb-2 w-full rounded"
//               value={newResult.examType}
//               onChange={(e) =>
//                 setNewResult({ ...newResult, examType: e.target.value })
//               }
//             >
//               <option value="">Select Exam Type</option>
//               <option value="Monthly Test">Monthly Test</option>
//               <option value="Mid Term">Mid Term</option>
//               <option value="Final Exam">Final Exam</option>
//             </select>
//             <div className="relative mb-2">
//               <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//               <input
//                 type="date"
//                 className="border pl-10 p-2 w-full rounded"
//                 value={newResult.examDate}
//                 onChange={(e) =>
//                   setNewResult({ ...newResult, examDate: e.target.value })
//                 }
//               />
//             </div>
//             <button
//               onClick={addResult}
//               className="bg-indigo-600 text-white px-4 py-2 rounded w-full mb-2"
//             >
//               <Plus className="inline w-4 h-4 mr-1" /> Add Result
//             </button>

//             <button
//               onClick={handleSubmitResult}
//               className="bg-blue-700 text-white px-4 py-2 rounded w-full"
//             >
//               <Plus className="inline w-4 h-4 mr-1" /> Submit All Results
//             </button>

//             <button
//               onClick={handleViewResult}
//               className="bg-green-600 text-white px-4 py-2 rounded w-full"
//             >
//               View Result
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // view complete results of current student because if teacher add marks then they view result current time

