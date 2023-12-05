/**
 * --- Day 3: Gear Ratios ---

You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

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

In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

Your puzzle answer was 551094.
 * 
 */
import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = false;

const REGEX = /\d+/g;

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);
  let result = 0;
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const line = data[rowIndex];
    let match: RegExpExecArray|null;
    while ((match = REGEX.exec(line)) != null) {
      let partLines = new PartLines();
      partLines.current = line;
      partLines.next = rowIndex + 1 < data.length ? data[rowIndex + 1] : null;
      partLines.previous = rowIndex - 1 >= 0 ? data[rowIndex - 1] : null;
      if (TRACE)
        console.log(
          `Number: ${match[0]}, match index: ${match.index}, rowIndex: ${rowIndex} `
        );

      if (isValidPart(partLines, match[0], match.index)) {
        if (TRACE) console.log(`Valid part: ${match[0]}`);
        result += +match[0];
      }
    }
  }

  return result;
}

function isValidPart(
  partLines: PartLines,
  partNumber: string,
  startIndex: number
): boolean {
  return (
    isCurrentLineValidPart(partLines.current, partNumber, startIndex) ||
    isLineValidPart(partLines.previous, partNumber, startIndex) ||
    isLineValidPart(partLines.next, partNumber, startIndex)
  );
}

function isCurrentLineValidPart(
  currentLine: string|null,
  partNumber: string,
  startIndex: number
): boolean {
  let prevIndex = startIndex - 1;
  let oneAfterIndex = startIndex + partNumber.length;
  if (TRACE) console.log(`Length: ${currentLine?.length}, Line: ${currentLine}`);
  if (TRACE)
    console.log(
      `Check current line: prevIndex: ${prevIndex}, oneAfterIndex: ${oneAfterIndex}}`
    );
  if (prevIndex >= 0 && currentLine?.charAt(prevIndex) != '.') {
    if (TRACE) console.log(`Valid current line part - prev`);
    return true;
  }
  if (
    currentLine != null &&
    oneAfterIndex < currentLine.length &&
    currentLine.charAt(oneAfterIndex) != '.'
  ) {
    if (TRACE) console.log(`Valid current line part - after`);
    return true;
  }
  if (TRACE) console.log(`Not valid current line part`);
  return false;
}

function isLineValidPart(
  line: string|null,
  partNumber: string,
  startIndex: number
): boolean {
  if (line == null) {
    return false;
  }
  let start = startIndex - 1 < 0 ? 0 : startIndex - 1;
  let end =
    startIndex + partNumber.length > line.length
      ? startIndex + partNumber.length
      : startIndex + partNumber.length + 1;
  if (TRACE) console.log(`Line: ${line}`);
  if (TRACE) console.log(`Check line: start: ${start}, end: ${end}}`);
  const search = line.substring(start, end);
  for (const char of [...search]) {
    if (char != '.') {
      if (TRACE) console.log(`Valid line part`);
      return true;
    }
  }

  if (TRACE) console.log(`Not valid line part`);
  return false;
}

class PartLines {
  current: string|null = null;
  previous: string|null = null;
  next: string|null = null;

  public toString(): string {
    return `Current: ${this.current}\n Previous: ${this.previous}\n Next: ${this.next}`;
  }
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
