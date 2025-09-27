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
              mdi-office-building
            </v-icon>
          </v-avatar>
          <div v-if="!rail || mobile" class="flex-grow-1">
            <div class="text-h6 font-weight-bold">HR System</div>
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
        
        <v-list-item
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
        />
      </v-list>

      <v-divider class="my-2" />

      <!-- Quick Actions -->
      <v-list density="compact">
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
      </v-list>

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
        <v-icon class="me-2" size="large">mdi-calendar-account</v-icon>
        <span class="text-h5 font-weight-bold d-none d-sm-flex">HR Management</span>
        <span class="text-h6 font-weight-bold d-sm-none">HR</span>
        <v-chip 
          class="ml-4" 
          color="secondary" 
          size="small" 
          variant="elevated"
        >
          {{ currentYear }}
        </v-chip>
      </v-app-bar-title>

      <v-spacer />

      <!-- Year selector -->
      <v-select
        v-model="selectedYear"
        :items="availableYears"
        label="Year"
        variant="outlined"
        density="compact"
        hide-details
        class="year-selector me-4 d-none d-md-flex"
        style="max-width: 120px;"
      />

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

        <!-- Today button -->
        <v-btn
          color="secondary"
          variant="elevated"
          @click="scrollToToday"
          :disabled="isLoading"
          :size="mobile ? 'small' : 'default'"
        >
          <v-icon :start="!mobile">mdi-calendar-today</v-icon>
          <span v-if="!mobile">Today</span>
        </v-btn>

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
    <v-main>
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

        <!-- Calendar container -->
        <div class="calendar-wrapper">
          <CalendarTable
            ref="calendarRef"
            :year="selectedYear"
            :container-height="calendarHeight"
            @cell-click="handleCellClick"
          />
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

      <!-- Loading overlay -->
      <v-overlay v-if="isInitializing" class="align-center justify-center">
        <div class="text-center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          />
          <div class="text-h6 mt-4">Loading HR Management System...</div>
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
import AbsenceDialog from './components/AbsenceDialog.vue'

/**
 * Main application component for HR Management System
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

// Reactive state
const selectedYear = ref(getCurrentYear())
const isInitializing = ref(true)
const error = ref<string | null>(null)
const successMessage = ref('')
const showSuccessMessage = ref(false)
const showStatsDialog = ref(false)

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

// Methods
/**
 * Initialize the application
 */
const initializeApp = async () => {
  isInitializing.value = true
  error.value = null
  
  try {
    await employeeStore.initializeData()
  } catch (err) {
    error.value = 'Failed to load employee data. Please refresh the page.'
    console.error('Initialization error:', err)
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
    showSuccess('Data refreshed successfully')
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
const handleCellClick = (employee: Employee, date: Date, absence?: Absence) => {
  // Don't allow editing weekend cells
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  if (isWeekend) return
  
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
 * Handle quick add absence
 */
const handleQuickAddAbsence = () => {
  // Use first employee and today's date as defaults
  const employees = employeeStore.getAllEmployees
  if (employees.length > 0) {
    absenceDialogData.value = {
      isOpen: true,
      employee: employees[0]!,
      selectedDate: new Date(),
      editingAbsence: null
    }
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

// Lifecycle
onMounted(async () => {
  await initializeApp()
  await nextTick()
  
  // Scroll to today after initial load
  setTimeout(() => {
    scrollToToday()
  }, 500)
})

// Set page title
useHead({
  title: 'HR Management System - Employee Absence Calendar',
  meta: [
    {
      name: 'description',
      content: 'Modern HR management system for tracking employee absences with virtual scrolling calendar view'
    }
  ]
})
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.calendar-wrapper {
  flex: 1;
  min-height: 0;
  margin: 16px;
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
}

@media (max-width: 600px) {
  .calendar-wrapper {
    margin: 4px;
  }
  
  .sidebar-header {
    padding: 12px !important;
  }
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
</style>
