import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./animatedPodcast.css";

import mic from "../assets/home/mic.png";

gsap.registerPlugin(ScrollTrigger);

const BLOCK_SECTION = [
  {
    block: 1,
    title: "Commercial Enterprise",
    subtitle: "Elevate Your Business Acumen",
    description: "Transform the way you see the pharmacy world and fast-track your professional growth. Whether you are leading the team, managing stock on the floor, or driving daily operations, this channel equips you with high-level business intelligence made completely accessible. Master strategic workflows, navigate regulatory shifts, and understand the industry mechanics that directly impact the bottom line—developing your business mind so you can step up as a sharper, more valuable contributor in any healthcare workplace.",
  },
  {
    block: 2,
    title: "Clinical Clarity",
    subtitle: "Master the Science of Health",
    description:
      "Become a trusted, articulate voice for wellness in every customer interaction. When health topics come up at the counter, on the floor, or out on deliveries, you won't just guess—you’ll know. Gain a comprehensive, expert-backed understanding of human health, nutrition, and wellness protocols so you can communicate vital health information clearly, accurately, and professionally whenever the moment calls for it.",
    backclass: "bg-gradients-light text-fonts-dark",
  },
  {
    block: 3,
    title: "The Balanced Workspace",
    subtitle: "Resilience & Synergy",
    description:
      "Master the art of high-performance without the burnout. Healthcare environments are fast-paced, but your peace of mind doesn't have to take a back seat. Discover powerful, practical toolkits to effortlessly balance demanding work schedules with your personal life, handle shift stress, and foster a supportive, zero-toxicity team environment where everyone looks out for each other—behind the counter, in the back office, and on the road.",
    backclass: "bg-white text-fonts-dark",
  },
  {
    block: 4,
    title: "Total Care",
    subtitle: "Resilience & Synergy",
    description:
      "Master the art of high-performance without the burnout. Healthcare environments are fast-paced, but your peace of mind doesn't have to take a back seat. Discover powerful, practical toolkits to effortlessly balance demanding work schedules with your personal life, handle shift stress, and foster a supportive, zero-toxicity team environment where everyone looks out for each other—behind the counter, in the back office, and on the road.",
    backclass: "bg-white text-fonts-dark",
  }
];

export default function AnimatedPodcastSection() {
  const containerRef = useRef(null);
  const micRef = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".ani-podcast-card");

      const tl = gsap.timeline({
        id: "animated-podcast",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // --- STEP 1: Transition into Block 1 ---
      // Fade out eyebrow & description
      tl.to(
        [".ani-podcast-eyebrow", ".ani-podcast-intro-description"],
        {
          opacity: 0,
          y: -20,
          duration: 1,
        },
        0
      )
        // Title moves slightly up and scales down
        .to(
          ".major-animate-title",
          {
            y: -60,
            scale: 0.65,
            duration: 1,
          },
          0
        )
        // Move mic down to center/left for Block 1 setup
        .to(
          micRef.current,
          {
            top: "50%",
            left: "25%",
            xPercent: -50,
            yPercent: -50,
            rotate: -15,
            duration: 1,
          },
          0
        );

      // --- STEP 2: Loop through Block Sections ---
      cards.forEach((card, index) => {
        const isOdd = index % 2 === 0; // Block 1, 3: Mic Left, Card Right | Block 2, 4: Mic Right, Card Left

        // Position Mic
        tl.to(micRef.current, {
          left: isOdd ? "25%" : "75%",
          rotate: isOdd ? -15 : 15,
          duration: 1,
        });

        // Fade & slide in the Card at 70% timing mark
        tl.to(
          card,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "<+=0.3"
        );

        // Hold frame visibility briefly
        tl.to({}, { duration: 1 });

        // Fade out active card before next block (except last block)
        if (index < cards.length - 1) {
          tl.to(card, { opacity: 0, y: -30, duration: 0.5 });
        }
      });

       // Let React/browser finish layout before measuring ScrollTrigger
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="ani-podcast-explainer-container">
      <img ref={micRef} src={mic} alt="Microphone" className="mic-img-pod" />

      {/* Intro Header */}
      <div className="ani-podcast-intro">
        <div className="ani-podcast-intro-content">
          <p className="ani-podcast-eyebrow">Explore Our Content</p>
          <h2 className="major-animate-title">
            Benefits Of Our <span>Podcast</span>
          </h2>
          <p className="ani-podcast-intro-description">
            Explore the knowledge, insights, and conversations designed to help
            you grow professionally.
          </p>
        </div>
      </div>

      {/* Dynamic Cards Container */}
      <div className="ani-podcast-blocks-wrapper">
        {BLOCK_SECTION.map((item, idx) => {
          const isOdd = idx % 2 === 0;
          return (
            <div
              key={item.block}
              className={`ani-podcast-block-step ${isOdd ? "card-right" : "card-left"}`}
            >
              <div className={`ani-podcast-card ${item.backclass || ""}`}>
                <h3 className="ani-podcast-card-title">{item.title}</h3>
                <h4 className="ani-podcast-card-subtitle">{item.subtitle}</h4>
                <p className="ani-podcast-card-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}