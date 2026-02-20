import inquirer from 'inquirer';
import chalk from 'chalk';
import { WorkoutRepository } from './repository.js';
import { Workout, DistanceWorkout, TimeBasedWorkout } from './workout.js';
import { DISTANCE_BASED_TYPES, TIME_BASED_TYPES, WORKOUT_CATEGORY, DATE_FORMAT, TIME_FORMAT } from './constants.js';
import { validateDate, validateTime, validatePositiveNumber, validateNotEmpty } from './validators.js';

const repo = new WorkoutRepository();

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const WORKOUT_TYPE_EMOJI = Object.freeze({
    walking:             '🚶',
    running:             '🏃',
    cycling:             '🚴',
    yoga:                '🧘',
    'strength-training': '💪',
});

const QUESTIONS = {
    customerId: { type: 'input',  name: 'customerId', message: 'Enter Customer ID:',                          validate: validateNotEmpty },
    type:       { type: 'list',   name: 'type',       message: 'Select workout type:',                        choices: [...DISTANCE_BASED_TYPES, ...TIME_BASED_TYPES] },
    date:       { type: 'input',  name: 'date',       message: `Enter date (${DATE_FORMAT.toUpperCase()}):`,  default: new Date().toISOString().split('T')[0], validate: validateDate },
    time:       { type: 'input',  name: 'time',       message: `Enter time (${TIME_FORMAT.toUpperCase()}):`,  validate: validateTime },
    duration:   { type: 'input',  name: 'duration',   message: 'Enter duration (minutes):',                   validate: validatePositiveNumber },
    distance:   { type: 'input',  name: 'distance',   message: 'Enter distance (metres):',                    validate: validatePositiveNumber },
    pressEnter: { type: 'input',  name: '_',          message: chalk.gray('Press Enter to return to menu...') },
};

const printWorkout = (w) => {
    const emoji = WORKOUT_TYPE_EMOJI[w.type] ?? '🏋️';
    console.log(chalk.cyan(`\n${emoji}  Type: ${capitalize(w.type)}`));
    console.log(`📅  Date: ${w.date}  |  🕐  Time: ${w.time}  |  ⏱️  Duration: ${w.duration} min`);
    if (w.category === WORKOUT_CATEGORY.DISTANCE) {
        console.log(`📏  Distance: ${w.distance} metres`);
        if (w.duration > 0) console.log(chalk.gray(`⚡  Avg Speed: ${w.averageSpeed.toFixed(2)} metres/minute`));
    }
    console.log(chalk.yellow(`⭐  Score: ${w.score.toFixed(2)}`));
};

export const recordWorkout = async () => {
    const { customerId, type, date, time, duration } = await inquirer.prompt([
        QUESTIONS.customerId,
        QUESTIONS.type,
        QUESTIONS.date,
        QUESTIONS.time,
        QUESTIONS.duration,
    ]);

    let workout;
    if (DISTANCE_BASED_TYPES.includes(type)) {
        const { distance } = await inquirer.prompt([QUESTIONS.distance]);
        workout = new DistanceWorkout(customerId, type, date, time, parseInt(duration, 10), parseInt(distance, 10));
    } else {
        workout = new TimeBasedWorkout(customerId, type, date, time, parseInt(duration, 10));
    }

    await repo.save(workout);
    console.log(chalk.green('\n✅  Workout recorded successfully!'));
};

export const listWorkouts = async () => {
    const { customerId } = await inquirer.prompt([QUESTIONS.customerId]);
    const workouts = await repo.fetch(customerId);

    if (workouts.length === 0) {
        console.log(chalk.yellow('\n📭  No workouts found for this customer!'));
        return;
    }

    console.log(chalk.blue.bold('\n💪  Your Workouts'));
    workouts.forEach(data => printWorkout(Workout.fromJSON(data)));

    await inquirer.prompt([QUESTIONS.pressEnter]);
};

export const exitApp = () => {
    console.log(chalk.green('👋  Goodbye!'));
    process.exit(0);
};
