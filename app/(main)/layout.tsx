import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import '../../app/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
