import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Filter,
} from 'lucide-react';

const sampleScheduleData = [
  // (your sampleScheduleData as it is)
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const subjectColors = {
  English: 'bg-blue-100 text-blue-800 border-blue-200',
  Mathematics: 'bg-green-100 text-green-800 border-green-200',
  Science: 'bg-purple-100 text-purple-800 border-purple-200',
  'Art & Craft': 'bg-pink-100 text-pink-800 border-pink-200',
  'Physical Education': 'bg-orange-100 text-orange-800 border-orange-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function WeeklyScheduleAdmin() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');

  const classes = [...new Set(sampleScheduleData.map((item) => item.className))];

  const getSectionData = () => {
    if (selectedClass === 'all') {
      return sampleScheduleData.flatMap((classItem) =>
        classItem.sections.map((section) => ({
          ...section,
          className: classItem.className,
        }))
      );
    }

    const classData = sampleScheduleData.find((item) => item.className === selectedClass);
    if (!classData) return [];

    if (selectedSection === 'all') {
      return classData.sections.map((section) => ({
        ...section,
        className: classData.className,
      }));
    }

    const section = classData.sections.find((s) => s.sectionName === selectedSection);
    return section ? [{ ...section, className: classData.className }] : [];
  };

  const sectionData = getSectionData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Weekly Schedule Admin</h1>
              <p className="text-sm text-gray-500">Complete schedule overview</p>
            </div>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Active Schedules
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow p-6 rounded-lg mb-6 border">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Class Select */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                className="w-48 px-3 py-2 border rounded"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Select */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                className="w-48 px-3 py-2 border rounded"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="all">All Sections</option>
                {selectedClass !== 'all' &&
                  sampleScheduleData
                    .find((item) => item.className === selectedClass)
                    ?.sections.map((section) => (
                      <option key={section.sectionName} value={section.sectionName}>
                        Section {section.sectionName}
                      </option>
                    ))}
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                className="border px-4 py-2 rounded hover:bg-gray-100"
                onClick={() => {
                  setSelectedClass('all');
                  setSelectedSection('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        {sectionData.length > 0 ? (
          sectionData.map((section) => (
            <div
              key={`${section.className}-${section.sectionName}`}
              className="bg-white shadow rounded-lg border overflow-hidden mb-6"
            >
              <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                    {section.className}
                  </span>
                  <span className="font-semibold">Section {section.sectionName}</span>
                </div>
                <span className="text-sm text-gray-700">
                  {section.schedule.length} Days Scheduled
                </span>
              </div>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 min-w-full border-t">
                  {days.map((day) => {
                    const daySchedule = section.schedule.find((s) => s.day === day);
                    return (
                      <div key={day} className="border-r border-gray-200 last:border-r-0">
                        <div className="bg-gray-100 text-center py-2 font-medium border-b">{day}</div>
                        <div className="p-3 space-y-3 min-h-[250px]">
                          {daySchedule?.lectures.map((lecture, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border text-sm ${
                                subjectColors[lecture.subject] || subjectColors.default
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">{lecture.subject}</span>
                                <span className="flex items-center text-xs">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {lecture.startTime} - {lecture.endTime}
                                </span>
                              </div>
                              <div className="text-xs flex items-center mt-1">
                                <User className="h-4 w-4 mr-1" />
                                {lecture.teacher}
                              </div>
                              <div className="text-xs flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {lecture.room}
                              </div>
                            </div>
                          )) || (
                            <div className="text-gray-400 text-sm text-center py-6">
                              No lectures scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 text-center rounded shadow border">
            <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
