import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import "../globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Postify - Your Social Media Dashboard",
  description: "Manage and schedule your social media posts with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
