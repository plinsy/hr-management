# HR Management Application - Technical Assessment Checklist

## 🚀 Project Setup
- [ ] Vue.js with Nuxt framework configured
- [ ] Vuetify for UI components and design integrated
- [ ] TypeScript configuration set up
- [ ] Project structure organized with SFCs (Single File Components)
- [ ] Package.json with all required dependencies
- [ ] Project runs locally with `npm install` → `npm run dev`

## 📊 Core Table Requirements

### Table Structure
- [ ] X-axis displays: First name, Last name, Personnel number, Dates (full year)
- [ ] Y-axis displays: Employees (vertical list)
- [ ] Table renders all employee data correctly

### Cell Color System
- [ ] Red cells for employee absences
- [ ] Green cells for employee presence
- [ ] Grey cells for weekends (Saturdays and Sundays)
- [ ] Color coding is consistent and accurate

## ⚡ Performance & Virtual Scrolling
- [ ] Virtual scrolling implemented horizontally (dates)
- [ ] Virtual scrolling implemented vertically (employees)
- [ ] Large datasets handled efficiently
- [ ] Smooth scrolling performance maintained

## 🎯 Absence Management Dialog

### Dialog Functionality
- [ ] Clicking on any cell opens absence management dialog
- [ ] Dialog shows relevant employee and date information
- [ ] Create new absence functionality
- [ ] Edit existing absence functionality
- [ ] Absences can span multiple days
- [ ] Dialog closes and updates table appropriately

### Form Controls
- [ ] Date picker for absence start/end dates
- [ ] Employee information displayed
- [ ] Save/Cancel buttons functional
- [ ] Form validation implemented

## 🔄 Live Updates & State Management
- [ ] Changes immediately visible in calendar after saving
- [ ] State persists during session (no data loss)
- [ ] Vuex or Nuxt composition API state management implemented
- [ ] Data structured for future GraphQL backend integration

## 📱 Responsive Design & UI/UX
- [ ] Vuetify responsive layout system implemented
- [ ] Works well on different screen sizes
- [ ] Mobile-friendly interface
- [ ] Desktop optimization

### Bonus Features
- [ ] Tooltips implemented
- [ ] Hover effects on cells
- [ ] Current day highlighting
- [ ] Loading states
- [ ] Error handling
- [ ] Smooth animations/transitions

## 🏗️ Code Quality & Architecture

### Structure & Modularity
- [ ] Separate component for calendar table
- [ ] Separate component for absence dialog
- [ ] Separate data handling utilities
- [ ] Reusable and modular code structure
- [ ] Clean component separation

### Data Management
- [ ] Initial dataset (empty or randomly generated)
- [ ] Data structure ready for GraphQL integration
- [ ] Proper TypeScript interfaces/types
- [ ] State management following best practices

## 🧪 Testing & Quality
- [ ] Code is clean and maintainable
- [ ] TypeScript types properly defined
- [ ] No console errors
- [ ] Performance optimized
- [ ] Cross-browser compatibility

## 📦 Deliverables
- [ ] Zipped folder prepared
- [ ] GitHub repository created and accessible
- [ ] README with setup instructions
- [ ] All functionality working as specified

## 📧 Submission
- [ ] Email prepared for laura.cancino@notfaroff.com
- [ ] Zipped folder attached
- [ ] GitHub repository link included
- [ ] Clear instructions for running the project

---

## 🎯 Success Criteria Summary
- ✅ Functional employee absence calendar
- ✅ Virtual scrolling in both directions
- ✅ Interactive absence management
- ✅ Live updates and state persistence
- ✅ Responsive design with Vuetify
- ✅ Clean, modular TypeScript code
- ✅ Ready for GraphQL backend integration

---

*Last Updated: September 27, 2025*
