import useInView from "../../hooks/UseView.js";
import "./FadeIn.css";

const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`fadein fadein--${direction} ${inView ? "fadein--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;