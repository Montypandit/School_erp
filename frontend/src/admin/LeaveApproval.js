import { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  User,
  Calendar,
  FileText,
  UserCheck,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function LeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/leaves/get/all/leaves", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch leave requests");
      const data = await res.json();

      // Convert date strings to Date objects
      const formatted = data.map((r) => ({
        ...r,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
        submittedAt: new Date(r.submittedAt),
      }));

      setLeaveRequests(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("adminToken");

      const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/leaves/update/leave/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");
      fetchLeaves(); // refresh list
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filtered = leaveRequests.filter(
    (r) => filter === "all" || r.status === filter
  );

  const counts = {
    total: leaveRequests.length,
    pending: leaveRequests.filter((r) => r.status === "pending").length,
    approved: leaveRequests.filter((r) => r.status === "approved").length,
    rejected: leaveRequests.filter((r) => r.status === "rejected").length,
  };

  const getBadge = (status) => {
    const base = "text-xs px-2 py-1 rounded font-semibold inline-flex items-center";
    switch (status) {
      case "pending":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800`}>
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      case "approved":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>
            <Check className="h-3 w-3 mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} bg-red-100 text-red-800`}>
            <X className="h-3 w-3 mr-1" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      sick: "bg-blue-100 text-blue-800",
      personal: "bg-purple-100 text-purple-800",
      family: "bg-orange-100 text-orange-800",
      medical: "bg-green-100 text-green-800",
    };
    const style = styles[type] || "bg-gray-100 text-gray-800";
    return (
      <span className={`text-xs px-2 py-1 rounded border ${style}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Leave
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <Link to="/admin/home">
        <h1 className="text-xl font-bold">School ERP</h1>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
       

             Leave Approval Dashboard
             
          </h2>
          <p className="text-gray-600"> 
            Manage student leave requests submitted across all classes.
          </p>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total Requests" value={counts.total} Icon={FileText} />
              <StatCard label="Pending" value={counts.pending} Icon={Clock} />
              <StatCard label="Approved" value={counts.approved} Icon={Check} />
              <StatCard label="Rejected" value={counts.rejected} Icon={X} />
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5" /> Filter Requests
              </h3>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "approved", "rejected"].map((key) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1 rounded border text-sm capitalize ${
                      filter === key
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {key} ({counts[key] ?? 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Leave Requests List */}
            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 p-8 bg-white rounded shadow">
                <FileText className="mx-auto h-8 w-8 mb-2" />
                No leave requests found.
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map((req) => (
                  <div key={req._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                          <User className="h-4 w-4" />
                          {req.studentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {req.studentId} • Submitted:{" "}
                          {format(req.submittedAt, "PPP")}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {getTypeBadge(req.leaveType)}
                        {getBadge(req.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        From: {format(req.startDate, "PPP")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        To: {format(req.endDate, "PPP")}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-800 font-medium mb-1">
                        Reason for Leave:
                      </p>
                      <p className="bg-gray-50 border p-3 rounded text-gray-700">
                        {req.reason}
                      </p>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex gap-2 pt-2 border-t mt-4">
                        <button
                          onClick={() => updateRequestStatus(req._id, "approved")}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req._id, "rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, Icon }) {
  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold mt-2 text-gray-900">{value}</div>
    </div>
  );
}
