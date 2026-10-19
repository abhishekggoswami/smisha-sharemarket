"use client";

import { useEffect, useState } from "react";
import SiteHeader from "./SiteHeader";
import { SiteFooter } from "./SharedSiteSections";
import { pastWorkshops } from "../lib/workshops";
import TextPressure from "./TextPressure";

const principles = [
  [
    "fa-chart-line",
    "Learn through application",
    "Convert ideas into reliable habits with real charts, guided examples, and focused practice.",
  ],
  [
    "fa-compass",
    "Act with a plan",
    "Follow a structured routine that puts preparation, exposure management, and risk first.",
  ],
  [
    "fa-people-group",
    "Advance together",
    "Build momentum with mentors and peers who keep your development on track.",
  ],
];

const learningReasons = [
  [
    "Built for every starting point",
    "Follow a clear path from the essentials to advanced setups, strategies, and risk awareness.",
  ],
  [
    "Market-led practice",
    "Work with live charts, indicators, and real scenarios instead of studying ideas in isolation.",
  ],
  [
    "Guided live learning",
    "Join market walkthroughs, get questions answered, and receive ongoing direction from mentors.",
  ],
  [
    "Calm, consistent trading",
    "Strengthen risk habits, emotional control, and the patience behind sustainable decisions.",
  ],
];

const tradingValues = [
  [
    "fa-shield-halved",
    "Transparent by design",
    "Receive honest explanations and realistic expectations at every stage of learning.",
  ],
  [
    "fa-feather-pointed",
    "Keep it clear",
    "Turn complex market ideas into simple, logical steps you can follow.",
  ],
  [
    "fa-chart-line",
    "Learn in context",
    "Connect theory to charts, price movement, and the situations traders see each day.",
  ],
  [
    "fa-circle-check",
    "Lead with discipline",
    "Make room for sensible risk limits, composure, and repeatable decision-making.",
  ],
  [
    "fa-rocket",
    "Improve over time",
    "Refine your approach as markets change and your experience grows.",
  ],
];

const proofPoints = [
  ["8+", "years in active markets"],
  ["100s", "learners supported"],
  ["Live", "market-led learning"],
];

const trustStats = [
  ["8+", "years of experience"],
  ["100+", "successful courses"],
  ["12+", "expert mentors"],
  ["1,100+", "happy traders"],
];

function PastWorkshopSlideshow() {
  const photos = pastWorkshops[0]?.photos ?? [];
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (
      photos.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setActivePhoto((current) => (current + 1) % photos.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  if (!photos.length) return null;

  return (
    <div
      className="about-workshop-slideshow"
      role="list"
      aria-label="Highlights from Smisha past workshops"
    >
      {photos.map((photo, index) => (
        <button
          key={photo.src}
          className={`about-workshop-panel${index === activePhoto ? " is-active" : ""}`}
          type="button"
          role="listitem"
          aria-label={photo.alt}
          aria-pressed={index === activePhoto}
          onMouseEnter={() => setActivePhoto(index)}
          onFocus={() => setActivePhoto(index)}
          onClick={() => setActivePhoto(index)}
        >
          <span className="about-workshop-media">
            <img
              src={photo.src}
              alt={index === activePhoto ? photo.alt : ""}
              aria-hidden={index !== activePhoto}
              decoding="async"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </span>
          <span className="about-workshop-shade" aria-hidden="true" />
          <span className="about-workshop-caption">
            <i aria-hidden="true" />
            <span>{photo.alt}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="course-shell about-page-shell">
      <SiteHeader active="About Us" demoHref="#contact" />

      <section
        className="about-page-hero shared-atmosphere-hero"
        aria-labelledby="about-page-title"
      >
        <video
          className="shared-hero-atmosphere"
          src="/assets/courses/courses-hero-atmosphere.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="shared-hero-atmosphere-shade" aria-hidden="true" />
        <div
          className="about-hero-orbit about-hero-orbit-one"
          aria-hidden="true"
        />
        <div
          className="about-hero-orbit about-hero-orbit-two"
          aria-hidden="true"
        />
        <div className="about-page-hero-inner">
          <div>
            <p className="course-kicker">
              <i className="fa-solid fa-seedling" /> About Smisha
            </p>
          <h1 id="about-page-title">
            <TextPressure text="Market education for" />
            <br />
            <strong>
              <TextPressure
                text="clearer, steadier decisions."
                minWeight={700}
              />
            </strong>
          </h1>
            <p>
              Smisha Share Market Classes helps aspiring traders turn curiosity
              into practical market knowledge, disciplined habits, and the
              confidence to act with intention.
            </p>
            <a className="course-primary-button" href="/contact">
              Talk to our team <i className="fa-solid fa-phone" />
            </a>
          </div>
          <aside
            className="about-hero-note"
            aria-label="Smisha learning approach"
          >
            <i className="fa-solid fa-lightbulb" aria-hidden="true" />
            <p>OUR APPROACH</p>
            <strong>
              Relevant lessons.
              <br />
              Experienced direction.
              <br />
              Stronger confidence.
            </strong>
          </aside>
        </div>
      </section>

      <section className="about-who" aria-labelledby="about-who-title">
        <div className="about-who-intro">
          <p className="about-who-kicker">MEET SMISHA</p>
          <h2 id="about-who-title">A practical place to learn the markets</h2>
          <p className="about-who-subtitle">
            Market education for informed trading choices
          </p>
          <div className="about-who-rule" aria-hidden="true" />
          <div className="about-who-copy">
            <p>
              <strong>Smisha Share Market</strong> gives aspiring traders and
              investors the knowledge, tools, and direction to approach the
              market with greater certainty. Drawing on{" "}
              <strong>more than eight years of active market experience</strong>
              , we have supported hundreds of learners as they develop
              confidence and make clearer decisions.
            </p>
            <p>
              Our team teaches from experience, not from theory alone. As{" "}
              <strong>active market participants</strong>, we keep every lesson
              simple, actionable, and connected to the decisions learners face
              in real conditions.
            </p>
          </div>
          <div
            className="about-proof-strip"
            aria-label="Smisha experience at a glance"
          >
            {proofPoints.map(([value, label]) => (
              <article key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <h3>What sets us apart?</h3>
          <div className="about-learning-reasons">
            {learningReasons.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h4>{title}</h4>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-belief" aria-labelledby="about-belief-title">
        <div className="about-values">
          <p className="about-who-kicker">OUR TEACHING COMMITMENTS</p>
          <div className="about-values-list">
            {tradingValues.map(([icon, title, copy]) => (
              <article key={title}>
                <i className={`fa-solid ${icon}`} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="about-values-signoff">
            <span />
            Study. Practise. Progress.
            <span />
          </p>
        </div>
        <div className="about-belief-copy">
          <h2 id="about-belief-title">The principles we stand for</h2>
          <p className="about-who-kicker">
            YOUR PROGRESS, THOUGHTFULLY SUPPORTED
          </p>
          <p>
            <strong>Smisha Share Market</strong> offers hands-on market
            education for first-time learners and experienced traders alike.
            Over more than six years, we have helped hundreds of students build
            skills in trading, technical analysis, and risk planning so they can
            participate with greater confidence and consistency.
          </p>
          <p>
            Whether you are taking your first steps or refining an established
            method, you will find expert input, practical tools, and ongoing
            support designed to help you trade independently and with
            discipline.
          </p>
          <div className="about-belief-pillars">
            <article>
              <i className="fa-solid fa-lightbulb" aria-hidden="true" />
              <h3>Our Vision</h3>
              <p>
                To help shape a more confident community of market learners
                across India through clarity, sound habits, and a long-term
                perspective.
              </p>
            </article>
            <article>
              <i className="fa-solid fa-trophy" aria-hidden="true" />
              <h3>Our Mission</h3>
              <p>
                To make market education easier to access through structured,
                practical teaching, live-market context, and meaningful
                mentorship.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <div className="about-story-media">
          <img
            src={pastWorkshops[0].photos[0].src}
            alt={pastWorkshops[0].photos[0].alt}
          />
          <span>SMISHA SHARE MARKET · LIVE LEARNING</span>
        </div>
        <div className="about-story-copy">
          <p className="section-label">OUR STORY</p>
          <h2 id="about-story-title">
            We make the market
            <br />
            <strong>more approachable.</strong>
          </h2>
          <p>
            Markets can feel overwhelming when learning stays theoretical. At
            Smisha, our focus is on helping learners connect concepts with the
            situations they will actually encounter: reading charts,
            understanding risk, building a process, and asking better questions.
          </p>
          <p>
            Whether you are taking your first step or refining an existing
            approach, our learning experience is built to be clear, practical,
            and grounded in long-term thinking.
          </p>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <div className="about-section-heading">
          <p className="section-label">HOW WE HELP YOU GROW</p>
          <h2 id="principles-title">
            Build market skills
            <br />
            <strong>that work in practice.</strong>
          </h2>
        </div>
        <div className="about-principles-grid">
          {principles.map(([icon, title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <i className={`fa-solid ${icon}`} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="about-trust-section"
        aria-labelledby="about-trust-title"
      >
        <div className="about-trust" aria-labelledby="about-trust-title">
          <h3 id="about-trust-title">Trusted by 1,000+ traders across India</h3>
          <div className="about-trust-stats">
            {trustStats.map(([value, label]) => (
              <article key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <PastWorkshopSlideshow />
        </div>
      </section>

      <section
        className="about-associations"
        aria-labelledby="associations-title"
      >
        <p className="about-associations-kicker">Our market ecosystem</p>
        <h2 id="associations-title">Officially associated with</h2>
        <div className="about-associations-logos">
          <div className="about-association-logo">
            <img
              src="/assets/about/angel-one-logo.webp"
              alt="Angel One"
              width="650"
              height="200"
              decoding="async"
            />
          </div>
          <div className="about-association-logo">
            <img
              src="/assets/about/dhan-logo.webp"
              alt="Dhan"
              width="484"
              height="200"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="about-vision" aria-labelledby="vision-title">
        <div className="about-vision-heading">
          <p className="section-label">LOOKING AHEAD</p>
          <h2 id="vision-title">
            Make informed choices
            <br />
            <strong>feel within reach.</strong>
          </h2>
        </div>
        <p>
          We want useful financial education to be accessible from day one. By
          combining clear teaching, hands-on market exposure, and dependable
          guidance, we help learners participate thoughtfully and make more
          considered decisions.
        </p>
      </section>

      <SiteFooter hideContactStrip />
    </main>
  );
}
