import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  ChevronRightIcon
} from '@heroicons/react/24/outline'

import PortalIcon from './../Assests/PortalIcon.png'

interface NavItem {
  name: string
  href?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  {
    name: 'Projects',
    icon: FolderIcon,
    children: [
      { name: 'All Projects', href: '/Projects' },
      { name: 'Project 1', href: '/ProjectRegression' }
    ]
  },
  { name: 'Users', href: '/About', icon: UsersIcon },
  { name: 'Parsers', href: '/Parsers', icon: DocumentTextIcon }
]

const allItems: NavItem[] = [
  ...navigation,
  { name: 'Settings', href: '/Settings', icon: Cog6ToothIcon }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const location = useLocation()
  const currentItem = allItems.find(item => item.href === location.pathname)

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className={classNames(
              'w-full flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
              'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            {item.icon && <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />}
            <span className="flex-1 text-left">{item.name}</span>
            {projectsOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
          {projectsOpen && (
            <ul className="ml-8 mt-1 space-y-1">
              {item.children.map(child => (
                <li key={child.name}>
                  <Link
                    to={child.href}
                    className={classNames(
                      location.pathname === child.href
                        ? 'bg-gray-800 text-purple-500'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'block rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    return (
      <li key={item.name}>
        <Link
          to={item.href!}
          className={classNames(
            location.pathname === item.href
              ? 'bg-gray-800 text-purple-500'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
          )}
        >
          {item.icon && <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />}
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <>
      <div>
        {/* Mobile sidebar */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear" />
          <div className="fixed inset-0 flex">
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="w-6 h-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex h-16 shrink-0 items-center">
                <img alt="Regression Portal" src={PortalIcon} className="h-8 w-auto" />
                <h1 className="pl-3 text-xl text-gray-100">{currentItem?.name || 'Regression Portal'}</h1>
              </div>

              <nav className="flex flex-1 flex-col overflow-y-auto">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map(renderNavItem)}
                    </ul>
                  </li>

                  <li className="mt-auto -mx-6">
                    <Link
                      to="/Settings"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      <Cog6ToothIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                      <span>Settings</span>
                    </Link>
                  </li>

                  <li className="-mx-6">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                      <span>Log Out</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img alt="Regression Portal" src={PortalIcon} className="h-8 w-auto" />
              <h1 className="pl-3 text-xl text-gray-100">{currentItem?.name || 'Regression Portal'}</h1>
            </div>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map(renderNavItem)}
                  </ul>
                </li>

                <li className="mt-auto">
                  <ul role="list" className="space-y-1">
                    <li className="mt-auto -mx-6">
                      <Link
                        to="/Settings"
                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        <Cog6ToothIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                        <span>Settings</span>
                      </Link>
                    </li>

                    <li className="mt-auto -mx-6 mb-6">
                      <a
                        href="#"
                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        <img
                          alt="Profile"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="w-8 h-8 rounded-full bg-gray-800"
                        />
                        <span className="sr-only">Your profile</span>
                        <span>Tom Cook</span>
                      </a>
                    </li>

                    <li className="mt-auto -mx-6 mb-2">
                      <a
                        href="#"
                        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                        <span>Log Out</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold text-white">Dashboard</div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt="Profile"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-8 h-8 rounded-full bg-gray-800"
            />
          </a>
        </div>
      </div>
    </>
  )
}
