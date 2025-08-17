import React, { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainNavBar from './MainNavBar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    
    department: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      subject,
      message,
      department
    } = formData;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

   

    // Create WhatsApp message with nice formatting
    const whatsappMessage = `
*Contact Form Submission*
Name: ${firstName} ${lastName}
Email: ${email}
Department: ${department || "N/A"}
Subject: ${subject}
Message: ${message}
    `.trim();

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

    // Reset form after sending
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      department: "",
      subject: "",
      message: ""
    });

    // Delay toast to prevent removalReason bug
    setTimeout(() => {
      toast.success("Message sent via WhatsApp!");
    }, 100);
  };

  return (
    
  <>
    <MainNavBar />
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-24">
    
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our school administration. We're here to help students, parents, and staff.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Send className="w-5 h-5" /> Send us a Message
            </h2>
            <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input type="text" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input type="text" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <input type="text" value={formData.subject} onChange={(e) => handleInputChange("subject", e.target.value)} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>

              

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="">Select department</option>
                  <option value="admissions">Admissions</option>
                  <option value="academic">Academic Affairs</option>
                  <option value="student-services">Student Services</option>
                  <option value="it-support">IT Support</option>
                  <option value="finance">Finance & Billing</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea value={formData.message} onChange={(e) => handleInputChange("message", e.target.value)} required rows={6} className="w-full border rounded px-3 py-2"></textarea>
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">Send Message</button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5" /> School Information
              </h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-sm text-gray-600">Ghaziabad<br />New Delhi</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <p className="text-sm text-gray-600">+(91) 1234567890</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="text-sm text-gray-600">info@schoolerp.edu</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" /> Opening Hours
              </h3>
              <p className="text-sm">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
              <p className="text-sm">Saturday: 10:00 AM - 4:00 PM EST</p>
              <p className="text-sm">Sunday: Closed</p>
              <span className="mt-2 inline-block text-xs bg-gray-200 px-2 py-1 rounded">24/7 Emergency Support Available</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
    </>
  );
};

export default ContactPage;
