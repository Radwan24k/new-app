import PageHeader from "../components/common/pageHeader";

function About() {
  return (
    <div className="container">
      <PageHeader
        title="About This Application"
        description="Learn more about the Business Card App, its features, and the technology behind it."
      />

      <div className="row mt-4">
        <div className="col-12">
          <h2>Welcome to the Business Card App!</h2>
          <p>
            This application is designed to help users create, manage, and share
            digital business cards. Whether you're a business professional
            looking to network or someone wanting to keep track of contacts,
            this app provides a simple and efficient solution.
          </p>

          <h3>Key Features:</h3>
          <ul>
            <li>
              Create custom digital business cards with your essential contact
              information.
            </li>
            <li>View cards created by other users.</li>
            <li>Mark cards as favorites for quick access.</li>
            <li>(For Business Users) Manage your own collection of cards.</li>
            <li>(For Admins) User management capabilities.</li>
          </ul>

          <h3>Technology Stack:</h3>
          <p>This application is built using modern web technologies:</p>
          <ul>
            <li>
              <strong>Frontend:</strong> React.js with Vite for a fast
              development experience, utilizing functional components and hooks.
            </li>
            <li>
              <strong>Styling:</strong> Bootstrap for responsive design and
              layout, along with custom CSS.
            </li>
            <li>
              <strong>Routing:</strong> React Router for handling navigation
              within the single-page application.
            </li>
            <li>
              <strong>State Management:</strong> React Context API for managing
              global state like authentication.
            </li>
            <li>
              <strong>HTTP Requests:</strong> Axios for making requests to the
              backend API.
            </li>
            <li>
              <strong>Validation:</strong> Joi for schema validation on the
              frontend, ensuring data integrity before submission.
            </li>
            {/* Add backend details if known, e.g., Node.js, Express, MongoDB */}
          </ul>

          <h3>About the Creator:</h3>
          <p>
            [Optional: Add information about yourself or the development team
            here. You could mention your motivation for building the project,
            your background, or links to your portfolio/GitHub.]
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
