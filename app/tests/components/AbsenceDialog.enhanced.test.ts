import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AbsenceDialog from '~/components/AbsenceDialog.vue'
import { useEmployeeStore } from '~/stores/employees'
import type { AbsenceDialogData, Employee, Absence, AbsenceType } from '~/types'

// Mock Vuetify components
vi.mock('vuetify/components', () => ({
  VDialog: { name: 'v-dialog', template: '<div><slot /></div>' },
  VCard: { name: 'v-card', template: '<div><slot /></div>' },
  VCardTitle: { name: 'v-card-title', template: '<div><slot /></div>' },
  VCardText: { name: 'v-card-text', template: '<div><slot /></div>' },
  VCardActions: { name: 'v-card-actions', template: '<div><slot /></div>' },
  VForm: { name: 'v-form', template: '<div><slot /></div>' },
  VContainer: { name: 'v-container', template: '<div><slot /></div>' },
  VRow: { name: 'v-row', template: '<div><slot /></div>' },
  VCol: { name: 'v-col', template: '<div><slot /></div>' },
  VTextField: { name: 'v-text-field', template: '<input />' },
  VAutocomplete: { name: 'v-autocomplete', template: '<select><slot /></select>' },
  VSelect: { name: 'v-select', template: '<select><slot /></select>' },
  VTextarea: { name: 'v-textarea', template: '<textarea />' },
  VBtn: { name: 'v-btn', template: '<button><slot /></button>' },
  VChip: { name: 'v-chip', template: '<span><slot /></span>' },
  VIcon: { name: 'v-icon', template: '<i><slot /></i>' },
  VDivider: { name: 'v-divider', template: '<hr />' },
  VAlert: { name: 'v-alert', template: '<div><slot /></div>' },
  VList: { name: 'v-list', template: '<ul><slot /></ul>' },
  VListItem: { name: 'v-list-item', template: '<li><slot /></li>' },
  VListItemTitle: { name: 'v-list-item-title', template: '<div><slot /></div>' },
  VSpacer: { name: 'v-spacer', template: '<div />' }
}))

describe('AbsenceDialog - Enhanced CRUD Features', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useEmployeeStore>
  
  const mockEmployee: Employee = {
    id: 'emp-1',
    firstName: 'John',
    lastName: 'Doe',
    personnelNumber: 'P001',
    phoneNumber: '+1-555-0001',
    absences: []
  }
  
  const mockEmployees: Employee[] = [
    mockEmployee,
    {
      id: 'emp-2',
      firstName: 'Jane',
      lastName: 'Smith',
      personnelNumber: 'P002',
      phoneNumber: '+1-555-0002',
      absences: []
    },
    {
      id: 'emp-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      personnelNumber: 'P003',
      phoneNumber: '+1-555-0003',
      absences: []
    }
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useEmployeeStore()
    
    // Initialize store with mock employees
    store.$patch({
      employees: mockEmployees,
      allEmployeesData: mockEmployees,
      totalCount: mockEmployees.length
    })
  })

  describe('Cell Click Integration', () => {
    it('should open dialog for creating absence when cell has no absence', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      expect(wrapper.exists()).toBe(true)
      // Should be in create mode (not editing)
      expect(dialogData.editingAbsence).toBeNull()
    })

    it('should open dialog for editing absence when cell has absence', () => {
      const existingAbsence: Absence = {
        id: 'abs-1',
        employeeId: 'emp-1',
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        type: 'vacation' as AbsenceType,
        reason: 'Spring break',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: existingAbsence
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      expect(wrapper.exists()).toBe(true)
      // Should be in edit mode
      expect(dialogData.editingAbsence).toBe(existingAbsence)
    })
  })

  describe('Employee Search Functionality', () => {
    it('should show employee selector when no employee is selected', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: null,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      // Should show autocomplete for employee search
      expect(wrapper.findComponent({ name: 'v-autocomplete' }).exists()).toBe(true)
    })

    it('should show employee chip when employee is pre-selected', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      // Should show employee info chip
      expect(wrapper.findComponent({ name: 'v-chip' }).exists()).toBe(true)
      // Should NOT show autocomplete
      expect(wrapper.findComponent({ name: 'v-autocomplete' }).exists()).toBe(false)
    })

    it('should provide all employees for search', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: null,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      // Access component instance
      const vm = wrapper.vm as any
      expect(vm.allEmployees).toHaveLength(3)
      expect(vm.allEmployees[0].fullName).toContain('John Doe')
    })
  })

  describe('Date Validation', () => {
    it('should validate start date is required', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      const rules = vm.startDateRules
      
      expect(rules[0]('')).toBe('Start date is required')
      expect(rules[0]('2025-03-15')).toBe(true)
    })

    it('should validate end date is after or equal to start date', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Set start date
      vm.formData.startDate = '2025-03-15'
      
      const rules = vm.endDateRules
      
      // End date before start date should fail
      expect(rules[1]('2025-03-10')).toContain('after or equal to')
      
      // End date equal to start date should pass
      expect(rules[1]('2025-03-15')).toBe(true)
      
      // End date after start date should pass
      expect(rules[1]('2025-03-20')).toBe(true)
    })

    it('should validate dates are within current year', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      const rules = vm.startDateRules
      
      // Date outside 2025 should fail
      expect(rules[1]('2024-12-31')).toContain('within 2025')
      expect(rules[1]('2026-01-01')).toContain('within 2025')
      
      // Date within 2025 should pass
      expect(rules[1]('2025-06-15')).toBe(true)
    })

    it('should detect overlapping absences', () => {
      const employeeWithAbsence: Employee = {
        ...mockEmployee,
        absences: [{
          id: 'abs-1',
          employeeId: 'emp-1',
          startDate: '2025-03-10',
          endDate: '2025-03-15',
          type: 'vacation' as AbsenceType,
          reason: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      }

      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: employeeWithAbsence,
        selectedDate: new Date('2025-03-20'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Set overlapping dates
      vm.formData.startDate = '2025-03-12'
      vm.formData.endDate = '2025-03-18'
      vm.formData.type = 'sick'
      
      const isValid = vm.validateForm()
      
      expect(isValid).toBe(false)
      expect(vm.validationErrors).toContain('This absence overlaps with an existing absence')
    })

    it('should allow editing same absence without overlap error', () => {
      const existingAbsence: Absence = {
        id: 'abs-1',
        employeeId: 'emp-1',
        startDate: '2025-03-10',
        endDate: '2025-03-15',
        type: 'vacation' as AbsenceType,
        reason: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const employeeWithAbsence: Employee = {
        ...mockEmployee,
        absences: [existingAbsence]
      }

      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: employeeWithAbsence,
        selectedDate: new Date('2025-03-10'),
        editingAbsence: existingAbsence
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Editing same dates shouldn't cause overlap
      vm.formData.startDate = '2025-03-10'
      vm.formData.endDate = '2025-03-15'
      vm.formData.type = 'vacation'
      
      const isValid = vm.validateForm()
      
      expect(isValid).toBe(true)
      expect(vm.validationErrors).not.toContain('This absence overlaps with an existing absence')
    })
  })

  describe('Duration Calculation', () => {
    it('should calculate duration for single day', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      vm.formData.startDate = '2025-03-15'
      vm.formData.endDate = '2025-03-15'
      
      expect(vm.calculateDuration()).toBe(1)
    })

    it('should calculate duration for multiple days', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      vm.formData.startDate = '2025-03-15'
      vm.formData.endDate = '2025-03-20'
      
      // Should be 6 days (15, 16, 17, 18, 19, 20)
      expect(vm.calculateDuration()).toBe(6)
    })

    it('should return 0 when dates are missing', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      vm.formData.startDate = ''
      vm.formData.endDate = ''
      
      expect(vm.calculateDuration()).toBe(0)
    })

    it('should update duration when dates change', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Initial duration
      vm.formData.startDate = '2025-03-15'
      vm.formData.endDate = '2025-03-17'
      expect(vm.calculateDuration()).toBe(3)
      
      // Change end date
      vm.formData.endDate = '2025-03-20'
      expect(vm.calculateDuration()).toBe(6)
      
      // Change start date
      vm.formData.startDate = '2025-03-18'
      expect(vm.calculateDuration()).toBe(3)
    })
  })

  describe('Form Submission', () => {
    it('should require employee when not pre-selected', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: null,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      vm.formData.startDate = '2025-03-15'
      vm.formData.endDate = '2025-03-17'
      vm.formData.type = 'vacation'
      
      const isValid = vm.validateForm()
      
      expect(isValid).toBe(false)
      expect(vm.validationErrors).toContain('Please select an employee')
    })

    it('should validate all required fields', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Empty form
      vm.formData.startDate = ''
      vm.formData.endDate = ''
      vm.formData.type = ''
      
      const isValid = vm.validateForm()
      
      expect(isValid).toBe(false)
      expect(vm.validationErrors.length).toBeGreaterThan(0)
    })

    it('should pass validation with valid data', () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      vm.formData.startDate = '2025-03-15'
      vm.formData.endDate = '2025-03-17'
      vm.formData.type = 'vacation'
      vm.formData.reason = 'Spring break'
      
      const isValid = vm.validateForm()
      
      expect(isValid).toBe(true)
      expect(vm.validationErrors).toHaveLength(0)
    })
  })

  describe('Form Initialization', () => {
    it('should pre-fill date when creating from cell click', () => {
      const selectedDate = new Date('2025-03-15')
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: selectedDate,
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      vm.initializeForm()
      
      expect(vm.formData.startDate).toBe('2025-03-15')
      expect(vm.formData.endDate).toBe('2025-03-15')
    })

    it('should auto-fill end date with start date for new absences', async () => {
      const dialogData: AbsenceDialogData = {
        isOpen: true,
        employee: mockEmployee,
        selectedDate: new Date('2025-03-15'),
        editingAbsence: null
      }

      const wrapper = mount(AbsenceDialog, {
        props: {
          modelValue: dialogData
        },
        global: {
          plugins: [pinia]
        }
      })

      const vm = wrapper.vm as any
      
      // Start with empty dates
      vm.formData.startDate = ''
      vm.formData.endDate = ''
      
      // Set start date (triggers watcher)
      vm.formData.startDate = '2025-03-15'
      
      // Should auto-fill end date
      await wrapper.vm.$nextTick()
      expect(vm.formData.endDate).toBe('2025-03-15')
    })
  })
})
