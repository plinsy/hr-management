# Absence Dialog Improvements

## Summary
Completed full CRUD functionality for the absence management dialog with enhanced features.

## Changes Made

### 1. Cell Click Integration ✅
**File**: `app/components/CalendarTable.vue`

- **Before**: Clicking on a cell would only show notifications
- **After**: Clicking on any cell opens the absence dialog
  - If the cell has an absence → Opens dialog in **EDIT mode**
  - If the cell is empty → Opens dialog in **CREATE mode** with the date pre-filled

### 2. Employee Search Functionality ✅
**File**: `app/components/AbsenceDialog.vue`

Added searchable employee dropdown when no employee is selected from the table:

- **Autocomplete component** with search functionality
- Search by employee name or personnel number
- Shows employee avatar and details in dropdown
- Displays personnel number as subtitle
- Chip display for selected employee
- Required validation for employee selection

**Features**:
```vue
<v-autocomplete
  v-model="selectedEmployeeId"
  :items="allEmployees"
  item-title="fullName"
  item-value="id"
  label="Select Employee"
  prepend-inner-icon="mdi-account-search"
  clearable
/>
```

### 3. Enhanced Date Validation ✅
**File**: `app/components/AbsenceDialog.vue`

Improved date validation with cross-field validation:

#### Start Date Validation:
- ✅ Required field
- ✅ Must be within current year (2025)
- ✅ Must be before or equal to end date
- ✅ Real-time validation when either date changes

#### End Date Validation:
- ✅ Required field
- ✅ Must be within current year (2025)
- ✅ Must be after or equal to start date
- ✅ Real-time validation when either date changes

#### Overlap Detection:
- ✅ Checks for overlapping absences
- ✅ Excludes current absence when editing
- ✅ Shows clear error message if overlap detected

### 4. Automatic Duration Calculation ✅
**File**: `app/components/AbsenceDialog.vue`

- Duration is automatically calculated from start and end dates
- Updates in real-time as dates change
- Includes both start and end dates in calculation
- Display shows number of days with suffix

```typescript
const calculateDuration = (): number => {
  if (!formData.value.startDate || !formData.value.endDate) return 0
  
  const startDate = new Date(formData.value.startDate)
  const endDate = new Date(formData.value.endDate)
  
  return daysDifference(startDate, endDate) + 1 // +1 to include both dates
}
```

### 5. Improved User Experience

#### Smart Date Initialization:
- When creating new absence, end date auto-fills with start date
- When clicking a specific date cell, that date is pre-filled
- Form validation triggers automatically when dates change

#### Enhanced Validation:
- Real-time validation feedback
- Clear error messages in alert box
- Form-level and field-level validation
- Prevents submission until all validation passes

#### Better State Management:
- Proper reset of employee selection on dialog close
- Maintains employee context from clicked cell
- Falls back to searchable dropdown if no employee context

## Technical Implementation

### New Computed Properties:
```typescript
// Get all employees for search dropdown
const allEmployees = computed(() => {
  return employeeStore.getAllEmployees.map(emp => ({
    ...emp,
    fullName: `${emp.firstName} ${emp.lastName} (${emp.personnelNumber})`
  }))
})

// Get current employee (from context or selection)
const currentEmployee = computed(() => {
  if (dialogState.value.employee) return dialogState.value.employee
  if (selectedEmployeeId.value) {
    return employeeStore.getEmployeeById(selectedEmployeeId.value)
  }
  return null
})
```

### New Watchers:
```typescript
// Auto-update end date when start date changes
watch(() => formData.value.startDate, (newStartDate) => {
  if (!isEditing.value && newStartDate && !formData.value.endDate) {
    formData.value.endDate = newStartDate
  }
  // Trigger validation
  if (formRef.value) {
    nextTick(() => formRef.value.validate())
  }
})

// Trigger validation when end date changes
watch(() => formData.value.endDate, () => {
  if (formRef.value) {
    nextTick(() => formRef.value.validate())
  }
})
```

## User Workflows

### Workflow 1: Create Absence from Calendar
1. User clicks on any calendar cell (employee row + date)
2. Dialog opens with:
   - Employee pre-selected (chip display)
   - Date pre-filled in start and end date
   - Absence type defaults to "Vacation"
3. User can modify dates, type, and add reason
4. Duration updates automatically
5. Submit creates the absence

### Workflow 2: Edit Absence from Calendar
1. User clicks on a cell with existing absence
2. Dialog opens in edit mode with:
   - All absence data pre-filled
   - Employee shown in chip
   - Delete button available
3. User can modify any field
4. Duration recalculates automatically
5. Submit updates the absence

### Workflow 3: Create Absence from Quick Action
1. User clicks "Add Absence" from sidebar or employee list
2. Dialog opens with:
   - Searchable employee dropdown
   - Empty date fields
   - Default absence type
3. User searches and selects employee
4. User enters date range
5. Duration calculates automatically
6. Submit creates the absence

## Validation Rules Summary

### Employee Selection
- Required when no employee from context
- Must be valid employee ID from store

### Start Date
- Required
- Must be within 2025
- Must be ≤ end date

### End Date
- Required
- Must be within 2025
- Must be ≥ start date
- No overlaps with existing absences (except current when editing)

### Absence Type
- Required
- Must be one of: vacation, sick, personal, maternity, paternity, bereavement, other

### Reason
- Optional
- Max 500 characters if provided

### Duration
- Auto-calculated (read-only)
- Includes both start and end dates

## Testing Recommendations

1. **Cell Click Tests**
   - Click empty cell → Creates new absence
   - Click filled cell → Edits existing absence
   - Verify date pre-fills correctly

2. **Employee Search Tests**
   - Search by first name
   - Search by last name
   - Search by personnel number
   - Select from dropdown
   - Clear selection

3. **Date Validation Tests**
   - Start date after end date → Error
   - End date before start date → Error
   - Dates outside 2025 → Error
   - Overlapping dates → Error
   - Valid date range → Success

4. **Duration Calculation Tests**
   - Single day (start = end) → 1 day
   - Multiple days → Correct count
   - Change dates → Recalculates

5. **Form Submission Tests**
   - Valid data → Success
   - Missing employee → Error
   - Missing dates → Error
   - Invalid dates → Error
   - Overlapping dates → Error

## Benefits

✅ **Seamless UX**: Click anywhere on calendar to create/edit absences  
✅ **Flexible**: Works with or without employee context  
✅ **Safe**: Comprehensive validation prevents data issues  
✅ **Smart**: Auto-calculations reduce user effort  
✅ **Clear**: Real-time feedback on validation errors  
✅ **Intuitive**: Natural workflows for all use cases  

## Files Modified

1. `app/components/AbsenceDialog.vue` - Major enhancements
2. `app/components/CalendarTable.vue` - Click handler update

## Next Steps (Optional Enhancements)

- [ ] Add keyboard shortcuts (e.g., Ctrl+Enter to submit)
- [ ] Add date range presets (e.g., "This Week", "Next Week")
- [ ] Add bulk absence creation (multiple employees at once)
- [ ] Add absence templates (common absence patterns)
- [ ] Add conflict resolution UI for overlapping absences
- [ ] Add approval workflow for absences
