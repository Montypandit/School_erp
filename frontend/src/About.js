import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Shield, Award, Heart, Mail, Phone } from 'lucide-react';
import MainNavBar from './MainNavBar';

const SimpleAboutPage = ()=> {
  return (
    <>
    <MainNavBar />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
         <div className="bg-white shadow-md rounded-lg mb-8 p-6">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated to providing excellent education and fostering a supportive learning environment for all students.
          </p>
        </div>
        </div>
        {/* Mission */}
        <div className="bg-white shadow-md rounded-lg mb-8 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To empower students with knowledge, skills, and values that prepare them for success
              in their academic journey and beyond. We are committed to creating an inclusive,
              innovative, and nurturing educational environment.
            </p>
          </div>
        </div>

      
        

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              icon: BookOpen,
              title: 'Quality Education',
              description: 'Comprehensive curriculum designed to meet modern educational standards and prepare students for the future.',
              color: 'text-blue-600'
            }, {
              icon: Users,
              title: 'Expert Faculty',
              description: 'Experienced and dedicated teachers committed to helping every student reach their full potential.',
              color: 'text-green-600'
            }, {
              icon: Shield,
              title: 'Safe Environment',
              description: 'A secure and supportive campus where students can learn, grow, and thrive in a positive atmosphere.',
              color: 'text-purple-600'
            }].map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
                <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color}`} />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white shadow-md rounded-lg mb-8 p-6">
          <h2 className="text-2xl text-center font-bold mb-6">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[{
              icon: Award,
              title: 'Excellence',
              description: 'Striving for the highest standards in education and personal development.',
              color: 'text-yellow-600'
            }, {
              icon: Heart,
              title: 'Care',
              description: 'Providing personalized attention and support for every student\'s needs.',
              color: 'text-red-600'
            }, {
              icon: Users,
              title: 'Community',
              description: 'Building strong relationships between students, families, and educators.',
              color: 'text-blue-600'
            }].map((value, index) => (
              <div key={index}>
                <value.icon className={`w-8 h-8 mx-auto mb-3 ${value.color}`} />
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 border border-blue-200 shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Have questions or want to learn more about our school? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-sm">(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-sm">info@school.edu</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Admissions Open', 'Financial Aid Available', 'Campus Tours'].map((badge, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
export default SimpleAboutPage;