/**
 * Employee data structure
 * Designed to be GraphQL-compatible
 */
export interface Employee {
  /** Unique identifier for the employee */
  id: string;
  /** Employee's first name */
  firstName: string;
  /** Employee's last name */
  lastName: string;
  /** Unique personnel number */
  personnelNumber: string;
  /** Employee's phone number */
  phoneNumber: string;
  /** List of absence records for this employee */
  absences: Absence[];
}

/**
 * Absence record structure
 * Supports single-day and multi-day absences
 */
export interface Absence {
  /** Unique identifier for the absence */
  id: string;
  /** Employee ID this absence belongs to */
  employeeId: string;
  /** Start date of the absence (ISO string format) */
  startDate: string;
  /** End date of the absence (ISO string format) */
  endDate: string;
  /** Optional reason for the absence */
  reason?: string;
  /** Type of absence (sick, vacation, personal, etc.) */
  type: AbsenceType;
  /** When this record was created */
  createdAt: string;
  /** When this record was last updated */
  updatedAt: string;
}

/**
 * Types of absences
 */
export enum AbsenceType {
  SICK = 'sick',
  VACATION = 'vacation',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  BEREAVEMENT = 'bereavement',
  OTHER = 'other'
}

/**
 * Calendar cell data structure
 * Represents the state of a specific date for an employee
 */
export interface CalendarCell {
  /** The date this cell represents */
  date: Date;
  /** Employee ID */
  employeeId: string;
  /** Whether the employee is absent on this date */
  isAbsent: boolean;
  /** Whether this is a weekend (Saturday or Sunday) */
  isWeekend: boolean;
  /** Absence record if the employee is absent */
  absence?: Absence;
}

/**
 * Dialog state for creating/editing absences
 */
export interface AbsenceDialogData {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** The employee being edited */
  employee: Employee | null;
  /** The selected date */
  selectedDate: Date | null;
  /** Existing absence being edited (null for new absence) */
  editingAbsence: Absence | null;
}

/**
 * Form data for absence creation/editing
 */
export interface AbsenceFormData {
  /** Start date of the absence */
  startDate: string;
  /** End date of the absence */
  endDate: string;
  /** Type of absence */
  type: AbsenceType;
  /** Optional reason */
  reason: string;
}

/**
 * Date range utility type
 */
export interface DateRange {
  /** Start date */
  start: Date;
  /** End date */
  end: Date;
}

/**
 * Virtual scrolling position data
 */
export interface VirtualScrollPosition {
  /** Horizontal scroll position */
  scrollLeft: number;
  /** Vertical scroll position */
  scrollTop: number;
}
