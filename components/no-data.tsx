import React from "react";
import Image from "next/image";

interface NoDataProps {
  message: string;
  imageUrl: string;
  description: string;
  onClick: () => void;
  buttonText: string;
}

const NoData: React.FC<NoDataProps> = ({
  message,
  imageUrl,
  description,
  onClick,
  buttonText,
}) => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center space-y-6 overflow-x-hidden bg-white p-6">
      <div className="relative w-60 md:w-80">
        <Image
          src={imageUrl}
          alt="no_data"
          width={320}
          height={320}
          className="shadow-md transition duration-300 hover:shadow-lg"
        />
      </div>
      <div className="max-w-md space-y-2 text-center">
        <p className="text-2xl font-bold tracking-wide text-gray-900">
          {message}
        </p>
        <p className="text-base leading-relaxed text-gray-600">{description}</p>
      </div>

      {onClick && (
        <button
          onClick={onClick}
          className="w-60 transform rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-300 px-6 font-medium text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
export default NoData;
