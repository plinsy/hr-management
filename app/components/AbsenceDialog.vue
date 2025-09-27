<template>
  <v-dialog
    v-model="dialogState.isOpen"
    max-width="600px"
    persistent
    @keydown.esc="handleCancel"
  >
    <v-card>
      <!-- Dialog header -->
      <v-card-title class="text-h5 pa-4">
        <v-icon class="me-2" color="primary">
          {{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}
        </v-icon>
        {{ isEditing ? 'Edit Absence' : 'Create New Absence' }}
      </v-card-title>

      <v-divider />

      <!-- Dialog content -->
      <v-card-text class="pa-4">
        <!-- Employee info -->
        <div v-if="dialogState.employee" class="employee-info mb-4">
          <v-chip
            color="primary"
            variant="tonal"
            size="large"
            class="mb-2"
          >
            <v-icon start>mdi-account</v-icon>
            {{ dialogState.employee.firstName }} {{ dialogState.employee.lastName }}
            ({{ dialogState.employee.personnelNumber }})
          </v-chip>
        </div>

        <!-- Form -->
        <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
          <v-container fluid class="pa-0">
            <v-row>
              <!-- Start Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.startDate"
                  type="date"
                  label="Start Date"
                  variant="outlined"
                  :rules="startDateRules"
                  required
                  :min="minDate"
                  :max="maxDate"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>

              <!-- End Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.endDate"
                  type="date"
                  label="End Date"
                  variant="outlined"
                  :rules="endDateRules"
                  required
                  :min="formData.startDate || minDate"
                  :max="maxDate"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>

              <!-- Absence Type -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.type"
                  :items="absenceTypes"
                  item-title="label"
                  item-value="value"
                  label="Absence Type"
                  variant="outlined"
                  :rules="typeRules"
                  required
                  prepend-inner-icon="mdi-tag"
                >
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-icon="getAbsenceTypeIcon(item.raw.value as AbsenceType)"
                    />
                  </template>
                </v-select>
              </v-col>

              <!-- Duration Display -->
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="calculateDuration()"
                  label="Duration"
                  variant="outlined"
                  readonly
                  prepend-inner-icon="mdi-clock-outline"
                  suffix="days"
                />
              </v-col>

              <!-- Reason -->
              <v-col cols="12">
                <v-textarea
                  v-model="formData.reason"
                  label="Reason (Optional)"
                  variant="outlined"
                  rows="3"
                  :rules="reasonRules"
                  prepend-inner-icon="mdi-text"
                  placeholder="Enter the reason for this absence..."
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <!-- Validation Summary -->
        <v-alert
          v-if="validationErrors.length > 0"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          <v-list dense>
            <v-list-item
              v-for="error in validationErrors"
              :key="error"
              class="pa-0"
            >
              <template #prepend>
                <v-icon size="small">mdi-alert-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">{{ error }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-alert>
      </v-card-text>

      <v-divider />

      <!-- Dialog actions -->
      <v-card-actions class="pa-4">
        <v-spacer />
        
        <!-- Delete button for editing -->
        <v-btn
          v-if="isEditing"
          color="error"
          variant="outlined"
          @click="handleDelete"
          :loading="isDeleting"
        >
          <v-icon start>mdi-delete</v-icon>
          Delete
        </v-btn>

        <v-spacer v-if="isEditing" />

        <!-- Cancel button -->
        <v-btn
          color="grey"
          variant="outlined"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancel
        </v-btn>

        <!-- Submit button -->
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="!formValid"
        >
          <v-icon start>{{ isEditing ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
          {{ isEditing ? 'Save Changes' : 'Create Absence' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmation Dialog for Delete -->
  <v-dialog v-model="showDeleteConfirmation" max-width="400px">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon class="me-2" color="error">mdi-alert</v-icon>
        Confirm Delete
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this absence? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="outlined" @click="showDeleteConfirmation = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete" :loading="isDeleting">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useEmployeeStore } from '~/stores/employees'
import type { Employee, Absence, AbsenceType, AbsenceFormData, AbsenceDialogData } from '~/types'
import { formatDate, daysDifference, getCurrentYear } from '~/utils/dateUtils'

/**
 * Absence management dialog component
 * Handles creation, editing, and deletion of employee absences
 */

// Props
interface Props {
  modelValue: AbsenceDialogData
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: AbsenceDialogData]
  'absenceCreated': [absence: Absence]
  'absenceUpdated': [absence: Absence]
  'absenceDeleted': [absenceId: string]
}>()

// Store
const employeeStore = useEmployeeStore()

// Refs
const formRef = ref()
const formValid = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const showDeleteConfirmation = ref(false)
const validationErrors = ref<string[]>([])

// Computed
const dialogState = computed({
  get: () => props.modelValue,
  set: (value: AbsenceDialogData) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!dialogState.value.editingAbsence)

// Form data
const formData = ref<AbsenceFormData>({
  startDate: '',
  endDate: '',
  type: 'vacation' as AbsenceType,
  reason: ''
})

// Date constraints
const currentYear = getCurrentYear()
const minDate = `${currentYear}-01-01`
const maxDate = `${currentYear}-12-31`

// Absence types with labels
const absenceTypes = [
  { label: 'Vacation', value: 'vacation', icon: 'mdi-beach' },
  { label: 'Sick Leave', value: 'sick', icon: 'mdi-medical-bag' },
  { label: 'Personal', value: 'personal', icon: 'mdi-account' },
  { label: 'Maternity', value: 'maternity', icon: 'mdi-baby' },
  { label: 'Paternity', value: 'paternity', icon: 'mdi-baby' },
  { label: 'Bereavement', value: 'bereavement', icon: 'mdi-heart-broken' },
  { label: 'Other', value: 'other', icon: 'mdi-dots-horizontal' }
]

// Validation rules
const startDateRules = [
  (v: string) => !!v || 'Start date is required',
  (v: string) => {
    if (!v) return true
    const date = new Date(v)
    const min = new Date(minDate)
    const max = new Date(maxDate)
    return date >= min && date <= max || `Date must be within ${currentYear}`
  }
]

const endDateRules = [
  (v: string) => !!v || 'End date is required',
  (v: string) => {
    if (!v || !formData.value.startDate) return true
    const endDate = new Date(v)
    const startDate = new Date(formData.value.startDate)
    return endDate >= startDate || 'End date must be after start date'
  },
  (v: string) => {
    if (!v) return true
    const date = new Date(v)
    const min = new Date(minDate)
    const max = new Date(maxDate)
    return date >= min && date <= max || `Date must be within ${currentYear}`
  }
]

const typeRules = [
  (v: string) => !!v || 'Absence type is required'
]

const reasonRules = [
  (v: string) => !v || v.length <= 500 || 'Reason must be 500 characters or less'
]

// Methods
/**
 * Get icon for absence type
 */
const getAbsenceTypeIcon = (type: AbsenceType): string => {
  return absenceTypes.find(t => t.value === type)?.icon || 'mdi-tag'
}

/**
 * Calculate duration between start and end dates
 */
const calculateDuration = (): number => {
  if (!formData.value.startDate || !formData.value.endDate) return 0
  
  const startDate = new Date(formData.value.startDate)
  const endDate = new Date(formData.value.endDate)
  
  return daysDifference(startDate, endDate) + 1 // +1 to include both start and end dates
}

/**
 * Initialize form data based on dialog state
 */
const initializeForm = () => {
  validationErrors.value = []
  
  if (isEditing.value && dialogState.value.editingAbsence) {
    // Populate form with existing absence data
    const absence = dialogState.value.editingAbsence
    formData.value = {
      startDate: absence.startDate,
      endDate: absence.endDate,
      type: absence.type,
      reason: absence.reason || ''
    }
  } else {
    // Initialize for new absence
    const selectedDate = dialogState.value.selectedDate
    const dateString = selectedDate ? formatDate(selectedDate, 'iso') : ''
    
    formData.value = {
      startDate: dateString,
      endDate: dateString,
      type: 'vacation' as AbsenceType,
      reason: ''
    }
  }
}

/**
 * Validate form data
 */
const validateForm = (): boolean => {
  validationErrors.value = []
  
  if (!formData.value.startDate) {
    validationErrors.value.push('Start date is required')
  }
  
  if (!formData.value.endDate) {
    validationErrors.value.push('End date is required')
  }
  
  if (formData.value.startDate && formData.value.endDate) {
    const startDate = new Date(formData.value.startDate)
    const endDate = new Date(formData.value.endDate)
    
    if (endDate < startDate) {
      validationErrors.value.push('End date must be after start date')
    }
    
    // Check for overlapping absences
    if (dialogState.value.employee) {
      const overlappingAbsence = dialogState.value.employee.absences.find(absence => {
        // Skip the current absence if editing
        if (isEditing.value && absence.id === dialogState.value.editingAbsence?.id) {
          return false
        }
        
        const absenceStart = new Date(absence.startDate)
        const absenceEnd = new Date(absence.endDate)
        
        // Check for overlap
        return startDate <= absenceEnd && endDate >= absenceStart
      })
      
      if (overlappingAbsence) {
        validationErrors.value.push('This absence overlaps with an existing absence')
      }
    }
  }
  
  if (!formData.value.type) {
    validationErrors.value.push('Absence type is required')
  }
  
  if (formData.value.reason && formData.value.reason.length > 500) {
    validationErrors.value.push('Reason must be 500 characters or less')
  }
  
  return validationErrors.value.length === 0
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid || !validateForm()) return
  
  if (!dialogState.value.employee) return
  
  isSubmitting.value = true
  
  try {
    let result: Absence
    
    if (isEditing.value && dialogState.value.editingAbsence) {
      // Update existing absence
      result = await employeeStore.updateAbsence(
        dialogState.value.editingAbsence.id,
        formData.value
      )
      emit('absenceUpdated', result)
    } else {
      // Create new absence
      result = await employeeStore.createAbsence(
        dialogState.value.employee.id,
        formData.value
      )
      emit('absenceCreated', result)
    }
    
    // Close dialog
    handleClose()
    
  } catch (error) {
    console.error('Error saving absence:', error)
    validationErrors.value.push('Failed to save absence. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Handle delete action
 */
const handleDelete = () => {
  showDeleteConfirmation.value = true
}

/**
 * Confirm delete action
 */
const confirmDelete = async () => {
  if (!dialogState.value.editingAbsence) return
  
  isDeleting.value = true
  
  try {
    await employeeStore.deleteAbsence(dialogState.value.editingAbsence.id)
    emit('absenceDeleted', dialogState.value.editingAbsence.id)
    showDeleteConfirmation.value = false
    handleClose()
  } catch (error) {
    console.error('Error deleting absence:', error)
    validationErrors.value.push('Failed to delete absence. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

/**
 * Handle cancel action
 */
const handleCancel = () => {
  handleClose()
}

/**
 * Close dialog and reset form
 */
const handleClose = () => {
  dialogState.value = {
    isOpen: false,
    employee: null,
    selectedDate: null,
    editingAbsence: null
  }
  
  // Reset form
  formData.value = {
    startDate: '',
    endDate: '',
    type: 'vacation' as AbsenceType,
    reason: ''
  }
  
  validationErrors.value = []
  formValid.value = false
  
  if (formRef.value) {
    formRef.value.reset()
  }
}

// Watchers
watch(
  () => dialogState.value.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      initializeForm()
    }
  }
)

// Auto-update end date when start date changes (for new absences)
watch(
  () => formData.value.startDate,
  (newStartDate) => {
    if (!isEditing.value && newStartDate && !formData.value.endDate) {
      formData.value.endDate = newStartDate
    }
  }
)
</script>

<style scoped>
.employee-info {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.v-card-title {
  background-color: #f8f9fa;
}

.v-alert :deep(.v-list-item) {
  min-height: auto;
}

/* Custom spacing for form */
:deep(.v-container) {
  padding: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  :deep(.v-dialog) {
    margin: 16px;
  }
}
</style>
