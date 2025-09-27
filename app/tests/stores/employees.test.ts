import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEmployeeStore } from '~/stores/employees'
import { type Employee, type AbsenceFormData, AbsenceType } from '~/types'

// Mock the data generator
vi.mock('~/utils/dataGenerator', () => ({
  generateEmployeeData: vi.fn(() => [
    {
      id: 'emp1',
      firstName: 'John',
      lastName: 'Doe',
      personnelNumber: 'EMP0001',
      absences: [
        {
          id: 'abs1',
          employeeId: 'emp1',
          startDate: '2024-01-15',
          endDate: '2024-01-17',
          type: 'sick',
          reason: 'Flu',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    },
    {
      id: 'emp2',
      firstName: 'Jane',
      lastName: 'Smith',
      personnelNumber: 'EMP0002',
      absences: []
    }
  ])
}))

describe('employeeStore', () => {
  let store: ReturnType<typeof useEmployeeStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useEmployeeStore()
  })

  describe('initial state', () => {
    it('should have empty employees array initially', () => {
      expect(store.employees).toEqual([])
    })

    it('should not be loading initially', () => {
      expect(store.isLoading).toBe(false)
    })

    it('should have no error initially', () => {
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    beforeEach(async () => {
      await store.initializeData()
    })

    it('should get all employees', () => {
      const employees = store.getAllEmployees
      expect(employees).toHaveLength(2)
      expect(employees[0]?.firstName).toBe('John')
    })

    it('should get employee by ID', () => {
      const employee = store.getEmployeeById('emp1')
      expect(employee?.firstName).toBe('John')
      expect(employee?.lastName).toBe('Doe')
    })

    it('should return undefined for non-existent employee ID', () => {
      const employee = store.getEmployeeById('nonexistent')
      expect(employee).toBeUndefined()
    })

    it('should get employee absences', () => {
      const absences = store.getEmployeeAbsences('emp1')
      expect(absences).toHaveLength(1)
      expect(absences[0]?.type).toBe('sick')
    })

    it('should return empty array for employee with no absences', () => {
      const absences = store.getEmployeeAbsences('emp2')
      expect(absences).toEqual([])
    })

    it('should check if employee is absent on date', () => {
      const testDate = new Date('2024-01-16') // Within absence range
      const absence = store.isEmployeeAbsentOnDate('emp1', testDate)
      expect(absence).toBeTruthy()
      expect(absence?.id).toBe('abs1')
    })

    it('should return null if employee is not absent on date', () => {
      const testDate = new Date('2024-01-20') // Outside absence range
      const absence = store.isEmployeeAbsentOnDate('emp1', testDate)
      expect(absence).toBeNull()
    })

    it('should get total number of employees', () => {
      expect(store.getTotalEmployees).toBe(2)
    })

    it('should get employee full name', () => {
      const fullName = store.getEmployeeFullName('emp1')
      expect(fullName).toBe('John Doe')
    })

    it('should return empty string for non-existent employee', () => {
      const fullName = store.getEmployeeFullName('nonexistent')
      expect(fullName).toBe('')
    })
  })

  describe('actions', () => {
    beforeEach(async () => {
      await store.initializeData()
    })

    describe('createAbsence', () => {
      it('should create a new absence', async () => {
        const absenceData: AbsenceFormData = {
          startDate: '2024-02-01',
          endDate: '2024-02-03',
          type: AbsenceType.VACATION,
          reason: 'Holiday trip'
        }

        const newAbsence = await store.createAbsence('emp2', absenceData)

        expect(newAbsence.employeeId).toBe('emp2')
        expect(newAbsence.startDate).toBe('2024-02-01')
        expect(newAbsence.endDate).toBe('2024-02-03')
        expect(newAbsence.type).toBe('vacation')
        expect(newAbsence.reason).toBe('Holiday trip')

        // Check that absence was added to employee
        const employee = store.getEmployeeById('emp2')
        expect(employee?.absences).toHaveLength(1)
      })

      it('should throw error for non-existent employee', async () => {
        const absenceData: AbsenceFormData = {
          startDate: '2024-02-01',
          endDate: '2024-02-03',
          type: AbsenceType.VACATION,
          reason: ''
        }

        await expect(
          store.createAbsence('nonexistent', absenceData)
        ).rejects.toThrow('Employee not found')
      })
    })

    describe('updateAbsence', () => {
      it('should update an existing absence', async () => {
        const absenceData: AbsenceFormData = {
          startDate: '2024-01-16',
          endDate: '2024-01-18',
          type: AbsenceType.PERSONAL,
          reason: 'Updated reason'
        }

        const updatedAbsence = await store.updateAbsence('abs1', absenceData)

        expect(updatedAbsence.startDate).toBe('2024-01-16')
        expect(updatedAbsence.endDate).toBe('2024-01-18')
        expect(updatedAbsence.type).toBe('personal')
        expect(updatedAbsence.reason).toBe('Updated reason')
      })

      it('should throw error for non-existent absence', async () => {
        const absenceData: AbsenceFormData = {
          startDate: '2024-02-01',
          endDate: '2024-02-03',
          type: AbsenceType.VACATION,
          reason: ''
        }

        await expect(
          store.updateAbsence('nonexistent', absenceData)
        ).rejects.toThrow('Absence not found')
      })
    })

    describe('deleteAbsence', () => {
      it('should delete an existing absence', async () => {
        const result = await store.deleteAbsence('abs1')
        expect(result).toBe(true)

        // Check that absence was removed from employee
        const employee = store.getEmployeeById('emp1')
        expect(employee?.absences).toHaveLength(0)
      })

      it('should return false for non-existent absence', async () => {
        const result = await store.deleteAbsence('nonexistent')
        expect(result).toBe(false)
      })
    })

    describe('addEmployee', () => {
      it('should add a new employee', async () => {
        const employeeData = {
          firstName: 'Bob',
          lastName: 'Johnson',
          personnelNumber: 'EMP0003'
        }

        const newEmployee = await store.addEmployee(employeeData)

        expect(newEmployee.firstName).toBe('Bob')
        expect(newEmployee.lastName).toBe('Johnson')
        expect(newEmployee.personnelNumber).toBe('EMP0003')
        expect(newEmployee.absences).toEqual([])
        expect(newEmployee.id).toBeDefined()

        // Check that employee was added to store
        expect(store.getAllEmployees).toHaveLength(3)
      })
    })

    describe('removeEmployee', () => {
      it('should remove an existing employee', async () => {
        const result = await store.removeEmployee('emp2')
        expect(result).toBe(true)

        // Check that employee was removed from store
        expect(store.getAllEmployees).toHaveLength(1)
        expect(store.getEmployeeById('emp2')).toBeUndefined()
      })

      it('should return false for non-existent employee', async () => {
        const result = await store.removeEmployee('nonexistent')
        expect(result).toBe(false)
      })
    })

    describe('clearData', () => {
      it('should clear all data', () => {
        store.clearData()

        expect(store.employees).toEqual([])
        expect(store.error).toBeNull()
      })
    })
  })
})
