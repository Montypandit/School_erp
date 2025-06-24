import React, { useState, useEffect } from "react"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Info,
  Calendar,
  ClipboardList,
  Save,
  Loader2,
  Building,
  Eye,
  DollarSign,
  CheckCircle2,
  FileText,
  BookOpen,
  CheckSquare,
} from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"

export default function EnquiryStudent() {
  const [student, setStudent] = useState(null)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate();
  const {inquiryId} = useParams();

  // Utility function to get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Utility function to format date
  const formatDate = (dateString) => {
    const today = new Date();
  return today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  }

  // Utility function to validate student data
  const validateStudentData = (studentData) => {
    if (!studentData) return false
    return !!(studentData.name && studentData.fatherName && studentData.fatherPhoneNo)
  }

  // InfoItem component defined inline
  const InfoItem = ({ icon, label, value, isLink, linkType }) => {
    const renderValue = () => {
      if (React.isValidElement(value)) {
        return value
      }

      if (isLink && typeof value === "string" && value) {
        const href = linkType === "email" ? `mailto:${value}` : `tel:${value.replace(/\D/g, "")}`
        return (
          <a href={href} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
            {value}
          </a>
        )
      }

      return <span className="text-gray-900 font-medium">{value || "Not provided"}</span>
    }

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="text-blue-600 mt-0.5 flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <div className="text-sm">{renderValue()}</div>
        </div>
      </div>
    )
  }

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = sessionStorage.getItem('coordinatorToken');
        if(!token){
          toast.info('Please login to continue');
          navigate('coordinator/login');
          return;
        }

        const res = await fetch(`http://localhost:5000/api/inquiry/get/inquiry/${inquiryId}`,{
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if(!res.ok){
          console.error('Error fetching inquiry:', res.status, res.statusText);
          toast.error('Failed to fetch inquiry details.');
          throw new Error('Failed to fetch inquiry details');
        }
        const data =await res.json();

        setStudent({
          ...data,
          // Initialize process fields
          schoolInfo: false,
          schoolVisit: false,
          aboutFees: false,
          educationPolicy: false,
          prospectus: false,
          formProceeded: false,
        })
        setRemarks("Initial enquiry received.")
        setError(null)
      } catch (err) {
        console.error("Error fetching student data:", err)
        setError("Failed to load student data")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [inquiryId, navigate])

  const handleCheckboxChange = (name, checked) => {
    if (!student) return
    setStudent((prev) => (prev ? { ...prev, [name]: checked } : null))
  }

  const handleSave = async () => {
    if (!student) return

    // Basic validation
    if (!validateStudentData(student)) {
      toast.info("Student data is incomplete (missing Name, Father's Name, or Phone).")
      return
    }

    setSaving(true)
    try {
      const processData = {
        inquiryId: student.inquiryId,
        remarks,
        schoolInfo: !!student.schoolInfo,
        schoolVisit: !!student.schoolVisit,
        aboutFees: !!student.aboutFees,
        educationPolicy: !!student.educationPolicy,
        prospectus: !!student.prospectus,
        formProceeded: !!student.formProceeded,
      }

      console.log("Saving data:", processData)

      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.info('Please login to continue');
        navigate('coordinator/login');
        return;
      }
      const response = await fetch('http://localhost:5000/api/inquiry-process/create/inquiry-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to save enquiry process');
      }

      toast.success("Enquiry processed successfully!")
      navigate('/coordinator/home')
    } catch (error) {
      console.error("Error processing enquiry:", error)
      toast.error("Error processing enquiry: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading student data...</h3>
              <p className="text-gray-600">Please wait while we fetch the information</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // No student data
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-800">No student data found for inquiry ID: {inquiryId}</p>
          </div>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enquiry</h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Enquiry ID: {inquiryId}
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div>{formatDate()}</div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}
            >
              {student.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <User className="h-5 w-5 mr-3 text-blue-600" />
                  Student Information
                </h2>
              </div>
              <div className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <InfoItem icon={<User className="h-4 w-4" />} label="Student Name" value={student.name} />
                    <InfoItem icon={<User className="h-4 w-4" />} label="Parent/Guardian" value={student.fatherName} />
                    <InfoItem
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Class Applied"
                      value={student.currentClass}
                    />
                    <InfoItem icon={<Info className="h-4 w-4" />} label="DOB" value={new Date(student.dob).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} />
                  </div>
                  <div className="space-y-1">
                    <InfoItem
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={student.fatherEmail}
                      isLink={true}
                      linkType="email"
                    />
                    <InfoItem
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={student.fatherPhoneNo}
                      isLink={true}
                      linkType="phone"
                    />
                    <InfoItem icon={<MapPin className="h-4 w-4" />} label="Gender" value={student.gender} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coordinator Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 h-fit">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <ClipboardList className="h-5 w-5 mr-3 text-blue-600" />
                  Coordinator Actions
                </h2>
              </div>
              <div className="p-6 pt-4 space-y-6">
                {/* Action Items */}
                <div className="space-y-4">
                  {[
                    {
                      key: "schoolInfo",
                      icon: <Building className="h-5 w-5" />,
                      title: "School Information Provided",
                      description: "Shared school brochure and details.",
                      checked: student.schoolInfo,
                      required: true,
                    },
                    {
                      key: "schoolVisit",
                      icon: <Eye className="h-5 w-5" />,
                      title: "School Visit Scheduled",
                      description: "A campus tour has been scheduled.",
                      checked: student.schoolVisit,
                      required: true,
                    },
                    {
                      key: "aboutFees",
                      icon: <DollarSign className="h-5 w-5" />,
                      title: "Fee Structure Discussed",
                      description: "Shared fee details and payment plans.",
                      checked: student.aboutFees,
                      required: true,
                    },
                    {
                      key: "educationPolicy",
                      icon: <BookOpen className="h-5 w-5" />,
                      title: "Education Policy Explained",
                      description: "Discussed the school's education policy.",
                      checked: student.educationPolicy,
                      required: true,
                    },
                    {
                      key: "prospectus",
                      icon: <FileText className="h-5 w-5" />,
                      title: "Prospectus Given",
                      description: "Provided a copy of the school prospectus.",
                      checked: student.prospectus,
                      required: false,
                    },
                    {
                      key: "formProceeded",
                      icon: <CheckSquare className="h-5 w-5" />,
                      title: "Forward for Admission",
                      description: "Proceed with the admission form.",
                      checked: student.formProceeded,
                      required: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                        item.checked
                          ? "border-blue-200 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                      }`}
                      onClick={() => handleCheckboxChange(item.key, !item.checked)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={!!item.checked}
                            onChange={(e) => handleCheckboxChange(item.key, e.target.checked)}
                            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div
                              className={`${
                                item.checked ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                              } transition-colors`}
                            >
                              {item.icon}
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm">{item.title}{item.required && <span className="text-red-500">*</span>}</h4>
                            {item.checked && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remarks */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any additional remarks here..."
                    rows={4}
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
