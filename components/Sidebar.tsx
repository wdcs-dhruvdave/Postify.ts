'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, User, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Posts', href: '/posts', icon: <FileText size={20} /> },
    { name: 'Profile', href: '/profile', icon: <User size={20} /> },
  ]

  return (
    <aside className="h-screen w-64 bg-white border-r fixed top-0 left-0 shadow-sm z-40">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-2xl font-bold">Postify</h1>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition ${
              pathname === item.href ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}

        <button className="flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-auto">
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  )
}
