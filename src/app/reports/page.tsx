"use client";

import React, { useState, ChangeEvent } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  BarChart,
  Eye,
  Clock,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface Report {
  id: number;
  name: string;
  date: string;
  downloads: number;
  views: number;
  engagement: string;
  type: "Monthly Analysis" | "Quarterly Review" | "Yearly Review";
  lastAccessed: string;
  size: string;
  shared: number;
}

interface FilterOption {
  value: string;
  label: string;
}

export default function Reports() {
  const [filterReports, setFilterReports] = useState<string>("all");

  const reports: Report[] = [
    // Sample structure for reference
    // {
    //   id: 1,
    //   name: 'January Report',
    //   date: '2023-01-31',
    //   downloads: 45,
    //   views: 156,
    //   engagement: '78%',
    //   type: 'Monthly Analysis',
    //   lastAccessed: '2 hours ago',
    //   size: '2.4 MB',
    //   shared: 12,
    // },
  ];

  const handleDownload = (report: Report) => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${report.id}`;

    fetch(downloadUrl, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };
    const handleView = (report: Report) => {
      // Logic to handle view
    };

  const handleShare = (report: Report) => {
    if (navigator.share) {
      navigator.share({
        title: report.name,
        text: `Check out this report: ${report.name}`,
        url: window.location.href,
      });
    }
  };

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilterReports(event.target.value);
  };

  const filteredReports = reports.filter((report) => {
    if (filterReports === "all") return true;
    if (filterReports === "monthly") return report.type === "Monthly Analysis";
    if (filterReports === "quarterly")
      return report.type === "Quarterly Review";
    if (filterReports === "yearly") return report.type === "Yearly Review";
    return true;
  });

  const generateReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type: filterReports,
            date: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        // Refresh reports list
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
              <FileText className="w-8 h-8 text-blue-500" />
              Reports
            </h1>
            <div className="flex gap-4">
              <Select
                value={filterReports}
                onChange={handleFilterChange}
                options={filterOptions}
              />
              <Button variant="primary" onClick={generateReport}>
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-blue-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {report.name}
                    </h3>
                    <span className="text-sm text-blue-500">{report.type}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownload(report)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <p>{report.date}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <p>{report.views} views</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Download className="w-4 h-4" />
                      <p>{report.downloads} downloads</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <p>{report.engagement}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Share2 className="w-4 h-4" />
                      <p>{report.shared} shares</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {report.lastAccessed}
                    </div>
                    <span className="text-sm text-gray-500">{report.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
