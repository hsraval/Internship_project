import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import UserSidebar from './UserSidebar'

export default function LayoutWrapper({ children }) {
  const { logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  const handleCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
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
