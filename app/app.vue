<template>
  <v-app>
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !mobile"
      :temporary="mobile"
      color="surface"
      elevation="3"
      app
    >
      <!-- Sidebar header -->
      <div class="sidebar-header pa-4">
        <div class="d-flex align-center">
          <v-avatar 
            :size="rail && !mobile ? 32 : 40" 
            color="primary"
            class="me-3"
          >
            <v-icon :size="rail && !mobile ? 'small' : 'default'" color="white">
              mdi-waves-arrow-right
            </v-icon>
          </v-avatar>
          <div v-if="!rail || mobile" class="flex-grow-1">
            <div class="text-h6 font-weight-bold">HRStream</div>
            <div class="text-caption text-medium-emphasis">{{ totalEmployees }} Employees</div>
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Navigation Menu -->
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-calendar-account"
          title="Calendar View"
          value="calendar"
          active
          @click="activeSection = 'calendar'"
        />
        
        <!-- <v-list-item
          prepend-icon="mdi-account-group"
          title="Employees"
          value="employees"
          @click="activeSection = 'employees'"
        />
        
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Statistics"
          value="statistics"
          @click="handleViewStats"
        />
        
        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          value="settings"
          @click="activeSection = 'settings'"
        /> -->
      </v-list>

      <v-divider class="my-2" />

      <!-- Quick Actions -->
      <!-- <v-list density="compact">
        <v-list-subheader v-if="!rail || mobile">Quick Actions</v-list-subheader>
        
        <v-list-item
          prepend-icon="mdi-calendar-plus"
          title="Add Absence"
          @click="handleQuickAddAbsence"
        />
        
        <v-list-item
          prepend-icon="mdi-account-plus"
          title="Add Employee"
          @click="handleQuickAddEmployee"
        />
      </v-list> -->

      <!-- Rail toggle button -->
      <template v-slot:append v-if="!mobile">
        <div class="pa-2">
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            @click="rail = !rail"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar 
      color="primary" 
      dark 
      elevation="2"
      app
    >
      <!-- Mobile menu button -->
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
      />

      <v-app-bar-title class="d-flex align-center">
        <span class="text-h5 font-weight-bold d-none d-sm-flex">HRStream</span>
        <span class="text-h6 font-weight-bold d-sm-none">HRStream</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- Year selector -->
      <!-- <v-select
        v-model="selectedYear"
        :items="availableYears"
        label="Year"
        variant="outlined"
        density="compact"
        hide-details
        class="year-selector me-4 d-none d-md-flex"
        style="max-width: 120px;"
      /> -->

      <!-- Actions -->
      <div class="d-flex align-center ga-2">
        <!-- Stats chip - hidden on mobile -->
        <v-chip 
          v-if="!mobile"
          color="secondary" 
          variant="tonal"
          prepend-icon="mdi-account-group"
        >
          {{ totalEmployees }} Employees
        </v-chip>

        <!-- Refresh button -->
        <v-btn
          icon="mdi-refresh"
          variant="text"
          @click="refreshData"
          :loading="isLoading"
          :size="mobile ? 'small' : 'default'"
        />
      </div>
    </v-app-bar>

    <!-- Main content -->
    <v-main class="main-content">
      <div class="main-container">
        <!-- Error state -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="ma-4"
          closable
          @click:close="error = null"
        >
          <v-alert-title>Error</v-alert-title>
          {{ error }}
        </v-alert>

        <!-- Success messages -->
        <v-snackbar
          v-model="showSuccessMessage"
          :timeout="3000"
          color="success"
          variant="elevated"
        >
          <v-icon start>mdi-check-circle</v-icon>
          {{ successMessage }}
        </v-snackbar>

        <!-- Warning messages -->
        <v-snackbar
          v-model="showWarningMessage"
          :timeout="3000"
          color="warning"
          variant="elevated"
        >
          <v-icon start>mdi-alert</v-icon>
          {{ warningMessage }}
        </v-snackbar>

        <!-- Calendar container -->
        <div v-if="activeSection === 'calendar'" class="calendar-wrapper">
          <CalendarTable
            ref="calendarRef"
            :year="selectedYear"
            :container-height="calendarHeight"
            :view-type="viewType"
            @cell-click="handleCellClick"
            @update:view-type="viewType = $event"
          />
        </div>

        <!-- Employees List -->
        <div v-else-if="activeSection === 'employees'" class="employees-section">
          <div class="section-header pa-4">
            <h2 class="text-h4 mb-2">Employee Directory</h2>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage and view all employees with their personnel information and {{ selectedYear }} absence summary
            </p>
          </div>

          <v-container fluid class="pa-4">
            <v-row>
              <v-col cols="12">
                <!-- Search and filters -->
                <v-card class="mb-4" elevation="1">
                  <v-card-text>
                    <v-row align="center">
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employeeSearch"
                          label="Search employees..."
                          prepend-inner-icon="mdi-magnify"
                          variant="outlined"
                          hide-details
                          clearable
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="selectedYear"
                          :items="availableYears"
                          label="Year"
                          variant="outlined"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="text-right">
                          <v-chip color="primary" variant="tonal" size="large">
                            <v-icon start>mdi-account-group</v-icon>
                            {{ filteredEmployees.length }} Employees
                          </v-chip>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Employee Table -->
                <v-card elevation="2">
                  <v-data-table
                    :headers="employeeHeaders"
                    :items="filteredEmployees"
                    :search="employeeSearch"
                    :loading="isLoading"
                    class="employee-table"
                    :items-per-page="25"
                    :sort-by="[{ key: 'lastName', order: 'asc' }]"
                  >
                    <!-- Employee Name Column -->
                    <template v-slot:item.name="{ item }">
                      <div class="d-flex align-center">
                        <v-avatar color="primary" size="32" class="me-3">
                          <span class="text-white font-weight-bold text-caption">
                            {{ getInitials(item.firstName, item.lastName) }}
                          </span>
                        </v-avatar>
                        <div>
                          <div class="font-weight-medium">{{ item.firstName }} {{ item.lastName }}</div>
                        </div>
                      </div>
                    </template>

                    <!-- Personnel Number Column -->
                    <template v-slot:item.personnelNumber="{ item }">
                      <v-chip size="small" variant="tonal" color="blue-grey">
                        {{ item.personnelNumber }}
                      </v-chip>
                    </template>

                    <!-- Year Dates Range Column -->
                    <template v-slot:item.yearDates="{ item }">
                      <div class="text-center">
                        <div class="font-weight-medium">Jan 1 - Dec 31, {{ selectedYear }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ getTotalWorkDays() }} work days
                        </div>
                      </div>
                    </template>

                    <!-- Absences Summary Column -->
                    <template v-slot:item.absencesSummary="{ item }">
                      <div class="text-center">
                        <v-chip 
                          :color="getAbsenceChipColor(getYearAbsences(item).length)"
                          variant="tonal"
                          size="small"
                          class="mb-1"
                        >
                          {{ getYearAbsences(item).length }} absences
                        </v-chip>
                        <div class="text-caption text-medium-emphasis">
                          {{ getAbsenceDays(item) }} days total
                        </div>
                      </div>
                    </template>

                    <!-- Actions Column -->
                    <template v-slot:item.actions="{ item }">
                      <div class="text-center">
                        <v-btn
                          icon="mdi-calendar-account"
                          variant="text"
                          color="primary"
                          size="small"
                          @click="viewEmployeeCalendar(item)"
                        >
                          <v-icon>mdi-calendar-account</v-icon>
                          <v-tooltip activator="parent" location="top">
                            View Calendar
                          </v-tooltip>
                        </v-btn>
                        <v-btn
                          icon="mdi-calendar-plus"
                          variant="text" 
                          color="success"
                          size="small"
                          @click="addAbsenceForEmployee(item)"
                        >
                          <v-icon>mdi-calendar-plus</v-icon>
                          <v-tooltip activator="parent" location="top">
                            Add Absence
                          </v-tooltip>
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>

      <!-- Absence Dialog -->
      <AbsenceDialog
        v-model="absenceDialogData"
        @absence-created="handleAbsenceCreated"
        @absence-updated="handleAbsenceUpdated"
        @absence-deleted="handleAbsenceDeleted"
      />

      <!-- Statistics Dialog -->
      <v-dialog v-model="showStatsDialog" max-width="600px">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
            Absence Statistics - {{ selectedYear }}
          </v-card-title>
          
          <v-card-text>
            <div class="stats-container">
              <v-row>
                <v-col cols="6">
                  <v-card variant="tonal" color="info">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold">{{ totalAbsences }}</div>
                      <div class="text-subtitle-1">Total Absences</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card variant="tonal" color="success">
                    <v-card-text class="text-center">
                      <div class="text-h4 font-weight-bold">{{ averageAbsencesPerEmployee }}</div>
                      <div class="text-subtitle-1">Avg per Employee</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              
              <v-divider class="my-4" />
              
              <div class="text-h6 mb-3">Absence Types</div>
              <div v-for="(count, type) in absencesByType" :key="type" class="mb-2">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-capitalize">{{ type }}</span>
                  <v-chip size="small" color="primary" variant="tonal">{{ count }}</v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" variant="outlined" @click="showStatsDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Enhanced Loading Screen -->
      <v-overlay v-if="isInitializing" class="loading-overlay">
        <div class="loading-container">
          <!-- Logo/Icon -->
          <div class="loading-logo mb-6">
            <v-avatar size="80" color="primary" class="elevation-4">
              <v-icon size="40" color="white">mdi-office-building</v-icon>
            </v-avatar>
          </div>
          
          <!-- Main loading spinner -->
          <v-progress-circular
            :size="80"
            :width="8"
            color="primary"
            indeterminate
            class="mb-6"
          />
          
          <!-- Loading text -->
          <div class="loading-text mb-4">
            <h2 class="text-h4 font-weight-light mb-2">HRStream</h2>
            <p class="text-h6 text-medium-emphasis">{{ loadingMessage }}</p>
          </div>
          
          <!-- Loading progress indicator -->
          <div class="loading-steps">
            <v-progress-linear
              :model-value="loadingProgress"
              color="primary"
              height="4"
              rounded
              class="mb-3"
              :indeterminate="loadingProgress === 0"
            />
            <p class="text-caption text-medium-emphasis">
              {{ loadingStep }}
            </p>
          </div>
          
          <!-- Loading animation dots -->
          <div class="loading-dots mt-6">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </v-overlay>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { useEmployeeStore } from '~/stores/employees'
import type { Employee, Absence, AbsenceDialogData } from '~/types'
import { getCurrentYear } from '~/utils/dateUtils'
import type CalendarTable from './components/CalendarTable.vue'
import type { ViewType } from './components/CalendarTable.vue'
import AbsenceDialog from './components/AbsenceDialog.vue'

/**
 * Main application component for HRStream
 * Features responsive design, virtual scrolling calendar, and absence management
 */

// Composables
const { mobile } = useDisplay()

// Store
const employeeStore = useEmployeeStore()

// Refs
const calendarRef = ref<InstanceType<typeof CalendarTable>>()

// Sidebar state
const drawer = ref(!mobile.value)
const rail = ref(false)
const activeSection = ref('calendar')

// Initialize sidebar state from localStorage
const initializeSidebarState = () => {
  if (typeof window === 'undefined') return
  const savedRailState = localStorage.getItem('hr-sidebar-rail')
  if (savedRailState !== null) {
    rail.value = JSON.parse(savedRailState)
  }
}

// Save sidebar state to localStorage
const saveSidebarState = (railState: boolean) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('hr-sidebar-rail', JSON.stringify(railState))
}

// Initialize view type from localStorage
const initializeViewType = (): ViewType => {
  if (typeof window === 'undefined') return 'monthView'
  const savedViewType = localStorage.getItem('hr-view-type')
  if (savedViewType && (savedViewType === 'monthView' || savedViewType === 'yearView')) {
    return savedViewType as ViewType
  }
  return 'monthView' // Default to monthView
}

// Save view type to localStorage
const saveViewType = (viewTypeValue: ViewType) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('hr-view-type', viewTypeValue)
}

// Reactive state
const selectedYear = ref(getCurrentYear())
const isInitializing = ref(true)
const error = ref<string | null>(null)
const successMessage = ref('')
const showSuccessMessage = ref(false)
const warningMessage = ref('')
const showWarningMessage = ref(false)
const showStatsDialog = ref(false)
const viewType = ref<ViewType>(initializeViewType())

// Enhanced loading state
const loadingMessage = ref('Initializing application...')
const loadingProgress = ref(0)
const loadingStep = ref('Setting up environment')

// Employee section state
const employeeSearch = ref('')

// Dialog state
const absenceDialogData = ref<AbsenceDialogData>({
  isOpen: false,
  employee: null,
  selectedDate: null,
  editingAbsence: null
})

// Computed properties
const currentYear = computed(() => getCurrentYear())
const isLoading = computed(() => employeeStore.isLoading)
const totalEmployees = computed(() => employeeStore.getTotalEmployees)

const availableYears = computed(() => {
  const current = getCurrentYear()
  return [current - 1, current, current + 1]
})

const calendarHeight = computed(() => {
  // Calculate dynamic height based on screen size
  const screenHeight = window?.innerHeight || 800
  return screenHeight - 120 // Account for app bar and padding
})

// Statistics computed properties
const totalAbsences = computed(() => {
  return employeeStore.getAllEmployees.reduce((total, employee) => {
    return total + employee.absences.filter(absence => {
      const year = new Date(absence.startDate).getFullYear()
      return year === selectedYear.value
    }).length
  }, 0)
})

const averageAbsencesPerEmployee = computed(() => {
  const employees = employeeStore.getAllEmployees
  if (employees.length === 0) return 0
  
  return Math.round((totalAbsences.value / employees.length) * 10) / 10
})

const absencesByType = computed(() => {
  const types: Record<string, number> = {}
  
  employeeStore.getAllEmployees.forEach(employee => {
    employee.absences.forEach(absence => {
      const year = new Date(absence.startDate).getFullYear()
      if (year === selectedYear.value) {
        types[absence.type] = (types[absence.type] || 0) + 1
      }
    })
  })
  
  return types
})

// Employee table computed properties
const employeeHeaders = computed(() => [
  {
    title: 'Employee Name',
    align: 'start' as const,
    sortable: true,
    key: 'name',
    width: '25%'
  },
  {
    title: 'Personnel Number',
    align: 'center' as const,
    sortable: true,
    key: 'personnelNumber',
    width: '15%'
  },
  {
    title: 'Year Date Range',
    align: 'center' as const,
    sortable: false,
    key: 'yearDates',
    width: '20%'
  },
  {
    title: 'Absences Summary',
    align: 'center' as const,
    sortable: true,
    key: 'absencesSummary',
    width: '20%'
  },
  {
    title: 'Actions',
    align: 'center' as const,
    sortable: false,
    key: 'actions',
    width: '20%'
  }
])

const filteredEmployees = computed(() => {
  let employees = employeeStore.getAllEmployees
  
  if (employeeSearch.value) {
    const search = employeeSearch.value.toLowerCase()
    employees = employees.filter(employee => 
      employee.firstName.toLowerCase().includes(search) ||
      employee.lastName.toLowerCase().includes(search) ||
      employee.personnelNumber.toLowerCase().includes(search)
    )
  }
  
  return employees
})

// Methods
/**
 * Initialize the application with enhanced loading feedback
 */
const initializeApp = async () => {
  isInitializing.value = true
  error.value = null
  loadingProgress.value = 0
  
  try {
    // Step 1: Initialize environment
    loadingMessage.value = 'Initializing application...'
    loadingStep.value = 'Setting up environment'
    loadingProgress.value = 20
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Step 2: Load configuration
    loadingMessage.value = 'Loading configuration...'
    loadingStep.value = 'Preparing system settings'
    loadingProgress.value = 40
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Step 3: Initialize data store
    loadingMessage.value = 'Loading employee data...'
    loadingStep.value = 'Fetching employee information'
    loadingProgress.value = 60
    await employeeStore.initializeData()
    
    // Step 4: Setup UI components
    loadingMessage.value = 'Preparing interface...'
    loadingStep.value = 'Setting up calendar and components'
    loadingProgress.value = 80
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Step 5: Finalizing
    loadingMessage.value = 'Almost ready...'
    loadingStep.value = 'Finalizing setup'
    loadingProgress.value = 100
    await new Promise(resolve => setTimeout(resolve, 200))
    
  } catch (err) {
    error.value = 'Failed to load employee data. Please refresh the page.'
    console.error('Initialization error:', err)
    loadingMessage.value = 'Loading failed'
    loadingStep.value = 'Please refresh the page'
  } finally {
    isInitializing.value = false
  }
}

/**
 * Refresh data
 */
const refreshData = async () => {
  try {
    await employeeStore.initializeData()
    // showSuccess('Data refreshed successfully')
  } catch (err) {
    error.value = 'Failed to refresh data. Please try again.'
  }
}

/**
 * Scroll calendar to today
 */
const scrollToToday = () => {
  calendarRef.value?.scrollToToday()
}

/**
 * Handle calendar cell clicks
 */
const handleCellClick = (employee: Employee, date: Date, absence?: Absence | null) => {
  // Don't allow editing weekend cells
  const isWeekendDay = date.getDay() === 0 || date.getDay() === 6
  if (isWeekendDay) {
    // Show user feedback that weekend cells cannot be edited
    showWarning('Cannot create or edit absences on weekends')
    return
  }
  
  // Open the absence dialog with the selected employee and date
  absenceDialogData.value = {
    isOpen: true,
    employee,
    selectedDate: date,
    editingAbsence: absence || null
  }
}

/**
 * Handle absence creation
 */
const handleAbsenceCreated = (absence: Absence) => {
  showSuccess('Absence created successfully')
}

/**
 * Handle absence updates
 */
const handleAbsenceUpdated = (absence: Absence) => {
  showSuccess('Absence updated successfully')
}

/**
 * Handle absence deletion
 */
const handleAbsenceDeleted = (absenceId: string) => {
  showSuccess('Absence deleted successfully')
}

/**
 * Show success message
 */
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
}

/**
 * Show warning message
 */
const showWarning = (message: string) => {
  warningMessage.value = message
  showWarningMessage.value = true
}

/**
 * Handle quick add absence
 */
const handleQuickAddAbsence = () => {
  // Open dialog without employee pre-selected so user can search
  absenceDialogData.value = {
    isOpen: true,
    employee: null,
    selectedDate: new Date(),
    editingAbsence: null
  }
}

/**
 * Handle quick add employee
 */
const handleQuickAddEmployee = () => {
  // In a real app, this would open an employee creation dialog
  showSuccess('Employee creation not implemented in this demo')
}

/**
 * Handle view stats
 */
const handleViewStats = () => {
  showStatsDialog.value = true
}

/**
 * Get employee initials for avatar
 */
const getInitials = (firstName: string, lastName: string): string => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

/**
 * Get total work days in the year (excluding weekends)
 */
const getTotalWorkDays = (): number => {
  const year = selectedYear.value
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  let workDays = 0
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workDays++
    }
  }
  
  return workDays
}

/**
 * Get absences for an employee in the selected year
 */
const getYearAbsences = (employee: Employee) => {
  return employee.absences.filter(absence => {
    const year = new Date(absence.startDate).getFullYear()
    return year === selectedYear.value
  })
}

/**
 * Get total absence days for an employee in the selected year
 */
const getAbsenceDays = (employee: Employee): number => {
  const yearAbsences = getYearAbsences(employee)
  return yearAbsences.reduce((total, absence) => {
    const start = new Date(absence.startDate)
    const end = new Date(absence.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return total + days
  }, 0)
}

/**
 * Get color for absence chip based on count
 */
const getAbsenceChipColor = (count: number): string => {
  if (count === 0) return 'success'
  if (count <= 3) return 'info'
  if (count <= 6) return 'warning'
  return 'error'
}

/**
 * View employee calendar
 */
const viewEmployeeCalendar = (employee: Employee) => {
  activeSection.value = 'calendar'
  nextTick(() => {
    // Optionally scroll to this employee in the calendar
    scrollToToday()
  })
}

/**
 * Add absence for specific employee
 */
const addAbsenceForEmployee = (employee: Employee) => {
  absenceDialogData.value = {
    isOpen: true,
    employee: employee,
    selectedDate: new Date(),
    editingAbsence: null
  }
}

// Watchers
watch(selectedYear, () => {
  // Year changed, could refresh data if needed
  nextTick(() => {
    scrollToToday()
  })
})

// Mobile responsiveness
watch(mobile, (newVal) => {
  if (newVal) {
    drawer.value = false
    rail.value = false
  } else {
    drawer.value = true
  }
}, { immediate: true })

// Watch rail state and persist to localStorage
watch(rail, (newVal) => {
  saveSidebarState(newVal)
})

// Watch view type and persist to localStorage
watch(viewType, (newVal) => {
  saveViewType(newVal)
})

// Lifecycle
onMounted(async () => {
  // Initialize sidebar state from localStorage
  initializeSidebarState()
  
  await initializeApp()
  await nextTick()
  
  // Scroll to today after initial load
  setTimeout(() => {
    scrollToToday()
  }, 500)
})

// Set page title
useHead({
  title: 'HRStream - Real-time Employee Absence Calendar',
  meta: [
    {
      name: 'description',
      content: 'Modern real-time HR platform for seamless employee absence tracking with fluid workflows and virtual scrolling calendar view'
    }
  ]
})
</script>

<style scoped>
.main-content {
  height: 100vh;
  overflow: hidden;
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calendar-wrapper {
  flex: 1;
  min-height: 0;
  margin: 16px;
  overflow: hidden;
}

.employees-section {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.section-header {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 2;
}

.employee-table {
  background-color: white;
}

.employee-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
}

.employee-table :deep(.v-data-table-header) {
  background-color: #f8f9fa;
}

.employee-table :deep(.v-data-table-rows-no-data) {
  text-align: center;
  padding: 40px;
}

.sidebar-header {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.year-selector :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.1);
}

.year-selector :deep(.v-field__input) {
  color: white;
}

.stats-container {
  min-height: 200px;
}

/* App bar customizations */
.v-app-bar {
  backdrop-filter: blur(10px);
}

/* Navigation drawer customizations */
.v-navigation-drawer {
  border-right: 1px solid rgba(var(--v-border-color), 0.12);
}

/* Responsive design */
@media (max-width: 960px) {
  .calendar-wrapper {
    margin: 8px;
  }
  
  .employees-section .section-header {
    padding: 16px !important;
  }
  
  .employee-table :deep(.v-data-table) {
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .calendar-wrapper {
    margin: 4px;
  }
  
  .sidebar-header {
    padding: 12px !important;
  }
}

/* Ensure the app takes full viewport */
:deep(.v-application) {
  height: 100vh;
  overflow: hidden;
}

:deep(.v-main) {
  height: 100vh;
}

/* Loading state */
.v-overlay {
  backdrop-filter: blur(2px);
}

/* Smooth transitions */
.v-main {
  transition: all 0.3s ease;
}

.v-navigation-drawer {
  transition: all 0.3s ease;
}

/* Custom scrollbar for better UX */
:deep(.calendar-body) {
  scrollbar-width: thin;
  scrollbar-color: #90caf9 #f5f5f5;
}

:deep(.calendar-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.calendar-body::-webkit-scrollbar-track) {
  background: #f5f5f5;
  border-radius: 4px;
}

:deep(.calendar-body::-webkit-scrollbar-thumb) {
  background: #90caf9;
  border-radius: 4px;
}

:deep(.calendar-body::-webkit-scrollbar-thumb:hover) {
  background: #64b5f6;
}

/* Sidebar hover effects */
.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

/* Rail mode adjustments */
.v-navigation-drawer--rail .v-list-item {
  padding-inline: 8px;
}

/* Enhanced Loading Screen Styles */
.loading-overlay {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.loading-logo {
  animation: pulse 2s ease-in-out infinite;
}

.loading-text h2 {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.loading-text p {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

.loading-steps {
  width: 100%;
  max-width: 300px;
}

.loading-steps p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

/* Animated loading dots */
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  animation: loadingDots 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Progress bar styling */
:deep(.loading-steps .v-progress-linear) {
  background: rgba(255, 255, 255, 0.2) !important;
}

:deep(.loading-steps .v-progress-linear__determinate) {
  background: linear-gradient(90deg, #4fc3f7, #29b6f6) !important;
}
</style>
