/**
 * 
 * 
--- Part Two ---

Of course, it would be nice to have even more history included in your report. Surely it's safe to just extrapolate backwards as well, right?

For each history, repeat the process of finding differences until the sequence of differences is entirely zero. Then, rather than adding a zero to the end and filling in the next values of each previous sequence, you should instead add a zero to the beginning of your sequence of zeroes, then fill in new first values for each previous sequence.

In particular, here is what the third example history looks like when extrapolating back in time:

5  10  13  16  21  30  45
  5   3   3   5   9  15
   -2   0   2   4   6
      2   2   2   2
        0   0   0

Adding the new values on the left side of each sequence from bottom to top eventually reveals the new left-most history value: 5.

Doing this for the remaining example data above results in previous values of -3 for the first history and 0 for the second history. Adding all three new values together produces 2.

Analyze your OASIS report again, this time extrapolating the previous value for each history. What is the sum of these extrapolated values?

 * 
 */
import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = true;

export async function day9b(dataPath?: string) {
  const data = await readData(dataPath);
  let rows = data.map((line) => new Row(line));
  log(`Test matrix: ${rows[0].differenceMatrix()}`);
  log(`Test previous Num: ${rows[0].nextNumber()}`);
  log(rows.toString());
  return rows
    .map((row) => row.previousNumber())
    .reduce((sum, curr) => sum + curr);
}

class Row {
  sequence: number[];

  constructor(line: string) {
    this.sequence = line.split(' ').map((str) => +str);
  }

  public toString() {
    return `Row: ${this.sequence}\n`;
  }

  public differenceMatrix(): number[][] {
    let matrix: number[][] = [];
    let index = 0;
    matrix[index] = this.sequence;
    do {
      index++;
      matrix[index] = [];
      for (let i = 0; i < matrix[index - 1].length - 1; i++) {
        const current = matrix[index - 1][i];
        const next = matrix[index - 1][i + 1];
        matrix[index].push(next - current);
      }
    } while (!matrix[index].every((n) => n === 0));
    return matrix;
  }

  public nextNumber(): number {
    let matrix = this.differenceMatrix();
    let num = 0;
    for (let i = matrix.length - 1; i >= 0; i--) {
      const row = matrix[i];
      const lastNum = row[row.length - 1];
      num += lastNum;
    }
    return num;
  }

  public previousNumber(): number {
    let matrix = this.differenceMatrix();
    let num = 0;
    for (let i = matrix.length - 1; i > 0; i--) {
      const row = matrix[i - 1];

      const firstNumOfPreviousRow = row[0];
      num = firstNumOfPreviousRow - num;
    }
    return num;
  }
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}
