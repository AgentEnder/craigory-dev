import './app.module.scss';

// home page of personal website of Craigory Coppola
// https://www.craigory.dev
// will contain links to github, linkedin, twitter, etc
// I enjoy programming, tech conferences, woodworking and games
export function App() {
  return (
    <div>
      <h1>Welcome!!</h1>
      <h2>I'm Craigory</h2>
      <p>
        I'm a software engineer, currently focused on open source and developer
        tooling. I enjoy programming, tech conferences, woodworking and games.
      </p>
      <h2>Links</h2>
      <ul>
        <li>
          <a href="https://www.github.com/agentender">Github</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/craigoryvcoppola">LinkedIn</a>
        </li>
        <li>
          <a href="https://www.twitter.com/@EnderAgent">Twitter</a>
        </li>
      </ul>
    </div>
  );
}

export default App;
