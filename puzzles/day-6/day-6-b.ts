/**
 * 
 * --- Part Two ---

As the race is about to start, you realize the piece of paper with race times and record distances you got earlier actually just has very bad kerning. There's really only one race - ignore the spaces between the numbers on each line.

So, the example from before:

Time:      7  15   30
Distance:  9  40  200

...now instead means this:

Time:      71530
Distance:  940200

Now, you have to figure out how many ways there are to win this single race. In this example, the race lasts for 71530 milliseconds and the record distance you need to beat is 940200 millimeters. You could hold the button anywhere from 14 to 71516 milliseconds and beat the record, a total of 71503 ways!

How many ways can you beat the record in this one much longer race?

Your puzzle answer was 28360140.

Both parts of this puzzle are complete! They provide two gold stars: **

 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const REGEX_NUMBER = /\d+/g;

const TRACE = true;

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);
  let race = parseRace(data);

  let result = 1;
  let winRange = race.getWinningRange();
  let min = winRange[0];
  let max = winRange[1];
  if (min > 0 && max <= race.time && min < max) {
    result *= max - min + 1;
  }
  return result;
}

function parseRace(data: string[]): Race {
  let times = data[0].match(REGEX_NUMBER) as RegExpMatchArray;
  let records = data[1].match(REGEX_NUMBER) as RegExpMatchArray;
  let time = '';
  let record = '';
  times.map((partialTime, index) => {
    time += partialTime;
    record += records[index];
  });
  return new Race(+time, +record);
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

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}
