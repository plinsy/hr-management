<template>
  <div class="calendar-container" ref="containerRef" :data-view-type="props.viewType">
    <!-- Loading overlay -->
    <v-overlay v-if="isLoading" class="align-center justify-center">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate />
    </v-overlay>

    <!-- Calendar content -->
    <div v-if="!isLoading" class="calendar-content">
      <!-- View controls header -->
      <div class="view-controls">
        <div class="view-selector">
          <v-btn-toggle :model-value="props.viewType" @update:model-value="$emit('update:viewType', $event)"
            color="primary" density="compact" variant="outlined">
            <v-btn value="yearView" size="small">Year View</v-btn>
            <v-btn value="monthView" size="small">Month View</v-btn>
          </v-btn-toggle>
        </div>

        <div class="date-navigation">
          <v-btn @click="navigatePrevious" icon="mdi-chevron-left" size="small" variant="outlined" />
          <v-btn @click="navigateNext" icon="mdi-chevron-right" size="small" variant="outlined" />
        </div>

        <!-- <div class="current-period">
          <h3>{{ currentPeriodLabel }}</h3>
        </div> -->
      </div>

      <!-- Date picker and Today button section -->
      <div class="date-picker-section">
        <div class="date-picker-controls">
          <v-btn @click="navigateToday" prepend-icon="mdi-calendar-today" size="small" variant="outlined"
            color="primary">
            Today
          </v-btn>

          <v-menu v-model="showDatePicker" :close-on-content-click="false" location="bottom start">
            <template v-slot:activator="{ props: menuProps }">
              <v-btn v-bind="menuProps" prepend-icon="mdi-calendar" size="small" variant="outlined">
                {{ formattedSelectedDate }}
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-date-picker v-model="selectedDateForPicker" @update:model-value="handleDatePickerChange" hide-header
                  show-adjacent-months color="primary" />
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </div>

      <!-- Fixed header with employee info columns -->
      <div v-if="viewType === 'monthView' || viewType === 'yearView'" class="fixed-header">
        <div class="employee-columns">
          <div class="employee-header-cell name-cell">First Name</div>
          <div class="employee-header-cell name-cell">Last Name</div>
          <div class="employee-header-cell phone-cell">Phone Number</div>
        </div>

        <!-- Scrollable date headers -->
        <div class="date-headers-container" ref="dateHeadersRef">
          <!-- Month View Headers -->
          <div v-if="viewType === 'monthView'" class="date-headers month-view" :style="{
            width: `${totalDateWidth}px`,
            transform: 'translateX(0)'
          }">
            <div v-for="(month, monthIndex) in visibleMonths" :key="monthIndex" class="month-group">
              <!-- Month header -->
              <div class="month-header" :style="{ width: '100%' }">
                {{ month.name }} {{ month.year }}
              </div>

              <!-- Date cells -->
              <div class="date-cells">
                <div v-for="date in month.dates" :key="date.getTime()" class="date-header-cell" :class="{
                  'weekend': isWeekend(date),
                  'today': isToday(date)
                }" :style="{ width: `${dynamicCellWidth}px` }">
                  <div class="date-day">{{ formatDate(date, 'day') }}</div>
                  <div class="date-weekday">{{ getDayName(date) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Year View Headers -->
          <div v-else-if="viewType === 'yearView'" class="date-headers year-view">
            <div class="year-month-headers">
              <div v-for="monthData in yearViewData" :key="`header-${monthData.year}-${monthData.month}`"
                class="year-month-header" @click="navigateToMonth(monthData.year, monthData.month)">
                <div class="month-name">{{ monthData.shortName }}</div>
                <div class="month-year">{{ monthData.year }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable body -->
      <div class="calendar-body" ref="calendarBodyRef" @scroll="handleScroll"
        :style="{ height: `${containerHeight}px` }">
        <!-- Year View -->
        <div v-if="viewType === 'yearView'" class="year-view-content">
          <div class="virtual-content" :style="{
            height: `${totalEmployeeHeight}px`,
            width: `${yearViewTotalWidth}px`
          }">
            <!-- Virtual scrolling employees for year view -->
            <div v-for="(employee, employeeIndex) in visibleEmployees" :key="employee.id" class="employee-row" :style="{
              position: 'absolute',
              top: `${(employeeVisibleRange.startIndex + employeeIndex) * ROW_HEIGHT}px`,
              height: `${ROW_HEIGHT}px`,
              width: '100%'
            }">
              <!-- Fixed employee info columns -->
              <div class="employee-info">
                <div class="employee-cell name-cell">{{ employee.firstName }}</div>
                <div class="employee-cell name-cell">{{ employee.lastName }}</div>
                <div class="employee-cell phone-cell">{{ employee.phoneNumber }}</div>
              </div>

              <!-- Month absence cells -->
              <div class="absence-cells year-view">
                <div v-for="monthData in yearViewData" :key="`${employee.id}-${monthData.year}-${monthData.month}`"
                  class="absence-cell year-month-cell" :class="{
                    'has-absences': getMonthAbsenceCount(employee.id, monthData.year, monthData.month) > 0,
                    'no-absences': getMonthAbsenceCount(employee.id, monthData.year, monthData.month) === 0
                  }" :style="{
                    width: `${yearMonthCellWidth}px`,
                    height: `${ROW_HEIGHT}px`
                  }" @click="handleMonthCellClick(employee, monthData.year, monthData.month)">

                  <!-- Absence count display -->
                  <span v-if="getMonthAbsenceCount(employee.id, monthData.year, monthData.month) > 0" class="absence-count-display">
                    {{ getMonthAbsenceCount(employee.id, monthData.year, monthData.month) > 9 ? '9+' : getMonthAbsenceCount(employee.id, monthData.year, monthData.month) }}
                  </span>

                  <!-- Tooltip for month absences -->
                  <v-tooltip v-if="getMonthAbsenceCount(employee.id, monthData.year, monthData.month) > 0" activator="parent" location="top">
                    <div class="month-absence-tooltip">
                      <div class="tooltip-header">
                        <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                      </div>
                      <div class="tooltip-month">{{ monthData.name }} {{ monthData.year }}</div>
                      <div class="tooltip-divider"></div>
                      <div class="absence-list">
                        <div v-for="absence in getEmployeeMonthAbsences(employee.id, monthData.year, monthData.month)" 
                             :key="absence.id" class="absence-item">
                          <div class="absence-dates">
                            {{ formatDate(new Date(absence.startDate), 'short') }} - 
                            {{ formatDate(new Date(absence.endDate), 'short') }}
                          </div>
                          <div class="absence-type">{{ absence.type }}</div>
                          <div v-if="absence.reason" class="absence-reason">{{ absence.reason }}</div>
                        </div>
                      </div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Month View -->
        <div v-else-if="viewType === 'monthView'" class="month-view-content">
          <div class="virtual-content" :style="{
            height: `${totalEmployeeHeight}px`,
            width: `${totalDateWidth + EMPLOYEE_COLUMNS_WIDTH}px`
          }">
            <!-- Virtual scrolling employees -->
            <div v-for="(employee, employeeIndex) in visibleEmployees" :key="employee.id" class="employee-row" :style="{
              position: 'absolute',
              top: `${(employeeVisibleRange.startIndex + employeeIndex) * ROW_HEIGHT}px`,
              height: `${ROW_HEIGHT}px`,
              width: '100%'
            }">
              <!-- Fixed employee info columns -->
              <div class="employee-info">
                <div class="employee-cell name-cell">{{ employee.firstName }}</div>
                <div class="employee-cell name-cell">{{ employee.lastName }}</div>
                <div class="employee-cell phone-cell">{{ employee.phoneNumber }}</div>
              </div>

              <!-- Absence cells -->
              <div class="absence-cells" :class="{ 'month-view': viewType === 'monthView' }" :style="{
                transform: 'translateX(0)'
              }">
                <div v-for="(date, dateIndex) in visibleDates" :key="`${employee.id}-${date.getTime()}`"
                  class="absence-cell" :class="{
                    'absent': getAbsenceForDate(employee.id, date),
                    'present': !getAbsenceForDate(employee.id, date) && !isWeekend(date),
                    'weekend': isWeekend(date),
                    'today': isToday(date)
                  }" :style="{
                    width: `${dynamicCellWidth}px`,
                    height: `${ROW_HEIGHT}px`
                  }" @click="handleCellClick(employee, date)" @mouseover="handleCellHover(employee, date)"
                  @mouseleave="handleCellLeave">
                  <!-- Tooltip for absence details -->
                  <v-tooltip v-if="getAbsenceForDate(employee.id, date)" activator="parent" location="top">
                    <div class="absence-tooltip">
                      <div><strong>{{ employee.firstName }} {{ employee.lastName }}</strong></div>
                      <div>{{ formatDate(date, 'long') }}</div>
                      <div>Type: {{ getAbsenceForDate(employee.id, date)?.type }}</div>
                      <div v-if="getAbsenceForDate(employee.id, date)?.reason">
                        Reason: {{ getAbsenceForDate(employee.id, date)?.reason }}
                      </div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useEmployeeStore } from '~/stores/employees'
import type { Employee, Absence } from '~/types'
import {
  getDatesInYear,
  getCurrentWeekDates,
  getDatesInMonth,
  getMonthsInYear,
  isWeekend,
  isToday,
  formatDate,
  getDayName,
  getMonthName,
  getCurrentYear
} from '~/utils/dateUtils'
import {
  calculateVisibleRange,
  calculateHorizontalVisibleRange,
  throttle
} from '~/utils/virtualScrolling'

/**
 * Calendar table component with virtual scrolling
 * Displays employee absences in a year-view calendar format
 */

// Constants for sizing
const ROW_HEIGHT = 40
const CELL_WIDTH = 40
const EMPLOYEE_COLUMNS_WIDTH = 380 // Width for name and phone number columns
const HEADER_HEIGHT = 80

// View types
export type ViewType = 'yearView' | 'monthView'

// Props
interface Props {
  year?: number
  containerHeight?: number
  viewType?: ViewType
}

const props = withDefaults(defineProps<Props>(), {
  year: () => getCurrentYear(),
  containerHeight: 600,
  viewType: 'yearView' as ViewType
})

// Emits
const emit = defineEmits<{
  cellClick: [employee: Employee, date: Date, absence?: Absence]
  'update:viewType': [viewType: ViewType]
}>()

// Store
const employeeStore = useEmployeeStore()

// Refs
const containerRef = ref<HTMLElement>()
const calendarBodyRef = ref<HTMLElement>()
const dateHeadersRef = ref<HTMLElement>()

// Reactive state
const scrollLeft = ref(0)
const scrollTop = ref(0)
const isLoading = ref(true)
const currentDate = ref(new Date()) // For week/month navigation

// Cache management for month data
interface CachedMonthData {
  dates: Date[]
  employees: Employee[]
  lastUpdated: number
}

const monthDataCache = ref<Map<string, CachedMonthData>>(new Map())
const isLoadingBackgroundData = ref(false)

// Date picker state
const showDatePicker = ref(false)
const selectedDateForPicker = ref(new Date())

// Reactive container width for responsive calculations
const containerWidth = ref(800)

// Computed properties
const employees = computed(() => employeeStore.getAllEmployees)

const displayDates = computed(() => {
  switch (props.viewType) {
    case 'yearView':
      // For year view, we'll return empty array as we handle months differently
      return []
    case 'monthView':
      // Use cached data if available, otherwise generate fresh
      const cacheKey = getCacheKey(currentDate.value.getFullYear(), currentDate.value.getMonth())
      const cachedData = monthDataCache.value.get(cacheKey)
      if (cachedData && isCacheValid(cachedData)) {
        return cachedData.dates
      }
      return getDatesInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth())
    default:
      return []
  }
})

// Keep yearDates for backward compatibility, but use displayDates for the view
const yearDates = computed(() => displayDates.value)

// Year view data - months with absence counts
const yearViewData = computed(() => {
  if (props.viewType !== 'yearView') return []

  const months = getMonthsInYear(currentDate.value.getFullYear())

  return months.map(month => {
    // Calculate absence counts for this month
    let totalAbsences = 0

    employees.value.forEach(employee => {
      employee.absences.forEach(absence => {
        const startDate = new Date(absence.startDate)
        const endDate = new Date(absence.endDate)

        // Check if absence overlaps with this month
        const monthStart = month.firstDate
        const monthEnd = new Date(month.year, month.month + 1, 0)

        if (startDate <= monthEnd && endDate >= monthStart) {
          totalAbsences++
        }
      })
    })

    return {
      ...month,
      absenceCount: totalAbsences,
      displayCount: totalAbsences > 9 ? '9+' : totalAbsences.toString()
    }
  })
})

// Year view table dimensions
const yearMonthCellWidth = computed(() => {
  if (props.viewType === 'yearView') {
    const _containerWidth = containerWidth.value - EMPLOYEE_COLUMNS_WIDTH
    return Math.max(80, Math.floor(_containerWidth / 12)) // 12 months
  }
  return 80
})

const yearViewTotalWidth = computed(() => {
  if (props.viewType === 'yearView') {
    return EMPLOYEE_COLUMNS_WIDTH + (yearMonthCellWidth.value * 12)
  }
  return EMPLOYEE_COLUMNS_WIDTH
})

// Virtual scrolling ranges
const employeeVisibleRange = computed(() =>
  calculateVisibleRange(
    scrollTop.value,
    props.containerHeight - HEADER_HEIGHT,
    ROW_HEIGHT,
    employees.value.length,
    5
  )
)

const dateVisibleRange = computed(() => {
  // For month view, show all dates without horizontal scrolling
  if (props.viewType === 'monthView') {
    return {
      startIndex: 0,
      endIndex: yearDates.value.length - 1
    }
  }

  // For week view, keep horizontal scrolling if needed
  return calculateHorizontalVisibleRange(
    scrollLeft.value,
    containerRef.value?.clientWidth || 800,
    CELL_WIDTH,
    yearDates.value.length,
    30
  )
})

// Visible data
const visibleEmployees = computed(() =>
  employees.value.slice(
    employeeVisibleRange.value.startIndex,
    employeeVisibleRange.value.endIndex + 1
  )
)

const visibleDates = computed(() => {
  // For month view, show all dates
  if (props.viewType === 'monthView') {
    return yearDates.value
  }

  // For week view, use virtual scrolling
  return yearDates.value.slice(
    dateVisibleRange.value.startIndex,
    dateVisibleRange.value.endIndex + 1
  )
})

// Calculate total dimensions
const totalEmployeeHeight = computed(() => employees.value.length * ROW_HEIGHT)
const totalDateWidth = computed(() => {
  if (props.viewType === 'monthView') {
    // Calculate width based on 31 days maximum to ensure all days fit
    const maxDaysInMonth = 31
    return dynamicCellWidth.value * maxDaysInMonth
  } else if (props.viewType === 'yearView') {
    // Calculate width for 12 months
    return yearMonthCellWidth.value * 12
  }
  return yearDates.value.length * CELL_WIDTH
})

// Calculate dynamic cell width for month view
const dynamicCellWidth = computed(() => {
  if (props.viewType === 'monthView') {
    const availableWidth = containerWidth.value - EMPLOYEE_COLUMNS_WIDTH
    // Always calculate based on maximum 31 days to ensure consistency
    const maxDaysInMonth = 31
    return Math.max(20, Math.floor(availableWidth / maxDaysInMonth)) // Minimum 20px per day
  }
  return CELL_WIDTH
})

// Watchers
watch(() => props.viewType, (newViewType) => {
  if (newViewType === 'monthView') {
    // Reset scroll position and preload adjacent months
    scrollLeft.value = 0
    nextTick(() => preloadAdjacentMonths())
  }
})

watch(currentDate, (newDate) => {
  // Sync the date picker with current date
  selectedDateForPicker.value = new Date(newDate)

  if (props.viewType === 'monthView') {
    nextTick(() => preloadAdjacentMonths())
  }
})

// Group dates by month for headers
const visibleMonths = computed(() => {
  const months: Array<{
    name: string
    year: number
    daysInMonth: number
    dates: Date[]
  }> = []

  let currentMonth = -1
  let currentMonthData: any = null

  for (const date of visibleDates.value) {
    const month = date.getMonth()

    if (month !== currentMonth) {
      if (currentMonthData) {
        months.push(currentMonthData)
      }

      currentMonth = month
      currentMonthData = {
        name: getMonthName(date),
        year: date.getFullYear(),
        daysInMonth: new Date(date.getFullYear(), month + 1, 0).getDate(),
        dates: [date]
      }
    } else {
      currentMonthData.dates.push(date)
    }
  }

  if (currentMonthData) {
    months.push(currentMonthData)
  }

  return months
})

// Methods
/**
 * Get absence for a specific employee and date
 */
const getAbsenceForDate = (employeeId: string, date: Date): Absence | null => {
  return employeeStore.isEmployeeAbsentOnDate(employeeId, date)
}

/**
 * Handle scroll events with throttling
 */
const handleScroll = throttle((event: Event) => {
  const target = event.target as HTMLElement

  // Prevent horizontal scrolling
  target.scrollLeft = 0
  scrollLeft.value = 0

  scrollTop.value = target.scrollTop
}, 16) // ~60fps

/**
 * Handle cell click events
 */
const handleCellClick = (employee: Employee, date: Date) => {
  const absence = getAbsenceForDate(employee.id, date)
  if (!absence) {
    throw new Error(`Cell not found ${employee.id} - ${date.toISOString()}`)
  }
  emit('cellClick', employee, date, absence)
}

/**
 * Get absence count for a specific employee and month
 */
const getMonthAbsenceCount = (employeeId: string, year: number, month: number): number => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  if (!employee) return 0

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)

  let count = 0
  employee.absences.forEach(absence => {
    const startDate = new Date(absence.startDate)
    const endDate = new Date(absence.endDate)
    
    // Check if absence overlaps with this month
    if (startDate <= monthEnd && endDate >= monthStart) {
      count++
    }
  })

  return count
}

/**
 * Get all absences for a specific employee and month
 */
const getEmployeeMonthAbsences = (employeeId: string, year: number, month: number): Absence[] => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  if (!employee) return []

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)

  return employee.absences.filter(absence => {
    const startDate = new Date(absence.startDate)
    const endDate = new Date(absence.endDate)
    
    // Check if absence overlaps with this month
    return startDate <= monthEnd && endDate >= monthStart
  })
}

/**
 * Handle month cell click in year view
 */
const handleMonthCellClick = (employee: Employee, year: number, month: number) => {
  // Navigate to month view for this specific month
  currentDate.value = new Date(year, month, 1)
  selectedDateForPicker.value = new Date(year, month, 1)
  emit('update:viewType', 'monthView')
}

/**
 * Handle cell hover events for enhanced UX
 */
const handleCellHover = (employee: Employee, date: Date) => {
  // Optional: Add hover effects or preview
}

/**
 * Handle cell leave events
 */
const handleCellLeave = () => {
  // Optional: Remove hover effects
}

// Current period label for display
const currentPeriodLabel = computed(() => {
  if (props.viewType === 'yearView') {
    return `${currentDate.value.getFullYear()}`
  } else {
    return `${getMonthName(currentDate.value)} ${currentDate.value.getFullYear()}`
  }
})

// Formatted selected date for the date picker button
const formattedSelectedDate = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

/**
 * Navigate to previous period (year or month)
 */
const navigatePrevious = () => {
  const newDate = new Date(currentDate.value)
  if (props.viewType === 'yearView') {
    newDate.setFullYear(newDate.getFullYear() - 1)
  } else {
    newDate.setMonth(newDate.getMonth() - 1)
  }
  currentDate.value = newDate

  // Preload adjacent months for month view
  if (props.viewType === 'monthView') {
    nextTick(() => preloadAdjacentMonths())
  }
}

/**
 * Navigate to next period (year or month)
 */
const navigateNext = () => {
  const newDate = new Date(currentDate.value)
  if (props.viewType === 'yearView') {
    newDate.setFullYear(newDate.getFullYear() + 1)
  } else {
    newDate.setMonth(newDate.getMonth() + 1)
  }
  currentDate.value = newDate

  // Preload adjacent months for month view
  if (props.viewType === 'monthView') {
    nextTick(() => preloadAdjacentMonths())
  }
}

/**
 * Navigate to today
 */
const navigateToday = () => {
  currentDate.value = new Date()
  selectedDateForPicker.value = new Date()
  showDatePicker.value = false
}

/**
 * Handle date picker changes
 */
const handleDatePickerChange = (newDate: Date | null) => {
  if (newDate) {
    currentDate.value = new Date(newDate)
    selectedDateForPicker.value = new Date(newDate)
    showDatePicker.value = false
  }
}

/**
 * Navigate to specific month (from year view)
 */
const navigateToMonth = (year: number, month: number) => {
  currentDate.value = new Date(year, month, 1)
  selectedDateForPicker.value = new Date(year, month, 1)
  emit('update:viewType', 'monthView')
}

// Cache management functions
/**
 * Generate cache key for a specific month
 */
const getCacheKey = (year: number, month: number): string => {
  return `${year}-${month.toString().padStart(2, '0')}`
}

/**
 * Check if cached data is still valid (within 5 minutes)
 */
const isCacheValid = (cachedData: CachedMonthData): boolean => {
  const fiveMinutes = 5 * 60 * 1000
  return Date.now() - cachedData.lastUpdated < fiveMinutes
}

/**
 * Cache month data
 */
const cacheMonthData = (year: number, month: number, dates: Date[], employees: Employee[]) => {
  const cacheKey = getCacheKey(year, month)
  monthDataCache.value.set(cacheKey, {
    dates,
    employees,
    lastUpdated: Date.now()
  })
}

/**
 * Load month data in background
 */
const loadMonthDataInBackground = async (year: number, month: number) => {
  const cacheKey = getCacheKey(year, month)

  // Skip if already cached and valid
  const existingCache = monthDataCache.value.get(cacheKey)
  if (existingCache && isCacheValid(existingCache)) {
    return
  }

  isLoadingBackgroundData.value = true

  try {
    // Generate dates for the month
    const dates = getDatesInMonth(year, month)

    // Get employees data (in a real app, this might be a filtered API call)
    const employees = employeeStore.getAllEmployees

    // Cache the data
    cacheMonthData(year, month, dates, employees)

  } catch (error) {
    console.error('Failed to load background data:', error)
  } finally {
    isLoadingBackgroundData.value = false
  }
}

/**
 * Preload next and previous months
 */
const preloadAdjacentMonths = () => {
  if (props.viewType !== 'monthView') return

  const currentYear = currentDate.value.getFullYear()
  const currentMonth = currentDate.value.getMonth()

  // Load next month
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
  loadMonthDataInBackground(nextYear, nextMonth)

  // Load previous month
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
  loadMonthDataInBackground(prevYear, prevMonth)
}

/**
 * Initialize component
 */
const initialize = async () => {
  isLoading.value = true

  try {
    // Load employee data if not already loaded
    if (employees.value.length === 0) {
      await employeeStore.initializeData()
    }
  } catch (error) {
    console.error('Failed to initialize calendar:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Scroll to today's date
 */
const scrollToToday = () => {
  const today = new Date()
  const todayIndex = yearDates.value.findIndex(date =>
    date.toDateString() === today.toDateString()
  )

  if (todayIndex !== -1 && calendarBodyRef.value) {
    const scrollPosition = Math.max(0, todayIndex * CELL_WIDTH - 200)
    calendarBodyRef.value.scrollLeft = scrollPosition
  }
}

// Lifecycle
// ResizeObserver to handle container size changes
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  // Initialize date picker with current date
  selectedDateForPicker.value = new Date(currentDate.value)

  await initialize()
  await nextTick()

  // Set up ResizeObserver to handle container width changes
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(containerRef.value)
  }

  if (props.viewType === 'monthView') {
    // For month view, preload adjacent months
    preloadAdjacentMonths()
  }
  // Year view doesn't need special initialization
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Expose methods for parent component
defineExpose({
  scrollToToday,
  scrollLeft,
  scrollTop
})
</script>

<style scoped>
.calendar-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

/* View controls styling */
.view-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  gap: 16px;
  flex-shrink: 0;
}

.view-selector {
  display: flex;
  align-items: center;
}

.date-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-period {
  flex: 1;
  text-align: center;
}

.current-period h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #424242;
}

/* Date picker section styling */
.date-picker-section {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.date-picker-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Fixed header styling */
.fixed-header {
  position: relative;
  z-index: 10;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  display: flex;
  flex-shrink: 0;
}

.employee-columns {
  position: sticky;
  left: 0;
  z-index: 12;
  display: flex;
  background-color: #f5f5f5;
  border-right: 2px solid #e0e0e0;
  width: 380px;
}

.employee-header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #424242;
  border-right: 1px solid #e0e0e0;
  padding: 8px 4px;
  background-color: #f5f5f5;
}

.name-cell {
  width: 120px;
}

.phone-cell {
  width: 140px;
}

/* Date headers */
.date-headers-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.date-headers {
  display: flex;
  position: relative;
}

.month-group {
  display: flex;
  flex-direction: column;
}

.month-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1976d2;
  background-color: #e3f2fd;
  border-right: 1px solid #90caf9;
  border-bottom: 1px solid #90caf9;
}

.date-cells {
  display: flex;
  height: 40px;
}

.date-header-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
  font-size: 0.75rem;
  padding: 2px;
}

.date-header-cell.weekend {
  background-color: #f5f5f5;
  color: #757575;
}

.date-header-cell.today {
  background-color: #1976d2;
  color: white;
  font-weight: 600;
}

.date-day {
  font-weight: 500;
  line-height: 1;
}

.date-weekday {
  font-size: 0.625rem;
  opacity: 0.8;
  line-height: 1;
}

/* Calendar body */
.calendar-body {
  position: relative;
  overflow: auto;
  background-color: #fff;
  flex: 1;
  min-height: 0;
}

.virtual-content {
  position: relative;
}

/* Employee rows */
.employee-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.employee-info {
  position: sticky;
  left: 0;
  z-index: 5;
  display: flex;
  background-color: #fafafa;
  border-right: 2px solid #e0e0e0;
  width: 380px;
}

.employee-cell {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 0.875rem;
  border-right: 1px solid #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Absence cells */
.absence-cells {
  display: flex;
  position: relative;
}

.absence-cell {
  border-right: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.absence-cell:hover {
  transform: scale(1.1);
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Cell states */
.absence-cell.absent {
  background-color: #f44336;
}

.absence-cell.present {
  background-color: #4caf50;
}

.absence-cell.weekend {
  background-color: #9e9e9e;
  cursor: default;
}

.absence-cell.today {
  box-shadow: inset 0 0 0 2px #1976d2;
}

/* Month view specific styles */
.date-headers.month-view {
  overflow: visible;
  width: 100% !important;
}

.absence-cells.month-view {
  overflow: visible;
  width: 100% !important;
}

.date-headers.month-view .date-cells {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.absence-cells.month-view {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Prevent horizontal scrolling in month view */
.calendar-body {
  overflow-x: auto;
}

.calendar-container[data-view-type="monthView"] .calendar-body {
  overflow-x: hidden !important;
}

/* Year view specific styles */
.year-view-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Year view headers */
.date-headers.year-view {
  display: flex;
  width: 100%;
}

.year-month-headers {
  display: flex;
  width: 100%;
}

.year-month-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
  padding: 8px 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 60px;
}

.year-month-header:hover {
  background-color: #e3f2fd;
}

.month-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1976d2;
}

.month-year {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}

/* Year view absence cells */
.absence-cells.year-view {
  display: flex;
  overflow: visible;
  width: 100%;
}

.year-month-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.year-month-cell.has-absences {
  background-color: #f44336;
  color: white;
}

.year-month-cell.no-absences {
  background-color: #4caf50;
}

.year-month-cell:hover {
  transform: scale(1.1);
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.absence-count-display {
  font-weight: 600;
  font-size: 0.875rem;
}

/* Year view tooltip styles */
.month-absence-tooltip {
  max-width: 300px;
  font-size: 0.875rem;
  line-height: 1.4;
}

.tooltip-header {
  margin-bottom: 8px;
}

.tooltip-month {
  color: #1976d2;
  font-weight: 500;
  margin-bottom: 8px;
}

.tooltip-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 0;
}

.absence-list {
  max-height: 200px;
  overflow-y: auto;
}

.absence-item {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.absence-item:last-child {
  border-bottom: none;
}

.absence-dates {
  font-weight: 500;
  color: #424242;
}

.absence-type {
  text-transform: capitalize;
  color: #666;
  font-size: 0.8rem;
}

.absence-reason {
  font-style: italic;
  color: #888;
  font-size: 0.8rem;
}/* Tooltip styling */
.absence-tooltip {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 960px) {

  .employee-columns,
  .employee-info {
    width: 340px;
  }

  .name-cell {
    width: 100px;
  }

  .phone-cell {
    width: 120px;
  }
}

@media (max-width: 600px) {

  .employee-columns,
  .employee-info {
    width: 260px;
  }

  .name-cell {
    width: 80px;
  }

  .phone-cell {
    width: 100px;
    font-size: 0.7rem;
  }

  .employee-cell,
  .employee-header-cell {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
}
</style>
