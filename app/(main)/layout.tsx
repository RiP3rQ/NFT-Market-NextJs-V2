import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Navbar />
      <div className="w-full flex-1">{children}</div>
    </div>
  );
}
