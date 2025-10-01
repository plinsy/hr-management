<template>
  <div class="calendar-container" ref="containerRef">
    <!-- Loading overlay -->
    <v-overlay v-if="isLoading" class="align-center justify-center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-overlay>

    <!-- Calendar content -->
    <div v-if="!isLoading" class="calendar-content">
      <!-- Fixed header with employee info columns -->
      <div class="fixed-header">
        <div class="employee-columns">
          <div class="employee-header-cell name-cell">First Name</div>
          <div class="employee-header-cell name-cell">Last Name</div>
          <div class="employee-header-cell phone-cell">Phone Number</div>
        </div>
        
        <!-- Scrollable date headers -->
        <div class="date-headers-container" ref="dateHeadersRef">
          <div 
            class="date-headers"
            :style="{ 
              width: `${totalDateWidth}px`,
              transform: `translateX(-${scrollLeft}px)`
            }"
          >
            <div
              v-for="(month, monthIndex) in visibleMonths"
              :key="monthIndex"
              class="month-group"
            >
              <!-- Month header -->
              <div 
                class="month-header"
                :style="{ width: `${month.daysInMonth * CELL_WIDTH}px` }"
              >
                {{ month.name }} {{ month.year }}
              </div>
              
              <!-- Date cells -->
              <div class="date-cells">
                <div
                  v-for="date in month.dates"
                  :key="date.getTime()"
                  class="date-header-cell"
                  :class="{
                    'weekend': isWeekend(date),
                    'today': isToday(date)
                  }"
                  :style="{ width: `${CELL_WIDTH}px` }"
                >
                  <div class="date-day">{{ formatDate(date, 'short') }}</div>
                  <div class="date-weekday">{{ getDayName(date) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable body -->
      <div 
        class="calendar-body"
        ref="calendarBodyRef"
        @scroll="handleScroll"
        :style="{ height: `${containerHeight}px` }"
      >
        <div
          class="virtual-content"
          :style="{ 
            height: `${totalEmployeeHeight}px`,
            width: `${totalDateWidth + EMPLOYEE_COLUMNS_WIDTH}px`
          }"
        >
          <!-- Virtual scrolling employees -->
          <div
            v-for="(employee, employeeIndex) in visibleEmployees"
            :key="employee.id"
            class="employee-row"
            :style="{
              position: 'absolute',
              top: `${(employeeVisibleRange.startIndex + employeeIndex) * ROW_HEIGHT}px`,
              height: `${ROW_HEIGHT}px`,
              width: '100%'
            }"
          >
            <!-- Fixed employee info columns -->
            <div class="employee-info">
              <div class="employee-cell name-cell">{{ employee.firstName }}</div>
              <div class="employee-cell name-cell">{{ employee.lastName }}</div>
              <div class="employee-cell phone-cell">{{ employee.phoneNumber }}</div>
            </div>

            <!-- Absence cells -->
            <div 
              class="absence-cells"
              :style="{ 
                marginLeft: `${EMPLOYEE_COLUMNS_WIDTH}px`,
                transform: `translateX(-${scrollLeft}px)`
              }"
            >
              <div
                v-for="(date, dateIndex) in visibleDates"
                :key="`${employee.id}-${date.getTime()}`"
                class="absence-cell"
                :class="{
                  'absent': getAbsenceForDate(employee.id, date),
                  'present': !getAbsenceForDate(employee.id, date) && !isWeekend(date),
                  'weekend': isWeekend(date),
                  'today': isToday(date)
                }"
                :style="{ 
                  width: `${CELL_WIDTH}px`,
                  height: `${ROW_HEIGHT}px`
                }"
                @click="handleCellClick(employee, date)"
                @mouseover="handleCellHover(employee, date)"
                @mouseleave="handleCellLeave"
              >
                <!-- Tooltip for absence details -->
                <v-tooltip
                  v-if="getAbsenceForDate(employee.id, date)"
                  activator="parent"
                  location="top"
                >
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useEmployeeStore } from '~/stores/employees'
import type { Employee, Absence } from '~/types'
import { 
  getDatesInYear, 
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

// Props
interface Props {
  year?: number
  containerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: () => getCurrentYear(),
  containerHeight: 600
})

// Emits
const emit = defineEmits<{
  cellClick: [employee: Employee, date: Date, absence?: Absence]
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

// Computed properties
const employees = computed(() => employeeStore.getAllEmployees)
const yearDates = computed(() => getDatesInYear(props.year))

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

const dateVisibleRange = computed(() =>
  calculateHorizontalVisibleRange(
    scrollLeft.value,
    containerRef.value?.clientWidth || 800,
    CELL_WIDTH,
    yearDates.value.length,
    30
  )
)

// Visible data
const visibleEmployees = computed(() => 
  employees.value.slice(
    employeeVisibleRange.value.startIndex,
    employeeVisibleRange.value.endIndex + 1
  )
)

const visibleDates = computed(() =>
  yearDates.value.slice(
    dateVisibleRange.value.startIndex,
    dateVisibleRange.value.endIndex + 1
  )
)

// Calculate total dimensions
const totalEmployeeHeight = computed(() => employees.value.length * ROW_HEIGHT)
const totalDateWidth = computed(() => yearDates.value.length * CELL_WIDTH)

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
  scrollLeft.value = target.scrollLeft
  scrollTop.value = target.scrollTop
  
  // Sync horizontal scroll with date headers
  if (dateHeadersRef.value) {
    dateHeadersRef.value.scrollLeft = target.scrollLeft
  }
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
onMounted(async () => {
  await initialize()
  await nextTick()
  scrollToToday()
})

onUnmounted(() => {
  // Cleanup if needed
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

/* Tooltip styling */
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
