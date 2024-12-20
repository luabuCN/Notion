import Navbar from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full pt-20">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MarketingLayout;
