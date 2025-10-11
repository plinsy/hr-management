# Quick Testing Guide - Cell Click Feature

## 🚀 Quick Start

1. **Start the dev server**:
   ```powershell
   pnpm dev
   ```

2. **Open browser**:
   ```
   http://localhost:3000
   ```

3. **Navigate to Calendar View** (should be default)

## ✅ Test Checklist

### Test 1: Click Weekday Cell (Present - Green)
- [ ] Find a green cell on a weekday (Mon-Fri)
- [ ] Hover over it → Should scale up with shadow
- [ ] Cursor should be pointer (👆)
- [ ] Click the cell
- [ ] **Expected**: Dialog opens with:
  - Employee name pre-selected
  - Date pre-filled (start & end same day)
  - Title: "Create New Absence"
  - Duration: "1 days"

**Result**: ☐ Pass ☐ Fail

---

### Test 2: Click Weekday Cell (Absent - Red)
- [ ] Find a red cell on a weekday (existing absence)
- [ ] Hover over it → Should show tooltip with absence details
- [ ] Cursor should be pointer (👆)
- [ ] Click the cell
- [ ] **Expected**: Dialog opens with:
  - Employee name pre-selected
  - All fields pre-filled with absence data
  - Title: "Edit Absence"
  - Delete button visible

**Result**: ☐ Pass ☐ Fail

---

### Test 3: Click Weekend Cell (Saturday - Grey)
- [ ] Find a grey cell on Saturday
- [ ] Hover over it:
  - [ ] Cursor should be not-allowed (🚫)
  - [ ] Cell should NOT scale
  - [ ] Cell should be semi-transparent (opacity 0.6)
- [ ] Click the cell
- [ ] **Expected**: 
  - Warning snackbar appears at top
  - Message: "Cannot create or edit absences on weekends"
  - Dialog does NOT open
  - Warning auto-dismisses after 3 seconds

**Result**: ☐ Pass ☐ Fail

---

### Test 4: Click Weekend Cell (Sunday - Grey)
- [ ] Find a grey cell on Sunday
- [ ] Same behavior as Saturday test
- [ ] Cursor: not-allowed (🚫)
- [ ] No hover effect
- [ ] Click shows warning
- [ ] Dialog does NOT open

**Result**: ☐ Pass ☐ Fail

---

### Test 5: Create Absence Flow
- [ ] Click a green weekday cell
- [ ] Dialog opens with pre-filled data
- [ ] Select absence type: "Vacation"
- [ ] Add reason: "Test absence"
- [ ] Click "Create Absence"
- [ ] **Expected**:
  - Dialog closes
  - Success message: "Absence created successfully"
  - Cell turns red
  - Hover shows tooltip with new absence data

**Result**: ☐ Pass ☐ Fail

---

### Test 6: Edit Absence Flow
- [ ] Click a red weekday cell (existing absence)
- [ ] Dialog opens in edit mode
- [ ] Change end date to extend absence
- [ ] Duration updates automatically
- [ ] Click "Save Changes"
- [ ] **Expected**:
  - Dialog closes
  - Success message: "Absence updated successfully"
  - Calendar updates to show extended absence

**Result**: ☐ Pass ☐ Fail

---

### Test 7: Multiple Weekend Clicks
- [ ] Click several different weekend cells
- [ ] **Expected** for each:
  - Warning message appears
  - Dialog never opens
  - No errors in console

**Result**: ☐ Pass ☐ Fail

---

### Test 8: Visual Indicators
- [ ] Check all cell colors:
  - [ ] Green = Present (#4caf50)
  - [ ] Red = Absent (#f44336)
  - [ ] Grey = Weekend (#9e9e9e)
- [ ] Check cursor types:
  - [ ] Weekdays = pointer (👆)
  - [ ] Weekends = not-allowed (🚫)
- [ ] Check opacity:
  - [ ] Weekdays = 1.0 (fully opaque)
  - [ ] Weekends = 0.6 (semi-transparent)

**Result**: ☐ Pass ☐ Fail

---

## 🔍 Console Check

Open browser DevTools (F12) and check:
- [ ] No errors in Console tab
- [ ] No warnings related to Vue components
- [ ] Network tab shows no failed requests

**Result**: ☐ Pass ☐ Fail

---

## 📱 Responsive Testing

Test on different screen sizes:

### Desktop (1920x1080)
- [ ] Calendar displays correctly
- [ ] Cells are clickable
- [ ] Dialog is centered
- [ ] Snackbar appears at top

**Result**: ☐ Pass ☐ Fail

### Tablet (768x1024)
- [ ] Calendar scrolls horizontally
- [ ] Cells remain clickable
- [ ] Dialog is responsive

**Result**: ☐ Pass ☐ Fail

### Mobile (375x667)
- [ ] Calendar is usable
- [ ] Touch targets are adequate
- [ ] Dialog fills screen appropriately

**Result**: ☐ Pass ☐ Fail

---

## 🐛 Edge Cases

### Edge Case 1: Rapid Clicks
- [ ] Rapidly click multiple weekday cells
- [ ] **Expected**: Only one dialog opens at a time

**Result**: ☐ Pass ☐ Fail

### Edge Case 2: Weekend to Weekday
- [ ] Click weekend cell (shows warning)
- [ ] Immediately click weekday cell
- [ ] **Expected**: Dialog opens normally

**Result**: ☐ Pass ☐ Fail

### Edge Case 3: Today Cell
- [ ] Find today's date (blue border)
- [ ] Click if it's a weekday
- [ ] **Expected**: Dialog opens normally
- [ ] If today is weekend, warning should show

**Result**: ☐ Pass ☐ Fail

---

## 📊 Test Results Summary

```
Total Tests: 11
Passed: _____
Failed: _____
Skipped: _____

Pass Rate: _____%
```

---

## 🎯 Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth animations
- ✅ Clear user feedback
- ✅ Correct dialog behavior
- ✅ Proper weekend blocking
- ✅ Responsive design works

---

## 🆘 Troubleshooting

### Dialog not opening on weekday click?
- Check browser console for errors
- Verify employee store has data
- Check if `handleCellClick` is being called

### Warning not showing on weekend click?
- Check if snackbar component is rendered
- Verify `showWarningMessage` is reactive
- Check `isWeekendDay` logic

### Cursor not changing?
- Check CSS is loaded correctly
- Verify `.absence-cell.weekend` class applied
- Check browser cache (hard refresh: Ctrl+Shift+R)

### Hover effects not working?
- Check CSS hover rules
- Verify cell classes are correct
- Test in different browser

---

## 📝 Notes

- Tests should be performed in **Chrome/Edge** (primary browsers)
- Test in **Firefox** and **Safari** for compatibility
- Use **Incognito/Private** mode to avoid cache issues
- Take **screenshots** of any issues encountered

---

## ✨ Feature Highlights

What this feature does:
1. **Smart Selection**: Automatically selects employee when clicking their row
2. **Date Pre-fill**: Pre-fills the selected date in the dialog
3. **Weekend Protection**: Prevents accidental weekend absence creation
4. **Visual Feedback**: Clear cursor and hover indicators
5. **User Guidance**: Warning messages for blocked actions

---

**Testing Time**: ~10-15 minutes  
**Last Updated**: October 11, 2025  
**Status**: ✅ Ready for Testing
