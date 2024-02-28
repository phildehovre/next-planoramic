"use client";

import { cn } from "@/lib/utils";
import React, { useLayoutEffect } from "react";
import "./hero.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

const hero = () => {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const details = gsap.utils.toArray(
        ".desktopContentSection:not(:first-child)"
      );
      const photos: GSAPStaggerVars[] = gsap.utils.toArray(
        ".desktopPhoto:not(:first-child)"
      );

      gsap.set(photos, { yPercent: 101 });

      const allPhotos: GSAPStaggerVars[] = gsap.utils.toArray(".desktopPhoto");

      // create
      let mm = gsap.matchMedia();

      // add a media query. When it matches, the associated function will run
      mm.add("(min-width: 600px)", () => {
        // this setup code only runs when viewport is at least 600px wide
        console.log("desktop");

        ScrollTrigger.create({
          trigger: ".gallery",
          start: "top top",
          end: "bottom bottom",
          pin: ".right",
          // markers: true,
        });

        //create scrolltrigger for each details section
        //trigger photo animation when headline of each details section
        //reaches 80% of window height
        details.forEach((detail: any, index) => {
          let headline = detail.querySelector("h1");
          let animation = gsap
            .timeline()
            .to(photos[index], { yPercent: 0 })
            .set(allPhotos[index], { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: headline,
            start: "top 70%",
            end: "top 50%",
            animation: animation,
            scrub: true,
            // markers: true,
          });
        });

        return () => {
          // optional
          // custom cleanup code here (runs when it STOPS matching)
          console.log("mobile");
        };
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-screen flex justify-center overflow-x-hidden h-[1000vh] ">
      <div className={cn("hero_background", "w-3/5  h-full")}></div>
      <div className={cn("track", "w-full z-10 flex  flex-col items-center ")}>
        <div className="w-3/4 h-[300vh] bg-green-400"></div>
        <div className="w-3/4 h-[300vh] bg-green-500"></div>
        <div className="w-3/4 h-[300vh] bg-green-600"></div>
        <div className="w-3/4 h-[300vh] bg-green-700"></div>
      </div>
    </div>
  );
};

export default hero;
