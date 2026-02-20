import inquirer from 'inquirer';
import chalk from 'chalk';
import { validateCustomerId, validateWorkoutType, validateDate, validateTime, validatePositiveNumber } from './utils.js';

const promptBasicWorkoutInfo = async (config) => {
  const questions = [
    {
      type: 'input',
      name: 'customerId',
      message: 'Enter Customer ID:',
      validate: validateCustomerId
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select workout type:',
      choices: config.workoutChoices,
      validate: input => validateWorkoutType(input, config.validWorkoutTypes)
    },
    {
      type: 'input',
      name: 'date',
      message: 'Enter date (YYYY-MM-DD):',
      default: new Date().toISOString().split('T')[0],
      validate: validateDate
    },
    {
      type: 'input',
      name: 'time',
      message: 'Enter time (HH:MM):',
      validate: validateTime
    },
    {
      type: 'input',
      name: 'duration',
      message: 'Enter duration (minutes):',
      validate: validatePositiveNumber
    }
  ];

  return inquirer.prompt(questions);
};

const promptDistanceIfRequired = async (type, config) => {
  if (!config.requiresDistance(type)) return null;

  const { distance } = await inquirer.prompt([
    {
      type: 'input',
      name: 'distance',
      message: 'Enter distance (metres):',
      validate: validatePositiveNumber
    }
  ]);

  return parseInt(distance);
};

export const recordWorkout = async (repo, config, Workout) => {
  const answers = await promptBasicWorkoutInfo(config);
  const distance = await promptDistanceIfRequired(answers.type, config);

  const workout = new Workout(
    answers.customerId,
    answers.type,
    answers.date,
    answers.time,
    parseInt(answers.duration),
    distance
  );

  await repo.save(workout);
  console.log(chalk.green('\nWorkout recorded successfully!'));
};