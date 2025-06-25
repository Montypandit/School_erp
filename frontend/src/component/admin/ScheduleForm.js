import React, { useState } from "react";
import "./ScheduleForm.css"; // Make sure this includes your inquiry-form CSS

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ScheduleForm = () => {
  const [className, setClassName] = useState("");
  const [sections, setSections] = useState([
    {
      sectionName: "",
      schedule: [
        {
          day: "",
          lectures: [
            {
              startTime: "",
              endTime: "",
              subject: "",
              teacher: "",
              room: "",
            },
          ],
        },
      ],
    },
  ]);

  const handleChange = (sectionIndex, scheduleIndex, lectureIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].schedule[scheduleIndex].lectures[lectureIndex][field] = value;
    setSections(updated);
  };

  const handleSectionNameChange = (i, e) => {
    const updated = [...sections];
    updated[i].sectionName = e.target.value;
    setSections(updated);
  };

  const handleDayChange = (si, schi, day) => {
    const updated = [...sections];
    updated[si].schedule[schi].day = day;
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
              {
                startTime: "",
                endTime: "",
                subject: "",
                teacher: "",
                room: "",
              },
            ],
          },
        ],
      },
    ]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ className, sections });
  };

  return (
    <div className="inquiry-form-container">
      <h1>Class Schedule Form</h1>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
        </div>

        {sections.map((section, si) => (
          <div className="form-section" key={si}>
            <h3>Section {si + 1}</h3>

            <div className="form-group">
              <label>Section Name</label>
              <input
                type="text"
                value={section.sectionName}
                onChange={(e) => handleSectionNameChange(si, e)}
                required
              />
            </div>

            {section.schedule.map((sch, schi) => (
              <div key={schi}>
                <div className="form-group">
                  <label>Day</label>
                  <select
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
                </div>

                {sch.lectures.map((lec, li) => (
                  <div key={li} className="form-section" style={{ background: "#fff" }}>
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={lec.startTime}
                        onChange={(e) =>
                          handleChange(si, schi, li, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={lec.endTime}
                        onChange={(e) =>
                          handleChange(si, schi, li, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        value={lec.subject}
                        onChange={(e) =>
                          handleChange(si, schi, li, "subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Teacher</label>
                      <input
                        type="text"
                        value={lec.teacher}
                        onChange={(e) =>
                          handleChange(si, schi, li, "teacher", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Room</label>
                      <input
                        type="text"
                        value={lec.room}
                        onChange={(e) =>
                          handleChange(si, schi, li, "room", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => addLecture(si, schi)}>
                  + Add Lecture
                </button>
              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addSection}>
          + Add Section
        </button>

        <button type="submit">Submit Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleForm;
