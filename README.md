# GoFit Node.js Replica

A modern command-line application for tracking walking, cycling, and running workouts, replicated from the original [GoFit](https://github.com/sajjadnazrulla/gofit) Go project.

## Features

- **Interactive CLI**: Powered by `inquirer.js` for a seamless user experience.
- **Record Workouts**: Capture workout type (walking, cycling, running), date, time, duration, and distance.
- **Data Validation**: Built-in validation for dates (YYYY-MM-DD), time (HH:MM), and numeric fields.
- **Local Persistence**: Workouts are saved locally in a `workouts.json` file.
- **Instant Feedback**: Automatically calculates and displays average speed (metres/minute) for each workout.
- **Searchable**: List and view all workouts for a specific Customer ID.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone the repository or copy the project files.
2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

Start the application by running:

```bash
node index.js
```

### Main Menu
- **Record Workout**: Follow the prompts to enter your workout details.
- **List Workouts**: Enter a Customer ID to view their workout history and statistics.
- **Exit**: Close the application.

## Project Structure

- `index.js`: Main entry point containing the CLI logic and user prompts.
- `repository.js`: Data access layer handling read/write operations for `workouts.json`.
- `workout.js`: Workout data model and logic for speed calculations.
- `package.json`: Project metadata and dependencies (`inquirer`, `chalk`, `date-fns`).

## License

This project is licensed under the ISC License.
