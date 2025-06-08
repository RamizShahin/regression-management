import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild
} from '@headlessui/react'
import {
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import PortalIcon from './../../../assets/PortalIcon.png'
import authService from './../../../services/auth'

interface Project {
  project_id: number
  project_name: string
  project_description: string
}

interface NavItem {
  name: string
  href?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children?: { name: string; href: string }[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const location = useLocation()
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = authService.getUser()
  const userName = user?.name || 'User'

  const isProjectsPath = location.pathname.startsWith('/projects')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await authService.makeAuthenticatedRequest('/api/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setUserProjects(data)
        if (isProjectsPath) setProjectsOpen(true)
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }
    fetchProjects()
  }, [])

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    {
      name: 'Projects',
      icon: FolderIcon,
      children: [
        { name: 'All Projects', href: '/projects' },
        ...userProjects.map(project => ({
          name: project.project_name,
          href: `/projects/${project.project_id}`
        }))
      ]
    },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Parsers', href: '/parsers', icon: DocumentTextIcon }
  ]

  const allItems: NavItem[] = [
    ...navigation,
    { name: 'Settings', href: '/Settings', icon: Cog6ToothIcon }
  ]

  const currentItem = allItems.find(
    item =>
      item.href === location.pathname ||
      item.children?.some(child => location.pathname.startsWith(child.href))
  )

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = '/login'
  }

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className={classNames(
              'w-full flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
              isProjectsPath ? 'bg-gray-800 text-purple-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            {item.icon && <item.icon className="w-6 h-6 shrink-0" />}
            <span className="flex-1 text-left">{item.name}</span>
            {projectsOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>

          {projectsOpen && (
            <ul className="ml-8 mt-1 space-y-1">
              {item.children.map(child => {
                const isActive =
                  location.pathname === child.href ||
                  (child.href !== '/projects' && location.pathname.startsWith(child.href + '/'))
                return (
                  <li key={child.name}>
                    <NavLink
                      to={child.href}
                      className={classNames(
                        isActive
                          ? 'bg-gray-800 text-purple-500'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                        'block rounded-md p-2 text-sm font-semibold'
                      )}
                    >
                      {child.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )
    }

    return (
      <li key={item.name}>
        <NavLink
          to={item.href!}
          end={item.href === '/projects'} // for All Projects
          className={({ isActive }) =>
            classNames(
              isActive
                ? 'bg-gray-800 text-purple-500'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
            )
          }
        >
          {item.icon && <item.icon className="w-6 h-6 shrink-0" />}
          {item.name}
        </NavLink>
      </li>
    )
  }

  const SidebarLayout = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
      <div className="flex h-16 shrink-0 items-center">
        <img alt="Regression Portal" src={PortalIcon} className="h-8 w-auto" />
        <h1 className="pl-3 text-xl text-gray-100">{currentItem?.name || 'Regression Portal'}</h1>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">{navigation.map(renderNavItem)}</ul>
          </li>

          <li className="mt-auto">
            <ul className="space-y-1">
              <li className="-mx-6">
                <NavLink
                  to="/Settings"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
                  <span>Settings</span>
                </NavLink>
              </li>
              <li className="-mx-6 mb-10">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  <span>{userName}</span>
                </div>
              </li>
              <li className="-mx-6 mb-6">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-gray-400" />
                  <span>Log Out</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-white">{currentItem?.name || 'Regression Portal'}</div>
        <UserCircleIcon className="w-8 h-8 text-gray-400" />
      </div>

      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {SidebarLayout}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {SidebarLayout}
      </div>
    </>
  )
}
