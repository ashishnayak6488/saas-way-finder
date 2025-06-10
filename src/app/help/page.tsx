"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  Book,
  Code,
  Lock,
  UserCog,
  Monitor,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Search,
  BookOpen,
  Video,
  FileText,
  ArrowUp,
} from "lucide-react";
import { Input } from "@/components/ui/Input";

// Define interfaces for FAQ and Troubleshooting data
interface FAQItem {
  icon: React.ReactNode;
  question: string;
  answer: string;
}

interface TroubleshootingItem {
  icon: React.ReactNode;
  issue: string;
  solution: string;
}

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const faqData: FAQItem[] = [
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password.",
    },
    {
      icon: <UserCog className="w-8 h-8 text-blue-500" />,
      question: "How do I update my profile?",
      answer:
        "You can update your profile by visiting the 'Account Settings' section. From there, you can change your personal details, including your profile picture, username, and email address.",
    },
    {
      icon: <Monitor className="w-8 h-8 text-blue-500" />,
      question: "What are the system requirements?",
      answer:
        "Our platform is accessible from modern web browsers, including Chrome, Firefox, and Safari. For the best experience, we recommend using the latest version of your preferred browser.",
    },
  ];

  const troubleshootingData: TroubleshootingItem[] = [
    {
      icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      issue: "I can't log in, what should I do?",
      solution:
        "If you're unable to log in, please check that you're entering the correct credentials. If you've forgotten your password, use the 'Forgot Password' feature. If the issue persists, please reach out to support.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-red-500" />,
      issue: "The website is not loading properly, how can I fix it?",
      solution:
        "Try clearing your browser cache or accessing the website from a different browser. If the issue continues, please check for any server outages on our status page.",
    },
  ];

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Placeholder components
  const HelpCategories: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Help Categories</h2>
      <ul className="space-y-2">
        <li>
          <a href="#account" className="text-blue-500 hover:underline">
            Account Management
          </a>
        </li>
        <li>
          <a href="#billing" className="text-blue-500 hover:underline">
            Billing & Payments
          </a>
        </li>
        <li>
          <a href="#technical" className="text-blue-500 hover:underline">
            Technical Support
          </a>
        </li>
      </ul>
    </div>
  );

  const FAQSection: React.FC = () => (
    <section className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
        More FAQs
      </h2>
      <p className="text-gray-600">
        Additional frequently asked questions will be listed here.
      </p>
    </section>
  );

  const GuidedTutorials: React.FC = () => (
    <section className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Video className="w-6 h-6 text-blue-500 mr-3" />
        Guided Tutorials
      </h2>
      <p className="text-gray-600">
        Step-by-step tutorials to help you get started.
      </p>
    </section>
  );

  const CommunitySection: React.FC = () => (
    <section className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="w-6 h-6 text-blue-500 mr-3" />
        Community Support
      </h2>
      <p className="text-gray-600">
        Join our community forums to ask questions and share knowledge.
      </p>
      <a href="/community" className="text-blue-500 hover:underline">
        Visit Community
      </a>
    </section>
  );

  const ContactSupport: React.FC = () => (
    <section className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Mail className="w-6 h-6 text-blue-500 mr-3" />
        Contact Support
      </h2>
      <p className="text-gray-600">
        Reach out to our support team via email at{" "}
        <a
          href="mailto:support@example.com"
          className="text-blue-500 hover:underline"
        >
          support@example.com
        </a>{" "}
        or call us at{" "}
        <a href="tel:+1234567890" className="text-blue-500 hover:underline">
          +1 (234) 567-890
        </a>
        .
      </p>
    </section>
  );

  const FeedbackSection: React.FC = () => (
    <section className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="w-6 h-6 text-blue-500 mr-3" />
        Provide Feedback
      </h2>
      <p className="text-gray-600">
        We value your feedback! Let us know how we can improve.
      </p>
      <a href="/feedback" className="text-blue-500 hover:underline">
        Submit Feedback
      </a>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Help & Support
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Find answers, troubleshoot issues, and get the support you need
              </p>
            </div>
            <HelpCircle className="w-10 h-10 text-blue-200 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="relative">
            <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search for help..."
              className="pl-12"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-3 lg:pr-8 mb-8 lg:mb-0">
            <HelpCategories />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="space-y-8">
              {/* FAQ Section */}
              <section className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
                  Frequently Asked Questions
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {faqData.map((faq, index) => (
                    <div
                      key={index}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div>{faq.icon}</div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Troubleshooting Section */}
              <section className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  Troubleshooting
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {troubleshootingData.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div>{item.icon}</div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.issue}
                          </h3>
                          <p className="text-gray-600">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resources Section */}
              <section className="grid md:grid-cols-2 gap-8">
                {/* Video Tutorials Section */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Video className="w-6 h-6 text-blue-500 mr-3" />
                    Video Tutorials
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Getting Started with Our Platform
                      </h3>
                      <p className="text-gray-600">
                        A step-by-step guide on how to start using our platform.
                      </p>
                      <a
                        href="https://www.youtube.com/watch?v=example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Watch Video Tutorial{" "}
                        <ExternalLink className="inline w-4 h-4" />
                      </a>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Advanced Features
                      </h3>
                      <p className="text-gray-600">
                        Learn about advanced features and integrations.
                      </p>
                      <a
                        href="https://www.youtube.com/watch?v=example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Watch Video Tutorial{" "}
                        <ExternalLink className="inline w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Documentation Section */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 text-blue-500 mr-3" />
                    Documentation
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        User Guide
                      </h3>
                      <p className="text-gray-600">
                        Comprehensive guide for using the platform.
                      </p>
                      <a
                        href="/help/userguide"
                        className="text-blue-500 hover:underline"
                      >
                        Read User Guide
                      </a>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        API Documentation
                      </h3>
                      <p className="text-gray-600">
                        Learn how to integrate with our API.
                      </p>
                      <a
                        href="/help/apidocs"
                        className="text-blue-500 hover:underline"
                      >
                        View API Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Sections */}
              <FAQSection />
              <GuidedTutorials />
              <CommunitySection />
              <ContactSupport />
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105"
          onClick={scrollToTop}
        >
          <ArrowUp className="inline w-5 h-5 mr-2" />
          Back to Top
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
