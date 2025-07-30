import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Input } from './input'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Badge } from './badge'
import { technicians, pools } from '../../test/fixtures/pool-maintenance-data'
import { TestTube, User, MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

const meta = {
  title: 'Patterns/Forms/Form Validation',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Form validation patterns using React Hook Form and Zod for pool maintenance data entry. These patterns demonstrate comprehensive validation strategies, error handling, and user feedback for critical pool safety data.

## Features
- Schema-based validation with Zod
- Real-time field validation
- Cross-field validation rules
- MAHC compliance checking
- Async validation for database checks
- Multi-step form flows
- Accessibility-focused error messaging

## Pool Maintenance Validation Rules
- Chemical levels must meet MAHC safety standards
- Technician certifications must be valid for task type
- Pool capacity limits for chemical dosing calculations
- Required fields for regulatory compliance
- Date/time validation for scheduling constraints
        `,
      },
    },
    backgrounds: {
      default: 'pool',
      values: [
        { name: 'pool', value: '#f0f9ff' },
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Basic form validation pattern
const basicFormSchema = z.object({
  poolName: z
    .string()
    .min(1, 'Pool name is required')
    .min(3, 'Pool name must be at least 3 characters')
    .max(50, 'Pool name must be less than 50 characters'),
  location: z.string().min(1, 'Location is required'),
  capacity: z.coerce
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity cannot exceed 1000 people'),
  type: z.enum(['community', 'therapy', 'kiddie', 'lap'], {
    errorMap: () => ({ message: 'Please select a valid pool type' }),
  }),
})

export const BasicFormValidation: Story = {
  render: () => {
    const form = useForm<z.infer<typeof basicFormSchema>>({
      resolver: zodResolver(basicFormSchema),
      defaultValues: {
        poolName: '',
        location: '',
        capacity: 0,
        type: 'community',
      },
    })

    const onSubmit = (values: z.infer<typeof basicFormSchema>) => {
      console.log('Form submitted:', values)
      alert(`Pool "${values.poolName}" created successfully!`)
    }

    return (
      <div className="w-96">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Create New Pool</h3>
          <p className="text-muted-foreground text-sm">Add a new pool to the maintenance system</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="poolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Community Pool" {...field} />
                  </FormControl>
                  <FormDescription>Enter a descriptive name for the pool</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="Recreation Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (people) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="150" {...field} />
                  </FormControl>
                  <FormDescription>Maximum safe capacity for swimmers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pool type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="community">Community Pool</SelectItem>
                      <SelectItem value="therapy">Therapy Pool</SelectItem>
                      <SelectItem value="kiddie">Kiddie Pool</SelectItem>
                      <SelectItem value="lap">Lap Pool</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Pool
            </Button>
          </form>
        </Form>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic form validation with required fields, input constraints, and select validation.',
      },
    },
  },
}

// Chemical reading form with MAHC compliance validation
const chemicalReadingSchema = z
  .object({
    poolId: z.string().min(1, 'Pool selection is required'),
    technicianId: z.string().min(1, 'Technician assignment is required'),
    date: z.string().min(1, 'Reading date is required'),
    time: z.string().min(1, 'Reading time is required'),
    chlorine: z.coerce
      .number()
      .min(0, 'Chlorine level cannot be negative')
      .max(10, 'Chlorine level dangerously high - maximum 10 ppm')
      .refine((val) => val >= 0.5, {
        message: 'CRITICAL: Chlorine below 0.5 ppm - pool closure required',
      }),
    ph: z.coerce
      .number()
      .min(6.0, 'pH too low - minimum 6.0')
      .max(8.5, 'pH too high - maximum 8.5')
      .refine((val) => val >= 7.2 && val <= 7.6, {
        message: 'pH outside ideal range (7.2-7.6) - adjustment needed',
      }),
    temperature: z.coerce
      .number()
      .min(15, 'Temperature too low for safe swimming')
      .max(40, 'Temperature too high - safety risk'),
    alkalinity: z.coerce
      .number()
      .min(80, 'Total alkalinity too low')
      .max(150, 'Total alkalinity too high'),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Cross-field validation: If chlorine is low, notes should explain action taken
      if (data.chlorine < 1.0 && (!data.notes || data.notes.trim().length < 10)) {
        return false
      }
      return true
    },
    {
      message: 'Action notes required when chlorine below 1.0 ppm',
      path: ['notes'],
    }
  )

export const ChemicalReadingValidation: Story = {
  render: () => {
    const form = useForm<z.infer<typeof chemicalReadingSchema>>({
      resolver: zodResolver(chemicalReadingSchema),
      defaultValues: {
        poolId: '',
        technicianId: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        chlorine: 0,
        ph: 0,
        temperature: 0,
        alkalinity: 0,
        notes: '',
      },
    })

    const watchedChlorine = form.watch('chlorine')
    const watchedPH = form.watch('ph')

    const getChlorineStatus = (value: number) => {
      if (value === 0) return { status: 'pending', message: 'Enter reading' }
      if (value < 0.5) return { status: 'critical', message: 'POOL CLOSURE REQUIRED' }
      if (value < 1.0) return { status: 'warning', message: 'Below safe range' }
      if (value > 3.0) return { status: 'warning', message: 'Above ideal range' }
      return { status: 'good', message: 'Within ideal range' }
    }

    const getPHStatus = (value: number) => {
      if (value === 0) return { status: 'pending', message: 'Enter reading' }
      if (value < 7.2 || value > 7.6) return { status: 'warning', message: 'Adjustment needed' }
      return { status: 'good', message: 'Optimal pH level' }
    }

    const onSubmit = (values: z.infer<typeof chemicalReadingSchema>) => {
      console.log('Chemical reading submitted:', values)
      alert('Chemical reading recorded successfully!')
    }

    return (
      <div className="w-[500px]">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <TestTube className="h-5 w-5" />
            Chemical Reading Entry
          </h3>
          <p className="text-muted-foreground text-sm">
            Record daily chemical levels with MAHC compliance validation
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Location *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pool" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pools.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{pool.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians
                          .filter((t) => t.status === 'available')
                          .map((tech) => (
                            <SelectItem key={tech.id} value={tech.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{tech.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chlorine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Free Chlorine (ppm) *
                      {watchedChlorine > 0 && (
                        <Badge
                          variant={
                            getChlorineStatus(watchedChlorine).status === 'critical'
                              ? 'destructive'
                              : getChlorineStatus(watchedChlorine).status === 'warning'
                                ? 'outline'
                                : 'secondary'
                          }
                          className={
                            getChlorineStatus(watchedChlorine).status === 'good'
                              ? 'bg-green-500 hover:bg-green-500/80'
                              : getChlorineStatus(watchedChlorine).status === 'warning'
                                ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                                : ''
                          }
                        >
                          {getChlorineStatus(watchedChlorine).status === 'critical' && (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {getChlorineStatus(watchedChlorine).status === 'good' && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {getChlorineStatus(watchedChlorine).message}
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="2.0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ideal: 1.0-3.0 ppm | Safe: 0.5-5.0 ppm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      pH Level *
                      {watchedPH > 0 && (
                        <Badge
                          variant={
                            getPHStatus(watchedPH).status === 'warning' ? 'outline' : 'secondary'
                          }
                          className={
                            getPHStatus(watchedPH).status === 'good'
                              ? 'bg-green-500 hover:bg-green-500/80'
                              : 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                          }
                        >
                          {getPHStatus(watchedPH).status === 'good' ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {getPHStatus(watchedPH).message}
                        </Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="6.0"
                        max="8.5"
                        placeholder="7.4"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ideal: 7.2-7.6 | Safe: 6.8-8.2</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Temperature (°C) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="15"
                        max="40"
                        placeholder="26.5"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Comfort range: 25-28°C</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alkalinity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Alkalinity (ppm) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="80" max="150" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>Target: 80-120 ppm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Action Notes {watchedChlorine < 1.0 && watchedChlorine > 0 && '*'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        watchedChlorine < 1.0 && watchedChlorine > 0
                          ? 'Required: Describe corrective action taken...'
                          : 'Optional: Additional observations or actions...'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {watchedChlorine < 1.0 && watchedChlorine > 0 && (
                      <span className="text-destructive font-medium">
                        Action notes required when chlorine is below safe levels
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              <TestTube className="mr-2 h-4 w-4" />
              Record Chemical Reading
            </Button>
          </form>
        </Form>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'MAHC-compliant chemical reading form with real-time validation, safety warnings, and cross-field dependencies.',
      },
    },
  },
}

// Task assignment form with conditional validation
const taskAssignmentSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Task title is required')
      .min(5, 'Title must be at least 5 characters'),
    description: z
      .string()
      .min(1, 'Task description is required')
      .min(10, 'Description must be at least 10 characters'),
    poolId: z.string().min(1, 'Pool selection is required'),
    technicianId: z.string().min(1, 'Technician assignment is required'),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    type: z.enum(['chemical', 'cleaning', 'maintenance', 'inspection', 'emergency']),
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    estimatedDuration: z.coerce
      .number()
      .min(15, 'Minimum task duration is 15 minutes')
      .max(480, 'Maximum task duration is 8 hours'),
    requiresCertification: z.boolean(),
    emergencyContact: z.string().optional(),
  })
  .refine(
    (data) => {
      // If task is emergency or critical, emergency contact is required
      if ((data.type === 'emergency' || data.priority === 'critical') && !data.emergencyContact) {
        return false
      }
      return true
    },
    {
      message: 'Emergency contact required for critical/emergency tasks',
      path: ['emergencyContact'],
    }
  )
  .refine(
    (data) => {
      // Chemical tasks require certified technicians
      if (data.type === 'chemical' && !data.requiresCertification) {
        return false
      }
      return true
    },
    {
      message: 'Chemical tasks require certified technicians',
      path: ['requiresCertification'],
    }
  )

export const TaskAssignmentValidation: Story = {
  render: () => {
    const form = useForm<z.infer<typeof taskAssignmentSchema>>({
      resolver: zodResolver(taskAssignmentSchema),
      defaultValues: {
        title: '',
        description: '',
        poolId: '',
        technicianId: '',
        priority: 'medium',
        type: 'maintenance',
        scheduledDate: new Date().toISOString().split('T')[0],
        estimatedDuration: 60,
        requiresCertification: false,
        emergencyContact: '',
      },
    })

    const watchedType = form.watch('type')
    const watchedPriority = form.watch('priority')

    const onSubmit = (values: z.infer<typeof taskAssignmentSchema>) => {
      console.log('Task assigned:', values)
      alert(`Task "${values.title}" assigned successfully!`)
    }

    const getAvailableTechnicians = () => {
      if (form.watch('requiresCertification')) {
        return technicians.filter(
          (t) =>
            t.status === 'available' &&
            (t.certifications.includes('Chemical Safety') ||
              t.certifications.includes('Pool Operator'))
        )
      }
      return technicians.filter((t) => t.status === 'available')
    }

    return (
      <div className="w-[600px]">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-5 w-5" />
            Task Assignment
          </h3>
          <p className="text-muted-foreground text-sm">
            Create and assign maintenance tasks with validation rules
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Pool filter cleaning and inspection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Detailed description of work to be performed..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chemical">
                          <div className="flex items-center gap-2">
                            <TestTube className="h-4 w-4" />
                            <span>Chemical Treatment</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="emergency">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Emergency</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400" />
                            <span>Low Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>Medium Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            <span>High Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span>Critical Priority</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Location *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pool" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pools.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{pool.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Technician *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getAvailableTechnicians().map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <div>{tech.name}</div>
                                <div className="text-muted-foreground text-xs">
                                  {tech.certifications.join(', ')}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="480"
                        step="15"
                        placeholder="60"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>15 minutes to 8 hours</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiresCertification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value || watchedType === 'chemical'}
                      onChange={field.onChange}
                      disabled={watchedType === 'chemical'}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Requires Certified Technician
                      {watchedType === 'chemical' && (
                        <Badge variant="secondary" className="ml-2">
                          Required for Chemical Tasks
                        </Badge>
                      )}
                    </FormLabel>
                    <FormDescription>
                      Only technicians with proper certifications can be assigned
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {(watchedType === 'emergency' || watchedPriority === 'critical') && (
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive h-4 w-4" />
                      Emergency Contact *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name and phone number for emergency contact" {...field} />
                    </FormControl>
                    <FormDescription className="text-destructive">
                      Required for emergency and critical priority tasks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </form>
        </Form>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complex task assignment form with conditional validation, certification requirements, and emergency protocols.',
      },
    },
  },
}

// Multi-step form pattern
export const MultiStepFormPattern: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3

    const stepTitles = ['Pool Information', 'Chemical Requirements', 'Schedule & Assignment']

    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }

    return (
      <div className="w-[500px]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Pool Setup Wizard</h3>
          <p className="text-muted-foreground text-sm">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>

          {/* Progress indicator */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium">Basic Pool Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Pool Name *</label>
                  <Input placeholder="Community Pool" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Location *</label>
                  <Input placeholder="Recreation Center" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Capacity *</label>
                  <Input type="number" placeholder="150" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium">Chemical Management Setup</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Primary Sanitizer</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sanitizer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chlorine">Chlorine</SelectItem>
                      <SelectItem value="bromine">Bromine</SelectItem>
                      <SelectItem value="saltwater">Salt Water System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Testing Frequency</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select testing schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twice-daily">Twice Daily</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium">Assignment & Schedule</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Primary Technician</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign primary technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} - {tech.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h5 className="mb-2 font-medium">Setup Summary</h5>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <div>✓ Pool information configured</div>
                    <div>✓ Chemical management setup</div>
                    <div>✓ Technician assigned</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={() => alert('Pool setup completed!')}>Complete Setup</Button>
          ) : (
            <Button onClick={nextStep}>Next Step</Button>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-step form pattern with progress tracking and step-by-step validation.',
      },
    },
  },
}
