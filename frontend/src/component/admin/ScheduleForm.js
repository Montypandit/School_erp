import React, { useState } from "react";
import { toast } from "react-toastify";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleForm() {
  const [className, setClassName] = useState("");
  const [sections, setSections] = useState([
    {
      sectionName: "",
      schedule: [
        {
          day: "",
          lectures: [
            { startTime: "", endTime: "", subject: "", teacher: "", room: "" },
          ],
        },
      ],
    },
  ]);

  const handleChange = (si, schi, li, field, value) => {
    const updated = [...sections];
    updated[si].schedule[schi].lectures[li][field] = value;
    setSections(updated);
  };

  const handleSectionNameChange = (si, value) => {
    const updated = [...sections];
    updated[si].sectionName = value;
    setSections(updated);
  };

  const handleDayChange = (si, schi, day) => {
    const updated = [...sections];
    updated[si].schedule[schi].day = day;
    setSections(updated);
  };

  const addLecture = (si, schi) => {
    const updated = [...sections];
    updated[si].schedule[schi].lectures.push({
      startTime: "",
      endTime: "",
      subject: "",
      teacher: "",
      room: "",
    });
    setSections(updated);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        sectionName: "",
        schedule: [
          {
            day: "",
            lectures: [
              { startTime: "", endTime: "", subject: "", teacher: "", room: "" },
            ],
          },
        ],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("adminToken");

    const response = await fetch("http://localhost:5000/api/schedules/create/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ className, sections }),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success("Schedule submitted successfully!");
      setClassName("");
      setSections([
        {
          sectionName: "",
          schedule: [
            {
              day: "",
              lectures: [
                { startTime: "", endTime: "", subject: "", teacher: "", room: "" },
              ],
            },
          ],
        },
      ]);
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center text-green">Create Class Schedule</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded shadow border">
          <label className="block font-medium mb-1">Class Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>

        {sections.map((section, si) => (
          <div
            key={si}
            className="bg-white p-4 rounded shadow border space-y-4"
          >
            <h2 className="text-lg font-semibold text-blue-600">
              Section {si + 1}
            </h2>

            <div>
              <label className="block font-medium mb-1">Section Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={section.sectionName}
                onChange={(e) => handleSectionNameChange(si, e.target.value)}
                required
              />
            </div>

            {section.schedule.map((sch, schi) => (
              <div key={schi} className="space-y-3">
                <label className="block font-medium">Day</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={sch.day}
                  onChange={(e) => handleDayChange(si, schi, e.target.value)}
                  required
                >
                  <option value="">Select Day</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                {sch.lectures.map((lec, li) => (
                  <div
                    key={li}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded p-3 bg-gray-50"
                  >
                    <div>
                      <label className="block text-sm font-medium">Start Time</label>
                      <input
                        type="time"
                        className="w-full border px-3 py-1 rounded"
                        value={lec.startTime}
                        onChange={(e) =>
                          handleChange(si, schi, li, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">End Time</label>
                      <input
                        type="time"
                        className="w-full border px-3 py-1 rounded"
                        value={lec.endTime}
                        onChange={(e) =>
                          handleChange(si, schi, li, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Subject</label>
                      <input
                        type="text"
                        className="w-full border px-3 py-1 rounded"
                        value={lec.subject}
                        onChange={(e) =>
                          handleChange(si, schi, li, "subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Teacher</label>
                      <input
                        type="text"
                        className="w-full border px-3 py-1 rounded"
                        value={lec.teacher}
                        onChange={(e) =>
                          handleChange(si, schi, li, "teacher", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Room</label>
                      <input
                        type="text"
                        className="w-full border px-3 py-1 rounded"
                        value={lec.room}
                        onChange={(e) =>
                          handleChange(si, schi, li, "room", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={() => addLecture(si, schi)}
                >
                  + Add Lecture
                </button>
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          className="text-sm text-green-700 hover:underline"
          onClick={addSection}
        >
          + Add Section
        </button>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Schedule
          </button>
        </div>
      </form>
    </div>
  );
}
