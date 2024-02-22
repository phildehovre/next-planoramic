"use client";

import React, { useEffect } from "react";
// import "./Hero.css";
// import { timeline, stagger, spring } from "motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function Hero() {
  //   useEffect(() => {
  //     timeline([
  //       [
  //         "#slogan-primary",
  //         { y: [20, 0], opacity: [0, 1] },
  //         { duration: 1, delay: stagger(0.5), easing: "ease-in-out" },
  //       ],
  //       [
  //         "#slogan-secondary",
  //         { y: [20, 0], opacity: [0, 1] },
  //         { duration: 1, delay: stagger(0.5), easing: "ease-in-out" },
  //       ],
  //       [
  //         "#slogan-cta",
  //         { x: [-100, 0], opacity: [0, 1] },
  //         { duration: 0.5, easing: spring({ stiffness: 800 }) },
  //       ],
  //     ]);
  //   });

  const testimonials = [
    {
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Sarah K.",
      quote:
        "\"I can't thank this app enough! It's like having a personal campaign strategist in my pocket. I started by creating a vision for my project, customized templates, and then turned them into a real-world campaign. The step-by-step guidance made everything so easy. Now, I'm enjoying the fantastic results, and it feels incredible. This app is a game-changer!\"",
    },
    {
      img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Alex P.",
      quote:
        "I've always struggled with planning and executing my campaigns effectively until I discovered this app. Building my strategy, launching campaigns, and tracking results has never been smoother. It's the ultimate tool for anyone looking to make their campaigns a success. I can't recommend it enough!",
    },
    {
      img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Emily W.",
      quote:
        "This app transformed how I approach my projects. Starting with a clear vision, customizing templates, and seamlessly transitioning to a real-world campaign has been a breeze. The app's user-friendly interface and guidance have made the process enjoyable. I'm now relishing the incredible outcomes of my hard work. This app is a must-have for anyone serious about planning and achieving success!",
    },
  ];

  const features = [
    {
      id: "01",
      title: "Shape your strategy",
      description:
        "Begin by building a solid plan tailored to your goals. Our app allows you to create and customize templates to perfection.",
    },
    {
      id: "02",
      title: "Launch your campaign",
      description:
        "Once you have a clear vision, you can easily transition to a real-world campaign. Our app will guide you through the process step-by-step.",
    },
    {
      id: "03",
      title: "Track your results",
      description:
        "Our app allows you to track your campaign results and make adjustments as needed. You can also use the data to improve future campaigns.",
    },
  ];

  const renderTestimonials = () => {
    return testimonials.map((testimonial, index) => {
      return (
        <Card className="bg-gradient-to-r from-sky-500 to-indigo-500">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <div
            className="testimonial-img"
            style={{ backgroundImage: `url(${testimonial.img})` }}
          ></div>
          <h3>{testimonial.name}</h3>
          <p>{testimonial.quote}</p>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      );
    });
  };

  const renderFeatures = () => {
    return features.map((feature) => {
      return (
        <div className="feature" key={feature.id}>
          <h3>
            <div className="feature-id">{feature.id}</div>
            {feature.title}
          </h3>
          <p>{feature.description}</p>
        </div>
      );
    });
  };

  return (
    <div className="w-3/4 overflow-hidden">
      <section className="w-3/4">
        <div className="w-1/2">
          <h1 id="slogan-primary" className="">
            Bring everyone together to build better campaigns
          </h1>
          <p id="slogan-secondary">
            <b>Planoramic </b>is a platform that helps you and your team plan,
            build, and launch your next campaign.
          </p>
          <Button>Get started</Button>
          <span>
            <h2>What's different about Planoramic?</h2>
            <p>
              Planoramic provides new functionality that is 100% oriented at
              helping marketing execs and social media managers develop
              repeatable and reusable campaign templates. Altogether in one
              place, thanks to our intergration with <b>Google Calendar.</b>
            </p>
          </span>
          <div className="hero-image-mobile"></div>
        </div>
        <div className="hero-image"></div>
      </section>
      <section className="hero-features">{renderFeatures()}</section>
      <section className={cn("testimonials", "w-[350px]")}>
        {renderTestimonials()}
      </section>
    </div>
  );
}

export default Hero;
