"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Heading = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to&nbsp;
        <span className="underline">Notion</span>
      </h1>
      <p className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where <br />
        better, faster work happens
      </p>
      {!isLoaded && (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {isSignedIn && isLoaded && (
        <Button asChild>
          <Link href="/documents">
            Enter Notion <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isSignedIn && isLoaded && (
        <SignInButton mode="modal">
          <Button>
            Get Started <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
