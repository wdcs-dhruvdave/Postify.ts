import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import '../globals.css'
import { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
        </>
  )
}
