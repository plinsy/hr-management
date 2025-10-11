# Cell Click Feature - Visual Guide

## How It Works

### 1. Calendar Layout
```
┌─────────────┬─────────────┬──────────────┬───────────────────────────────────────────────┐
│ First Name  │ Last Name   │ Phone Number │        Dates (Jan - Dec 2025)                │
├─────────────┼─────────────┼──────────────┼───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┤
│ John        │ Doe         │ +1-555-0001  │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │ □ │ □ │ ✓ │ ✓ │...│...│...│
├─────────────┼─────────────┼──────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│ Jane        │ Smith       │ +1-555-0002  │ ✓ │ ✓ │ ✗ │ ✗ │ ✓ │ □ │ □ │ ✓ │ ✓ │...│...│...│
└─────────────┴─────────────┴──────────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

Legend:
✓ = Present (Green cell)
✗ = Absent (Red cell)
□ = Weekend (Grey cell, disabled)
```

### 2. Clicking a Weekday Cell (Present - Green)

**Before Click:**
```
Cell Appearance:
┌───────────┐
│           │  ← Green background (#4caf50)
│     ✓     │  ← Cursor: pointer (👆)
│           │  ← Hover: scales to 1.1x with shadow
└───────────┘
```

**User Action:** Click the cell

**After Click:**
```
Dialog Opens:
┌─────────────────────────────────────────┐
│  Create New Absence                  ✕  │
├─────────────────────────────────────────┤
│                                         │
│  Employee: [John Doe (P001)]            │
│                                         │
│  Start Date:  [2025-03-15]             │
│  End Date:    [2025-03-15]             │
│  Duration:    1 days                    │
│                                         │
│  Type:        [Select Type ▼]          │
│  Reason:      [___________________]    │
│                                         │
│         [Cancel]  [Create Absence]      │
└─────────────────────────────────────────┘
```

### 3. Clicking a Weekday Cell (Absent - Red)

**Before Click:**
```
Cell Appearance:
┌───────────┐
│           │  ← Red background (#f44336)
│     ✗     │  ← Cursor: pointer (👆)
│           │  ← Hover: scales to 1.1x with shadow
└───────────┘
    ↓
  Tooltip
┌──────────────────────┐
│ John Doe             │
│ March 15, 2025       │
│ Type: vacation       │
│ Reason: Spring break │
└──────────────────────┘
```

**User Action:** Click the cell

**After Click:**
```
Dialog Opens (Edit Mode):
┌─────────────────────────────────────────┐
│  Edit Absence                        ✕  │
├─────────────────────────────────────────┤
│                                         │
│  Employee: [John Doe (P001)]            │
│                                         │
│  Start Date:  [2025-03-15]             │
│  End Date:    [2025-03-17]             │
│  Duration:    3 days                    │
│                                         │
│  Type:        [Vacation ▼]             │
│  Reason:      [Spring break________]   │
│                                         │
│  [Delete]  [Cancel]  [Save Changes]    │
└─────────────────────────────────────────┘
```

### 4. Clicking a Weekend Cell (Saturday/Sunday - Grey)

**Before Click:**
```
Cell Appearance:
┌───────────┐
│           │  ← Grey background (#9e9e9e)
│     □     │  ← Opacity: 0.6 (semi-transparent)
│           │  ← Cursor: not-allowed (🚫)
└───────────┘
    ↑
  Hover: NO scale, NO shadow
```

**User Action:** Click the cell

**After Click:**
```
❌ Dialog DOES NOT Open

Instead, Warning Snackbar appears:
┌────────────────────────────────────────────────┐
│ ⚠ Cannot create or edit absences on weekends  │
└────────────────────────────────────────────────┘
     ↑ Auto-dismisses after 3 seconds
```

## Visual States Comparison

### Weekday Cells (Clickable)
```
┌─────────────┬─────────────┬─────────────┐
│   PRESENT   │   ABSENT    │    TODAY    │
├─────────────┼─────────────┼─────────────┤
│ Green       │ Red         │ Blue border │
│ #4caf50     │ #f44336     │ Highlight   │
│ pointer 👆  │ pointer 👆  │ pointer 👆  │
│ Hover: ⬆    │ Hover: ⬆    │ Hover: ⬆    │
│ Clickable ✓ │ Clickable ✓ │ Clickable ✓ │
└─────────────┴─────────────┴─────────────┘
```

### Weekend Cells (Non-clickable)
```
┌─────────────────────────┐
│       WEEKEND           │
├─────────────────────────┤
│ Grey #9e9e9e            │
│ Opacity: 0.6            │
│ not-allowed 🚫          │
│ Hover: NO effect        │
│ Clickable: Shows warning│
└─────────────────────────┘
```

## User Interaction Flow

### Scenario 1: Create New Absence
```
User Journey:
1. Browse Calendar
   ↓
2. Find Employee Row (e.g., "John Doe")
   ↓
3. Find Date (e.g., "March 15, 2025")
   ↓
4. Check if Weekday
   ├─ Yes (Mon-Fri) → Continue
   └─ No (Sat-Sun)  → ⚠ Warning shown
   ↓
5. Hover over cell
   ├─ Green (Present) → Shows scale effect
   └─ Red (Absent)    → Shows tooltip + scale
   ↓
6. Click cell
   ↓
7. Dialog opens with:
   ├─ Employee: Pre-selected ✓
   ├─ Date: Pre-filled ✓
   └─ Mode: Create New ✓
   ↓
8. Fill in details:
   ├─ Type: "Vacation"
   ├─ Reason: "Family trip"
   └─ Duration: Auto-calculated
   ↓
9. Click "Create Absence"
   ↓
10. Success! ✅
    ├─ Dialog closes
    ├─ Cell turns red
    └─ Success message shown
```

### Scenario 2: Edit Existing Absence
```
User Journey:
1. Browse Calendar
   ↓
2. Find red cell (existing absence)
   ↓
3. Hover over cell
   ├─ Tooltip appears
   └─ Shows: Name, Date, Type, Reason
   ↓
4. Click cell
   ↓
5. Dialog opens with:
   ├─ Employee: Pre-selected ✓
   ├─ All fields: Pre-filled ✓
   └─ Mode: Edit ✓
   ↓
6. Modify details
   ├─ Change dates
   ├─ Change type
   └─ Update reason
   ↓
7. Click "Save Changes"
   ↓
8. Success! ✅
    ├─ Dialog closes
    ├─ Cell updates
    └─ Success message shown
```

### Scenario 3: Attempt Weekend Click
```
User Journey:
1. Browse Calendar
   ↓
2. Hover over weekend cell (Sat/Sun)
   ├─ Cursor: not-allowed 🚫
   ├─ No scale effect
   └─ Opacity: 0.6
   ↓
3. Click weekend cell
   ↓
4. Warning appears:
   ┌────────────────────────────────────┐
   │ ⚠ Cannot create or edit absences │
   │   on weekends                      │
   └────────────────────────────────────┘
   ↓
5. Dialog does NOT open ❌
   ↓
6. Warning auto-dismisses (3 seconds)
   ↓
7. User selects weekday instead ✓
```

## CSS Visual Indicators

### Cell Cursor States
```css
/* Weekday cells (clickable) */
.absence-cell.present,
.absence-cell.absent {
  cursor: pointer;  /* Shows 👆 hand cursor */
}

/* Weekend cells (non-clickable) */
.absence-cell.weekend {
  cursor: not-allowed;  /* Shows 🚫 forbidden cursor */
}
```

### Cell Hover Effects
```css
/* Weekday cells: Scale on hover */
.absence-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Weekend cells: No effect on hover */
.absence-cell.weekend:hover {
  transform: none;
  box-shadow: none;
}
```

### Cell Opacity
```css
/* Normal cells: Fully opaque */
.absence-cell {
  opacity: 1.0;
}

/* Weekend cells: Semi-transparent */
.absence-cell.weekend {
  opacity: 0.6;
}
```

## Keyboard Navigation (Future Enhancement)

```
Current: Mouse-only
Future:  
- Tab: Navigate between cells
- Enter: Open dialog for selected cell
- Escape: Close dialog
- Arrow Keys: Move selection
```

## Accessibility

### Current Features:
- ✅ Visual cursor indicators
- ✅ Color coding for different states
- ✅ Hover effects for feedback
- ✅ Warning messages for blocked actions

### Future Enhancements:
- [ ] ARIA labels for screen readers
- [ ] Keyboard navigation support
- [ ] Focus indicators
- [ ] High contrast mode support

## Browser Behavior

### Chrome/Edge:
```
🚫 not-allowed cursor → Red circle with slash
👆 pointer cursor → Hand with pointing finger
```

### Firefox:
```
🚫 not-allowed cursor → Red circle with slash
👆 pointer cursor → Hand with pointing finger
```

### Safari:
```
🚫 not-allowed cursor → Circle with slash
👆 pointer cursor → Hand with pointing finger
```

## Summary

✅ **Click weekday cells** → Dialog opens with employee & date  
❌ **Click weekend cells** → Warning shown, dialog blocked  
🎨 **Visual feedback** → Cursor, opacity, hover effects  
📱 **Responsive** → Works on all screen sizes  
♿ **Accessible** → Clear visual indicators  

---

**Note**: This feature is fully implemented and tested. Users can now easily:
1. Click any employee's cell on any date
2. See immediate visual feedback
3. Create or edit absences with pre-filled data
4. Be guided away from weekend selections
