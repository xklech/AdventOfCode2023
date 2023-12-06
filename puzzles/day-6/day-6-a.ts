import { readData } from '../../shared.ts';
import chalk from 'chalk';

const REGEX_NUMBER = /\d+/g;

const TRACE = true;

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);
  let races = parseRaces(data);

  let result = 1;
  races.forEach((race) => {
    let winRange = race.getWinningRange();
    let min = winRange[0];
    let max = winRange[1];
    if (min > 0 && max <= race.time && min < max) {
      result *= max - min + 1;
    }
  });
  return result;
}

function parseRaces(data: string[]): Race[] {
  let races: Race[] = [];
  let times = data[0].match(REGEX_NUMBER) as RegExpMatchArray;
  let records = data[1].match(REGEX_NUMBER) as RegExpMatchArray;
  times.map((time, index) => {
    races.push(new Race(+time, +records[index]));
  });
  return races;
}

class Race {
  time: number;
  record: number;
  options: Map<number, number> = new Map();

  constructor(time: number, record: number) {
    this.time = time;
    this.record = record;
  }

  public getWinningRange(): [number, number] {
    log(`Compute winning range for Race: ${this}`);
    log(`b**2: ${this.time ** 2}`);
    log(`4ac: ${4 * -1 * -1 * this.record}`);
    log(`sqrt: ${this.time ** 2 - 4 * -1 * -1 * this.record}`);

    log(
      `raw result min: ${
        (-1 * this.time +
          Math.sqrt(this.time ** 2 - 4 * -1 * -1 * this.record)) /
        -2
      }`
    );
    log(
      `raw result max: ${
        (-1 * this.time -
          Math.sqrt(this.time ** 2 - 4 * -1 * -1 * this.record)) /
        -2
      }`
    );
    let min: number =
      (-1 * this.time + Math.sqrt(this.time ** 2 - 4 * -1 * -1 * this.record)) /
      -2;
    let max: number =
      (-1 * this.time - Math.sqrt(this.time ** 2 - 4 * -1 * -1 * this.record)) /
      -2;
    min = Number.isInteger(min) ? min + 1 : Math.ceil(min);
    max = Number.isInteger(max) ? max - 1 : Math.floor(max);
    log(`Min: ${min}, Max: ${max}`);
    return [min, max];
  }

  public toString(): string {
    return `Race - Time: ${this.time}, Record: ${this.record}\n`;
  }
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}
