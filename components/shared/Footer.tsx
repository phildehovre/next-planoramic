import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-screen flex mt-5 py-5 flex-col justify-evenly text-sm items-center bg-slate-100">
      <div className="flex gap-5 justify-evenly w-full">
        <div className="px-10 flex-row">
          <ul className="flex-col">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h1>Logo</h1>
        </div>
      </div>
      <p>Copyright placeholder</p>
    </footer>
  );
};

export default Footer;
