"use client";

import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

const KolekcjePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);

    const getAllCollections = async () => {
      const collections = await axios.get("/api/kolekcje");
      setCollections(collections.data);
      console.log(collections);
      setLoading(false);
    };

    getAllCollections();
  }, []);

  if (loading)
    return (
      <div className="bg-slate-100 h-full flex flex-col items-center justify-center">
        <InfinitySpin width="200" color="#4fa94d" />
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );

  return (
    <main className="bg-slate-100 p-10 h-full flex flex-col">
      <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex flex-col items-center cursor-pointer 
            transition-all duration-200 hover:scale-105"
            onClick={() => {
              const url = qs.stringifyUrl(
                {
                  url: `/kolekcje/${collection.id}`,
                  query: {
                    collectionAddress: collection.address,
                  },
                },
                { skipNull: true }
              );

              router.push(url);
            }}
          >
            <img
              className="h-96 w-60 rounded-2xl object-cover"
              src={collection.mainImage}
              alt={collection.title}
            />

            <div className="p-5">
              <h2 className="text-3xl">{collection.title}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {collection.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default KolekcjePage;
