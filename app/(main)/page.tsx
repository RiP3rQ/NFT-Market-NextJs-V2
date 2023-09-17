import React from "react";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

const MainPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      {children}
    </div>
  );
};

export default MainPage;
