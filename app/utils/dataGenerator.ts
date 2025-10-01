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
 * Generate a realistic US phone number
 * @returns Formatted phone number string
 */
function generatePhoneNumber(): string {
  // Generate area code (avoid reserved codes like 000, 555, etc.)
  const areaCodes = ['201', '202', '203', '205', '206', '207', '208', '209', '210', '212', '213', '214', '215', '216', '217', '218', '219', '224', '225', '228', '229', '231', '234', '239', '240', '248', '251', '252', '253', '254', '256', '260', '262', '267', '269', '270', '276', '281', '283', '301', '302', '303', '304', '305', '307', '308', '309', '310', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '323', '325', '330', '331', '334', '336', '337', '339', '347', '351', '352', '360', '361', '386', '401', '402', '404', '405', '406', '407', '408', '409', '410', '412', '413', '414', '415', '417', '419', '423', '424', '425', '430', '432', '434', '435', '440', '443', '458', '469', '470', '475', '478', '479', '480', '484', '501', '502', '503', '504', '505', '507', '508', '509', '510', '512', '513', '515', '516', '517', '518', '520', '530', '540', '541', '551', '559', '561', '562', '563', '564', '567', '570', '571', '573', '574', '575', '580', '585', '586', '601', '602', '603', '605', '606', '607', '608', '609', '610', '612', '614', '615', '616', '617', '618', '619', '620', '623', '626', '628', '629', '630', '631', '636', '641', '646', '650', '651', '657', '660', '661', '662', '667', '678', '680', '681', '682', '701', '702', '703', '704', '706', '707', '708', '712', '713', '714', '715', '716', '717', '718', '719', '720', '724', '725', '727', '730', '731', '732', '734', '737', '740', '743', '747', '754', '757', '760', '762', '763', '765', '769', '770', '772', '773', '774', '775', '779', '781', '785', '786', '801', '802', '803', '804', '805', '806', '808', '810', '812', '813', '814', '815', '816', '817', '818', '828', '830', '831', '832', '843', '845', '847', '848', '850', '856', '857', '858', '859', '860', '862', '863', '864', '865', '870', '872', '878', '901', '903', '904', '906', '907', '908', '909', '910', '912', '913', '914', '915', '916', '917', '918', '919', '920', '925', '928', '929', '931', '934', '936', '937', '940', '941', '947', '949', '951', '952', '954', '956', '959', '970', '971', '972', '973', '975', '978', '979', '980', '984', '985', '989']
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
  
  // Generate exchange code (first digit 2-9, second digit 0-9, third digit 0-9)
  const exchangeFirst = Math.floor(Math.random() * 8) + 2 // 2-9
  const exchangeSecond = Math.floor(Math.random() * 10) // 0-9
  const exchangeThird = Math.floor(Math.random() * 10) // 0-9
  const exchange = `${exchangeFirst}${exchangeSecond}${exchangeThird}`
  
  // Generate subscriber number (0000-9999, but avoid 0000)
  let subscriber: string
  do {
    subscriber = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  } while (subscriber === '0000')
  
  return `(${areaCode}) ${exchange}-${subscriber}`
}

/**
 * Generate employee data for testing
 * @param count - Number of employees to generate
 * @returns Array of employee records
 */
export function generateEmployeeData(count: number = 20): Employee[] {
  const employees: Employee[] = []
  const usedPersonnelNumbers = new Set<string>()
  const usedPhoneNumbers = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    // Generate unique personnel number
    let personnelNumber: string
    do {
      personnelNumber = `EMP${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`
    } while (usedPersonnelNumbers.has(personnelNumber))
    usedPersonnelNumbers.add(personnelNumber)
    
    // Generate unique phone number
    let phoneNumber: string
    do {
      phoneNumber = generatePhoneNumber()
    } while (usedPhoneNumbers.has(phoneNumber))
    usedPhoneNumbers.add(phoneNumber)
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    
    const employee: Employee = {
      id: `employee_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: firstName!,
      lastName: lastName!,
      personnelNumber,
      phoneNumber,
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
