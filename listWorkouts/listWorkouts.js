import inquirer from 'inquirer';
import chalk from 'chalk';
import { validateCustomerId, capitalize } from '../recordWorkout/utils.js';

const promptCustomerId = async () => {
  const { customerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customerId',
      message: 'Enter Customer ID:',
      validate: validateCustomerId
    }
  ]);

  return customerId.trim();
};

const formatWorkout = workout => {
  const lines = [];

  lines.push(
    chalk.cyan(
      `\nType: ${capitalize(workout.type)}`
    )
  );

  lines.push(`Date: ${workout.date}`);
  lines.push(`Time: ${workout.time}`);
  lines.push(`Duration: ${workout.duration} minutes`);

  if (workout.isDistanceBased && workout.distance !== null) {
    lines.push(`Distance: ${workout.distance} metres`);

    if (workout.duration > 0 && workout.averageSpeed !== null) {
      lines.push(
        chalk.gray(
          `Average Speed: ${workout.averageSpeed.toFixed(2)} metres/minute`
        )
      );
    }
  } else {
    lines.push(
      chalk.gray(`(Time-based workout - no distance tracked)`)
    );
  }

  // Display workout score
  lines.push(
    chalk.green.bold(`Score: ${workout.score.toFixed(2)}`)
  );

  return lines.join('\n');
};

export const listWorkouts = async (repo, Workout) => {
  const customerId = await promptCustomerId();

  const workoutData = await repo.fetch(customerId);

  if (!workoutData.length) {
    console.log(chalk.yellow('\nNo workouts found for this customer!'));
    return;
  }

  console.log(chalk.blue.bold('\n=== Your Workouts ==='));

  const workouts = workoutData.map(data => Workout.fromJSON(data));
  console.log(workouts)

  workouts.forEach(workout => {
    console.log(formatWorkout(workout));
  });
};