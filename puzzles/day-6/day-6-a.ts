/**
 * 
 * --- Day 6: Wait For It ---

The ferry quickly brings you across Island Island. After asking around, you discover that there is indeed normally a large pile of sand somewhere near here, but you don't see anything besides lots of water and the small island where the ferry has docked.

As you try to figure out what to do next, you notice a poster on a wall near the ferry dock. "Boat races! Open to the public! Grand prize is an all-expenses-paid trip to Desert Island!" That must be where the sand comes from! Best of all, the boat races are starting in just a few minutes.

You manage to sign up as a competitor in the boat races just in time. The organizer explains that it's not really a traditional race - instead, you will get a fixed amount of time during which your boat has to travel as far as it can, and you win if your boat goes the farthest.

As part of signing up, you get a sheet of paper (your puzzle input) that lists the time allowed for each race and also the best distance ever recorded in that race. To guarantee you win the grand prize, you need to make sure you go farther in each race than the current record holder.

The organizer brings you over to the area where the boat races are held. The boats are much smaller than you expected - they're actually toy boats, each with a big button on top. Holding down the button charges the boat, and releasing the button allows the boat to move. Boats move faster if their button was held longer, but time spent holding the button counts against the total race time. You can only hold the button at the start of the race, and boats don't move until the button is released.

For example:

Time:      7  15   30
Distance:  9  40  200

This document describes three races:

    The first race lasts 7 milliseconds. The record distance in this race is 9 millimeters.
    The second race lasts 15 milliseconds. The record distance in this race is 40 millimeters.
    The third race lasts 30 milliseconds. The record distance in this race is 200 millimeters.

Your toy boat has a starting speed of zero millimeters per millisecond. For each whole millisecond you spend at the beginning of the race holding down the button, the boat's speed increases by one millimeter per millisecond.

So, because the first race lasts 7 milliseconds, you only have a few options:

    Don't hold the button at all (that is, hold it for 0 milliseconds) at the start of the race. The boat won't move; it will have traveled 0 millimeters by the end of the race.
    Hold the button for 1 millisecond at the start of the race. Then, the boat will travel at a speed of 1 millimeter per millisecond for 6 milliseconds, reaching a total distance traveled of 6 millimeters.
    Hold the button for 2 milliseconds, giving the boat a speed of 2 millimeters per millisecond. It will then get 5 milliseconds to move, reaching a total distance of 10 millimeters.
    Hold the button for 3 milliseconds. After its remaining 4 milliseconds of travel time, the boat will have gone 12 millimeters.
    Hold the button for 4 milliseconds. After its remaining 3 milliseconds of travel time, the boat will have gone 12 millimeters.
    Hold the button for 5 milliseconds, causing the boat to travel a total of 10 millimeters.
    Hold the button for 6 milliseconds, causing the boat to travel a total of 6 millimeters.
    Hold the button for 7 milliseconds. That's the entire duration of the race. You never let go of the button. The boat can't move until you let go of the button. Please make sure you let go of the button so the boat gets to move. 0 millimeters.

Since the current record for this race is 9 millimeters, there are actually 4 different ways you could win: you could hold the button for 2, 3, 4, or 5 milliseconds at the start of the race.

In the second race, you could hold the button for at least 4 milliseconds and at most 11 milliseconds and beat the record, a total of 8 different ways to win.

In the third race, you could hold the button for at least 11 milliseconds and no more than 19 milliseconds and still beat the record, a total of 9 ways you could win.

To see how much margin of error you have, determine the number of ways you can beat the record in each race; in this example, if you multiply these values together, you get 288 (4 * 8 * 9).

Determine the number of ways you could beat the record in each race. What do you get if you multiply these numbers together?

Your puzzle answer was 449550.

The first half of this puzzle is complete! It provides one gold star: *
 * 
 */

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
