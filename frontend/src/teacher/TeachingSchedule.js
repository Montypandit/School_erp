import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Filter, User, Book, MapPin, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import TeacherNavbar from '../component/teacher/TeacherNavbar';

/**
 * TeacherSchedulePage Component
 *
 * Displays the teaching schedule for the logged-in teacher.
 * It fetches the teacher's personal information and their assigned class schedules.
 * Provides UI for filtering schedules by day and searching by various fields.
 * Shows a summary of total classes and subjects.
 *
 * @component
 */
const TeacherSchedulePage = () => {
    /** @type {[Array<Object>, function(Array<Object>): void]} State for storing the list of schedule objects. */
    const [schedules, setSchedules] = useState([]);
    /** @type {[boolean, function(boolean): void]} State to manage the loading indicator. */
    const [loading, setLoading] = useState(true);
    /** @type {[string|null, function(string|null): void]} State to store any fetching errors. */
    const [error, setError] = useState(null);
    /** @type {[string, function(string): void]} State for the selected day filter. Defaults to 'All'. */
    const [selectedDay, setSelectedDay] = useState('All');
    /** @type {[string, function(string): void]} State for the search input value. */
    const [searchTerm, setSearchTerm] = useState('');
    /** @type {[string, function(string): void]} State for the teacher's employee ID. */
    const [id, setId] = useState('');
    /** @type {[Object, function(Object): void]} State for storing the teacher's personal information. */
    const [teacherInfo, setTeacherInfo] = useState({
        empId:'',
        empName:'',
        imageUrl:'',
        phoneNumber:'',
        email:'',
    });

    /**
     * Effect hook to fetch the logged-in teacher's data on component mount.
     * It retrieves the token and email from session storage to make the API call.
     * On success, it populates the teacherInfo and id states.
     */
    useEffect(() => {
        const fetchTeacherData = async () => {
            const token = sessionStorage.getItem('teacherToken');
            if (!token) {
                toast.error('Authentication token not found. Please log in.');
                window.location.href = '/';
                return;
            }

            try {
                const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/employees/get/employee/email/${sessionStorage.getItem('email')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Corrected from 'Brearer'
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch teacher information');
                }
                const data = await res.json();
                setTeacherInfo({
                    empId: data.empId,
                    empName: `${data.firstName} ${data.lastName}`,
                    imageUrl: data.imageUrl,
                    phoneNumber: data.phone,
                    email: data.email
                });
                setId(data.empId);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching teacher info:', err);
            }
        };

        fetchTeacherData();
    }, []);

    // Get teacher empId from session storage
    const empId = id;

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    /**
     * Effect hook to fetch the teaching schedule once the teacher's empId is available.
     * It runs whenever the empId state changes.
     */
    useEffect(() => {
        if (empId) {
            fetchSchedule();
        }
    }, [empId]);

    /**
     * Fetches the teaching schedule from the API for the current teacher.
     * Handles loading and error states.
     */
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = sessionStorage.getItem('teacherToken');
            if(!token){
                toast.error('Please login to continue');
                window.location.href = '/'
                return;
            }

            const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/teaching/schedule/get/teaching/schedule/${empId}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });


            if (!response.ok) {
                throw new Error(`Failed to fetch schedule: ${response.status}`);
            }

            const data = await response.json();
            setSchedules(data);

            // Extract teacher info from first schedule entry
            if (data.length > 0) {
                setTeacherInfo({
                    empId: data[0].empId,
                    empName: data[0].empName
                });
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filters the schedules based on the selected day and search term.
     * @type {Array<Object>}
     */
    const filteredSchedules = schedules.filter(schedule => {
        const matchesDay = selectedDay === 'All' || schedule.day === selectedDay;
        const matchesSearch =
            schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDay && matchesSearch;
    });

    /**
     * Sorts the filtered schedules by day of the week and then by start time.
     * @type {Array<Object>}
     */
    const sortedSchedules = filteredSchedules.sort((a, b) => {
        const dayOrder = daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
        if (dayOrder !== 0) return dayOrder;
        return a.startTime.localeCompare(b.startTime);
    });

    /**
     * Formats a 24-hour time string (e.g., "14:30") into a 12-hour format with AM/PM.
     * @param {string} time - The time string in HH:mm format.
     * @returns {string} The formatted time string (e.g., "2:30 PM").
     */
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    /**
     * Calculates the number of classes scheduled for each day of the week.
     * @returns {Object.<string, number>} An object mapping day names to class counts.
     */
    const getClassesPerDay = () => {
        return daysOfWeek.reduce((acc, day) => {
            acc[day] = schedules.filter(schedule => schedule.day === day).length;
            return acc;
        }, {});
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your teaching schedule...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Schedule</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchSchedule}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar />
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center">
                            <Calendar className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Teaching Schedule</h1>
                                <p className="text-gray-600">
                                    Schedule assigned by coordinator
                                    {teacherInfo && (
                                        <span className="ml-2">
                                            • <User className="inline h-4 w-4 mr-1" />
                                            {teacherInfo.empName} ({empId})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center">
                                <div className="font-bold text-lg">{schedules.length}</div>
                                <div className="text-sm">Total Classes</div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-center">
                                <div className="font-bold text-lg">{[...new Set(schedules.map(s => s.subject))].length}</div>
                                <div className="text-sm">Subjects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="inline h-4 w-4 mr-1" />
                                Filter by Day
                            </label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="All">All Days ({schedules.length} classes)</option>
                                {daysOfWeek.map(day => {
                                    const count = getClassesPerDay()[day];
                                    return (
                                        <option key={day} value={day}>
                                            {day} {count > 0 ? `(${count} classes)` : '(No classes)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Search className="inline h-4 w-4 mr-1" />
                                Search Schedule
                            </label>
                            <input
                                type="text"
                                placeholder="Search by subject, class, section, or room number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-green-600 text-white">
                        <h2 className="text-xl font-semibold flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Teaching Schedule
                            {selectedDay !== 'All' && (
                                <span className="ml-4 bg-green-700 px-3 py-1 rounded-full text-sm">
                                    {selectedDay} - {getClassesPerDay()[selectedDay]} classes
                                </span>
                            )}
                        </h2>
                    </div>

                    {sortedSchedules.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Day
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time Slot
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Class & Section
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Room Number
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedSchedules.map((schedule, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {schedule.day}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="font-medium">
                                                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <Book className="h-4 w-4 mr-2 text-blue-500" />
                                                    <span className="font-semibold text-gray-900">{schedule.subject}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                                                    <span>Class {schedule.className} - Section {schedule.section}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                                    <span className="font-medium text-gray-900">{schedule.roomNumber}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            {schedules.length === 0 ? (
                                <>
                                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Schedule Assigned</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        It looks like no teaching schedule has been assigned to you yet.
                                        Please contact your coordinator if you believe this is an error.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Found</h3>
                                    <p className="text-gray-500">
                                        No classes match your current filters. Try adjusting your search or selecting a different day.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Weekly Overview */}
                {schedules.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {daysOfWeek.map(day => {
                                const count = getClassesPerDay()[day];
                                return (
                                    <div
                                        key={day}
                                        className={`text-center p-3 rounded-lg border-2 transition-colors ${count > 0
                                            ? 'bg-green-50 border-green-200 text-green-800'
                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{day.slice(0, 3)}</div>
                                        <div className="text-xl font-bold mt-1">{count}</div>
                                        <div className="text-xs">
                                            {count === 1 ? 'class' : 'classes'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSchedulePage;