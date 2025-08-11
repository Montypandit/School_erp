import React, { useEffect, useState } from "react";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("teacherToken");
        const response = await fetch("https://school-erp-11-mr7k.onrender.com/api/employees/get/teacher/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!teacher) {
    return <div className="text-center mt-10 text-red-500">Profile not found</div>;
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-gray-100 font-sans">
      <div className="bg-white rounded-lg p-8 shadow-md text-center">
        <div className="w-28 h-28 rounded-full bg-blue-500 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
          {getInitials(teacher.name)}
        </div>
        <h1 className="text-2xl text-gray-800 font-semibold mb-1">{teacher.name}</h1>
        <p className="text-gray-500 text-sm mb-5">{teacher.role}</p>

        <div className="text-left space-y-3">
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Emp ID:</span>
            <span>{teacher.empId}</span>
          </div>
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Email:</span>
            <span>{teacher.email}</span>
          </div>
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Phone:</span>
            <span>{teacher.phone}</span>
          </div>
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Gender:</span>
            <span>{teacher.gender}</span>
          </div>
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Subject:</span>
            <span>{teacher.subject}</span>
          </div>
          <div className="flex border-b pb-2">
            <span className="font-semibold w-28 text-gray-600">Qualification:</span>
            <span>{teacher.qualification}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-28 text-gray-600">Experience:</span>
            <span>{teacher.experience} years</span>
          </div>
        </div>

        <button
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          onClick={() => alert("Update Profile coming soon...")}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default TeacherProfile;
