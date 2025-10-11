# Test Suite Overview

## Test Coverage

The HR Management application has comprehensive test coverage across multiple layers:

### 1. Component Tests

#### AbsenceDialog Component
**File**: `app/tests/components/AbsenceDialog.test.ts`

Tests cover:
- ✅ Component rendering and initialization
- ✅ Form validation (required fields, date validation)
- ✅ Dialog actions (create, edit, delete)
- ✅ Employee selection
- ✅ Date range validation
- ✅ Submit and cancel functionality

**File**: `app/tests/components/AbsenceDialog.enhanced.test.ts`

Enhanced tests cover:
- ✅ Cell click integration (create/edit modes)
- ✅ Employee search functionality
- ✅ Cross-field date validation
- ✅ Duration calculation (single/multiple days)
- ✅ Form submission validation
- ✅ Overlap detection
- ✅ Auto-fill behavior

### 2. Store Tests

#### Employee Store (Pinia)
**File**: `app/tests/stores/employees.test.ts`

Tests cover:
- ✅ Store initialization
- ✅ Data loading with pagination
- ✅ CRUD operations for absences
  - Create absence
  - Update absence
  - Delete absence
- ✅ Employee retrieval (by ID, all employees)
- ✅ Absence queries (by employee, by date range)
- ✅ Error handling
- ✅ Loading states

### 3. Utility Tests

#### Date Utilities
**File**: `app/tests/utils/dateUtils.test.ts`

Tests cover:
- ✅ Date formatting functions
- ✅ Date range generation
- ✅ Month/year calculations
- ✅ Weekend detection
- ✅ Today detection
- ✅ Days difference calculation

#### Virtual Scrolling Utilities
**File**: `app/tests/utils/virtualScrolling.test.ts`

Tests cover:
- ✅ Visible range calculation (vertical)
- ✅ Horizontal visible range calculation
- ✅ Debounce function
- ✅ Throttle function
- ✅ Optimized scroll position calculation

#### Data Generator
**File**: `app/tests/utils/dataGenerator.test.ts`

Tests cover:
- ✅ Employee data generation
- ✅ Absence data generation
- ✅ Random data distribution
- ✅ Data structure validation

## Test Framework

**Testing Stack:**
- **Test Runner**: Vitest
- **Component Testing**: @vue/test-utils
- **DOM Environment**: happy-dom
- **Type Safety**: TypeScript

## Running Tests

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Tests Once (CI mode)
```bash
pnpm test --run
```

### Run Specific Test File
```bash
pnpm test app/tests/components/AbsenceDialog.test.ts
```

### Run with Coverage
```bash
pnpm test --coverage
```

## Test Structure

### Example Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ComponentName from '~/components/ComponentName.vue'

describe('ComponentName', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('feature group', () => {
    it('should do something specific', () => {
      const wrapper = mount(ComponentName, {
        props: { ... }
      })
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Expected text')
    })
  })
})
```

## Recent Updates

### Fixed Issues:
1. **Button Text Mismatch**
   - Updated test to expect "Add" instead of "Create Absence"
   - Updated test to expect "Save Changes" for edit mode
   - Reason: Component uses shorter, cleaner button labels

## Test Coverage Goals

### Current Coverage:
- ✅ Core components (AbsenceDialog)
- ✅ State management (Pinia stores)
- ✅ Utility functions
- ✅ Date calculations
- ✅ Virtual scrolling logic

### Future Coverage (Optional):
- [ ] CalendarTable component
- [ ] App.vue main component
- [ ] Integration tests
- [ ] E2E tests with Playwright
- [ ] Accessibility tests
- [ ] Performance benchmarks

## Common Test Scenarios

### 1. Create Absence
```typescript
it('should create absence successfully', async () => {
  const wrapper = mount(AbsenceDialog, { ... })
  
  // Fill form
  await wrapper.find('[label="Start Date"]').setValue('2025-03-15')
  await wrapper.find('[label="End Date"]').setValue('2025-03-15')
  await wrapper.find('[label="Type"]').setValue('vacation')
  
  // Submit
  await wrapper.find('button:contains("Add")').trigger('click')
  
  // Verify
  expect(wrapper.emitted('absence-created')).toBeTruthy()
})
```

### 2. Edit Absence
```typescript
it('should edit absence successfully', async () => {
  const existingAbsence = { ... }
  const wrapper = mount(AbsenceDialog, {
    props: {
      modelValue: {
        isOpen: true,
        employee: mockEmployee,
        editingAbsence: existingAbsence
      }
    }
  })
  
  // Modify fields
  await wrapper.find('[label="End Date"]').setValue('2025-03-20')
  
  // Submit
  await wrapper.find('button:contains("Save Changes")').trigger('click')
  
  // Verify
  expect(wrapper.emitted('absence-updated')).toBeTruthy()
})
```

### 3. Validation
```typescript
it('should validate required fields', async () => {
  const wrapper = mount(AbsenceDialog, { ... })
  
  // Try to submit without filling required fields
  await wrapper.find('button:contains("Add")').trigger('click')
  
  // Should show validation errors
  expect(wrapper.text()).toContain('required')
})
```

### 4. Date Range Validation
```typescript
it('should validate end date is after start date', async () => {
  const wrapper = mount(AbsenceDialog, { ... })
  
  await wrapper.find('[label="Start Date"]').setValue('2025-03-20')
  await wrapper.find('[label="End Date"]').setValue('2025-03-15')
  
  expect(wrapper.text()).toContain('End date must be after')
})
```

## Debugging Tests

### View Test Output
```bash
pnpm test -- --reporter=verbose
```

### Debug Single Test
```typescript
it.only('should test specific feature', () => {
  // Only this test will run
})
```

### Skip Test Temporarily
```typescript
it.skip('should test feature', () => {
  // This test will be skipped
})
```

### Add Console Logs
```typescript
it('should debug test', () => {
  console.log('Wrapper HTML:', wrapper.html())
  console.log('Wrapper Text:', wrapper.text())
  console.log('Emitted events:', wrapper.emitted())
})
```

## Continuous Integration

### GitHub Actions (Future)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test --run
      - run: pnpm test --coverage
```

## Test Best Practices

1. **Isolate Tests**
   - Each test should be independent
   - Use `beforeEach` to reset state
   - Don't rely on test execution order

2. **Test Behavior, Not Implementation**
   - Test what users see and interact with
   - Avoid testing internal implementation details
   - Focus on component outputs and events

3. **Use Descriptive Names**
   - Test names should describe what they test
   - Use "should" statements
   - Be specific about expected behavior

4. **Mock External Dependencies**
   - Mock API calls
   - Mock stores when testing components
   - Use test doubles for complex dependencies

5. **Keep Tests Fast**
   - Avoid unnecessary delays
   - Use minimal setup
   - Run tests in parallel when possible

## Troubleshooting

### Tests Failing After Component Changes
- Update test expectations to match new behavior
- Check if component props or events changed
- Verify mock data structure matches new requirements

### Tests Hanging
- Check for missing `async/await`
- Look for infinite loops
- Verify event handlers are properly cleaned up

### Flaky Tests
- Add proper waits for async operations
- Use `nextTick()` for Vue updates
- Check for race conditions
- Ensure proper cleanup in `afterEach`

## Status

**Current Status**: 🟡 **IN PROGRESS**

- ✅ Core functionality tested
- 🔧 Fixing button text mismatches
- 🔄 Running full test suite

**Next Steps:**
1. Fix all failing tests
2. Increase test coverage
3. Add integration tests
4. Set up CI/CD pipeline

---

**Last Updated**: October 11, 2025  
**Test Framework**: Vitest + Vue Test Utils  
**Coverage**: ~70% (estimated)
