import { describe, it, expect } from 'vitest'
import { generateEmployeeData, generateAbsence } from '~/utils/dataGenerator'
import type { AbsenceType } from '~/types'

describe('dataGenerator', () => {
  describe('generateEmployeeData', () => {
    it('should generate the correct number of employees', () => {
      const employees = generateEmployeeData(10)
      expect(employees).toHaveLength(10)
    })

    it('should generate employees with required fields', () => {
      const employees = generateEmployeeData(5)
      
      employees.forEach(employee => {
        expect(employee.id).toBeDefined()
        expect(typeof employee.id).toBe('string')
        expect(employee.firstName).toBeDefined()
        expect(typeof employee.firstName).toBe('string')
        expect(employee.lastName).toBeDefined()
        expect(typeof employee.lastName).toBe('string')
        expect(employee.personnelNumber).toBeDefined()
        expect(typeof employee.personnelNumber).toBe('string')
        expect(employee.personnelNumber).toMatch(/^EMP\d{4}$/)
        expect(employee.phoneNumber).toBeDefined()
        expect(typeof employee.phoneNumber).toBe('string')
        expect(employee.phoneNumber).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/)
        expect(Array.isArray(employee.absences)).toBe(true)
      })
    })

    it('should generate unique personnel numbers', () => {
      const employees = generateEmployeeData(20)
      const personnelNumbers = employees.map(emp => emp.personnelNumber)
      const uniqueNumbers = new Set(personnelNumbers)
      
      expect(uniqueNumbers.size).toBe(personnelNumbers.length)
    })

    it('should generate unique phone numbers', () => {
      const employees = generateEmployeeData(20)
      const phoneNumbers = employees.map(emp => emp.phoneNumber)
      const uniquePhones = new Set(phoneNumbers)
      
      expect(uniquePhones.size).toBe(phoneNumbers.length)
    })

    it('should generate default number of employees when no count provided', () => {
      const employees = generateEmployeeData()
      expect(employees.length).toBeGreaterThan(0)
      expect(employees.length).toBeLessThanOrEqual(50) // Based on available names
    })

    it('should generate employees with absences', () => {
      const employees = generateEmployeeData(5)
      
      employees.forEach(employee => {
        employee.absences.forEach(absence => {
          expect(absence.id).toBeDefined()
          expect(absence.employeeId).toBe(employee.id)
          expect(absence.startDate).toBeDefined()
          expect(absence.endDate).toBeDefined()
          expect(absence.type).toBeDefined()
          expect(absence.createdAt).toBeDefined()
          expect(absence.updatedAt).toBeDefined()
          
          // Validate date formats
          expect(new Date(absence.startDate).toString()).not.toBe('Invalid Date')
          expect(new Date(absence.endDate).toString()).not.toBe('Invalid Date')
          expect(new Date(absence.createdAt).toString()).not.toBe('Invalid Date')
          expect(new Date(absence.updatedAt).toString()).not.toBe('Invalid Date')
        })
      })
    })

    it('should generate absences within current year', () => {
      const employees = generateEmployeeData(3)
      const currentYear = new Date().getFullYear()
      
      employees.forEach(employee => {
        employee.absences.forEach(absence => {
          const startYear = new Date(absence.startDate).getFullYear()
          const endYear = new Date(absence.endDate).getFullYear()
          
          expect(startYear).toBe(currentYear)
          expect(endYear).toBe(currentYear)
        })
      })
    })
  })

  describe('generateAbsence', () => {
    const employeeId = 'test-employee-123'

    it('should generate absence with required fields', () => {
      const absence = generateAbsence(employeeId)
      
      expect(absence.id).toBeDefined()
      expect(typeof absence.id).toBe('string')
      expect(absence.employeeId).toBe(employeeId)
      expect(absence.startDate).toBeDefined()
      expect(absence.endDate).toBeDefined()
      expect(absence.type).toBeDefined()
      expect(absence.createdAt).toBeDefined()
      expect(absence.updatedAt).toBeDefined()
    })

    it('should use provided dates', () => {
      const startDate = new Date(2024, 5, 15) // June 15, 2024
      const endDate = new Date(2024, 5, 17)   // June 17, 2024
      
      const absence = generateAbsence(employeeId, startDate, endDate)
      
      expect(absence.startDate).toBe('2024-06-15')
      expect(absence.endDate).toBe('2024-06-17')
    })

    it('should use provided absence type', () => {
      const type: AbsenceType = 'sick' as AbsenceType
      const absence = generateAbsence(employeeId, undefined, undefined, type)
      
      expect(absence.type).toBe(type)
    })

    it('should generate end date after start date when only start date provided', () => {
      const startDate = new Date(2024, 5, 15)
      const absence = generateAbsence(employeeId, startDate)
      
      const start = new Date(absence.startDate)
      const end = new Date(absence.endDate)
      
      expect(end.getTime()).toBeGreaterThanOrEqual(start.getTime())
    })

    it('should generate valid absence types', () => {
      const validTypes = ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'bereavement', 'other']
      
      for (let i = 0; i < 20; i++) {
        const absence = generateAbsence(employeeId)
        expect(validTypes).toContain(absence.type)
      }
    })

    it('should generate reasonable absence durations', () => {
      for (let i = 0; i < 10; i++) {
        const absence = generateAbsence(employeeId)
        const startDate = new Date(absence.startDate)
        const endDate = new Date(absence.endDate)
        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        expect(duration).toBeGreaterThanOrEqual(1)
        expect(duration).toBeLessThanOrEqual(10) // Should be reasonable duration
      }
    })
  })
})
