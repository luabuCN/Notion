import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";

const Footer = () => {
  return (
    <footer className="z-10 flex itemx-center w-full px-6 bg-background dark:bg-[#1F1F1F]">
      <Logo />
      <div className="flex items-center justify-between md:justify-end gap-x-2 w-full md:ml-auto text-muted-foreground">
        <Button variant="ghost" asChild>
          <Link href="">Privacy Policy</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="">Terms & Conditions</Link>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
