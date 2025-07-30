import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TestTube,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import { useState, useMemo } from 'react'

const meta = {
  title: 'Components/Organisms/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Table component provides structured data display for pool maintenance operations. Built with semantic HTML table elements and enhanced with sorting, filtering, and interactive capabilities.

## Features
- **Responsive Design**: Horizontal scrolling on smaller screens
- **Sortable Columns**: Click headers to sort data ascending/descending
- **Row Selection**: Multi-select capabilities for batch operations
- **Filtering**: Search and filter data by multiple criteria
- **Action Buttons**: In-row actions for edit, delete, view operations
- **Status Indicators**: Visual badges for different states
- **Loading States**: Skeleton loading and empty state handling

## Pool Maintenance Usage
- Chemical reading history and trend analysis
- Technician assignment and task tracking
- Pool facility status monitoring
- Maintenance schedule management
- Equipment inspection records
- Compliance audit trails

## Data Categories
- Pool status and operational data
- Chemical test results with safety ranges
- Staff scheduling and certifications
- Equipment maintenance records
- Emergency response logs
- Regulatory compliance tracking
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
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for stories
const poolStatusData = [
  {
    id: 'POOL-001',
    name: 'Main Community Pool',
    location: 'Building A',
    status: 'operational',
    capacity: 150,
    currentOccupancy: 45,
    lastInspection: '2024-01-28',
    nextMaintenance: '2024-01-30',
    assignedTechnician: 'John Smith',
  },
  {
    id: 'POOL-002',
    name: 'Kiddie Pool',
    location: 'Building A',
    status: 'maintenance',
    capacity: 30,
    currentOccupancy: 0,
    lastInspection: '2024-01-27',
    nextMaintenance: '2024-01-29',
    assignedTechnician: 'Sarah Johnson',
  },
  {
    id: 'POOL-003',
    name: 'Therapy Pool',
    location: 'Building B',
    status: 'operational',
    capacity: 20,
    currentOccupancy: 8,
    lastInspection: '2024-01-28',
    nextMaintenance: '2024-02-01',
    assignedTechnician: 'Mike Davis',
  },
  {
    id: 'POOL-004',
    name: 'Lap Pool',
    location: 'Building C',
    status: 'closed',
    capacity: 80,
    currentOccupancy: 0,
    lastInspection: '2024-01-25',
    nextMaintenance: '2024-01-31',
    assignedTechnician: 'Emily Wilson',
  },
]

const chemicalReadingsData = [
  {
    id: 'CHE-001',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    testDate: '2024-01-28 14:30',
    freeChlorine: 2.4,
    totalChlorine: 2.6,
    ph: 7.3,
    alkalinity: 95,
    temperature: 78.5,
    status: 'safe',
    technician: 'John Smith',
  },
  {
    id: 'CHE-002',
    poolId: 'POOL-002',
    poolName: 'Kiddie Pool',
    testDate: '2024-01-28 13:15',
    freeChlorine: 1.8,
    totalChlorine: 2.1,
    ph: 7.5,
    alkalinity: 105,
    temperature: 82.0,
    status: 'safe',
    technician: 'Sarah Johnson',
  },
  {
    id: 'CHE-003',
    poolId: 'POOL-003',
    poolName: 'Therapy Pool',
    testDate: '2024-01-28 12:45',
    freeChlorine: 0.8,
    totalChlorine: 1.2,
    ph: 7.1,
    alkalinity: 85,
    temperature: 84.0,
    status: 'warning',
    technician: 'Mike Davis',
  },
  {
    id: 'CHE-004',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    testDate: '2024-01-28 09:30',
    freeChlorine: 3.2,
    totalChlorine: 3.5,
    ph: 6.8,
    alkalinity: 110,
    temperature: 77.0,
    status: 'attention',
    technician: 'John Smith',
  },
  {
    id: 'CHE-005',
    poolId: 'POOL-004',
  poolName: 'Lap Pool',
    testDate: '2024-01-27 16:20',
    freeChlorine: 0.3,
    totalChlorine: 0.8,
    ph: 6.5,
    alkalinity: 70,
    temperature: 76.5,
    status: 'critical',
    technician: 'Emily Wilson',
  },
]

const technicianData = [
  {
    id: 'TECH-001',
    name: 'John Smith',
    certification: 'CPO Certified',
    experience: '5 years',
    currentAssignments: 2,
    status: 'active',
    phone: '(555) 123-4567',
    email: 'john.smith@pool.com',
    lastActive: '2024-01-28 15:30',
  },
  {
    id: 'TECH-002',
    name: 'Sarah Johnson',
    certification: 'NSPF Certified',
    experience: '3 years',
    currentAssignments: 1,
    status: 'active',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@pool.com',
    lastActive: '2024-01-28 14:45',
  },
  {
    id: 'TECH-003',
    name: 'Mike Davis',
    certification: 'CPO + MAHC',
    experience: '8 years',
    currentAssignments: 3,
    status: 'busy',
    phone: '(555) 345-6789',
    email: 'mike.davis@pool.com',
    lastActive: '2024-01-28 13:15',
  },
  {
    id: 'TECH-004',
    name: 'Emily Wilson',
    certification: 'CPO Certified',
    experience: '2 years',
    currentAssignments: 1,
    status: 'off-duty',
    phone: '(555) 456-7890',
    email: 'emily.wilson@pool.com',
    lastActive: '2024-01-27 17:00',
  },
]

// Basic pool status table
export const PoolStatusTable: Story = {
  render: () => (
    <div className="w-full p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Pool Status Dashboard</h2>
        <p className="text-gray-600">Current operational status of all pool facilities</p>
      </div>
      
      <Table>
        <TableCaption>Community pool facilities operational status</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pool ID</TableHead>
            <TableHead>Pool Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Last Inspection</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {poolStatusData.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell className="font-medium">{pool.id}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{pool.location}</TableCell>
              <TableCell>
                <Badge
                  className={
                    pool.status === 'operational'
                      ? 'bg-green-500 hover:bg-green-500/80'
                      : pool.status === 'maintenance'
                      ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                      : 'bg-red-500 hover:bg-red-500/80'
                  }
                >
                  {pool.status === 'operational' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {pool.status === 'maintenance' && <Clock className="w-3 h-3 mr-1" />}
                  {pool.status === 'closed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {pool.status}
                </Badge>
              </TableCell>
              <TableCell>
                {pool.currentOccupancy}/{pool.capacity}
                <div className="text-xs text-gray-500">
                  {Math.round((pool.currentOccupancy / pool.capacity) * 100)}% capacity
                </div>
              </TableCell>
              <TableCell>{pool.lastInspection}</TableCell>
              <TableCell>{pool.assignedTechnician}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic table displaying pool status information with badges and action buttons.',
      },
    },
  },
}

// Sortable chemical readings table
export const SortableChemicalReadings: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string>('testDate')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    const handleSort = (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortColumn(column)
        setSortDirection('asc')
      }
    }

    const sortedData = useMemo(() => {
      return [...chemicalReadingsData].sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a]
        let bValue = b[sortColumn as keyof typeof b]

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = (bValue as string).toLowerCase()
        }

        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }, [sortColumn, sortDirection])

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
      <TableHead
        className="cursor-pointer hover:bg-gray-50 select-none"
        onClick={() => handleSort(column)}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortColumn === column && (
            sortDirection === 'asc' ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </TableHead>
    )

    return (
      <div className="w-full p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Chemical Readings</h2>
          <p className="text-gray-600">Recent water quality test results with sorting capabilities</p>
        </div>

        <Table>
          <TableCaption>Click column headers to sort data</TableCaption>
          <TableHeader>
            <TableRow>
              <SortableHeader column="poolName">Pool</SortableHeader>
              <SortableHeader column="testDate">Test Date</SortableHeader>
              <SortableHeader column="freeChlorine">Cl (ppm)</SortableHeader>
              <SortableHeader column="ph">pH</SortableHeader>
              <SortableHeader column="alkalinity">Alkalinity</SortableHeader>
              <SortableHeader column="temperature">Temp (°F)</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="technician">Technician</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((reading) => (
              <TableRow key={reading.id}>
                <TableCell className="font-medium">{reading.poolName}</TableCell>
                <TableCell>{new Date(reading.testDate).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={
                    reading.freeChlorine < 1.0 ? 'text-red-600 font-medium' :
                    reading.freeChlorine > 3.0 ? 'text-orange-600 font-medium' :
                    'text-green-600'
                  }>
                    {reading.freeChlorine}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={
                    reading.ph < 7.2 || reading.ph > 7.6 ? 'text-orange-600 font-medium' :
                    'text-green-600'
                  }>
                    {reading.ph}
                  </span>
                </TableCell>
                <TableCell>{reading.alkalinity}</TableCell>
                <TableCell>{reading.temperature}°</TableCell>
                <TableCell>
                  <Badge
                    className={
                      reading.status === 'safe'
                        ? 'bg-green-500 hover:bg-green-500/80'
                        : reading.status === 'warning'
                        ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                        : reading.status === 'attention'
                        ? 'bg-orange-500 hover:bg-orange-500/80'
                        : 'bg-red-500 hover:bg-red-500/80'
                    }
                  >
                    {reading.status === 'safe' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {reading.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {reading.status === 'attention' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {reading.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {reading.status}
                  </Badge>
                </TableCell>
                <TableCell>{reading.technician}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive table with sortable columns for chemical readings data. Click headers to sort by different criteria.',
      },
    },
  },
}

// Filterable technician table
export const FilterableTechnicianTable: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [certificationFilter, setCertificationFilter] = useState<string>('all')

    const filteredData = useMemo(() => {
      return technicianData.filter((tech) => {
        const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tech.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || tech.status === statusFilter
        const matchesCertification = certificationFilter === 'all' || 
                                   tech.certification.toLowerCase().includes(certificationFilter.toLowerCase())

        return matchesSearch && matchesStatus && matchesCertification
      })
    }, [searchTerm, statusFilter, certificationFilter])

    return (
      <div className="w-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Technician Management</h2>
          <p className="text-gray-600">Manage pool maintenance staff and assignments</p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
            </SelectContent>
          </Select>

          <Select value={certificationFilter} onValueChange={setCertificationFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Certification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Certs</SelectItem>
              <SelectItem value="cpo">CPO</SelectItem>
              <SelectItem value="nspf">NSPF</SelectItem>
              <SelectItem value="mahc">MAHC</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchTerm('')
            setStatusFilter('all')
            setCertificationFilter('all')
          }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <Table>
          <TableCaption>
            Showing {filteredData.length} of {technicianData.length} technicians
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Assignments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-500">{tech.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tech.certification}</Badge>
                  </TableCell>
                  <TableCell>{tech.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {tech.currentAssignments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        tech.status === 'active'
                          ? 'bg-green-500 hover:bg-green-500/80'
                          : tech.status === 'busy'
                          ? 'bg-orange-500 hover:bg-orange-500/80'
                          : 'bg-gray-500 hover:bg-gray-500/80'
                      }
                    >
                      {tech.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{tech.phone}</div>
                      <div className="text-gray-500">{tech.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(tech.lastActive).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-gray-400" />
                    <p className="text-gray-500">No technicians found matching your criteria</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('all')
                        setCertificationFilter('all')
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced table with search and filter capabilities for technician management.',
      },
    },
  },
}

// Selectable table with batch actions
export const SelectableTable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

    const handleSelectAll = () => {
      if (selectedRows.size === poolStatusData.length) {
        setSelectedRows(new Set())
      } else {
        setSelectedRows(new Set(poolStatusData.map(pool => pool.id)))
      }
    }

    const handleSelectRow = (id: string) => {
      const newSelected = new Set(selectedRows)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      setSelectedRows(newSelected)
    }

    return (
      <div className="w-full p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Pool Selection</h2>
          <p className="text-gray-600">Select pools for batch operations</p>
        </div>

        {selectedRows.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedRows.size} pool{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <TestTube className="w-4 h-4 mr-2" />
                  Schedule Tests
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === poolStatusData.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Pool Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Technician</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poolStatusData.map((pool) => (
              <TableRow
                key={pool.id}
                className={cn(
                  selectedRows.has(pool.id) && 'bg-blue-50 border-blue-200'
                )}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(pool.id)}
                    onChange={() => handleSelectRow(pool.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium">{pool.name}</TableCell>
                <TableCell>{pool.location}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      pool.status === 'operational'
                        ? 'bg-green-500 hover:bg-green-500/80'
                        : pool.status === 'maintenance'
                        ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                        : 'bg-red-500 hover:bg-red-500/80'
                    }
                  >
                    {pool.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {pool.currentOccupancy}/{pool.capacity}
                </TableCell>
                <TableCell>{pool.nextMaintenance}</TableCell>
                <TableCell>{pool.assignedTechnician}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with row selection capabilities and batch actions for multiple pools.',
      },
    },
  },
}

// Loading and empty states
export const LoadingAndEmptyStates: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)

    const SkeletonRow = () => (
      <TableRow>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
        <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
      </TableRow>
    )

    return (
      <div className="w-full p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Table States</h2>
          <p className="text-gray-600">Loading and empty state examples</p>
        </div>

        <div className="mb-4 flex gap-2">
          <Button 
            variant={loading ? "default" : "outline"}
            onClick={() => {
              setLoading(true)
              setIsEmpty(false)
            }}
          >
            Loading State
          </Button>
          <Button 
            variant={isEmpty ? "default" : "outline"}
            onClick={() => {
              setLoading(false)
              setIsEmpty(true)
            }}
          >
            Empty State
          </Button>
          <Button 
            variant={!loading && !isEmpty ? "default" : "outline"}
            onClick={() => {
              setLoading(false)
              setIsEmpty(false)
            }}
          >
            With Data
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Test</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : isEmpty ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pools found</h3>
                      <p className="text-gray-500 mb-4">No pool data is available at this time.</p>
                      <Button>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Normal data
              poolStatusData.slice(0, 3).map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell className="font-medium">{pool.name}</TableCell>
                  <TableCell>{pool.location}</TableCell>
                  <TableCell>{pool.lastInspection}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        pool.status === 'operational'
                          ? 'bg-green-500 hover:bg-green-500/80'
                          : pool.status === 'maintenance'
                          ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                          : 'bg-red-500 hover:bg-red-500/80'
                      }
                    >
                      {pool.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{pool.assignedTechnician}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Table showing loading skeleton and empty state patterns for better user experience.',
      },
    },
  },
}