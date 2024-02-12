import { SignUp } from "@clerk/nextjs";
import { UserButton, auth, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const Header = async () => {
  const user = await currentUser();
  return (
    <header>
      <nav className="w-full flex justify-center">
        <ul className="w-2/3 flex justify-between items-center py-2">
          <Link href="/">
            <div>Logo</div>
          </Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
