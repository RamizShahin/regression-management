import Sidebar from './UserSiseber'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="lg:flex h-screen lg:min-h-screen">
      {/* Sidebar */}
      <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 w-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-grow bg-gray-950 overflow-y-auto w-full lg:ml-72 text-white">
        <Outlet />
      </main>
    </div>
  )
}
