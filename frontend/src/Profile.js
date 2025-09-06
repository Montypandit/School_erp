import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, CreditCard, FileText, Edit2, Save, X } from 'lucide-react';

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState(null); // fetched employee
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get token from session storage
  const token = JSON.parse(sessionStorage.getItem("loginToken"))?.token;

  useEffect(() => {
    if (!token) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `https://school-erp-1-exji.onrender.com/api/employees/me`, // backend /me route
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch employee data");
        const data = await res.json();
        setEmployee(data.employee);
        setEditedEmployee(data.employee);
      } catch (err) {
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [token]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://school-erp-1-exji.onrender.com/api/employees/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedEmployee),
        }
      );
      if (!res.ok) throw new Error("Failed to update employee data");
      const updatedData = await res.json();
      setEmployee(updatedData.employee);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedEmployee(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!employee) return <div className="p-4 text-center">Employee not found</div>;

  const currentEmployee = isEditing ? editedEmployee : employee;

  const InfoField = ({ label, value, field, icon: Icon, type = "text" }) => (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <label className="text-xs sm:text-sm font-medium text-gray-600">{label}</label>
      </div>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={e => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      ) : (
        <div className="text-sm font-medium text-gray-900 break-words min-h-[1.5rem]">{value || "N/A"}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6">
              {/* Profile Image */}
              <div className="relative -mt-16">
                <img
                  src={currentEmployee.profileImage || "https://via.placeholder.com/150"}
                  alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-400 w-6 h-6 rounded-full border-2 border-white"></div>
              </div>

              {/* Info */}
              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{currentEmployee.firstName} {currentEmployee.lastName}</h1>
                <p className="text-lg text-gray-600">{currentEmployee.role}</p>
                <p className="text-sm text-gray-500">Employee ID: {currentEmployee.employeeId}</p>
              </div>

              {/* Buttons */}
              <div className="mt-4 sm:mt-0">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      <Save className="w-4 h-4 inline-block mr-1" /> Save
                    </button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      <X className="w-4 h-4 inline-block mr-1" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Edit2 className="w-4 h-4 inline-block mr-1" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField label="First Name" value={currentEmployee.firstName} field="firstName" icon={User} />
          <InfoField label="Last Name" value={currentEmployee.lastName} field="lastName" icon={User} />
          <InfoField label="Email" value={currentEmployee.email} field="email" icon={Mail} type="email" />
          <InfoField label="Phone" value={currentEmployee.phone} field="phone" icon={Phone} />
          <InfoField label="Gender" value={currentEmployee.gender} field="gender" icon={User} />
          <InfoField label="Date of Birth" value={currentEmployee.dateOfBirth} field="dateOfBirth" icon={Calendar} type="date" />
          <InfoField label="Date of Joining" value={currentEmployee.dateOfJoining} field="dateOfJoining" icon={Calendar} type="date" />
          <InfoField label="Role" value={currentEmployee.role} field="role" icon={Briefcase} />
          <InfoField label="Qualification" value={currentEmployee.qualification} field="qualification" icon={FileText} />
          <InfoField label="Residential Address" value={currentEmployee.residentialAddress} field="residentialAddress" icon={MapPin} />
          <InfoField label="Permanent Address" value={currentEmployee.permanentAddress} field="permanentAddress" icon={MapPin} />
          <InfoField label="Aadhar No" value={currentEmployee.aadharNo} field="aadharNo" icon={CreditCard} />
          <InfoField label="PAN No" value={currentEmployee.panNo} field="panNo" icon={CreditCard} />
          <InfoField label="Passport No" value={currentEmployee.passportNo} field="passportNo" icon={CreditCard} />
          <InfoField label="Salary" value={currentEmployee.salary} field="salary" icon={CreditCard} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
