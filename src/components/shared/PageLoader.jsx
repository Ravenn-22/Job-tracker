import JugglerLoader from "./Loader.jsx";
import "./Loader.css";


const PageLoader = ({ label = "Loading…", inline = false }) => {
  return (
    <div className={`page-loader-overlay ${inline ? "page-loader-overlay--inline" : ""}`}>
      <JugglerLoader />
      <p className="page-loader-label">{label}</p>
    </div>
  );
};
export default PageLoader;