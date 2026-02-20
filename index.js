import inquirer from 'inquirer';
import chalk from 'chalk';
import { recordWorkout, listWorkouts, exitApp } from './workoutHandler.js';
import { validateNotEmpty } from './validators.js';

const MENU_ACTIONS = {
    '1': recordWorkout,
    'record workout': recordWorkout,
    '2': listWorkouts,
    'list workouts': listWorkouts,
    '3': exitApp,
    'exit': exitApp,
};

const mainMenu = async () => {
    while (true) {
        console.log(chalk.blue.bold('\n🏋️  Workout Tracker'));
        console.log('1. 📝  Record Workout\n2. 📋  List Workouts\n3. 🚪  Exit');

        const { choice } = await inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'Choose option:',
            validate: validateNotEmpty,
        }]);

        const key = choice.trim().toLowerCase();
        const action = MENU_ACTIONS[key];
        action
            ? await action()
            : console.log(chalk.red('❌  Invalid option. Please try again.'));
    }
};

mainMenu().catch(err => console.error(chalk.red('An error occurred:'), err));
