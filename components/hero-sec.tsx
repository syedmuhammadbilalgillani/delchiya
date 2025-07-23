"use client";

const HeroSection = () => {
  return (
    <div
      className="relative  h-[650px] max-sm:h-[650px] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center justify-center text-center h-full px-5">
        <h1 className="text-white text-8xl max-w-[10ch] font-marcellus font-normal">Sommerhus ved Marielyst
        </h1>
        <p className="text-xl text-white">
          Et skridt væk fra hverdagens stress, et skridt ind i sommerhusidyllen
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
