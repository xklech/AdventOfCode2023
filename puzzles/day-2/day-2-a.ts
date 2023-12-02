import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = true;

const RED = 12;
const GREEN = 13;
const BLUE = 14;

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  data.forEach(line => {
    let gameValid = true;
    let index = +line.substring(5, line.indexOf(":"));
    let sets = line.split(";");
    sets.forEach(set => {
      if (!isSetValid(set)) {
        gameValid = false;
      }
    });
    if (TRACE) console.log("Index: " + index);
    if (TRACE) console.log("Game valid: " + gameValid);
    if (gameValid) {
      sum += index;
    }
  });

  return sum;
}

function isSetValid(set: string) {
  let redPart = set.match(/\d+(?= red)/);
  if (redPart != null && +redPart[0] > RED) {
    return false;
  }
  let greenPart = set.match(/\d+(?= green)/);
  if (greenPart != null && +greenPart[0] > GREEN) {
    return false;
  }
  let bluePart = set.match(/\d+(?= blue)/);
  if (bluePart != null && +bluePart[0] > BLUE) {
    return false;
  }
  return true;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
