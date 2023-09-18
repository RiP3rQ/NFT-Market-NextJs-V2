"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SuccessfulMintPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams?.get("name");
  const image = searchParams?.get("image");
  const description = searchParams?.get("description");
  const owner = searchParams?.get("owner");
  const supply = searchParams?.get("supply");

  return (
    <div className="flex h-full flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:h-full">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={`${image}`}
              alt={`${name}`}
            />
          </div>
          <div className="text-center p-5 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {description} {name}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Content of Right Side */}
        <div
          className="mt-10 flex flex-1 flex-col items-center 
        space-y-6 text-center lg:space-y-0 justify-center"
        >
          <h1 className="text-4xl font-bold lg:text-5xl lg:font-extrabold text-green-500">
            ! CONGRATULATION !
          </h1>
          <p className="text-base font-bold lg:text-xl lg:font-extrabold text-center text-rose-400">
            {owner?.slice(0, 5) + "..." + owner?.slice(-5)}
          </p>

          <p className="text-2xl font-bold lg:text-4xl lg:font-extrabold text-gray-400">
            You successful minted x{supply} NFT
          </p>
          <span className="text-lg font-bold lg:text-xl lg:font-extrabold text-gray-300">
            From collection: {description}
          </span>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div
          className="flex items-end 
       text-center  justify-center"
        >
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-br from-cyan-800 to-rose-500 p-5 rounded-3xl"
          >
            <p className="text-white font-bold text-lg">
              Let's mint another one
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulMintPage;

// metadata.description, metadata.name , metadata.image,
// owner
// supply
