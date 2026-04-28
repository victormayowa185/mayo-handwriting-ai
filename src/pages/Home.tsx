import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { FaBrain, FaFileImage, FaUserCheck, FaShieldAlt } from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const loopTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const hero = heroTextRef.current;
    const corners = [
      cornerTLRef.current,
      cornerTRRef.current,
      cornerBLRef.current,
      cornerBRRef.current,
    ];
    const scanLine = scanLineRef.current;
    const output = outputRef.current;
    const contentArea = contentAreaRef.current;
    const cta = ctaRef.current;
    const features = featuresRef.current;

    if (!hero || !scanLine || !output || !contentArea) return;

    // ── Initial states ──
    gsap.set(hero, { clipPath: "circle(0% at 50% 50%)", opacity: 0 });
    corners.forEach((c) => c && gsap.set(c, { opacity: 0 }));
    gsap.set(scanLine, { top: 0, opacity: 0, visibility: "hidden" });
    gsap.set(output, { opacity: 0 });
    if (cta) gsap.set(cta, { opacity: 0 });
    if (features) gsap.set(features, { opacity: 0, y: 20 });

    const mainTl = gsap.timeline({
      onComplete: () => {
        // Show CTA and feature cards once
        if (cta)
          gsap.to(cta, { opacity: 1, duration: 0.7, ease: "power2.out" });
        if (features)
          gsap.to(features, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });

        if (loopTlRef.current) {
          loopTlRef.current.kill();
          loopTlRef.current = null;
        }

        // ── Infinite loop (slower, adjustable) ──
        const loopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 }); // <-- pause between loops

        loopTl
          .set(hero, { clipPath: "circle(0% at 50% 50%)", opacity: 0 })
          .set(output, { opacity: 0 })
          .set(scanLine, { top: 0, visibility: "hidden", opacity: 0 })
          .set(corners, { opacity: 0 })
          // 1. Hero reveals
          .to(hero, {
            clipPath: "circle(100% at 50% 50%)",
            opacity: 1,
            duration: 1.0, // ⏱ hero reveal speed (seconds)
            ease: "power3.out",
          })
          // 2. Corners pop in
          .to(corners, {
            opacity: 1,
            duration: 0.4, // ⏱ corner animation speed
            stagger: 0.08, // ⏱ delay between each corner
            ease: "back.out(1.7)",
          })
          // 3. Scan line sweep
          .add(() => gsap.set(scanLine, { visibility: "visible" }))
          .fromTo(
            scanLine,
            { top: 0, opacity: 1 },
            {
              top: contentArea.offsetHeight,
              duration: 1.5, // ⏱ laser travel time (slower = more dramatic)
              ease: "power2.inOut",
            },
          )
          // 4. Hide scan line, fade hero, show message
          .to(scanLine, { opacity: 0, duration: 0.2 })
          .set(scanLine, { visibility: "hidden", top: 0 })
          .to(hero, { opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.2")
          .to(
            output,
            { opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          )
          .to(output, { opacity: 0, duration: 0.6, delay: 11.9 }); // ⏱ how long message stays visible

        loopTlRef.current = loopTl;
      },
    });

    // ── First entrance (perfect, unchanged) ──
    mainTl
      .to(hero, {
        clipPath: "circle(100% at 50% 50%)",
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(corners, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
      .add(() => gsap.set(scanLine, { visibility: "visible" }))
      .fromTo(
        scanLine,
        { top: 0, opacity: 1 },
        {
          top: contentArea.offsetHeight,
          duration: 1.8,
          ease: "power2.inOut",
        },
      )
      .to(scanLine, { opacity: 0, duration: 0.2 })
      .set(scanLine, { visibility: "hidden", top: 0 })
      .to(hero, { opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.2")
      .to(output, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");

    return () => {
      mainTl.kill();
      if (loopTlRef.current) {
        loopTlRef.current.kill();
        loopTlRef.current = null;
      }
      gsap.killTweensOf(scanLine);
      gsap.killTweensOf(hero);
      gsap.killTweensOf(output);
    };
  }, []);

  const features = [
    {
      icon: <FaBrain />,
      title: "AI-Powered Recognition",
      desc: "Our advanced AI model accurately reads handwriting—neat or messy.",
    },
    {
      icon: <FaFileImage />,
      title: "Multi-Format",
      desc: "Supports JPEG, PNG, WebP, and images copied to your clipboard.",
    },
    {
      icon: <FaUserCheck />,
      title: "Super Simple",
      desc: "Just upload, paste, or drop an image—no sign‑ups, no hassles.",
    },
    {
      icon: <FaShieldAlt />,
      title: "100% Private",
      desc: "Everything stays on your device. No uploads, no servers, no logs.",
    },
  ];

  return (
    <div className="home">
      <div className="scanner-container">
        <div className="corner top-left" ref={cornerTLRef}></div>
        <div className="corner top-right" ref={cornerTRRef}></div>
        <div className="corner bottom-left" ref={cornerBLRef}></div>
        <div className="corner bottom-right" ref={cornerBRRef}></div>

        <div className="content-area" ref={contentAreaRef}>
          <h1 className="hero-text" ref={heroTextRef}>
            <span className="brand">AI</span> Handwriting Recognition
          </h1>
          <div className="scan-line" ref={scanLineRef}></div>
          <div className="output-text" ref={outputRef}>
            <p className="cta-message">
              AI‑powered handwriting to text. <br />
              <span>Just upload, paste, or drop.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="cta-section" ref={ctaRef}>
        <Link to="/ocr" className="cta-link">
          Try it now
          <span className="arrow">→</span>
        </Link>
      </div>

      <div className="features" ref={featuresRef}>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-line"></div>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
