import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './sidebar/AdminSidebar' // or AdminSidebar based on role
import authService from '../../services/auth' // adjust path if needed

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const init = async () => {
      const success = await authService.initializeAuth()
      if (!success && location.pathname !== '/login') {
        navigate('/login')
      }
      setIsLoading(false)
    }
    init()
  }, [location.pathname, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="lg:flex lg:min-h-screen">
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
