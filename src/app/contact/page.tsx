"use client";

import { JSX, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  MapPin,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

interface FormData {
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  department: string;
}

interface SupportInfo {
  hours: string;
  email: string;
  phone: string;
  locations: string[];
  response: string;
}

interface Department {
  id: string;
  name: string;
}

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    message: "",
    priority: "medium",
    department: "technical",
  });

  const supportInfo: SupportInfo = {
    hours: "24/7 Support Available",
    email: "support@xpi.com",
    phone: "+1 (555) 123-4567",
    locations: ["Mumbai, India", "New York, USA", "London, UK"],
    response: "Average Response Time: 2 Hours",
  };

  // const departments: Department[] = [
  //   { id: "technical", name: "Technical Support" },
  //   { id: "billing", name: "Billing & Payments" },
  //   { id: "general", name: "General Inquiry" },
  //   { id: "sales", name: "Sales & Marketing" },
  //   { id: "customer", name: "Customer Support" },
  //   { id: "other", name: "Other" },
  // ];

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSelectChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ): void => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handlePriorityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData((prev) => ({
      ...prev,
      priority: e.target.value as "low" | "medium" | "high",
    }));
  };

  return (
    <div className="min-h-screen p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Contact Support
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated support team is here to help. Choose your preferred
            way to reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Contact Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all"
          >
            <Phone className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg text-gray-700 font-semibold mb-2">
              Phone Support
            </h3>
            <p className="text-gray-600 mb-4">{supportInfo.phone}</p>
            <p className="text-sm text-blue-500">{supportInfo.hours}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all"
          >
            <Mail className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg text-gray-700 font-semibold mb-2">
              Email Support
            </h3>
            <p className="text-gray-600 mb-4">{supportInfo.email}</p>
            <p className="text-sm text-blue-500">{supportInfo.response}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg text-gray-700 font-semibold mb-2">
              Live Chat
            </h3>
            <p className="text-gray-600 mb-4">Available for instant support</p>
            <button className="text-blue-500 hover:text-blue-600">
              Start Chat →
            </button>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-md border border-blue-100"
          >
            <h2 className="text-2xl text-gray-700 font-semibold mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                {/* <Select
                  value={formData.department}
                  onChange={handleSelectChange}
                  options={departments.map((dept) => ({
                    label: dept.name,
                    value: dept.id,
                  }))}
                  variant="outline"
                  label="Department"
                  placeholder="Select Department"
                  className="w-full"
                  name="department"
                /> */}
              </div>

              <div className="group">
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  label="Subject"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-[rgb(98,60,231)]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition-all focus:border-[rgb(98,60,231)] focus:ring-1 focus:ring-[rgb(98,60,231)] group-hover:border-[rgb(98,60,231)]"
                  placeholder="Describe your issue..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-4">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={handlePriorityChange}
                        className="text-blue-500 focus:ring-blue-300"
                      />
                      <span className="ml-2 capitalize text-gray-600">
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all "
            >
              <h3 className="text-xl text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <Clock className="text-blue-500" />
                Support Hours
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between text-gray-600">
                  <span>Weekdays</span>
                  <span>9:00 AM - 8:00 PM</span>
                </p>
                <p className="flex justify-between text-gray-600">
                  <span>Weekends</span>
                  <span>10:00 AM - 6:00 PM</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <Globe className="text-blue-500" />
                Global Offices
              </h3>
              <div className="space-y-4 text-gray-600 ">
                {supportInfo.locations.map(
                  (location: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <MapPin className="text-blue-500 w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
