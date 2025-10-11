# HR Management Web App - Development Checklist

## Tech Stack Setup
- [x] Set up Vue.js with Nuxt framework
- [x] Install and configure Vuetify for UI components
- [x] Configure TypeScript for the project
- [x] Structure project using SFCs (Single File Components)
- [x] Set up data management compatible with future GraphQL backend

## Core Table Implementation
- [x] Create employee absence table component
- [ ] Implement X-axis: First name, Last name, Personnel number, Dates (full year)
- [x] Implement Y-axis: Employees list
- [ ] Add virtual scrolling (horizontal & vertical)

## Cell Color System
- [x] Red cells for employee absences
- [x] Green cells for employee presence
- [x] Grey cells for weekends (Saturdays/Sundays)

## Absence Management Dialog
- [x] Create dialog component that opens on cell click
- [x] Implement create new absence functionality
- [x] Implement edit existing absence functionality
- [x] Support multi-day absence spans

## Live Updates & Data Persistence
- [x] Implement immediate visual updates after absence changes
- [x] Persist changes in Vue state
- [x] Structure data for future GraphQL compatibility
- [x] Use initial empty or random dataset

## State Management
- [x] Set up Vuex or Nuxt composition API for state management
- [x] Implement data store for employee absence data
- [x] Handle state updates for absence modifications

## Responsive Design & Performance
- [x] Apply Vuetify's responsive layout system
- [ ] Optimize performance for large datasets (full year + multiple employees)
- [ ] Test on different screen sizes

## Code Structure & Modularity
- [ ] Create separate components for table, dialog, and data handling
- [ ] Ensure modular and reusable code structure
- [ ] Follow best practices for component organization

## Bonus Features
- [x] Add tooltips for better UX
- [x] Implement hover effects
- [x] Highlight current day
- [ ] Additional UI/UX improvements

## Final Deliverables
- [ ] Ensure project runs locally (`npm install` → `npm run dev`)
- [ ] Test all functionality thoroughly
- [ ] Prepare zipped folder for submission
- [ ] Create GitHub repository
- [ ] Submit to laura.cancino@notfaroff.com

## Testing & Quality Assurance
- [ ] Test virtual scrolling performance
- [ ] Verify absence creation/editing workflows
- [ ] Test responsive design on various devices
- [ ] Validate data persistence across updates
