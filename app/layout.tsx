import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "@/utils/context/ChatContext";
import Navbar from "@/components/layout/Navbar";
import { NotificationsProvider } from "@/utils/context/NotificationsContext";
import { FCMProvider } from "@/components/FCMProvider";

export const metadata = {
  title: "Postify",
  description: "A modern social media platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <FCMProvider>
          <ChatProvider>
            <NotificationsProvider>
              <Navbar />
              <Toaster position="top-center" reverseOrder={false} />
              <main className="flex-1 flex flex-col">{children}</main>
            </NotificationsProvider>
          </ChatProvider>
        </FCMProvider>
      </body>
    </html>
  );
}
