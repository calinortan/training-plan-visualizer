# Training Plan Visualizer

A React application for visualizing and tracking running training plans. Upload your CSV training plan and track your daily progress with a beautiful, mobile-responsive interface.

## Features

- 📁 **CSV Upload**: Drag and drop or browse to upload your training plan CSV
- 💾 **Local Storage**: All data is automatically saved to your browser's local storage
- ✅ **Daily Tracking**: Mark individual days as completed with a simple click
- 📊 **Progress Visualization**: See overall progress and weekly completion rates
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile devices
- 🎨 **Beautiful UI**: Modern, clean interface with smooth animations
- 📈 **Statistics Overview**: Track total weeks, completed weeks, total days, and completed days

## CSV Format

Your CSV file should have the following columns:

```csv
Week,Phase,Start,End,Long Run (km),Key Workout,Weekly Mileage (km),Long Run Pace
1,Base,2025-07-08,2025-07-14,14,Easy intervals,37,5:10–5:30/km
2,Base,2025-07-15,2025-07-21,15,3x2k @ 4:20/km,39,5:10–5:30/km
```

### Required Columns:

- `Week`: Week number
- `Phase`: Training phase (Base, Specific, Taper, Race week, etc.)
- `Start`: Start date in YYYY-MM-DD format
- `End`: End date in YYYY-MM-DD format
- `Long Run (km)`: Distance of the long run in kilometers
- `Key Workout`: Description of the main workout for the week
- `Weekly Mileage (km)`: Total weekly distance in kilometers
- `Long Run Pace`: Target pace for the long run

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready application.

## Usage

1. **Upload Your Training Plan**:

   - Drag and drop your CSV file onto the upload area, or
   - Click the upload area to browse and select your file

2. **Track Your Progress**:

   - Click on any day to mark it as completed (green)
   - Click again to unmark it
   - Today's date is highlighted with a blue border and pulsing animation

3. **View Statistics**:

   - Overall progress bar shows completion percentage
   - Weekly cards show individual week progress
   - Overview cards display key metrics

4. **Data Persistence**:

   - All data is automatically saved to your browser's local storage
   - Your progress will be restored when you return to the app

5. **Clear Data**:
   - Use the "Clear All Data" button to reset everything
   - This will remove both the training plan and all completion data

## Features in Detail

### Visual Indicators

- **Completed Days**: Green background
- **Today**: Blue border with pulsing animation
- **Completed Weeks**: Green left border and gradient background
- **Phase Colors**: Different colors for different training phases

### Responsive Design

- **Desktop**: Full layout with all statistics visible
- **Tablet**: Adjusted grid layouts for medium screens
- **Mobile**: Single-column layouts and touch-friendly interactions

### Data Management

- **Automatic Saving**: Changes are saved immediately
- **Error Handling**: Graceful handling of invalid CSV files
- **Data Validation**: Checks for required columns and date formats

## Technologies Used

- **React 18**: Modern React with hooks
- **PapaParse**: CSV parsing library
- **date-fns**: Date manipulation and formatting
- **CSS3**: Modern styling with flexbox and grid
- **Local Storage**: Browser-based data persistence

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
