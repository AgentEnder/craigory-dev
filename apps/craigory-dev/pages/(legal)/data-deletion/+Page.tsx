export function Page() {
  return (
    <>
      <div className="legal-header">
        <h1>Data Deletion Request</h1>
        <div className="last-updated">
          Last Updated: {new Date('2026-04-15').toLocaleDateString()}
        </div>
      </div>

      <div className="legal-content">
        <h2>Overview</h2>
        <p>
          This page explains how to request deletion of your personal data
          from applications and services published by Craigory Coppola or
          Twice Baked Software LLC. We are committed to honoring your right
          to have your data removed.
        </p>

        <h2>Automatic Deletion</h2>
        <p>
          Most account data is{' '}
          <strong>
            automatically deleted 60 days after account termination
          </strong>
          . If you have already deleted your account through the
          application, your data will be purged from our systems within
          that window without any further action on your part.
        </p>
        <div className="info-box">
          If you need your data removed sooner, or if the application you
          used does not offer in-app account deletion, follow the manual
          request process below.
        </div>

        <h2>How to Request Manual Deletion</h2>
        <p>
          To request deletion of your data, send an email to{' '}
          <a href="mailto:privacy@craigory.dev">privacy@craigory.dev</a>{' '}
          with the following information:
        </p>
        <ul>
          <li>
            <strong>The URL of the service</strong> you are using (for
            example, <code>https://example.craigory.dev</code>)
          </li>
          <li>
            <strong>Account information</strong> that identifies the data
            to be deleted, such as the email address, username, or display
            name associated with your account
          </li>
          <li>
            A brief description of any additional user-generated content
            you want removed, if applicable
          </li>
        </ul>
        <p>
          We will confirm receipt of your request and complete deletion
          within a reasonable timeframe, typically within 30 days.
        </p>

        <h2>Where Your Data Lives</h2>
        <p>
          Depending on the specific application, your data may be stored
          with one of the following third-party services. Deletion requests
          we process will remove your data from these systems as well:
        </p>

        <h3>Firebase (Google)</h3>
        <p>
          Some applications use Firebase Authentication and Firebase
          services for user authentication and data storage.
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
          Some applications use Supabase for user authentication and data
          storage.
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

        <h3>Turso Cloud</h3>
        <p>
          Some applications use Turso Cloud for database hosting and data
          storage.
        </p>
        <p>
          <a
            href="https://turso.tech/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Turso Privacy Policy →
          </a>
        </p>

        <h2>Contact</h2>
        <p>
          For questions about data deletion or any other privacy concerns,
          please contact:
        </p>
        <p>
          <strong>Craigory Coppola</strong>
          <br />
          Email:{' '}
          <a href="mailto:privacy@craigory.dev">privacy@craigory.dev</a>
        </p>

        <hr />

        <div className="info-box">
          For our full data handling practices, see the{' '}
          <a href="/privacy">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
}
