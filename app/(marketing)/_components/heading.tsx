"use client";
import { useIsLogon } from "@/app/(main)/useDocumentQuery";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const Heading = () => {
  const { data, isLoading } = useIsLogon();
  return (
    <div className=" max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mt-5">
        你的想法、文档和计划。统一。欢迎来到&nbsp;
        <span className="underline">Jotion</span>
      </h1>
      <p className="text-base sm:text-xl md:text-2xl font-medium">
        Jotion 是一个连接的工作空间，在这里 <br />
        更好、更快的工作发生
      </p>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {data && (
        <Button asChild>
          <Link href="/documents">
            获取 Jotion <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!data && (
        <SignInButton mode="modal">
          <Button>
            免费获取 Jotion <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
