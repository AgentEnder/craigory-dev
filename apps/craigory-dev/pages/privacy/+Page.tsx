import './privacy.scss';

export function Page() {
  return (
    <div className="privacy-container">
      <div className="privacy-card">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <div className="last-updated">
            Last Updated: {new Date('2025-10-10').toLocaleDateString()}
          </div>
        </div>

        <div className="privacy-content">
          <h2>Overview</h2>
          <p>
            This privacy policy applies to applications and services published by
            Craigory Coppola or Twice Baked Software LLC. We are committed to
            protecting your privacy and being transparent about how we handle your
            data.
          </p>

          <h2>Information We Collect</h2>
          <p>
            The specific data collected depends on the application you're using.
            Generally, we collect:
          </p>
          <ul>
            <li>
              Account information (email address, display name) when you create an
              account
            </li>
            <li>
              User-generated content and data specific to the application you're
              using
            </li>
            <li>Basic usage analytics to improve our services</li>
          </ul>

          <h2>Authentication and Data Storage</h2>
          <p>
            Depending on the specific application you're using, your authentication
            and data may be managed by one of the following third-party services:
          </p>

          <h3>Firebase (Google)</h3>
          <p>
            Some applications use Firebase Authentication and Firebase services for
            user authentication and data storage. Firebase is provided by Google
            LLC.
          </p>
          <p>
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Firebase Privacy Policy →
            </a>
          </p>

          <h3>Supabase</h3>
          <p>
            Some applications use Supabase for user authentication and data storage.
            Supabase is an open-source Firebase alternative.
          </p>
          <p>
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Supabase Privacy Policy →
            </a>
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain the application services</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Improve and optimize our applications</li>
            <li>Communicate with you about the services</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect your data from unauthorized
            access, alteration, disclosure, or destruction. However, no method of
            transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            Our applications may contain links to third-party websites or services.
            We are not responsible for the privacy practices of these third parties.
            We encourage you to review their privacy policies.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            "Last Updated" date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions or concerns about this privacy policy or our data
            practices, please contact:
          </p>
          <p>
            <strong>Craigory Coppola</strong>
            <br />
            Email: <a href="mailto:privacy@craigory.dev">privacy@craigory.dev</a>
          </p>

          <hr />

          <div className="info-box">
            This privacy policy is designed to be reusable across multiple small
            applications. The specific authentication provider and data storage used
            will depend on the particular application you're using.
          </div>
        </div>

        <div className="privacy-footer">
          <a href="/" className="back-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Return to craigory.dev
          </a>
        </div>
      </div>
    </div>
  );
}
