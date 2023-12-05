/**
 * --- Part Two ---

The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?

Your puzzle answer was 80179647.

 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = false;

const REGEX = /\*/g;

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);
  let result = 0;
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const line = data[rowIndex];
    let match: RegExpExecArray|null;
    while ((match = REGEX.exec(line)) != null) {
      if (TRACE) console.log('===================');
      let partLines = new PartLines(data, rowIndex);

      if (TRACE)
        console.log(`Match index: ${match.index}, rowIndex: ${rowIndex} `);
      let temp: number[] = [];
      temp = temp
        .concat(getCurrentLineAdjacentNumbers(partLines.current, match.index))
        .concat(getLineAdjacentNumbers(partLines.previous, match.index))
        .concat(getLineAdjacentNumbers(partLines.next, match.index));
      if (TRACE)
        console.log(
          chalk.bgBlueBright('Found numbers in vicinity: ') + ' ' + temp
        );
      if (temp.length == 2) {
        if (TRACE)
          console.log(
            chalk.bgCyan('Exactly two numbers found. Adding to result.')
          );
        result += temp[0] * temp[1];
      }
    }
  }

  return result;
}

function getCurrentLineAdjacentNumbers(
  currentLine: string,
  starIndex: number
): number[] {
  let prevIndex = starIndex - 1;
  let oneAfterIndex = starIndex + 1;

  if (TRACE) console.log(`Line: ${currentLine}`);

  let result: number[] = [];

  if (prevIndex >= 0 && isNumeric(currentLine.charAt(prevIndex))) {
    let number = expandNumber(currentLine, prevIndex);
    result.push(number);
  }
  if (
    oneAfterIndex < currentLine.length &&
    isNumeric(currentLine.charAt(oneAfterIndex))
  ) {
    let number = expandNumber(currentLine, oneAfterIndex);
    result.push(number);
  }
  if (TRACE) console.log(`Numbers before after: ${result}`);
  return result;
}

function getLineAdjacentNumbers(line: string|null, starIndex: number): number[] {
  if (line == null) {
    return [];
  }
  let result = new Set<number>();
  let start = starIndex - 1 < 0 ? 0 : starIndex - 1;
  let end = starIndex + 1 > line.length ? starIndex + 1 : starIndex + 1 + 1;
  if (TRACE) console.log(`Line: ${line}`);
  if (TRACE) console.log(`Check line: start: ${start}, end: ${end}`);
  const search = line.substring(start, end);
  for (let charIndex = 0; charIndex < search.length; charIndex++) {
    const char = search[charIndex];
    if (isNumeric(char)) {
      let number = expandNumber(line, start + charIndex);
      if (TRACE) console.log(`Digit found. Expand. Number ${number}`);
      result.add(number);
    }
  }
  if (TRACE) console.log(`Returning numbers:  ${[...result]}`);
  return [...result];
}

function expandNumber(line: string, index: number): number {
  let result = line[index];
  let indexLeft = index;
  while (true) {
    if (indexLeft-- > 0 && isNumeric(line[indexLeft])) {
      result = line[indexLeft] + result;
    } else {
      break;
    }
  }
  let indexRight = index;
  while (true) {
    if (indexRight++ < line.length - 1 && isNumeric(line[indexRight])) {
      result = result + line[indexRight];
    } else {
      break;
    }
  }
  return +result;
}

function isNumeric(str: string): boolean {
  return /^\d$/.test(str);
}

class PartLines {
  current: string;
  previous: string|null;
  next: string|null;

  constructor(data: readonly string[], rowIndex: number) {
    this.current = data[rowIndex];
    this.next = rowIndex + 1 < data.length ? data[rowIndex + 1] : null;
    this.previous = rowIndex - 1 >= 0 ? data[rowIndex - 1] : null;
  }

  public toString(): string {
    return `Current: ${this.current}\n Previous: ${this.previous}\n Next: ${this.next}`;
  }
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
