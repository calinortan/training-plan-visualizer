# Training Plan Visualizer

A React + TypeScript application for visualizing and tracking running training plans. Upload your CSV training plan and track your weekly progress with a beautiful, mobile-responsive interface.

## Features

- 📁 **CSV Upload**: Drag and drop or browse to upload your training plan CSV
- 💾 **Local Storage**: All data is automatically saved to your browser's local storage
- ✅ **Weekly Tracking**: Mark key workouts, long runs, and enter your actual weekly mileage
- 📊 **Progress Visualization**: See overall progress and weekly completion rates
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile devices
- 🎨 **Beautiful UI**: Modern, clean interface with smooth animations
- 📈 **Statistics Overview**: Track total weeks, completed weeks, target mileage, and completed mileage
- 🚀 **Easy GitHub Pages Deployment**: One-command deploy to your own public site

## CSV Format

Your CSV file should have the following columns:

```csv
Week,Phase,Start,Long Run (km),Key Workout,Weekly Mileage (km),Long Run Pace
1,Base,2025-07-14,14,Easy intervals,37,5:10–5:30/km
2,Base,2025-07-21,15,3x2k @ 4:20/km,39,5:10–5:30/km
```

### Required Columns:

- `Week`: Week number
- `Phase`: Training phase (Base, Specific, Taper, Race week, etc.)
- `Start`: Start date in YYYY-MM-DD format (should be a Monday for best results)
- `Long Run (km)`: Distance of the long run in kilometers
- `Key Workout`: Description of the main workout for the week
- `Weekly Mileage (km)`: Total weekly distance in kilometers
- `Long Run Pace`: Target pace for the long run

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
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
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with the production-ready application. **Note:** `dist/` is gitignored and should not be committed to your repository.

## Deployment to GitHub Pages

This project is pre-configured for easy deployment to GitHub Pages using the `gh-pages` package and Vite's static site output.

### Steps:

1. **Push your code to GitHub** (main branch)
2. **Deploy:**

   ```bash
   npm run deploy
   ```

   This will build your app and publish the `dist/` folder to the `gh-pages` branch.

3. **Visit your site:**
   [https://calinortan.github.io/training-plan-visualizer/](https://calinortan.github.io/training-plan-visualizer/)

#### Notes:

- The `dist/` folder is **not** tracked by git (see `.gitignore`).
- The deployment process pushes the build output to the `gh-pages` branch, not your main branch.
- You can redeploy at any time by running `npm run deploy` again.
- If you change your repo name or GitHub username, update the `homepage` field in `package.json` and the `base` in `vite.config.js`.

## Usage

1. **Upload Your Training Plan**:

   - Drag and drop your CSV file onto the upload area, or
   - Click the upload area to browse and select your file

2. **Track Your Progress**:

   - Mark key workouts and long runs as completed
   - Enter your actual weekly mileage; the tile is marked as completed when you meet or exceed the target
   - Today's date is highlighted with a blue border and pulsing animation

3. **View Statistics**:

   - See total/target mileage, completed mileage, and progress bars
   - Overview cards display key metrics

4. **Data Persistence**:

   - All data is automatically saved to your browser's local storage
   - Your progress will be restored when you return to the app

5. **Clear Data**:
   - Use the "Clear All Data" button to reset everything
   - This will remove both the training plan and all completion data

## Generating a Training Plan CSV with AI

You can use an LLM (like ChatGPT or Gemini) to generate a compatible training plan CSV. Here’s a recommended prompt:

```
Generate a 14-week running training plan as a CSV for a half marathon. Each week should have the following columns:
- Week (number)
- Phase (Base, Specific, Taper, Race week, etc.)
- Start (YYYY-MM-DD, Mondays only)
- Long Run (km)
- Key Workout (short description)
- Weekly Mileage (km)
- Long Run Pace (e.g., 5:10–5:30/km)

The plan should gradually increase mileage, include a variety of workouts, and have a taper and race week. Output only the CSV, no extra text.
```

Paste the generated CSV into a file and upload it to the app!

## Technologies Used

- **React 18 + TypeScript**: Modern React with type safety
- **Vite**: Fast build tool and dev server
- **PapaParse**: CSV parsing library
- **date-fns**: Date manipulation and formatting
- **CSS3**: Modern styling with flexbox and grid
- **Local Storage**: Browser-based data persistence
- **gh-pages**: Easy deployment to GitHub Pages

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
