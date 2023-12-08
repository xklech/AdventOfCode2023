/**
 * 
 * --- Day 8: Haunted Wasteland ---

You're still riding a camel across Desert Island when you spot a sandstorm quickly approaching. When you turn to warn the Elf, she disappears before your eyes! To be fair, she had just finished warning you about ghosts a few minutes ago.

One of the camel's pouches is labeled "maps" - sure enough, it's full of documents (your puzzle input) about how to navigate the desert. At least, you're pretty sure that's what they are; one of the documents contains a list of left/right instructions, and the rest of the documents seem to describe some kind of network of labeled nodes.

It seems like you're meant to use the left/right instructions to navigate the network. Perhaps if you have the camel follow the same instructions, you can escape the haunted wasteland!

After examining the maps for a bit, two nodes stick out: AAA and ZZZ. You feel like AAA is where you are now, and you have to follow the left/right instructions until you reach ZZZ.

This format defines each node of the network individually. For example:

RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)

Starting with AAA, you need to look up the next element based on the next left/right instruction in your input. In this example, start with AAA and go right (R) by choosing the right element of AAA, CCC. Then, L means to choose the left element of CCC, ZZZ. By following the left/right instructions, you reach ZZZ in 2 steps.

Of course, you might not find ZZZ right away. If you run out of left/right instructions, repeat the whole sequence of instructions as necessary: RL really means RLRLRLRLRLRLRLRL... and so on. For example, here is a situation that takes 6 steps to reach ZZZ:

LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)

Starting at AAA, follow the left/right instructions. How many steps are required to reach ZZZ?

Your puzzle answer was 21389.

The first half of this puzzle is complete! It provides one gold star: *
 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const REGEX = /([A-Z])+/g;

const TRACE = true;

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);
  let gameMap = GameMap.createMap(data);
  let count = 0;
  let currentPlace = 'AAA';
  let index = 0;
  let path = gameMap.path;
  while (currentPlace !== 'ZZZ') {
    count++;
    currentPlace = gameMap.nextStop(
      currentPlace,
      Coordinates.getDirection(path[index])
    );
    index++;
    index = index < path.length ? index : 0;
  }
  return count;
}

class GameMap {
  path: string;
  directions: Map<string, Coordinates>;

  constructor(path: string) {
    this.path = path;
    this.directions = new Map();
  }

  public addDirection(origin: string, left: string, right: string) {
    this.directions.set(origin, new Coordinates(left, right));
  }

  public nextStop(current: string, direction: Direction): string {
    return this.directions.get(current)!.get(direction);
  }

  public static createMap(data: string[]): GameMap {
    let gameMap = new GameMap(data[0]);
    for (let i = 2; i < data.length; i++) {
      const line = data[i];
      let matches = line.match(REGEX)!;
      if (line) {
        gameMap.addDirection(matches[0], matches[1], matches[2]);
      }
    }
    return gameMap;
  }
}

enum Direction {
  LEFT,
  RIGHT,
}

class Coordinates {
  left: string;
  right: string;

  constructor(left: string, right: string) {
    this.left = left;
    this.right = right;
  }

  public static getDirection(letter: string): Direction {
    return letter === 'R' ? Direction.RIGHT : Direction.LEFT;
  }

  public get(direction: Direction) {
    return direction === Direction.LEFT ? this.left : this.right;
  }

  public toStrong() {
    return `left - ${this.left}, right - ${this.right}}`;
  }
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
