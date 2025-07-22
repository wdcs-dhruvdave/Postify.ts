'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Postify
        </Link>

        <nav className="flex space-x-6 items-center text-sm font-medium">
          <Link
            href="/"
            className={`transition ${
              pathname === '/'
                ? 'text-blue-600 underline underline-offset-4'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            Home
          </Link>

          <Link
            href="/posts"
            className={`transition ${
              pathname === '/posts'
                ? 'text-blue-600 underline underline-offset-4'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            Posts
          </Link>

          <Link
            href="/profile"
            className={`transition ${
              pathname === '/profile'
                ? 'text-blue-600 underline underline-offset-4'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            Profile
          </Link>

          {/* Optional Auth Buttons */}
          <Link
            href="/login"
            className={`transition ${
            pathname === '/login'
              ? 'text-blue-600 underline underline-offset-4'
              : 'text-gray-700 hover:text-blue-500'
          }`}>
            Login
          </Link>

          <Link
            href="/signup"
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}
