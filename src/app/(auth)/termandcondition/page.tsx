"use client";

import React, { JSX, useState } from "react";

export default function TermsAndConditions(): JSX.Element {
  const [activeSection, setActiveSection] = useState<string>("overview");

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Terms and Conditions - xPi Digital Signage
      </h1>

      <div className="prose prose-blue max-w-none">
        {/* Section 1 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            1. Overview
          </h2>
          <p>
            Welcome to xPi Digital Signage. These Terms and Conditions govern
            your use of our digital signage solutions, software, and services.
            By accessing or using our services, you agree to be bound by these
            terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            2. Service Description
          </h2>
          <p>xPi Digital Signage provides:</p>
          <ul className="list-disc pl-6">
            <li>Cloud-based digital signage management platform</li>
            <li>Content creation and management tools</li>
            <li>Remote display management capabilities</li>
            <li>Real-time content scheduling and deployment</li>
            <li>Analytics and reporting features</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            3. Licensing Terms
          </h2>
          <p>
            Our software is licensed, not sold. The license grants you the right
            to:
          </p>
          <ul className="list-disc pl-6">
            <li>Deploy content to authorized displays</li>
            <li>Access management dashboard</li>
            <li>Create and modify content within platform guidelines</li>
            <li>Utilize available templates and assets</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            4. Data Privacy and Security
          </h2>
          <ul className="list-disc pl-6">
            <li>End-to-end encryption for content transmission</li>
            <li>Regular security audits and updates</li>
            <li>GDPR and CCPA compliance</li>
            <li>Secure data storage and backup</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            5. Usage Restrictions
          </h2>
          <p>Users are prohibited from:</p>
          <ul className="list-disc pl-6">
            <li>Reverse engineering the software</li>
            <li>Sharing access credentials</li>
            <li>Displaying illegal or unauthorized content</li>
            <li>Modifying system infrastructure</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            6. Service Level Agreement
          </h2>
          <ul className="list-disc pl-6">
            <li>99.9% uptime guarantee</li>
            <li>24/7 technical support</li>
            <li>Maximum 4-hour response time for critical issues</li>
            <li>Regular maintenance windows</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            7. Payment Terms
          </h2>
          <ul className="list-disc pl-6">
            <li>Monthly/Annual subscription billing</li>
            <li>30-day payment terms</li>
            <li>Automatic renewal unless cancelled</li>
            <li>Usage-based pricing for additional services</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            8. Intellectual Property
          </h2>
          <p>All rights reserved for:</p>
          <ul className="list-disc pl-6">
            <li>Software architecture and code</li>
            <li>User interface design</li>
            <li>Company branding and assets</li>
            <li>Documentation and training materials</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            9. Liability and Indemnification
          </h2>
          <p>xPi Digital Signage is not liable for:</p>
          <ul className="list-disc pl-6">
            <li>Content displayed by users</li>
            <li>Network connectivity issues</li>
            <li>Third-party hardware failures</li>
            <li>Force majeure events</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            10. Contact Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <strong>Technical Support:</strong> support@xpi-digitalsignage.com
            </p>
            <p>
              <strong>Sales Inquiries:</strong> sales@xpi-digitalsignage.com
            </p>
            <p>
              <strong>Corporate Office:</strong> 123 Tech Park, Innovation
              District
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Hours:</strong> 24/7 Support Available
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            11. Updates to Terms
          </h2>
          <p>
            xPi Digital Signage reserves the right to modify these terms. Users
            will be notified of significant changes 30 days in advance.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">Version: 1.0</p>
        </div>
      </div>
    </div>
  );
}
