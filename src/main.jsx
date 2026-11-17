import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Minus,
  X,
  Menu,
  Sparkles,
  Check,
  Copy,
  Linkedin,
  FileDown,
  ScanLine,
  MoveUpRight,
  CornerDownRight,
} from "lucide-react";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import { profile, researchLenses, focusAreas, approachSteps } from "./content";
import "./styles.css";

function Mark({ small = false }) {
  return (
    <span className={`brand-mark ${small ? "small" : ""}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const links = [
    ["focus", "Research"],
    ["about", "About"],
    ["approach", "Approach"],
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          href="#home"
          className="brand"
          aria-label="Sandy Holley, home"
          onClick={() => setOpen(false)}
        >
          <Mark />
          <span>
            {profile.shortName}
            <small>RESEARCH & INSIGHTS</small>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
          id="main-navigation"
        >
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <span className="nav-dot" />
            </a>
          ))}
          <a
            href="#contact"
            className="button button-dark nav-contact"
            onClick={() => setOpen(false)}
          >
            Let’s connect <ArrowUpRight size={16} />
          </a>
        </nav>
        <button
          className="menu-toggle icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function ResearchExplorer() {
  const [lens, setLens] = useState("Market");
  const [selected, setSelected] = useState(9);
  const data = researchLenses[lens];
  const point = data.points[selected];
  return (
    <div
      className="research-explorer"
      aria-label="Interactive research illustration"
    >
      <div className="explorer-heading">
        <span>
          <span className="status-dot" /> THE RESEARCH LENS
        </span>
        <ScanLine size={19} strokeWidth={1.3} />
      </div>
      <div className="explorer-title">
        A different lens.
        <br />
        <em>A new perspective.</em>
      </div>
      <div className="plot-wrap">
        <span className="axis-y">{data.y}</span>
        <svg
          viewBox="0 0 500 315"
          className="scatter-plot"
          aria-label={`Illustrative ${lens.toLowerCase()} research scatter plot. Select a point to explore.`}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="1" x2="1" y2="0">
              <stop stopColor="#98ae82" stopOpacity="0" />
              <stop offset="1" stopColor="#6c895b" stopOpacity=".7" />
            </linearGradient>
          </defs>
          {[60, 120, 180, 240, 300].map((y) => (
            <line
              key={`y${y}`}
              x1="25"
              y1={y}
              x2="480"
              y2={y}
              className="plot-grid"
            />
          ))}
          {[40, 120, 200, 280, 360, 440].map((x) => (
            <line
              key={`x${x}`}
              x1={x}
              y1="20"
              x2={x}
              y2="288"
              className="plot-grid"
            />
          ))}
          <path
            d={`M 30 280 Q 170 ${lens === "Product" ? 110 : 240}, 470 45`}
            className="trend-line"
          />
          <line
            x1={point[0]}
            y1={point[1]}
            x2={point[0]}
            y2="298"
            className="selected-guide"
          />
          <line
            x1="26"
            y1={point[1]}
            x2={point[0]}
            y2={point[1]}
            className="selected-guide"
          />
          <circle className="point-halo" cx={point[0]} cy={point[1]} r="27" />
          {data.points.map(([x, y], i) => (
            <g
              className={`data-point ${i === selected ? "selected" : ""}`}
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`${lens} observation ${i + 1}`}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(i);
                }
              }}
            >
              <circle cx={x} cy={y} r="15" fill="transparent" />
              <circle
                className="point-core"
                cx={x}
                cy={y}
                r={i === selected ? 7 : i % 3 === 0 ? 5 : 4}
              />
            </g>
          ))}
          <g
            className="plot-callout"
            transform={`translate(${Math.min(Math.max(point[0] - 75, 30), 283)}, ${Math.max(point[1] - 67, 5)})`}
            aria-hidden="true"
          >
            <rect width="184" height="39" rx="7" />
            <text x="13" y="24">
              There’s a story in the signal.
            </text>
            <path d="M75 39l7 7 7-7" />
          </g>
        </svg>
        <span className="axis-x">
          {data.x} <ArrowRight size={12} />
        </span>
      </div>
      <div className="lens-controls" aria-label="Research lenses">
        {Object.keys(researchLenses).map((name) => (
          <button
            key={name}
            aria-pressed={lens === name}
            onClick={() => setLens(name)}
          >
            {name} {lens === name && <span />}
          </button>
        ))}
        <span className="explore-hint">
          Switch your perspective <MoveUpRight size={13} />
        </span>
      </div>
      <div className="explorer-caption" aria-live="polite">
        <span>{data.question}</span>
        <span>ILLUSTRATIVE DATA</span>
      </div>
      <div className="insight-sticker">
        <span className="sticker-icon">
          <Sparkles size={19} strokeWidth={1.5} />
        </span>
        <span>
          Connecting the dots.<small>Finding the human story.</small>
        </span>
        <span className="sticker-line" />
      </div>
    </div>
  );
}

function FocusArt({ type, large = false }) {
  if (type === "market")
    return (
      <div
        className={`focus-art art-market ${large ? "large" : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 360 210">
          <defs>
            <pattern
              id={`marketGrid${large}`}
              width="26"
              height="26"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M26 0H0V26"
                fill="none"
                stroke="#b8bca5"
                strokeWidth=".5"
                opacity=".6"
              />
            </pattern>
          </defs>
          <rect width="360" height="210" fill={`url(#marketGrid${large})`} />
          <circle
            cx="180"
            cy="104"
            r="71"
            fill="none"
            stroke="#9ba986"
            strokeDasharray="3 5"
          />
          <circle cx="180" cy="104" r="45" fill="#e9efdc" stroke="#9ba986" />
          {[
            [95, 57],
            [89, 143],
            [267, 64],
            [271, 146],
          ].map(([x, y], i) => (
            <g key={i}>
              <path
                d={`M${x} ${y}L180 104`}
                stroke="#8e9b7b"
                strokeDasharray="3 3"
              />
              <circle cx={x} cy={y} r="20" fill="#f4f6ed" stroke="#a9b397" />
              <circle cx={x} cy={y - 4} r="4.5" fill="#829268" />
              <path d={`M${x - 8} ${y + 8}q0-9 8-9t8 9`} fill="#829268" />
            </g>
          ))}
          <circle cx="180" cy="96" r="9" fill="#415a38" />
          <path d="M163 121q0-18 17-18t17 18" fill="#415a38" />
          <rect x="134" y="172" width="93" height="24" rx="12" fill="#fff" />
          <text
            x="180"
            y="188"
            textAnchor="middle"
            fill="#566348"
            fontSize="9"
            fontFamily="DM Sans"
          >
            THE HUMAN FACTOR
          </text>
        </svg>
      </div>
    );
  if (type === "product")
    return (
      <div
        className={`focus-art art-product ${large ? "large" : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 360 210">
          <path d="M56 119h248" stroke="#a6b9b6" strokeDasharray="4 5" />
          <circle cx="56" cy="119" r="4" fill="#708f87" />
          <circle cx="304" cy="119" r="4" fill="#708f87" />
          <g transform="translate(87 40) rotate(-8 62 66)">
            <rect
              width="105"
              height="135"
              rx="9"
              fill="#d9e3df"
              stroke="#9fb5ac"
            />
            <rect x="12" y="15" width="48" height="5" rx="2" fill="#99aea3" />
            <rect x="12" y="32" width="80" height="44" rx="4" fill="#b6ccc0" />
            <path
              d="M13 91h56m-56 11h76"
              stroke="#9aafa5"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="13" y="116" width="35" height="8" rx="4" fill="#99aea3" />
          </g>
          <g transform="translate(162 29) rotate(6 60 75)">
            <rect
              width="112"
              height="151"
              rx="9"
              fill="#fbfcf8"
              stroke="#7c9a8b"
            />
            <circle cx="17" cy="17" r="4" fill="#88a896" />
            <path
              d="M30 17h44"
              stroke="#b3c4b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="13" y="32" width="86" height="52" rx="4" fill="#dce8dc" />
            <path
              d="m40 64 13-13 13 13 12-19"
              fill="none"
              stroke="#779a80"
              strokeWidth="2"
            />
            <path
              d="M14 98h68m-68 10h46"
              stroke="#bdcbc0"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="13" y="122" width="86" height="16" rx="4" fill="#456451" />
          </g>
          <circle cx="269" cy="55" r="15" fill="#eaf2e6" stroke="#8ca78e" />
          <path
            d="m263 55 4 4 8-8"
            stroke="#5e7e5a"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  return (
    <div
      className={`focus-art art-data ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 210">
        {[55, 90, 125, 160].map((y) => (
          <path key={y} d={`M66 ${y}h234`} stroke="#c7c3af" strokeWidth=".6" />
        ))}
        {[35, 58, 44, 84, 105, 126, 114].map((h, i) => (
          <rect
            key={i}
            x={76 + i * 31}
            y={169 - h}
            width="17"
            height={h}
            rx="3"
            fill={i === 5 ? "#647047" : "#d1cfb6"}
            opacity={i === 5 ? 1 : 0.9}
          />
        ))}
        <path
          d="m83 130 31-28 31 11 31-45 31-7 31-23 31 8"
          stroke="#69744e"
          strokeWidth="2"
          fill="none"
        />
        {[
          [83, 130],
          [114, 102],
          [145, 113],
          [176, 68],
          [207, 61],
          [238, 38],
          [269, 46],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#f5f2e5"
            stroke="#69744e"
            strokeWidth="1.5"
          />
        ))}
        <rect x="119" y="180" width="124" height="21" rx="10" fill="#fcfbf5" />
        <text
          x="181"
          y="194"
          textAnchor="middle"
          fontSize="9"
          fill="#777951"
          fontFamily="DM Sans"
        >
          FROM SIGNAL TO INSIGHT
        </text>
      </svg>
    </div>
  );
}

function FocusModal({ area, close }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  function dismiss() {
    dialog.current.close();
    close();
  }
  return (
    <dialog
      className="focus-dialog"
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-inner">
        <button
          autoFocus
          className="icon-button dialog-close"
          onClick={dismiss}
          aria-label="Close research focus"
        >
          <X size={20} />
        </button>
        <span className="eyebrow">
          RESEARCH LENS / {area.category.toUpperCase()}
        </span>
        <h2 id="dialog-title">{area.title.replace("\n", " ")}</h2>
        <FocusArt type={area.id} large />
        <p className="dialog-overview">{area.overview}</p>
        <h3>A question worth exploring</h3>
        <p className="dialog-question">“{area.question}”</p>
        <h3>How I’d approach it</h3>
        <ol>
          {area.steps.map((step, i) => (
            <li key={step}>
              <span>0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="method-tags">
          {area.methods.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>
        <p className="content-note">
          This is an introduction to a research interest, not a completed case
          study. Project details will be added as the portfolio grows.
        </p>
      </div>
    </dialog>
  );
}

function FocusSection() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const lastTrigger = useRef(null);
  function closeModal() {
    setSelected(null);
    lastTrigger.current?.focus();
  }
  return (
    <section className="focus-section section container" id="focus">
      <div className="section-top reveal">
        <span className="eyebrow">
          <span className="section-index">01 /</span> RESEARCH INTERESTS
        </span>
        <span className="section-note">
          <span className="tiny-dot" /> Different questions. Shared curiosity.
        </span>
      </div>
      <div className="section-heading reveal">
        <div>
          <h2>
            Looking closer.
            <br />
            <em>Seeing more.</em>
          </h2>
          <p>
            People, products, and the patterns in between.
            <br />A few areas I’m curious about.
          </p>
        </div>
        <div className="filter-controls" aria-label="Filter research interests">
          {["All", "Market", "Product", "Data"].map((name) => (
            <button
              key={name}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name}
              {name === "All" && <span>03</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="focus-grid" aria-live="polite">
        {focusAreas
          .filter((area) => filter === "All" || area.category === filter)
          .map((area) => (
            <button
              className={`focus-card focus-card-${area.id}`}
              key={area.id}
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setSelected(area);
              }}
              aria-label={`Explore ${area.category.toLowerCase()} research focus`}
            >
              <div className="card-art-wrap">
                <FocusArt type={area.id} />
                <span className="card-number">{area.number}</span>
                <span className="card-open">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="card-body">
                <span className="eyebrow card-eyebrow">{area.tag}</span>
                <h3>
                  {area.title.split("\n").map((line, i) => (
                    <React.Fragment key={line}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </h3>
                <p>{area.description}</p>
                <div className="card-bottom">
                  <span>{area.category} research</span>
                  <ArrowUpRight size={17} />
                </div>
              </div>
            </button>
          ))}
      </div>
      <div className="work-note reveal">
        <span className="work-note-icon">
          <Plus size={15} />
        </span>
        <span>
          A portfolio in progress.{" "}
          <span>More stories and case studies to come.</span>
        </span>
      </div>
      {selected && <FocusModal area={selected} close={closeModal} />}
    </section>
  );
}

function About() {
  return (
    <section className="about-section section" id="about">
      <div className="container">
        <div className="section-top reveal">
          <span className="eyebrow">
            <span className="section-index">02 /</span> THE PERSON BEHIND THE
            QUESTIONS
          </span>
        </div>
        <div className="about-grid">
          <div className="about-visual reveal">
            <div className="about-visual-top">
              <Mark small />
              <span>ALWAYS A LITTLE CURIOUS.</span>
              <ArrowUpRight size={18} />
            </div>
            <div className="orbit-system" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <span className="orbit-center">
                sh<span>;</span>
              </span>
              <span className="orbit-label label-people">People</span>
              <span className="orbit-label label-products">Products</span>
              <span className="orbit-label label-patterns">Patterns</span>
              <span className="orbit-dot one" />
              <span className="orbit-dot two" />
              <span className="orbit-dot three" />
            </div>
            <div className="about-visual-bottom">
              <span>
                Sandy Yoga
                <br />
                Prakasa Holley
              </span>
              <span>
                CURIOUS BY NATURE.
                <br />
                THOUGHTFUL BY APPROACH.
              </span>
            </div>
          </div>
          <div className="about-copy reveal">
            <h2>
              Hi, I’m Sandy.
              <br />
              <em>Curiosity is my compass.</em>
            </h2>
            <p>
              I’m Sandy Yoga Prakasa Holley, an aspiring researcher interested
              in how people think, what they need, and why they make the choices
              they do.
            </p>
            <p>
              My experience as a{" "}
              <strong>research intern in data and product</strong> has shaped my
              interest in connecting evidence with real human context. I’m
              looking to bring that perspective to market research and research
              roles.
            </p>
            <p>
              I enjoy the moment when scattered information starts to make
              sense—and a better question leads to a clearer direction.
            </p>
            <div className="experience-snippet">
              <span className="experience-icon">
                <ScanLine size={21} strokeWidth={1.5} />
              </span>
              <div>
                <span className="eyebrow">EXPERIENCE SNAPSHOT</span>
                <h3>
                  Research Intern <span>— Data & Product</span>
                </h3>
              </div>
              <ArrowUpRight size={19} />
            </div>
            {profile.resume && (
              <a className="text-link" href={profile.resume} download>
                Download my résumé <FileDown size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  const [active, setActive] = useState(0);
  return (
    <section className="approach-section section container" id="approach">
      <div className="section-top reveal">
        <span className="eyebrow">
          <span className="section-index">03 /</span> HOW I THINK
        </span>
        <span className="section-note">
          An open mind. A considered process.
        </span>
      </div>
      <div className="approach-grid">
        <div className="approach-heading reveal">
          <h2>
            Good research.
            <br />
            <em>Thoughtful steps.</em>
          </h2>
          <p>
            A simple philosophy: ask with purpose,
            <br />
            explore with care, and make it useful.
          </p>
          <div className="process-line" aria-hidden="true">
            {approachSteps.map((s, i) => (
              <React.Fragment key={s.short}>
                <span className={i <= active ? "reached" : ""}>
                  {i === active ? (
                    <Sparkles size={18} />
                  ) : (
                    <span>0{i + 1}</span>
                  )}
                </span>
                {i < 2 && <i className={i < active ? "reached" : ""} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="approach-accordion reveal">
          {approachSteps.map((s, i) => (
            <div
              className={`approach-item ${i === active ? "expanded" : ""}`}
              key={s.name}
            >
              <h3>
                <button
                  aria-expanded={active === i}
                  aria-controls={`step-panel-${i}`}
                  id={`step-button-${i}`}
                  onClick={() => setActive(i)}
                >
                  <span className="step-number">0{i + 1}</span>
                  <span>{s.name}</span>
                  {i === active ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </h3>
              <div
                className="step-panel"
                id={`step-panel-${i}`}
                role="region"
                aria-labelledby={`step-button-${i}`}
                hidden={active !== i}
              >
                <p>{s.text}</p>
                <span className="step-question">
                  <CornerDownRight size={12} aria-hidden="true" /> {s.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyName() {
    try {
      await navigator.clipboard.writeText(profile.name);
      setCopied(true);
      setCopyFailed(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-inner">
        <div className="contact-main reveal">
          <div>
            <span className="eyebrow">
              <span className="status-dot" /> OPEN TO RESEARCH OPPORTUNITIES
            </span>
            <h2>
              Big questions.
              <br />
              <em>Let’s explore them.</em>
            </h2>
            <p>
              Interested in thoughtful research and a fresh perspective?{" "}
              <br />
              I’d love to be part of the conversation.
            </p>
          </div>
          <a
            className="contact-arrow"
            href={
              profile.email ? `mailto:${profile.email}` : "#contact-details"
            }
            aria-label={profile.email ? "Email Sandy" : "View contact details"}
          >
            <ArrowUpRight size={44} strokeWidth={1.3} />
          </a>
        </div>
        <div className="contact-bottom reveal" id="contact-details">
          <div className="contact-details">
            <span className="eyebrow">LET’S CONNECT</span>
            {profile.email ? (
              <a href={`mailto:${profile.email}`}>
                {profile.email} <ArrowUpRight size={15} />
              </a>
            ) : (
              <span className="contact-pending">
                Contact details coming soon <span className="tiny-dot" />
              </span>
            )}
          </div>
          <div className="contact-links">
            {profile.linkedIn && (
              <a href={profile.linkedIn} target="_blank" rel="noreferrer">
                <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
              </a>
            )}
            <button onClick={copyName} className="copy-button">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span aria-live="polite">
                {copied
                  ? "Name copied"
                  : copyFailed
                    ? profile.name
                    : "Keep my name handy"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero container" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="status-dot" /> A LITTLE CURIOSITY GOES A LONG
                WAY
              </div>
              <h1>
                A curious mind.
                <br />A <em>clearer</em> picture
                <span className="title-period">.</span>
              </h1>
              <p className="hero-description">
                I’m <strong>{profile.name}.</strong>
                <br />
                Exploring people, products, and the patterns behind
                <br className="desktop-break" /> better decisions.
              </p>
              <div className="hero-actions">
                <a className="button button-lime" href="#focus">
                  Explore my perspective <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#about">
                  Meet Sandy <ArrowDown size={15} />
                </a>
              </div>
              <div className="hero-footnote">
                <span className="short-line" /> Rooted in data. Interested in
                people.
              </div>
            </div>
            <div className="hero-graphic">
              <ResearchExplorer />
            </div>
          </div>
          <div className="discipline-strip">
            <span className="strip-label">MY AREAS OF CURIOSITY</span>
            <div>
              <span>Market research</span>
              <Plus />
              <span>Product research</span>
              <Plus />
              <span>Data & insights</span>
            </div>
            <a href="#focus" aria-label="Scroll to research interests">
              <ArrowDown size={19} />
            </a>
          </div>
        </section>
        <FocusSection />
        <About />
        <Approach />
        <Contact />
      </main>
      <footer className="site-footer container">
        <a href="#home" className="footer-brand">
          <Mark small />
          <span>{profile.shortName}</span>
        </a>
        <span>Thoughtfully curious. Always learning.</span>
        <a href="#home" className="back-top">
          Back to top <ArrowUp size={14} />
        </a>
        <span className="copyright">© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
