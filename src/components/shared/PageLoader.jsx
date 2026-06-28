import JugglerLoader from "./Loader.jsx";
import "./Loader.css";

/**
 * Full-screen overlay version of the juggler loader.
 * Drop this in during async actions like login.
 *
 * Usage:
 *   {isLoggingIn && <PageLoader label="Logging you in…" />}
 */
const PageLoader = ({ label = "Loading…" }) => {
  return (
    <div className="page-loader-overlay">
      <JugglerLoader />
      <p className="page-loader-label">{label}</p>
    </div>
  );
};

export default PageLoader;