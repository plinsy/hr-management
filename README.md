# HR Management System

A modern, responsive HR management system built with **Vue.js 3**, **Nuxt 3**, and **Vuetify** for tracking employee absences with an intuitive year-view calendar interface featuring virtual scrolling for optimal performance.

![HR Management System](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js)
![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=flat&logo=nuxt.js)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=flat&logo=vuetify)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?style=flat&logo=pinia)

## 🚀 Features

### Core Functionality
- **📅 Year-View Calendar**: Full year calendar displaying all 365 days with employee absence tracking
- **👥 Employee Management**: Track multiple employees with personal details and absence history
- **📊 Virtual Scrolling**: High-performance rendering of large datasets (supports 1000+ employees)
- **🎯 Interactive Calendar**: Click any cell to create, edit, or view absence details
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Absence Management
- **➕ Create Absences**: Easy-to-use dialog for adding new absences
- **✏️ Edit Absences**: Modify existing absence records with full validation
- **🗑️ Delete Absences**: Remove absence records with confirmation dialog
- **📅 Multi-day Support**: Handle single-day and multi-day absence periods
- **🏷️ Absence Types**: Support for various absence types (sick, vacation, personal, etc.)

### Visual Indicators
- **🔴 Absent Days**: Red cells indicate employee absences
- **🟢 Present Days**: Green cells show regular working days
- **⚪ Weekends**: Gray cells for Saturday and Sunday
- **🔵 Today Highlight**: Special highlighting for the current date
- **💡 Tooltips**: Hover information with absence details

### Advanced Features
- **📈 Statistics Dashboard**: View absence analytics and trends
- **🔍 Quick Search**: Navigate to today's date instantly
- **📊 Real-time Updates**: Live calendar updates when absences are modified
- **💾 State Persistence**: Changes persist throughout the session
- **🚀 Performance Optimized**: Virtual scrolling and efficient rendering

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: Vue.js 3 with Composition API
- **Meta Framework**: Nuxt 3 for SSR/SSG capabilities
- **UI Framework**: Vuetify 3 for Material Design components
- **State Management**: Pinia for reactive state management
- **Type Safety**: TypeScript for robust development experience
- **Testing**: Vitest + Vue Test Utils for comprehensive testing
- **Build Tool**: Vite for fast development and optimized builds

### Project Structure
```
hr-management/
├── app/
│   └── app.vue                 # Main application layout
├── components/
│   ├── CalendarTable.vue       # Virtual scrolling calendar component
│   └── AbsenceDialog.vue       # Absence creation/editing modal
├── stores/
│   └── employees.ts            # Pinia store for employee data
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   ├── dateUtils.ts            # Date manipulation utilities
│   ├── dataGenerator.ts        # Sample data generation
│   └── virtualScrolling.ts     # Virtual scrolling helpers
├── tests/                      # Comprehensive test suite
├── nuxt.config.ts              # Nuxt configuration
└── package.json                # Dependencies and scripts
```

### Design Patterns & Best Practices
- **Single File Components (SFCs)**: Modular, maintainable component structure
- **Composition API**: Modern Vue.js reactivity and state management
- **GraphQL-Ready Architecture**: Data structures designed for future backend integration
- **SOLID Principles**: Clean, extensible, and maintainable code
- **Responsive Design**: Mobile-first approach with Vuetify's grid system
- **Performance Optimization**: Virtual scrolling and efficient data rendering
- **Type Safety**: Full TypeScript integration for better DX and fewer bugs
- **Comprehensive Testing**: Unit tests for all critical functionality

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm
- Modern web browser with ES6+ support

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
# Build the application
pnpm build

# Preview the build
pnpm preview

# Generate static files (if needed)
pnpm generate
```

## 🎮 Usage Guide

### Getting Started
1. **Launch the Application**: Open the development server and navigate to the calendar view
2. **Explore the Interface**: 
   - Year selector in the top bar
   - Employee list on the left
   - Scrollable calendar grid
   - Quick action buttons

### Managing Absences

#### Creating New Absences
1. Click on any **green cell** (working day) in the calendar
2. Select absence type from the dropdown
3. Set start and end dates
4. Add optional reason
5. Click "Create Absence"

#### Editing Existing Absences
1. Click on any **red cell** (absence day)
2. Modify the absence details in the dialog
3. Click "Save Changes"

#### Deleting Absences
1. Open an existing absence for editing
2. Click the "Delete" button
3. Confirm the deletion

### Navigation Features
- **Today Button**: Quickly scroll to the current date
- **Year Selector**: Switch between different years
- **Virtual Scrolling**: Smooth navigation through large datasets
- **Responsive Layout**: Optimized for all screen sizes

### Statistics & Analytics
- Click the **statistics button** to view absence analytics
- View total absences, averages per employee
- Breakdown by absence types
- Year-over-year comparisons

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test --coverage
```

### Test Coverage
The project includes comprehensive tests for:
- **Utility Functions**: Date manipulation, data generation, virtual scrolling
- **Store Logic**: Employee data management, absence CRUD operations
- **Components**: Dialog interactions, calendar rendering
- **Integration**: End-to-end workflows and user interactions

### Test Structure
```
tests/
├── components/          # Component unit tests
├── stores/              # Pinia store tests
├── utils/               # Utility function tests
└── integration/         # Integration tests (if applicable)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
# API Configuration (for future backend integration)
NUXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Development settings
NUXT_DEV_TOOLS=true
```

### Vuetify Theme Customization
Modify the theme in `nuxt.config.ts`:
```typescript
vuetify: {
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          // ... other colors
        }
      }
    }
  }
}
```

## 📊 Performance Considerations

### Virtual Scrolling Implementation
- **Horizontal Scrolling**: Renders only visible date columns (±30 buffer)
- **Vertical Scrolling**: Renders only visible employee rows (±5 buffer)
- **Memory Efficiency**: Handles 1000+ employees with minimal memory usage
- **Smooth Animations**: 60fps scrolling with hardware acceleration

### Data Management
- **Lazy Loading**: Data loaded on demand
- **State Persistence**: Efficient state updates without full re-renders
- **GraphQL Ready**: Structured for efficient API queries

### Bundle Optimization
- **Tree Shaking**: Only import used Vuetify components
- **Code Splitting**: Automatic route-based code splitting with Nuxt
- **Asset Optimization**: Optimized images and fonts

## 🔮 Future Enhancements

### Backend Integration
- **GraphQL API**: Ready-to-integrate data layer
- **Authentication**: User roles and permissions
- **Real-time Updates**: WebSocket support for live collaboration
- **Data Persistence**: Database integration

### Additional Features
- **Export Functionality**: PDF/Excel export of absence reports
- **Advanced Filtering**: Filter by employee, department, absence type
- **Approval Workflows**: Manager approval for absence requests
- **Email Notifications**: Automated absence notifications
- **Calendar Integration**: Sync with Google Calendar, Outlook

### Mobile App
- **Progressive Web App**: Offline-first mobile experience
- **Native Integration**: iOS/Android app development
- **Push Notifications**: Mobile absence reminders

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper tests
4. Run the test suite: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript**: Strict typing required
- **ESLint**: Follow the configured linting rules
- **Vue Style Guide**: Adhere to official Vue.js style guidelines
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update README and code comments

### Issue Reporting
- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include browser/environment information
- Add relevant screenshots or videos

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team**: For the excellent frontend framework
- **Nuxt Team**: For the powerful meta-framework
- **Vuetify Team**: For the comprehensive UI component library
- **Pinia Team**: For the intuitive state management solution

## 📞 Support

For support and questions:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](link-to-issues)
- 📖 Documentation: [Project Wiki](link-to-wiki)
- 💬 Discussions: [GitHub Discussions](link-to-discussions)

---

**Built with ❤️ using Vue.js, Nuxt, and Vuetify**

*This project demonstrates modern frontend development practices with a focus on performance, usability, and maintainability.*

# HR Management System 🏢

A modern, responsive employee absence management application built with Vue.js, Nuxt 3, and Vuetify. This application provides an intuitive calendar interface for tracking and managing employee absences with virtual scrolling for optimal performance.

## ✨ Features

### 🗓️ Calendar View
- **Full Year Display**: Complete calendar view showing all days of the year
- **Virtual Scrolling**: Efficient rendering of large datasets (both horizontal and vertical)
- **Color-Coded Cells**:
  - 🟢 **Green**: Employee present
  - 🔴 **Red**: Employee absent
  - 🔘 **Grey**: Weekends (non-working days)
  - 🔵 **Blue Border**: Today's date

### 👥 Employee Management
- Display employee information (First Name, Last Name, Personnel Number)
- Support for large numbers of employees with virtual scrolling
- Real-time statistics (total employees, total absences)

### 🏖️ Absence Management
- **Create Absences**: Add new employee absences
- **Edit Absences**: Modify existing absence records
- **Delete Absences**: Remove absence records with confirmation
- **Multi-day Support**: Absences can span multiple consecutive days
- **Absence Types**: Vacation, Sick Leave, Personal, Maternity, Paternity, Bereavement, Other
- **Validation**: Prevent overlapping absences and ensure data integrity

### 📱 Responsive Design
- Mobile-first approach with Vuetify's responsive layout system
- Optimized touch interactions for mobile devices
- Adaptive UI components for different screen sizes

### ⚡ Performance
- Virtual scrolling for handling thousands of employees and year-long data
- Efficient state management with Pinia
- Optimized rendering with Vue 3 Composition API

### 🎨 User Experience
- Intuitive click-to-edit interface
- Tooltips showing absence details on hover
- Visual indicators for current day
- Smooth animations and transitions
- Loading states and error handling

## 🛠️ Technology Stack

### Frontend Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Nuxt 3](https://nuxt.com/)** - Full-stack Vue framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI Framework
- **[Vuetify 3](https://vuetifyjs.com/)** - Material Design component library
- **[Material Design Icons](https://materialdesignicons.com/)** - Icon library

### State Management
- **[Pinia](https://pinia.vuejs.org/)** - Vue store library (GraphQL-ready structure)

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[Vue Test Utils](https://vue-test-utils.vuejs.org/)** - Vue component testing utilities
- **[Happy DOM](https://github.com/capricorn86/happy-dom)** - Lightweight DOM implementation

### Build Tools
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm generate     # Generate static site

# Testing
pnpm test         # Run unit tests
pnpm test:watch   # Run tests in watch mode

# Maintenance
pnpm postinstall  # Prepare Nuxt
```

## 📁 Project Structure

```
hr-management/
├── app/                          # Main application directory
│   ├── components/              # Vue components
│   │   ├── CalendarTable.vue    # Main calendar component with virtual scrolling
│   │   └── AbsenceDialog.vue    # Absence creation/editing dialog
│   ├── stores/                  # Pinia stores
│   │   └── employees.ts         # Employee and absence data management
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # Application type definitions
│   ├── utils/                   # Utility functions
│   │   ├── dateUtils.ts        # Date manipulation utilities
│   │   ├── dataGenerator.ts    # Sample data generation
│   │   └── virtualScrolling.ts # Virtual scrolling helpers
│   ├── tests/                   # Test files
│   │   ├── components/         # Component tests
│   │   ├── stores/            # Store tests
│   │   └── utils/             # Utility tests
│   └── app.vue                 # Root application component
├── public/                     # Static assets
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies and scripts
├── vitest.config.ts           # Vitest configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🏗️ Architecture & Design Patterns

### Component Architecture
- **Single File Components (SFCs)**: All components use Vue SFC structure
- **Composition API**: Modern Vue 3 patterns for better code organization
- **Props & Emits**: Clear component communication patterns
- **Reactive References**: Efficient state management within components

### State Management (GraphQL-Ready)
The application uses Pinia stores structured to easily integrate with GraphQL backends:

```typescript
// Current structure (ready for GraphQL)
interface Employee {
  id: string              // GraphQL ID
  firstName: string       // Scalar field
  lastName: string        // Scalar field
  personnelNumber: string // Scalar field
  absences: Absence[]     // Relationship field
}

// Future GraphQL query example
query GetEmployees {
  employees {
    id
    firstName
    lastName
    personnelNumber
    absences {
      id
      startDate
      endDate
      type
      reason
    }
  }
}
```

### Virtual Scrolling Implementation
- **Horizontal Scrolling**: Handles 365+ date columns efficiently
- **Vertical Scrolling**: Manages unlimited employee rows
- **Performance Optimization**: Only renders visible cells
- **Smooth Experience**: Maintains 60fps scrolling performance

### Responsive Design Strategy
- **Mobile-First**: Base styles target mobile devices
- **Progressive Enhancement**: Additional features for larger screens
- **Breakpoint System**: Vuetify's 12-column grid system
- **Touch-Friendly**: Optimized for mobile interactions

## 📊 Data Management

### Sample Data Generation
The application includes a robust data generation system for demonstration:

```typescript
// Generates realistic employee data
generateEmployeeData(50) // Creates 50 employees with random absences

// Configurable absence generation
- Random absence types (vacation, sick, personal, etc.)
- Realistic date ranges
- Varying absence frequencies per employee
- Proper data relationships
```

### Data Validation
- **Date Validation**: Ensures logical date ranges
- **Overlap Prevention**: Prevents conflicting absences
- **Type Safety**: Full TypeScript coverage
- **Form Validation**: Real-time user input validation

## 🧪 Testing Strategy

### Unit Tests
- **Store Testing**: Complete Pinia store functionality
- **Component Testing**: Vue component behavior
- **Utility Testing**: Pure function validation
- **Type Safety**: TypeScript integration tests

### Test Coverage
- **Stores**: CRUD operations, state management, error handling
- **Components**: User interactions, prop validation, event emissions
- **Utils**: Date calculations, data generation, virtual scrolling logic

### Running Tests
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode for development
pnpm test --coverage   # Generate coverage report
```

## 📈 Performance Optimizations

### Virtual Scrolling
- **Viewport-based Rendering**: Only visible cells are rendered
- **Efficient Memory Usage**: Constant memory footprint regardless of data size
- **Smooth Scrolling**: Throttled scroll events for optimal performance

### State Management
- **Computed Properties**: Cached calculations for derived data
- **Reactive Updates**: Minimal re-renders on state changes
- **Modular Stores**: Separated concerns for better performance

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Component Lazy Loading**: On-demand component loading
- **Asset Optimization**: Efficient asset bundling with Vite

## 🔮 Future Enhancements

### Backend Integration
- **GraphQL API**: Ready-to-connect data structure
- **Real-time Updates**: WebSocket support for live data
- **Authentication**: User role management
- **Data Persistence**: Database integration

### Advanced Features
- **Export Functionality**: PDF/Excel report generation
- **Advanced Filtering**: Search and filter capabilities
- **Calendar Integration**: Import/export to calendar applications
- **Notification System**: Absence approval workflows
- **Analytics Dashboard**: Absence trend analysis

### Performance Improvements
- **Progressive Web App**: Offline functionality
- **Service Worker**: Background sync capabilities
- **Caching Strategy**: Intelligent data caching
- **Lazy Loading**: Route-based code splitting

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow Vue.js style guide and TypeScript best practices
2. **Component Structure**: Use Composition API with `<script setup>`
3. **Testing**: Write tests for new features and bug fixes
4. **Type Safety**: Maintain full TypeScript coverage

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit pull request with detailed description

## 📝 License

This project is created for demonstration purposes as part of a technical assessment. It showcases modern Vue.js development practices and serves as a foundation for real-world HR management applications.

## 🙏 Acknowledgments

- **Vue.js Team** - For the excellent framework
- **Vuetify Team** - For the beautiful UI components
- **Nuxt Team** - For the powerful full-stack framework
- **Pinia Team** - For the intuitive state management solution

---

## 🚀 Quick Start Demo

After running `pnpm dev`, you'll see:

1. **📅 Calendar Interface**: Year-long employee absence calendar
2. **👥 50 Sample Employees**: Pre-generated realistic data
3. **🎯 Interactive Cells**: Click any cell to manage absences
4. **📱 Responsive Design**: Works on desktop and mobile
5. **⚡ Virtual Scrolling**: Smooth performance with large datasets

**Try clicking on any colored cell to create or edit an absence!**

The application demonstrates a production-ready approach to building complex data visualization interfaces with Vue.js, showcasing best practices in modern web development.
