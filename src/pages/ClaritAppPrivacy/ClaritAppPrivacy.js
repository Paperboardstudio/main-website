// ClaritAppPrivacy.js
import React, { useEffect } from 'react';
import './ClaritAppPrivacy.scss';

const ClaritAppPrivacy = () => {
  useEffect(() => {
    // Set page title
    document.title = 'ClaritApp Privacy Policy | Paperboard Studio';

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content');

    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Privacy Policy for ClaritApp. Learn how we collect, use, and protect your personal information.'
      );
    }

    // Cleanup: restore original meta on unmount
    return () => {
      document.title = 'Paperboard Studio';
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, []);

  return (
    <div className="privacy-page">
      <article className="privacy-content">
        <h1>ClaritApp Privacy Policy</h1>

        <p>
          <strong>Last Updated:</strong> December 21, 2025
        </p>

        <p>
          Paperboard Studio Oy built the ClaritApp app as a [Freemium/Free/Commercial] app. This
          SERVICE is provided by Paperboard Studio Oy and is intended for use as is.
        </p>

        <p>
          This page is used to inform visitors regarding our policies with the collection, use, and
          disclosure of Personal Information if anyone decided to use our Service.
        </p>

        <h2>1. Information Collection and Use</h2>

        <p>
          For a better experience, while using our Service, we may require you to provide us with
          certain personally identifiable information to facilitate business operations. This may
          include, but is not limited to:
        </p>

        <ul>
          <li>
            <strong>Account Information:</strong> Email address and business name for account
            synchronization.
          </li>
          <li>
            <strong>Transaction Data:</strong> Information regarding sales, inventory, and products
            entered into the app.
          </li>
        </ul>

        <h3>Device Permissions</h3>
        <ul>
          <li>
            <strong>Bluetooth/Location:</strong> To connect to receipt printers or card readers.
          </li>
          <li>
            <strong>Storage:</strong> To export reports or save receipts.
          </li>
        </ul>

        <p>
          The information that we request will be retained by us and used as described in this
          privacy policy.
        </p>

        <h2>2. Third-Party Services</h2>

        <p>
          The app does use third-party services that may collect information used to identify you.
          Below are the links to the privacy policies of third-party service providers used by the
          app:
        </p>

        <ul>
          <li>Google Play Services</li>
          <li>Google Analytics for Firebase (If used for crash reporting/analytics)</li>
        </ul>

        <h2>3. Log Data</h2>

        <p>
          We want to inform you that whenever you use our Service, in case of an error in the app,
          we collect data and information (through third-party products) on your phone called Log
          Data. This Log Data may include information such as your device Internet Protocol (“IP”)
          address, device name, operating system version, the configuration of the app when
          utilizing our Service, the time and date of your use of the Service, and other
          statistics.
        </p>

        <h2>4. Cookies</h2>

        <p>
          Cookies are files with a small amount of data that are commonly used as anonymous unique
          identifiers. This Service does not use these “cookies” explicitly. However, the app may
          use third-party code and libraries that use “cookies” to collect information and improve
          their services.
        </p>

        <h2>5. Service Providers</h2>

        <p>We may employ third-party companies and individuals to:</p>

        <ul>
          <li>Facilitate our Service;</li>
          <li>Perform Service-related services (e.g., database hosting); or</li>
          <li>Assist us in analyzing how our Service is used.</li>
        </ul>

        <p>
          These third parties have access to your Personal Information only to perform the tasks
          assigned to them on our behalf and are obligated not to disclose or use the information
          for any other purpose.
        </p>

        <h2>6. Security</h2>

        <p>
          We value your trust in providing us your Business and Personal Information, thus we are
          striving to use commercially acceptable means of protecting it. However, no method of
          transmission over the internet or electronic storage is 100% secure, and we cannot
          guarantee its absolute security.
        </p>

        <h2>7. Children’s Privacy</h2>

        <p>
          These Services do not address anyone under the age of 13. We do not knowingly collect
          personally identifiable information from children. If we discover that a child under 13
          has provided us with personal information, we immediately delete this from our servers.
        </p>

        <h2>8. Data Deletion and Retention</h2>

        <p>Paperboard Studio Oy acknowledges your right to control your data.</p>

        <h3>What data do we collect?</h3>
        <ul>
          <li>Business profile data and inventory lists.</li>
          <li>Analytics data to improve app performance.</li>
        </ul>

        <h3>How to request deletion</h3>
        <p>
          To delete your account and all associated business data collected by ClaritApp, please
          contact us at{' '}
          <a href="mailto:contact@paperboardstudio.com">contact@paperboardstudio.com</a>. We will
          process your request and remove all stored data from our active databases within 30 days.
        </p>

        <h2>9. Changes to This Privacy Policy</h2>

        <p>
          We may update our Privacy Policy from time to time. You are advised to review this page
          periodically for any changes. These changes are effective immediately after they are
          posted on this page.
        </p>

        <h2>10. Contact Us</h2>

        <p>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to
          contact us at{' '}
          <a href="mailto:contact@paperboardstudio.com">contact@paperboardstudio.com</a>.
        </p>
      </article>
    </div>
  );
};

export default ClaritAppPrivacy;