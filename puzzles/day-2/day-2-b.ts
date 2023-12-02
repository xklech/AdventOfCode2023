import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = false;

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);
  let sum = 0;
  data.forEach(line => {
    let minQubes = new Set();
    let sets = line.split(";");
    sets.forEach(setStr => {
      let set = extractSet(setStr);
      minQubes.red = minQubes.red < set.red ? set.red : minQubes.red;
      minQubes.green = minQubes.green < set.green ? set.green : minQubes.green;
      minQubes.blue = minQubes.blue < set.blue ? set.blue : minQubes.blue;
    });
    sum += minQubes.power();
    if (TRACE) console.log("Min qubes: " + minQubes.power());
    if (TRACE) console.log("Power: " + minQubes);
  });

  return sum;
}

function extractSet(setStr: string): Set {
  let set = new Set();
  let redPart = setStr.match(/\d+(?= red)/);
  if (redPart != null) {
    set.red = +redPart[0];
  }
  let greenPart = setStr.match(/\d+(?= green)/);
  if (greenPart != null) {
    set.green = +greenPart[0];
  }
  let bluePart = setStr.match(/\d+(?= blue)/);
  if (bluePart != null) {
    set.blue = +bluePart[0];
  }
  return set;
}

class Set {
  red: number = 0;
  green: number = 0;
  blue: number = 0;

  public power(): number {
    return this.red * this.green * this.blue;
  }

  public toString():string {
    return `Red ${this.red}, Green ${this.green}, Blue ${this.blue}`;
  }
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
