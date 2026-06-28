import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import Georn from "../assets/georn.png";
import FadeIn from "../components/shared/FadeIn.jsx";
import careerProgress from "../assets/career-progress.png";
import workingLate from "../assets/working-late.png";
import remoteWorker from "../assets/remote-worker.png";
import useActiveSection from "../hooks/useActiveSection.js";
import skylineImg from "../assets/footer-skyline.jpg";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Get Started", href: "/login" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const year = new Date().getFullYear();
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
};

const steps = [
  {
    number: "01",
    title: "Create your Account",
    text: "Sign up for free and set up your profile in under a minute. No credit card required, no setup fees — just create an account and start tracking.",
    image: careerProgress,
    alt: "Illustration of a person checking their reflection, ready to start their job search",
  },
  {
    number: "02",
    title: "Add your applications",
    text: "Log every job you apply to with role, company, salary range, and status. Attach the job description and resume version so everything lives in one place.",
    image: workingLate,
    alt: "Illustration of a person working late at a desk, logging job applications",
  },
  {
    number: "03",
    title: "Stay on top of everything",
    text: "Track interviews, get email reminders for follow-ups and deadlines, export your data anytime, and never miss an opportunity again.",
    image: remoteWorker,
    alt: "Illustration of a person on a headset call, ready for an interview",
  },
];
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top--visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const activeSection = useActiveSection([
    "features",
    "how-it-works",
    "testimonials",
    "faq",
  ]);
  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <h1 className="landing-logo">Georn</h1>

        <button
          className="landing-nav-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
          <button
            className={activeSection === "features" ? "nav-link--active" : ""}
            onClick={() => scrollTo("features")}
          >
            Features
          </button>
          <button
            className={
              activeSection === "how-it-works" ? "nav-link--active" : ""
            }
            onClick={() => scrollTo("how-it-works")}
          >
            How it works
          </button>
          <button
            className={
              activeSection === "testimonials" ? "nav-link--active" : ""
            }
            onClick={() => scrollTo("testimonials")}
          >
            Testimonials
          </button>
          <button
            className={activeSection === "faq" ? "nav-link--active" : ""}
            onClick={() => scrollTo("faq")}
          >
            Faqs
          </button>

          <button
            className="landing-nav-cta landing-nav-cta--mobile"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <div
          aria-label="User Login Button"
          tabIndex="0"
          role="button"
          className="user-profile"
          onClick={() => navigate("/login")}
        >
          <div className="user-profile-inner">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"></path>
              </g>
            </svg>
            <p>Log In</p>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <FadeIn direction="up">
        <section className="landing-hero">
          <div className="landing-hero-bg" />
          <div className="landing-hero-inner">
            <div className="landing-hero-badge">Your Career, in motion.</div>
            <h1 className="landing-hero-title">
              Your job search,
              <br />
              finally under control.
            </h1>
            <p className="landing-hero-sub">
              Track applications, manage interviews, set reminders, and never
              lose track of an opportunity again.
            </p>
            <div className="landing-hero-actions">
              <button
                className="landing-hero-cta"
                onClick={() => navigate("/login")}
              >
                Get started free
              </button>
              <button
                className="landing-hero-secondary"
                onClick={() => scrollTo("how-it-works")}
              >
                See how it works
              </button>
            </div>

            {/* MOCKUPS */}
            <div className="landing-mockups">
              <div className="landing-mockup-laptop">
                <div className="mockup-bar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="mockup-screen">
                  <img src={Georn} alt="" />
                </div>
              </div>
              <div className="landing-mockup-phone">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <img
                    src="https://images.unsplash.com/photo-1698680746129-89aea8bb512d?q=80&w=1343&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURES */}
      <FadeIn direction="up" delay={200}>
        <section className="landing-features" id="features">
          <div className="landing-bento-wrap">
            {/* Top row cards */}
            <div className="bento-card bento-rotate-left">
              <h3>
                <span className="bento-icon">▤</span> Kanban Board
              </h3>
              <p>
                Visualize your entire job search. Drag and drop across stages.
              </p>
            </div>

            <div className="bento-card bento-rotate-right">
              <h3>
                <span className="bento-icon">◎</span> Interview Tracking
              </h3>
              <p>Log every round, outcome, and interviewer in one place.</p>
            </div>

            {/* Center text */}
            <div className="landing-features-center">
              <h2 className="landing-section-title">Everything you need</h2>
              <p className="landing-section-sub">
                Built for job seekers who are serious about landing their next
                role.
              </p>
            </div>

            <div className="bento-card bento-rotate-left2">
              <h3>
                <span className="bento-icon">◷</span> Smart Reminders
              </h3>
              <p>
                Get email reminders for follow-ups and deadlines automatically.
              </p>
            </div>

            <div className="bento-card bento-rotate-right2">
              <h3>
                <span className="bento-icon">❏</span> Resume Manager
              </h3>
              <p>Store and manage multiple resume versions. Always ready.</p>
            </div>

            <div className="bento-card bento-bottom-center">
              <h3>
                <span className="bento-icon">◈</span> Salary Insights
              </h3>
              <p>Track salary ranges and understand your market value.</p>
            </div>

            {/* Floating decorative dots */}
            <div className="float-dot dot-1" />
            <div className="float-dot dot-2" />
            <div className="float-dot dot-3" />
          </div>
        </section>
      </FadeIn>

      {/* HOW IT WORKS */}

      <section className="hiw" id="how-it-works">
        <div className="hiw-header">
          <span className="hiw-eyebrow">How it works</span>
          <h2 className="hiw-heading">
            Get up and running
            <br /> <span className="mins">in minutes</span>
          </h2>
        </div>

        <div className="hiw-timeline">
          <div className="hiw-line" aria-hidden="true" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`hiw-step ${index % 2 === 1 ? "hiw-step--reverse" : ""}`}
            >
              <div className="hiw-content">
                <h3 className="hiw-title">{step.title}</h3>
                <p className="hiw-text">{step.text}</p>
              </div>

              <div className="hiw-marker" aria-hidden="true">
                <span className="hiw-num">{step.number}</span>
                <span className="hiw-dot" />
              </div>

              <div className="hiw-image">
                <img src={step.image} alt={step.alt} loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="landing-testimonials" id="testimonials">
        <div className="top">
          <p className="testimonials-eyebrow">Testimonials</p>
          <h2 className="testimonials-heading-top">
            Helping careers move <span className="top-s">forward.</span>
          </h2>
        </div>
        <div className="testimonials-inner">
          <div className="testimonials-left">
            <div className="testimonials-quote">"</div>
            <h2 className="testimonials-heading">
              What job seekers
              <br />
              are saying
            </h2>
            <div className="testimonials-nav">
              <button
                className="testimonials-nav-btn"
                onClick={() => {
                  document
                    .querySelector(".testimonials-track")
                    .scrollBy({ left: -340, behavior: "smooth" });
                }}
              >
                ←
              </button>
              <div className="testimonials-nav-line" />
              <button
                className="testimonials-nav-btn"
                onClick={() => {
                  document
                    .querySelector(".testimonials-track")
                    .scrollBy({ left: 340, behavior: "smooth" });
                }}
              >
                →
              </button>
            </div>
          </div>

          <div className="testimonials-right">
            <div className="testimonials-track">
              {[
                {
                  text: "I was applying to 10+ jobs a week and losing track of everything. Georn gave me a clear picture of where I stood with every company.",
                  name: "Aisha O.",
                  role: "Social Medial Manager",
                  initial: "A",
                },
                {
                  text: "The interview tracker is a game changer. I had 4 companies in different stages and never missed a follow-up. The email reminders alone are worth it.",
                  name: "Adepeju O.",
                  role: "Product Manager",
                  initial: "A",
                },
                {
                  text: "I switched from a messy Notion doc to Georn and never looked back. The Kanban board makes it so easy to see your pipeline at a glance.",
                  name: "Olaribigbe B.",
                  role: "DevOps Engineer",
                  initial: "O",
                },
                {
                  text: "The salary insights feature helped me negotiate better. I could see exactly what ranges I was targeting across all my applications and walked in confident.",
                  name: "Boluwatife A.",
                  role: "Model",
                  initial: "B",
                },
                {
                  text: "Having all my resumes in one place and being able to pick the right one per application saved me so much time. Georn is genuinely built for how job hunting actually works.",
                  name: "Emeka R.",
                  role: "UX Designer",
                  initial: "E",
                },
              ].map((t, i) => (
                <div className="testimonial-card" key={i}>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initial}</div>
                    <div>
                      <p className="testimonial-name">{t.name}</p>
                      <p className="testimonial-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-faq" id="faq">
        <FadeIn direction="up">
          <div className="landing-section-header">
            <p className="testimonials-eyebrow">FAQs</p>
            <h2 className="landing-section-title">
              Frequently asked questions
            </h2>
          </div>
        </FadeIn>

        <div className="faq-list">
          {[
            {
              q: "Is Georn free to use?",
              a: "Yes, Georn is completely free. Create an account and start tracking your job search immediately with no credit card required.",
            },
            {
              q: "How many applications can I track?",
              a: "Unlimited. There is no cap on the number of job applications, interview rounds, or resumes you can add to your account.",
            },
            {
              q: "How do email reminders work?",
              a: "When you set a follow-up date or application deadline on any application, Georn automatically sends you an email reminder on that date at 8AM so you never miss it.",
            },
            {
              q: "Can I store multiple versions of my resume?",
              a: "Yes. The Resume Manager lets you upload, name, and manage as many resume versions as you need — Frontend Resume, Backend Resume, Product Resume, and so on.",
            },
            {
              q: "Can I export my data?",
              a: "Yes. You can export all your applications as a CSV file at any time from the Applications page and open it in Excel or Google Sheets.",
            },
          ].map((item, i) => (
            <FadeIn direction="up" delay={i * 100} key={i}>
              <FAQItem q={item.q} a={item.a} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}

      <section className="landing-cta-banner">
        <div className="cta-float-dot cta-dot-1" />
        <div className="cta-float-dot cta-dot-2" />
        <div className="cta-float-dot cta-dot-3" />
        <div className="cta-float-dot cta-dot-4" />
        <div className="cta-ring" />

        <div className="landing-cta-inner">
          <FadeIn direction="up">
            <h2 className="landing-cta-title">
              Ready to <span className="ready">take control</span> of your job
              search?
            </h2>
            <p className="landing-cta-sub">
              Join job seekers who use Georn to stay organized and land faster.
            </p>

            <button
              className="animated-button"
              onClick={() => navigate("/login")}
            >
              <svg
                viewBox="0 0 24 24"
                className="arr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
              <span className="text">Join Us</span>
              <span className="circle"></span>
              <svg
                viewBox="0 0 24 24"
                className="arr-1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
            </button>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="ftr-inner">
          <div className="ftr-top">
            <div className="ftr-brand">
              <div className="ftr-logo">
                <span className="ftr-logo-mark" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
                    <path d="M3 12h18" />
                  </svg>
                </span>
                <span className="ftr-logo-text">GEORN</span>
              </div>
              <p className="ftr-desc">
                Track every job application, resume, and interview in one
                organized place.
              </p>
            </div>

            <div className="ftr-newsletter">
              <h4 className="ftr-heading">Newsletter</h4>
              <form
                className="ftr-newsletter-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="ftr-newsletter-input"
                  required
                />
                <button type="submit" className="ftr-newsletter-btn">
                  Submit
                </button>
              </form>
              <p className="ftr-newsletter-text">
                Get job search tips, product updates, and new features in your
                inbox.
              </p>
            </div>
          </div>

          <div className="ftr-links">
            <div className="ftr-col">
              <h5 className="ftr-col-heading">Quick Links</h5>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ftr-col">
              <h5 className="ftr-col-heading">Legal</h5>
              <ul>
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ftr-col">
              <h5 className="ftr-col-heading">Connect With Us</h5>
              <ul className="ftr-contact">
                <li>
                  <a href="mailto:georn.tracker@gmail.com">
                    georn.tracker@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+2349013986749">+234 90 139 86749</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="ftr-divider" />

          <p className="ftr-copyright">© {year} Georn. All Rights Reserved.</p>
        </div>

        <div className="ftr-skyline" aria-hidden="true">
          <img src={skylineImg} alt="" className="ftr-skyline-img" />
        </div>
      </footer>
      <BackToTop />
    </div>
  );
};

export default Landing;
