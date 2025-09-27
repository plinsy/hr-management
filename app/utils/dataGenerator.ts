import type { Employee, Absence, AbsenceType } from '~/types'

/**
 * Generate sample employee data for testing and demonstration
 */

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily',
  'James', 'Jessica', 'William', 'Ashley', 'Richard', 'Amanda', 'Joseph',
  'Stephanie', 'Thomas', 'Melissa', 'Christopher', 'Nicole', 'Daniel',
  'Elizabeth', 'Paul', 'Helen', 'Mark', 'Laura', 'Donald', 'Rebecca',
  'Steven', 'Sharon', 'Kenneth', 'Cynthia', 'Joshua', 'Kathleen', 'Kevin',
  'Amy', 'Brian', 'Angela', 'George', 'Brenda', 'Edward', 'Emma', 'Ronald',
  'Olivia', 'Timothy', 'Sophia', 'Jason', 'Kimberly', 'Jeffrey', 'Donna'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts'
]

const absenceTypes: AbsenceType[] = [
  'sick' as AbsenceType,
  'vacation' as AbsenceType,
  'personal' as AbsenceType,
  'maternity' as AbsenceType,
  'paternity' as AbsenceType,
  'bereavement' as AbsenceType,
  'other' as AbsenceType
]

const absenceReasons = [
  'Annual leave',
  'Medical appointment',
  'Family emergency',
  'Sick leave',
  'Personal business',
  'Maternity leave',
  'Paternity leave',
  'Bereavement leave',
  'Training course',
  'Conference attendance'
]

/**
 * Format date as YYYY-MM-DD in local timezone
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Generate a random date within the current year
 * @param startMonth - Optional start month (0-11)
 * @param endMonth - Optional end month (0-11)
 * @returns Random date
 */
function getRandomDate(startMonth: number = 0, endMonth: number = 11): Date {
  const currentYear = new Date().getFullYear()
  const start = new Date(currentYear, startMonth, 1)
  const end = new Date(currentYear, endMonth, 31)
  
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Generate random absences for an employee
 * @param employeeId - Employee ID
 * @param count - Number of absences to generate (default: random 0-8)
 * @returns Array of absence records
 */
function generateAbsences(employeeId: string, count?: number): Absence[] {
  const absenceCount = count ?? Math.floor(Math.random() * 9) // 0-8 absences
  const absences: Absence[] = []
  
  for (let i = 0; i < absenceCount; i++) {
    const startDate = getRandomDate()
    const duration = Math.floor(Math.random() * 5) + 1 // 1-5 days
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration - 1)
    
    const absence: Absence = {
      id: `absence_${employeeId}_${i}_${Date.now()}`,
      employeeId,
      startDate: formatDateLocal(startDate),
      endDate: formatDateLocal(endDate),
      type: absenceTypes[Math.floor(Math.random() * absenceTypes.length)]!,
      reason: Math.random() > 0.3 ? absenceReasons[Math.floor(Math.random() * absenceReasons.length)] : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Created within last 30 days
      updatedAt: new Date().toISOString()
    }
    
    absences.push(absence)
  }
  
  // Sort by start date
  absences.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  
  return absences
}

/**
 * Generate employee data for testing
 * @param count - Number of employees to generate
 * @returns Array of employee records
 */
export function generateEmployeeData(count: number = 20): Employee[] {
  const employees: Employee[] = []
  const usedPersonnelNumbers = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    // Generate unique personnel number
    let personnelNumber: string
    do {
      personnelNumber = `EMP${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`
    } while (usedPersonnelNumbers.has(personnelNumber))
    usedPersonnelNumbers.add(personnelNumber)
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    
    const employee: Employee = {
      id: `employee_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: firstName!,
      lastName: lastName!,
      personnelNumber,
      absences: []
    }
    
    // Generate absences for this employee
    employee.absences = generateAbsences(employee.id)
    
    employees.push(employee)
  }
  
  return employees
}

/**
 * Generate a specific absence for testing
 * @param employeeId - Employee ID
 * @param startDate - Start date (optional, defaults to random)
 * @param endDate - End date (optional, calculated from start date)
 * @param type - Absence type (optional, defaults to random)
 * @returns Absence record
 */
export function generateAbsence(
  employeeId: string,
  startDate?: Date,
  endDate?: Date,
  type?: AbsenceType
): Absence {
  const start = startDate || getRandomDate()
  const end = endDate || new Date(start.getTime() + (Math.random() * 4 + 1) * 24 * 60 * 60 * 1000) // 1-5 days
  
  return {
    id: `absence_${employeeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    startDate: formatDateLocal(start),
    endDate: formatDateLocal(end),
    type: type || absenceTypes[Math.floor(Math.random() * absenceTypes.length)]!,
    reason: Math.random() > 0.3 ? absenceReasons[Math.floor(Math.random() * absenceReasons.length)] : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
