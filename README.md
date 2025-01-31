# Rate Availability Calendar

## Project Overview

This project implements a high-performance rate availability calendar system designed to handle large datasets efficiently. The application showcases real-time room availability across extended time periods while maintaining smooth user interactions and optimal performance.

### Key Implementation Highlights

#### Performance Optimization
- **TanStack Virtualization Integration**: 
  - Implemented to efficiently render large datasets of room availability data
  - Only renders visible elements in the viewport, significantly reducing DOM nodes
  - Handles horizontal and vertical virtualization for the calendar and room availability tables
  - Results in improved memory usage and smoother scrolling performance

#### State Management & URL Integration
- **URL-based State Persistence**:
  - Implemented dynamic URL updates to reflect the current view state
  - Enables direct sharing of specific calendar views via URL
  - Maintains state consistency across page refreshes and sharing

#### Server-Side Optimization
- **Next.js Server Components**:
  - Leveraged for optimal data fetching and initial page load
  - Reduces client-side JavaScript bundle size
  - Improves SEO through server-side rendering
  - Better performance metrics (FCP, LCP, TTI)

#### Architecture & Best Practices
- **Clean Code & Modularity**:
  - Implemented component-based architecture for better maintainability
  - Followed best practices in writing clean code
  - Created reusable hooks for common functionality
  - Maintained consistent coding standards across the project

- **Code Organization**:
  - Structured project with clear separation of concerns
  - Organized components by feature and responsibility
  - Implemented shared utilities for common operations
  - Created type definitions for better code reliability

### Technical Challenges & Solutions

#### Synchronized Scrolling Implementation
- **Initial Challenge**:
  - Real-time synchronization between calendar and room tables needed to be optimized
  - Required smooth and instant updates without performance impact
  - Needed to handle high-frequency scroll events efficiently

- **Solution Implemented**:
  - Implemented optimized scroll event handling
  - Achieved instant and smooth synchronization between components
  - Maintains consistent visual updates without performance degradation
  - Provides seamless user experience with real-time feedback

- **Technical Implementation**:
  - Efficient scroll event handling mechanism
  - Optimized component position updates
  - Introduced react compiler to improve performance through better memorization out of the box and avoid unnecessary re-renders.
  - Used TanStack Virtualization for efficient rendering of large datasets.
  - Used Intersection Observer for lazy loading of data.
  - Used useLayoutEffect for smooth animations.
  - Used useEffect for handling scroll events.
  - Used useRef for handling scroll position.
  - Used overscan to handle the extra items to be rendered to achieve instant scroll updates.

#### Future Optimization Opportunities
- Optimize for millions of data points

## Technical Choices

### Package Manager: Yarn
- Faster installation and better dependency resolution than npm
- More reliable package locking and consistent installations across environments

### Styling: Tailwind CSS + Shadcn/ui
- Tailwind CSS provides utility-first approach, reducing bundle size and improving development speed
- Shadcn/ui offers accessible, customizable components that integrate seamlessly with Tailwind
- Better performance and smaller bundle size compared to MUI's full framework approach

### Virtualization: TanStack Virtual
- More flexible and modern API compared to react-window
- Better for large data sets and performance for complex use cases
- Built-in support for horizontal virtualization needed for calendar implementation

## Features

- Interactive calendar view for rate availability
- Scrollable room table with time slots
- Date range selection
- Responsive design that works on both desktop, tabs and mobile devices
- Dark/Light mode toggle
- Modern UI components using Shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Date Handling**: date-fns


## Key Components

- **ScrollableCalendar**: Main component that handles the calendar view and scrolling functionality
- **RoomCalendarContainer**: Manages the room booking display and interactions
- **DatePickerWithRange**: Allows users to select date ranges for viewing bookings
- **ModeToggle**: Implements dark/light mode switching

## Features Implementation

### Calendar View
- Implements a scrollable calendar interface
- Shows room availability across different time slots
- Supports horizontal scrolling for date navigation

### Room Management
- Displays rooms in a scrollable table format
- Shows booking status for each room
- Supports time slot visualization

### User Interface
- Responsive design that adapts to different screen sizes
- Dark/Light mode support for better user experience
- Clean and intuitive interface


## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mashuk-tamim/rate-availability-calendar2.0.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
