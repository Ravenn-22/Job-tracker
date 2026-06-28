import { useNavigate } from "react-router-dom";
import illustration from "../assets/404-illustration.png";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-bg">
        <img src={illustration} alt="" className="notfound-illustration" />
      </div>
      <div className="notfound-inner">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Looks like this page ghosted you.</h2>
        <p className="notfound-desc">
          Just like that recruiter who never replied — this page has gone quiet.
          Let's get you back on track.
        </p>
        <div className="notfound-actions">
          <button className="notfound-btn" onClick={() => navigate("/")}>
            Go home
          </button>
          <button className="notfound-btn--ghost" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;