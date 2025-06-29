import React, { useState } from "react";
import './ActivityPlanner.css';

const ActivityPlanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activityType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    classesInvolved: [{ class: "", section: "" }],
    createdBy: { userId: "", userType: "coordinator" },
    coordinator: { userId: "", name: "", userType: "coordinator" },
    status: "planned"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClassChange = (index, field, value) => {
    const updated = [...formData.classesInvolved];
    updated[index][field] = value;
    setFormData({ ...formData, classesInvolved: updated });
  };

  const addClass = () => {
    setFormData({
      ...formData,
      classesInvolved: [...formData.classesInvolved, { class: "", section: "" }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Submit to backend API here
  };

  return (
    <form className="activity-planner-form" onSubmit={handleSubmit}>
      <h2>Activity Planner</h2>

      <div className="form-group">
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
      </div>

      <div className="form-group">
        <label>Activity Type</label>
        <select name="activityType" value={formData.activityType} onChange={handleChange}>
          <option value="">-- Select --</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Academic">Academic</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Competition">Competition</option>
          <option value="Field Trip">Field Trip</option>
          <option value="Exhibition">Exhibition</option>
          <option value="Meeting">Meeting</option>
          <option value="Celebration">Celebration</option>
          <option value="Training">Training</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Venue</label>
        <input name="venue" value={formData.venue} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Classes Involved</label>
        {formData.classesInvolved.map((cls, index) => (
          <div key={index} className="class-row">
            <input
              placeholder="Class"
              value={cls.class}
              onChange={(e) => handleClassChange(index, "class", e.target.value)}
            />
            <input
              placeholder="Section"
              value={cls.section}
              onChange={(e) => handleClassChange(index, "section", e.target.value)}
            />
          </div>
        ))}
        <div className="add-class-btn" onClick={addClass}>+ Add Class</div>
      </div>

      <div className="form-group">
        <label>Created By (Coordinator)</label>
        <input name="createdBy.userId" placeholder="User ID" value={formData.createdBy.userId} onChange={(e) =>
          setFormData({ ...formData, createdBy: { ...formData.createdBy, userId: e.target.value } })
        } />
      </div>

      <div className="form-group">
        <label>Coordinator Info</label>
        <input name="coordinator.userId" placeholder="User ID" value={formData.coordinator.userId} onChange={(e) =>
          setFormData({ ...formData, coordinator: { ...formData.coordinator, userId: e.target.value } })
        } />
        <input name="coordinator.name" placeholder="Name" value={formData.coordinator.name} onChange={(e) =>
          setFormData({ ...formData, coordinator: { ...formData.coordinator, name: e.target.value } })
        } />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="planned">Planned</option>
          <option value="approved">Approved</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="postponed">Postponed</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">Submit Activity</button>
    </form>
  );
};

export default ActivityPlanner;
