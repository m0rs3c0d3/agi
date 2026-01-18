import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const navItems = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/neural', label: 'Neural', icon: '✧' },
  { path: '/projects', label: 'Projects', icon: '◈' },
  { path: '/notes', label: 'Notes', icon: '☰' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
]

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
