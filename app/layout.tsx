import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NotificationsProvider } from "@/utils/context/NotificationsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <Toaster position="top-center" reverseOrder={false} />
          <NotificationsProvider>
            <main className="flex-1">{children}</main>
          </NotificationsProvider>
        </div>
      </body>
    </html>
  );
}
