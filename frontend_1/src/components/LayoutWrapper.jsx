import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import UserSidebar from './UserSidebar'

export default function LayoutWrapper({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to sign out')
    } finally {
      setLoggingOut(false)
    }
  }

  const handleCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex h-screen bg-[#d7e9f2] overflow-hidden">
      <UserSidebar 
        onLogout={handleLogout} 
        loggingOut={loggingOut} 
        onCollapsedChange={handleCollapsedChange}
      />
      <main className="flex-1 overflow-x-hidden md:ml-0 ml-16 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
