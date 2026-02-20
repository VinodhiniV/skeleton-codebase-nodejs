# GoFit Node.js

A command-line application for tracking workouts — distance-based (walking, cycling, running) and time-based (yoga, strength-training).

> For a full breakdown of all issues found and refactoring decisions made, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

---

## Project Structure

```
.
├── index.js             # Entry point — menu wiring and main loop
├── workoutHandler.js    # CLI handler — prompts, display, record/list/exit actions
├── validators.js        # Input validation — date, time, number, and empty-field rules
├── workout.js           # Workout class hierarchy: Workout, DistanceWorkout, TimeBasedWorkout
├── repository.js        # Data access layer — reads/writes workouts.json
├── constants.js         # Shared constants: workout types, categories, date/time formats
├── workouts.json        # Local data store (auto-created on first save)
├── PROJECT_OVERVIEW.md  # Full refactoring notes and issue log
└── package.json         # Project metadata and dependencies
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

---

## Installation

```bash
npm install
```

---

## Usage

```bash
node index.js
```

- **1 / Record Workout** — Select a workout type and enter details. Distance is only prompted for distance-based workouts.
- **2 / List Workouts** — Enter a Customer ID to view workout history.
- **3 / Exit** — Close the application.

---

## License

This project is licensed under the ISC License.
