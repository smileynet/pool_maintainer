import type { Meta, StoryObj } from '@storybook/react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu'
import { cn } from '@/lib/utils'
import {
  Droplet,
  LayoutDashboard,
  TestTube,
  MapPin,
  Users,
  Calendar,
  FileText,
  Settings,
  AlertTriangle,
  Clock,
  Activity,
  BarChart3,
  Wrench,
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Home,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Badge } from './badge'

const meta = {
  title: 'Components/Organisms/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The NavigationMenu component provides structured navigation patterns for the pool maintenance system. Built on Radix UI Navigation Menu with pool maintenance-specific workflows and accessibility features.

## Features
- **Hierarchical Navigation**: Multi-level menu structures for complex workflows
- **Keyboard Navigation**: Full keyboard support with arrow keys and Enter/Space
- **Mobile Responsive**: Adaptive layouts for desktop and mobile devices
- **Focus Management**: Proper focus handling and visual indicators
- **ARIA Compliance**: Screen reader support and semantic navigation
- **Visual Indicators**: Active states and hover effects

## Pool Maintenance Usage
- Main application navigation between modules
- Quick access to critical pool safety functions
- Technician workflow navigation and task switching
- Mobile-friendly navigation for on-site technicians
- Context-sensitive navigation based on user roles
- Emergency action quick access patterns

## Navigation Patterns
- Horizontal main navigation with dropdown menus
- Vertical sidebar navigation for detailed workflows
- Breadcrumb navigation for deep hierarchies
- Mobile hamburger menu with overlay
- Tab-style navigation for related content areas
        `,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'pool', value: '#f0f9ff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

// Main navigation examples
export const Default: Story = {
  render: () => (
    <div className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Pool Management</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-600 p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Droplet className="h-6 w-6 text-white" />
                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                          Pool Status
                        </div>
                        <p className="text-sm leading-tight text-blue-100">
                          Monitor all pool facilities and operational status in real-time.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/pools" title="All Pools">
                    View and manage all pool facilities
                  </ListItem>
                  <ListItem href="/pools/chemical-readings" title="Chemical Readings">
                    Latest water quality test results
                  </ListItem>
                  <ListItem href="/pools/maintenance" title="Maintenance Log">
                    Track maintenance history and schedules
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tasks & Scheduling</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem
                    title="Maintenance Tasks"
                    href="/tasks"
                    icon={<Wrench className="h-4 w-4" />}
                  >
                    Schedule and track maintenance work
                  </ListItem>
                  <ListItem
                    title="Chemical Testing"
                    href="/chemical-testing"
                    icon={<TestTube className="h-4 w-4" />}
                  >
                    Plan and record water quality tests
                  </ListItem>
                  <ListItem
                    title="Calendar View"
                    href="/calendar"
                    icon={<Calendar className="h-4 w-4" />}
                  >
                    Weekly and monthly maintenance schedule
                  </ListItem>
                  <ListItem
                    title="Emergency Tasks"
                    href="/emergency"
                    icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                  >
                    Urgent safety and maintenance issues
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Team Management</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2 lg:w-[500px]">
                  <ListItem
                    title="Technicians"
                    href="/technicians"
                    icon={<Users className="h-4 w-4" />}
                  >
                    Manage staff and certifications
                  </ListItem>
                  <ListItem
                    title="Assignments"
                    href="/assignments"
                    icon={<User className="h-4 w-4" />}
                  >
                    Task assignments and workload
                  </ListItem>
                  <ListItem
                    title="Time Tracking"
                    href="/time-tracking"
                    icon={<Clock className="h-4 w-4" />}
                  >
                    Work hours and performance metrics
                  </ListItem>
                  <ListItem
                    title="Training Records"
                    href="/training"
                    icon={<FileText className="h-4 w-4" />}
                  >
                    Certification and training status
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/reports">
                Reports
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  ),
}

// Mobile navigation pattern
export const MobileNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="w-full">
        {/* Mobile Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center">
            <Droplet className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-semibold">Pool Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
            <nav className="fixed top-0 right-0 bottom-0 w-64 bg-white border-l shadow-xl">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplet className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-semibold">Menu</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-1">
                  <MobileNavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                    Dashboard
                  </MobileNavItem>
                  <MobileNavItem href="/pools" icon={<MapPin className="h-4 w-4" />}>
                    Pool Management
                  </MobileNavItem>
                  <MobileNavItem
                    href="/chemical-testing"
                    icon={<TestTube className="h-4 w-4" />}
                    badge="3"
                  >
                    Chemical Testing
                  </MobileNavItem>
                  <MobileNavItem href="/tasks" icon={<Wrench className="h-4 w-4" />} badge="7">
                    Maintenance Tasks
                  </MobileNavItem>
                  <MobileNavItem href="/technicians" icon={<Users className="h-4 w-4" />}>
                    Team Management
                  </MobileNavItem>
                  <MobileNavItem href="/calendar" icon={<Calendar className="h-4 w-4" />}>
                    Schedule
                  </MobileNavItem>
                  <MobileNavItem href="/reports" icon={<BarChart3 className="h-4 w-4" />}>
                    Reports & Analytics
                  </MobileNavItem>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <div className="space-y-1">
                    <MobileNavItem href="/settings" icon={<Settings className="h-4 w-4" />}>
                      Settings
                    </MobileNavItem>
                    <MobileNavItem href="/profile" icon={<User className="h-4 w-4" />}>
                      Profile
                    </MobileNavItem>
                    <MobileNavItem href="/logout" icon={<LogOut className="h-4 w-4" />}>
                      Sign Out
                    </MobileNavItem>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden lg:block border-b bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/pools">
                    <MapPin className="h-4 w-4 mr-2" />
                    Pools
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/tasks">
                    <Wrench className="h-4 w-4 mr-2" />
                    Tasks
                    <Badge className="ml-2 bg-orange-500 text-white">7</Badge>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/team">
                    <Users className="h-4 w-4 mr-2" />
                    Team
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive navigation that adapts to mobile with hamburger menu and desktop horizontal layout.',
      },
    },
  },
}

// Breadcrumb navigation
export const BreadcrumbNavigation: Story = {
  render: () => (
    <div className="w-full bg-gray-50 border-b p-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a
                href="#"
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Pool Management
              </a>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <a
                href="#"
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Main Community Pool
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                Chemical Readings
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb navigation showing the current location within the pool management hierarchy.',
      },
    },
  },
}

// Sidebar navigation
export const SidebarNavigation: Story = {
  render: () => (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex items-center mb-8">
            <Droplet className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-xl font-bold">Pool System</h1>
          </div>

          <div className="space-y-2">
            <SidebarNavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} active>
              Dashboard
            </SidebarNavItem>
            
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Pool Operations
              </p>
              <div className="mt-2 space-y-1">
                <SidebarNavItem href="/pools" icon={<MapPin className="h-5 w-5" />}>
                  Pool Status
                </SidebarNavItem>
                <SidebarNavItem href="/chemical-testing" icon={<TestTube className="h-5 w-5" />}>
                  Chemical Testing
                  <Badge className="ml-auto bg-red-500">3</Badge>
                </SidebarNavItem>
                <SidebarNavItem href="/maintenance" icon={<Wrench className="h-5 w-5" />}>
                  Maintenance
                  <Badge className="ml-auto bg-orange-500">7</Badge>
                </SidebarNavItem>
              </div>
            </div>

            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Team Management
              </p>
              <div className="mt-2 space-y-1">
                <SidebarNavItem href="/technicians" icon={<Users className="h-5 w-5" />}>
                  Technicians
                </SidebarNavItem>
                <SidebarNavItem href="/schedule" icon={<Calendar className="h-5 w-5" />}>
                  Schedule
                </SidebarNavItem>
                <SidebarNavItem href="/assignments" icon={<User className="h-5 w-5" />}>
                  Assignments
                </SidebarNavItem>
              </div>
            </div>

            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Analytics
              </p>
              <div className="mt-2 space-y-1">
                <SidebarNavItem href="/reports" icon={<BarChart3 className="h-5 w-5" />}>
                  Reports
                </SidebarNavItem>
                <SidebarNavItem href="/analytics" icon={<Activity className="h-5 w-5" />}>
                  Analytics
                </SidebarNavItem>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="space-y-1">
              <SidebarNavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
                Settings
              </SidebarNavItem>
              <SidebarNavItem href="/logout" icon={<LogOut className="h-5 w-5" />}>
                Sign Out
              </SidebarNavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 p-8">
        <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
        <p className="text-gray-600">
          This area would contain the main application content. The sidebar provides 
          navigation to different sections of the pool maintenance system.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar navigation with grouped sections for different areas of the pool maintenance system.',
      },
    },
  },
}

// Tab navigation
export const TabNavigation: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('overview')

    const tabs = [
      { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: 'chemical', label: 'Chemical Readings', icon: <TestTube className="h-4 w-4" /> },
      { id: 'maintenance', label: 'Maintenance Log', icon: <Wrench className="h-4 w-4" /> },
      { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
      { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
    ]

    return (
      <div className="w-full">
        <div className="border-b bg-white">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'chemical' && (
                  <Badge className="bg-red-500 text-white">3</Badge>
                )}
                {tab.id === 'maintenance' && (
                  <Badge className="bg-orange-500 text-white">7</Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label} Content
            </h3>
            <p className="text-gray-500">
              This area would show the content for the selected tab: {activeTab}
            </p>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Tab navigation for switching between related pool management sections with status badges.',
      },
    },
  },
}

// Quick action navigation
export const QuickActionNavigation: Story = {
  render: () => (
    <div className="w-full bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Droplet className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-semibold">Pool Maintenance</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
                <Badge className="ml-2 bg-red-500 text-white">2</Badge>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <TestTube className="h-4 w-4 mr-2" />
              Quick Test
            </Button>
            <Button size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
            
            <div className="ml-4 flex items-center">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                John Smith
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Quick action navigation bar with emergency actions and user context for pool technicians.',
      },
    },
  },
}

// Helper components
const ListItem = ({ 
  className, 
  title, 
  children, 
  icon, 
  href, 
  ...props 
}: {
  className?: string
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  href: string
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          href={href}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

const MobileNavItem = ({ 
  href, 
  icon, 
  children, 
  badge 
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  badge?: string
}) => (
  <a
    href={href}
    className="flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-3">{children}</span>
    </div>
    {badge && (
      <Badge className="bg-red-500 text-white">{badge}</Badge>
    )}
  </a>
)

const SidebarNavItem = ({ 
  href, 
  icon, 
  children, 
  active = false 
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}) => (
  <a
    href={href}
    className={cn(
      'group flex items-center px-3 py-2 rounded-md text-sm font-medium',
      active
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    )}
  >
    {icon}
    <span className="ml-3 flex-1">{children}</span>
  </a>
)