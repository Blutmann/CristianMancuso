"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMotionPaused } = useMotion();

  useEffect(() => {
    const isTouchOrMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024;

    if (isMotionPaused || isTouchOrMobile) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [isMotionPaused]);

  return <>{children}</>;
}
