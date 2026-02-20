import inquirer from 'inquirer';
import chalk from 'chalk';
import { WorkoutRepository } from './repository.js';
import { Workout } from './workout.js';
import { config } from './config.js';
import { recordWorkout } from './recordWorkout/recordWorkout.js';
import { listWorkouts } from './listWorkouts/listWorkouts.js';

const repo = new WorkoutRepository();

const mainMenu = async (repo, config, Workout) => {
  const menuOptions = [
    {
      key: '1',
      label: 'Record Workout',
      action: () => recordWorkout(repo, config, Workout)
    },
    {
      key: '2',
      label: 'List Workouts',
      action: () => listWorkouts(repo, Workout)
    },
    {
      key: '3',
      label: 'Exit',
      action: () => {
        console.log(chalk.green('Goodbye!'));
        process.exit(0);
      }
    }
  ];

  while (true) {
    console.log(chalk.blue.bold('\n=== Workout Tracker ==='));
    menuOptions.forEach(option =>
      console.log(`${option.key}. ${option.label}`)
    );

    const { choice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'choice',
        message: 'Choose option:',
        validate: input =>
          input.trim() !== '' ? true : 'Please enter an option'
      }
    ]);

    const normalizedChoice = choice.trim().toLowerCase();

    const selectedOption = menuOptions.find(
      option =>
        normalizedChoice === option.key ||
        normalizedChoice === option.label.toLowerCase()
    );

    if (selectedOption) {
      await selectedOption.action();
    } else {
      console.log(chalk.red('Invalid option. Please try again.'));
    }
  }
};

// const recordWorkout = async () => {
//     const questions = [
//         {
//             type: 'input',
//             name: 'customerId',
//             message: 'Enter Customer ID:',
//             validate: input => input.trim() !== '' ? true : 'Customer ID is required' // Need to add more validation on custID
//         },
//         {
//             type: 'list',
//             name: 'type',
//             message: 'Select workout type:',
//             choices: config.workoutChoices,
//             validate: input => {
//                 if (!input || input.trim() === '') {
//                     return 'Workout type is required';
//                 }
//                 const validTypes = config.validWorkoutTypes;
//                 if (!validTypes.includes(input.toLowerCase().trim())) {
//                     return `Invalid workout type. Must be one of: ${validTypes.join(', ')}`;
//                 }
//                 return true;
//             }
//         },
//         {
//             type: 'input',
//             name: 'date',
//             message: 'Enter date (YYYY-MM-DD):',
//             default: new Date().toISOString().split('T')[0],
//             validate: input => {
//                 const parsedDate = parse(input, 'yyyy-MM-dd', new Date());
//                 return isValid(parsedDate) ? true : 'Invalid date format! Use YYYY-MM-DD';
//             }
//         },
//         {
//             type: 'input',
//             name: 'time',
//             message: 'Enter time (HH:MM):',
//             validate: input => {
//                 const parsedTime = parse(input, 'HH:mm', new Date());
//                 return isValid(parsedTime) ? true : 'Invalid time format! Use HH:MM';
//             }
//         },
//         {
//             type: 'input',
//             name: 'duration',
//             message: 'Enter duration (minutes):',
//             validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Invalid duration!'
//         }
//     ];

//     const answers = await inquirer.prompt(questions);
    
//     let distance = null;
//     if (config.requiresDistance(answers.type)) {
//         const distanceAnswer = await inquirer.prompt([
//             {
//                 type: 'input',
//                 name: 'distance',
//                 message: 'Enter distance (metres):',
//                 validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Invalid distance!'
//             }
//         ]);
//         distance = parseInt(distanceAnswer.distance);
//     }

//     const workout = new Workout(
//         answers.customerId,
//         answers.type,
//         answers.date,
//         answers.time,
//         parseInt(answers.duration),
//         distance
//     );

//     await repo.save(workout);
//     console.log(chalk.green('\nWorkout recorded successfully!'));
// };

// const listWorkouts = async () => {
//     const { customerId } = await inquirer.prompt([
//         {
//             type: 'input',
//             name: 'customerId',
//             message: 'Enter Customer ID:',
//             validate: input => input.trim() !== '' ? true : 'Customer ID is required'
//         }
//     ]);

//     const workoutData = await repo.fetch(customerId);

//     if (workoutData.length === 0) {
//         console.log(chalk.yellow('\nNo workouts found for this customer!'));
//         return;
//     }

//     console.log(chalk.blue.bold('\n=== Your Workouts ==='));
//     workoutData.forEach(data => {
//         const w = Workout.fromJSON(data);
//         console.log(chalk.cyan(`\nType: ${w.type.charAt(0).toUpperCase() + w.type.slice(1)}`));
//         console.log(`Date: ${w.date}`);
//         console.log(`Time: ${w.time}`);
//         console.log(`Duration: ${w.duration} minutes`);
        
//         if (w.isDistanceBased && w.distance !== null) {
//             console.log(`Distance: ${w.distance} metres`);
//             if (w.duration > 0 && w.averageSpeed !== null) {
//                 console.log(chalk.gray(`Average Speed: ${w.averageSpeed.toFixed(2)} metres/minute`));
//             }
//         } else {
//             console.log(chalk.gray(`(Time-based workout - no distance tracked)`));
//         }
//     });
// };

mainMenu(repo, config, Workout).catch(err => {
    console.error(chalk.red('An error occurred:'), err);
});
