import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import '../../app/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar />
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
        </>
  )
}
