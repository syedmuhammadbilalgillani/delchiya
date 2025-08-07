import { Star } from "lucide-react";
import Image from "next/image";
import Text from "./Language/TranslatedText";

const GUEST_EXPERIENCES = () => {
  return (
    <div
  className="min-h-dvh bg-center bg-cover flex justify-center items-center relative z-0"
  style={{ backgroundImage: "url('/apostolos.jpg')" }}
>
  <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/50" />
  <div className="z-[2] relative text-center flex justify-center items-center flex-col gap-4 p-6">
    <Image
      src={"/breakfast.png"}
      alt="breakfast"
      width={100}
      height={100}
      className="object-contain"
    />
    <Text
      as="p"
      className="text-white"
      textKey="guestExperienceTitle"
    />
    <p className="text-2xl md:text-3xl text-white font-marcellus max-w-3xl">
      <Text
        textKey="guestReview"
      />
    </p>
    <p className="text-white text-base uppercase font-jost">
      <Text
        textKey="reviewerDetails"
      />
    </p>
    <div className="flex gap-2 items-center">
      <Star
        fill="#b99d75"
        size={20}
        className="text-yellow"
        color="#b99d75"
      />
      <Star
        fill="#b99d75"
        size={20}
        className="text-yellow"
        color="#b99d75"
      />
      <Star
        fill="#b99d75"
        size={20}
        className="text-yellow"
        color="#b99d75"
      />
      <Star
        fill="#b99d75"
        size={20}
        className="text-yellow"
        color="#b99d75"
      />
      <Star
        fill="#b99d75"
        size={20}
        className="text-yellow"
        color="#b99d75"
      />
    </div>
  </div>
</div>

  );
};

export default GUEST_EXPERIENCES;
