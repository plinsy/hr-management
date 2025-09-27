import { defineStore } from 'pinia'
import type { Employee, Absence, AbsenceType, AbsenceFormData } from '~/types'
import { generateEmployeeData } from '~/utils/dataGenerator'

/**
 * Employee store state interface
 */
interface EmployeeState {
  /** List of all employees */
  employees: Employee[]
  /** Loading state */
  isLoading: boolean
  /** Error message if any */
  error: string | null
}

/**
 * Employee store for managing employee data and absences
 * Structured to be GraphQL-ready for future backend integration
 */
export const useEmployeeStore = defineStore('employees', {
  state: (): EmployeeState => ({
    employees: [],
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * Get all employees with their absences
     */
    getAllEmployees: (state) => state.employees,

    /**
     * Get employee by ID
     */
    getEmployeeById:
      (state) =>
      (id: string): Employee | undefined => {
        return state.employees.find((employee) => employee.id === id)
      },

    /**
     * Get all absences for a specific employee
     */
    getEmployeeAbsences:
      (state) =>
      (employeeId: string): Absence[] => {
        const employee = state.employees.find((e) => e.id === employeeId)
        return employee?.absences || []
      },

    /**
     * Get absences for a specific date range
     */
    getAbsencesByDateRange:
      (state) =>
      (startDate: Date, endDate: Date): Absence[] => {
        const absences: Absence[] = []

        state.employees.forEach((employee) => {
          employee.absences.forEach((absence) => {
            const absenceStart = new Date(absence.startDate)
            const absenceEnd = new Date(absence.endDate)

            // Check if absence overlaps with the requested date range
            if (absenceStart <= endDate && absenceEnd >= startDate) {
              absences.push(absence)
            }
          })
        })

        return absences
      },

    /**
     * Check if employee is absent on a specific date
     */
    isEmployeeAbsentOnDate:
      (state) =>
      (employeeId: string, date: Date): Absence | null => {
        const employee = state.employees.find((e) => e.id === employeeId)
        if (!employee) return null

        const dateString = date.toISOString().split('T')[0]

        return (
          employee.absences.find((absence) => {
            const startDate = absence.startDate.split('T')[0]
            const endDate = absence.endDate.split('T')[0]
            return (
              dateString &&
              startDate &&
              endDate &&
              dateString >= startDate &&
              dateString <= endDate
            )
          }) || null
        )
      },

    /**
     * Get total number of employees
     */
    getTotalEmployees: (state) => state.employees.length,

    /**
     * Get employee full name
     */
    getEmployeeFullName:
      (state) =>
      (employeeId: string): string => {
        const employee = state.employees.find((e) => e.id === employeeId)
        return employee ? `${employee.firstName} ${employee.lastName}` : ''
      }
  },

  actions: {
    /**
     * Initialize employee data
     * In a real application, this would fetch from GraphQL endpoint
     */
    async initializeData() {
      this.isLoading = true
      this.error = null

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate sample data
        this.employees = generateEmployeeData(50) // Generate 50 employees for testing
      } catch (error) {
        this.error = 'Failed to load employee data'
        console.error('Error initializing employee data:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create a new absence
     * Structured for GraphQL mutation
     */
    async createAbsence(
      employeeId: string,
      absenceData: AbsenceFormData
    ): Promise<Absence> {
      const employee = this.employees.find((e) => e.id === employeeId)
      if (!employee) {
        throw new Error('Employee not found')
      }

      const newAbsence: Absence = {
        id: `absence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId,
        startDate: absenceData.startDate,
        endDate: absenceData.endDate,
        type: absenceData.type,
        reason: absenceData.reason || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add absence to employee
      employee.absences.push(newAbsence)

      // Sort absences by start date
      employee.absences.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

      return newAbsence
    },

    /**
     * Update an existing absence
     * Structured for GraphQL mutation
     */
    async updateAbsence(
      absenceId: string,
      absenceData: AbsenceFormData
    ): Promise<Absence> {
      let targetAbsence: Absence | null = null
      let targetEmployee: Employee | null = null

      // Find the absence and its employee
      for (const employee of this.employees) {
        const absence = employee.absences.find((a) => a.id === absenceId)
        if (absence) {
          targetAbsence = absence
          targetEmployee = employee
          break
        }
      }

      if (!targetAbsence || !targetEmployee) {
        throw new Error('Absence not found')
      }

      // Update absence data
      targetAbsence.startDate = absenceData.startDate
      targetAbsence.endDate = absenceData.endDate
      targetAbsence.type = absenceData.type
      targetAbsence.reason = absenceData.reason || undefined
      targetAbsence.updatedAt = new Date().toISOString()

      // Re-sort absences
      targetEmployee.absences.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

      return targetAbsence
    },

    /**
     * Delete an absence
     * Structured for GraphQL mutation
     */
    async deleteAbsence(absenceId: string): Promise<boolean> {
      for (const employee of this.employees) {
        const absenceIndex = employee.absences.findIndex(
          (a) => a.id === absenceId
        )
        if (absenceIndex !== -1) {
          employee.absences.splice(absenceIndex, 1)
          return true
        }
      }
      return false
    },

    /**
     * Add a new employee
     * Structured for GraphQL mutation
     */
    async addEmployee(
      employeeData: Omit<Employee, 'id' | 'absences'>
    ): Promise<Employee> {
      const newEmployee: Employee = {
        ...employeeData,
        id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        absences: []
      }

      this.employees.push(newEmployee)
      return newEmployee
    },

    /**
     * Remove an employee
     * Structured for GraphQL mutation
     */
    async removeEmployee(employeeId: string): Promise<boolean> {
      const index = this.employees.findIndex((e) => e.id === employeeId)
      if (index !== -1) {
        this.employees.splice(index, 1)
        return true
      }
      return false
    },

    /**
     * Clear all data
     */
    clearData() {
      this.employees = []
      this.error = null
    }
  }
})
