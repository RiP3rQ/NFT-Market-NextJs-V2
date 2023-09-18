"use client";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const router = useRouter();

  return router.push("/oferty");
};

export default MainPage;
