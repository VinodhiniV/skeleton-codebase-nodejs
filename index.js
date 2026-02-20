// import inquirer from 'inquirer';
// import chalk from 'chalk';
// import { parse, isValid } from 'date-fns';
// import { WorkoutRepository } from './repository.js';
// import { Workout } from './workout.js';


import express from 'express';
import workoutRoutes from './routes/workout-routes.js';

const app = express();

app.use(express.json());
app.use('/api', workoutRoutes);

app.listen(3003, () => {
  console.log('Server running on http://localhost:3003');
});

// const repo = new WorkoutRepository();

// /* ------------------------ Helpers ------------------------ */

// const required = (msg) => (input) => input?.trim() ? true : msg;
// const isPositiveNumber = (msg) => (input) => !isNaN(input) && Number(input) > 0 ? true : msg;

// const isValidDate = (format, msg) => (input) => {
//   const parsed = parse(input, format, new Date());
//   return isValid(parsed) ? true : msg;
// };

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// /* ------------------------ Menu ------------------------ */

// const mainMenu = async () => {
//   while (true) {
//     console.clear();
//     console.log(chalk.blue.bold('\n=== Workout Tracker ==='));

//     const { choice } = await inquirer.prompt([
//       {
//         type: 'list',
//         name: 'choice',
//         message: 'Choose option:',
//         choices: [
//           { name: 'Record Workout', value: 'record' },
//           { name: 'List Workouts', value: 'list' },
//           { name: 'Exit', value: 'exit' }
//         ]
//       }
//     ]);

//     console.log('DEBUG choice =', choice);

//     if (choice === 'record') await recordWorkout();
//     else if (choice === 'list') await listWorkouts();
//     else if (choice === 'exit') {
//             exitApp();
//     }
//   }
// };

// const exitApp = () => {
//   console.log(chalk.green('\nGoodbye! 👋'));
//   process.exit(0);
// };

// /* ------------------------ Features ------------------------ */

// const recordWorkout = async () => {
//   const answers = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'customerId',
//       message: 'Enter Customer ID:',
//       validate: required('Customer ID is required')
//     },
//     {
//       type: 'list',
//       name: 'type',
//       message: 'Select workout type:',
//       choices: ['walking', 'cycling', 'running', 'yoga', 'strength-training']
//     },
//     {
//       type: 'input',
//       name: 'date',
//       message: 'Enter date (YYYY-MM-DD):',
//       default: new Date().toISOString().split('T')[0],
//       validate: isValidDate('yyyy-MM-dd', 'Invalid date format! Use YYYY-MM-DD')
//     },
//     {
//       type: 'input',
//       name: 'time',
//       message: 'Enter time (HH:MM):',
//       validate: isValidDate('HH:mm', 'Invalid time format! Use HH:MM')
//     },
//     {
//       type: 'input',
//       name: 'duration',
//       message: 'Enter duration (minutes):',
//       validate: isPositiveNumber('Duration must be a positive number')
//     },
//     {
//       type: 'input',
//       name: 'distance',
//       message: 'Enter distance (metres):',
//       when: (a) => ['walking', 'cycling', 'running'].includes(a.type),
//       validate: isPositiveNumber('Distance must be a positive number')
//     }
//   ]);

//   const workout = new Workout(
//     answers.customerId,
//     answers.type,
//     answers.date,
//     answers.time,
//     Number(answers.duration),
//     answers.distance ? Number(answers.distance) : null
//   );

//   await repo.save(workout);
//   console.log(chalk.green('\n✅ Workout recorded successfully!'));
//   await pause();
// };

// /* ------------------------ UI Helpers ------------------------ */

// const listWorkouts = async () => {
//   const { customerId } = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'customerId',
//       message: 'Enter Customer ID:',
//       validate: required('Customer ID is required')
//     }
//   ]);

//   const workoutData = await repo.fetch(customerId);

//   if (!workoutData.length) {
//     console.log(chalk.yellow('\n⚠️ No workouts found for this customer!'));
//     return pause();
//   }

//   console.log(chalk.blue.bold('\n=== Your Workouts ==='));

//   workoutData.forEach(data => {
//     const w = Workout.fromJSON(data);

//     console.log(chalk.cyan(`\nType: ${capitalize(w.type)}`));
//     console.log(`Date: ${w.date}`);
//     console.log(`Time: ${w.time}`);
//     console.log(`Duration: ${w.duration} minutes`);

//     if (w.distance) {
//       console.log(`Distance: ${w.distance} metres`);
//       console.log(chalk.gray(`Average Speed: ${w.averageSpeed.toFixed(2)} metres/minute`));
//     } else {
//       console.log(chalk.gray('This is a time-based workout (no distance tracked)'));
//     }
//   });

//   await pause();
// };

// const pause = async () => {
//   await inquirer.prompt([{ type: 'input', name: 'pause', message: 'Press Enter to continue...' }]);
// };

// /* ------------------------ Start App ------------------------ */

// mainMenu().catch(err => {
//   console.error(chalk.red('An error occurred:'), err);
// });