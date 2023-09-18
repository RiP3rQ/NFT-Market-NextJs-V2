"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();

  return router.push("/oferty");
};

export default MainPage;
