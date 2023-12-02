/** 
 * 
 * --- Part Two ---

Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen

In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?

 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';


const TRACE = false;
const REGEX = /(\d)/g;

function replace(expression: string): string {
  return expression
    .replaceAll("one", "o1e")
    .replaceAll("two", "t2o")
    .replaceAll("three", "t3e")
    .replaceAll("four", "f4r")
    .replaceAll("five", "f5e")
    .replaceAll("six", "s6x")
    .replaceAll("seven", "s7n")
    .replaceAll("eight", "e8t")
    .replaceAll("nine", "n9e");
}

function extractCoord(line: string): number {
  let replaced = replace(line);
  let numbers_first = replaced.match(REGEX);
  if (TRACE) {
    console.log("Line: " + line);
    console.log("Replaced: " + replaced);
    console.log("Numbers first: " + numbers_first);
  }
  if (numbers_first == null) {
    return 0;
  }
  let sum = +(numbers_first[0] + numbers_first[numbers_first.length - 1]);
  if (TRACE) console.log("Sum: " + sum);
  return sum;
}

export async function day1b(dataPath?: string): Promise<number> {
  const data = await readData(dataPath);
  let sum = 0;
  data.forEach(line => {
    sum += extractCoord(line);
  });
  return sum;
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
