# Mobile Horizontal Scroll Feature

## Overview
Added horizontal scrolling capability for date columns on mobile devices in both Year View and Month View of the calendar.

## Changes Made

### 1. CSS Modifications

#### Date Headers Container
- **Before**: `overflow: hidden` - prevented horizontal scrolling
- **After**: `overflow-x: auto; overflow-y: hidden` - allows horizontal scrolling
- Added scrollbar hiding for cleaner UI while maintaining functionality

#### Calendar Body
- Added mobile-specific override: `overflow-x: auto !important` for screens ≤768px
- Prevents horizontal scroll on desktop (≥769px) for Month View to maintain clean layout
- Year View allows horizontal scroll on mobile

#### Year View Content
- Changed from `overflow-x: hidden` to `overflow-x: auto` on mobile
- Desktop (≥769px) maintains `overflow-x: hidden`

#### Mobile Responsive Improvements (≤600px)
- Added minimum widths for date cells: `min-width: 40px`
- Added minimum widths for year view month cells: `min-width: 60px`
- Ensures content doesn't become too narrow on small screens
- Allows content overflow with proper scrolling

### 2. JavaScript Scroll Syncing

#### Two-Way Scroll Synchronization
Added bidirectional scroll syncing between date headers and calendar body:

1. **Calendar Body → Date Headers**
   - When user scrolls the calendar body horizontally
   - Date headers scroll in sync
   - Maintains alignment of dates with absence cells

2. **Date Headers → Calendar Body**
   - When user scrolls the date headers horizontally
   - Calendar body scrolls in sync
   - Provides additional scroll interaction point

#### Implementation Details
- Added `dateHeaderScrollHandler` ref to store the event handler
- Modified main scroll handler to sync `scrollLeft` to date headers
- Added dedicated date header scroll handler to sync back to body
- Proper cleanup in `onUnmounted` to prevent memory leaks

### 3. Responsive Breakpoints

```css
/* Desktop - No horizontal scroll in month view */
@media (min-width: 769px) {
  .calendar-container[data-view-type="monthView"] .calendar-body {
    overflow-x: hidden !important;
  }
  .year-view-content {
    overflow-x: hidden;
  }
}

/* Mobile - Enable horizontal scroll */
@media (max-width: 768px) {
  .calendar-body {
    overflow-x: auto !important;
  }
}

/* Small mobile - Minimum cell sizes */
@media (max-width: 600px) {
  .date-header-cell, .absence-cell {
    min-width: 40px !important;
  }
  .year-month-header, .year-month-cell {
    min-width: 60px !important;
  }
}
```

## User Experience

### Before
- Date columns were compressed on mobile
- No way to see all dates on small screens
- Content was cut off or illegible

### After
- Smooth horizontal scrolling on mobile
- Date headers and body scroll together
- Minimum cell sizes prevent content from becoming too small
- Desktop experience unchanged (no horizontal scroll when not needed)
- Year View and Month View both support horizontal scrolling

## Testing Recommendations

1. **Mobile Devices (≤600px)**
   - Test horizontal scroll in Month View
   - Test horizontal scroll in Year View
   - Verify date headers sync with body scroll
   - Check that cells maintain minimum width

2. **Tablet Devices (600-768px)**
   - Verify horizontal scrolling works
   - Check layout adjustments

3. **Desktop (≥769px)**
   - Ensure no horizontal scroll appears unnecessarily
   - Month View should fit without horizontal scroll
   - Year View should hide horizontal scroll if content fits

4. **Scroll Sync Testing**
   - Scroll the calendar body and verify date headers move
   - Scroll the date headers and verify calendar body moves
   - Test on both touch and mouse devices

## Browser Compatibility

- Scrollbar hiding uses standard CSS properties
- Scroll syncing uses standard DOM events
- Passive event listeners for better performance
- Compatible with all modern browsers

## Performance Considerations

- Passive scroll listeners prevent blocking
- Direct DOM manipulation for scroll syncing (no Vue reactivity overhead)
- Proper cleanup prevents memory leaks
- Minimal repaints/reflows due to transform-based animations
