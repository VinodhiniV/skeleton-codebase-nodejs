import inquirer from 'inquirer';
import chalk from 'chalk';
import { parse, isValid } from 'date-fns';
import { WorkoutRepository } from './repository.js';
import { Workout } from './workout.js';

const repo = new WorkoutRepository();

const mainMenu = async () => {
    console.log(chalk.blue.bold('\n=== Workout Tracker ==='));
    console.log('1. Record Workout');
    console.log('2. List Workouts');
    console.log('3. Exit');

    const { choice } = await inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'Choose option:',
            validate: input => input.trim() !== '' ? true : 'Please enter an option'
        }
    ]);

    const normalizedChoice = choice.trim().toLowerCase();

    if (normalizedChoice === '1' || normalizedChoice === 'record workout') {
        await recordWorkout();
    } else if (normalizedChoice === '2' || normalizedChoice === 'list workouts') {
        await listWorkouts();
    } else if (normalizedChoice === '3' || normalizedChoice === 'exit') {
        console.log(chalk.green('Goodbye!'));
        process.exit(0);
    } else {
        console.log(chalk.red('Invalid option. Please try again.'));
    }

    await mainMenu();
};

const recordWorkout = async () => {
    const questions = [
        {
            type: 'input',
            name: 'customerId',
            message: 'Enter Customer ID:',
            validate: input => input.trim() !== '' ? true : 'Customer ID is required'
        },
        {
            type: 'list',
            name: 'type',
            message: 'Enter workout type:walking, cycling, running',
            choices: ['walking', 'cycling', 'running']
        },
        {
            type: 'input',
            name: 'date',
            message: 'Enter date (YYYY-MM-DD):',
            default: new Date().toISOString().split('T')[0],
            validate: input => {
                const parsedDate = parse(input, 'yyyy-MM-dd', new Date());
                return isValid(parsedDate) ? true : 'Invalid date format! Use YYYY-MM-DD';
            }
        },
        {
            type: 'input',
            name: 'time',
            message: 'Enter time (HH:MM):',
            validate: input => {
                const parsedTime = parse(input, 'HH:mm', new Date());
                return isValid(parsedTime) ? true : 'Invalid time format! Use HH:MM';
            }
        },
        {
            type: 'input',
            name: 'duration',
            message: 'Enter duration (minutes):',
            validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Invalid duration!'
        },
        {
            type: 'input',
            name: 'distance',
            message: 'Enter distance (metres):',
            validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Invalid distance!'
        }
    ];

    const answers = await inquirer.prompt(questions);
    const workout = new Workout(
        answers.customerId,
        answers.type,
        answers.date,
        answers.time,
        parseInt(answers.duration),
        parseInt(answers.distance)
    );

    await repo.save(workout);
    console.log(chalk.green('\nWorkout recorded successfully!'));
};

const listWorkouts = async () => {
    const { customerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'customerId',
            message: 'Enter Customer ID:',
            validate: input => input.trim() !== '' ? true : 'Customer ID is required'
        }
    ]);

    const workoutData = await repo.fetch(customerId);

    if (workoutData.length === 0) {
        console.log(chalk.yellow('\nNo workouts found for this customer!'));
        return;
    }

    console.log(chalk.blue.bold('\n=== Your Workouts ==='));
    workoutData.forEach(data => {
        const w = Workout.fromJSON(data);
        console.log(chalk.cyan(`\nType: ${w.type.charAt(0).toUpperCase() + w.type.slice(1)}`));
        console.log(`Date: ${w.date}`);
        console.log(`Time: ${w.time}`);
        console.log(`Duration: ${w.duration} minutes`);
        console.log(`Distance: ${w.distance} metres`);
        if (w.duration > 0) {
            console.log(chalk.gray(`Average Speed: ${w.averageSpeed.toFixed(2)} metres/minute`));
        }
    });
};

mainMenu().catch(err => {
    console.error(chalk.red('An error occurred:'), err);
});
