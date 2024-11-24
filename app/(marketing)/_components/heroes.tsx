import Image from "next/image";
const Heroes = () => {
  return (
    <div className=" flex flex-col items-center justify-center max-w-5xl">
      <h1 className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/promo/documents.png"
            fill
            className=" object-contain dark:hidden"
            alt="hero image"
          />
          <Image
            src="/promo/documents-dark.png"
            fill
            className=" object-contain hidden dark:block"
            alt="hero image"
          />
        </div>
        <div className=" relative h-[400px] w-[400px] hidden md:block">
          <Image
            src="/promo/reading.png"
            fill
            className=" object-contain dark:hidden"
            alt="reading image"
          />
          <Image
            src="/promo/reading-dark.png"
            fill
            className=" object-contain hidden dark:block"
            alt="reading image"
          />
        </div>
      </h1>
    </div>
  );
};

export default Heroes;
