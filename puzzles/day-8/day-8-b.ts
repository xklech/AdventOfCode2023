/**
 * 
--- Part Two ---

The sandstorm is upon you and you aren't any closer to escaping the wasteland. You had the camel follow the instructions, but you've barely left your starting position. It's going to take significantly more steps to escape!

What if the map isn't for people - what if the map is for ghosts? Are ghosts even bound by the laws of spacetime? Only one way to find out.

After examining the maps a bit longer, your attention is drawn to a curious fact: the number of nodes with names ending in A is equal to the number ending in Z! If you were a ghost, you'd probably just start at every node that ends with A and follow all of the paths at the same time until they all simultaneously end up at nodes that end with Z.

For example:

LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)

Here, there are two starting nodes, 11A and 22A (because they both end with A). As you follow each left/right instruction, use that instruction to simultaneously navigate away from both nodes you're currently on. Repeat this process until all of the nodes you're currently on end with Z. (If only some of the nodes you're on end with Z, they act like any other node and you continue as normal.) In this example, you would proceed as follows:

    Step 0: You are at 11A and 22A.
    Step 1: You choose all of the left paths, leading you to 11B and 22B.
    Step 2: You choose all of the right paths, leading you to 11Z and 22C.
    Step 3: You choose all of the left paths, leading you to 11B and 22Z.
    Step 4: You choose all of the right paths, leading you to 11Z and 22B.
    Step 5: You choose all of the left paths, leading you to 11B and 22C.
    Step 6: You choose all of the right paths, leading you to 11Z and 22Z.

So, in this example, you end up entirely on nodes that end in Z after 6 steps.

Simultaneously start on every node that ends with A. How many steps does it take before you're only on nodes that end with Z?

Your puzzle answer was 21083806112641.

Both parts of this puzzle are complete! They provide two gold stars: **
 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const REGEX = /\w+/g;

const TRACE = true;

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);
  let gameMap = GameMap.createMap(data);
  let count = 0;
  let currentPlaces = [...gameMap.directions.keys()].filter((place) =>
    place.endsWith('A')
  );
  log(`Starting places: ${currentPlaces}`);
  let distancesToZ = currentPlaces.map((place) =>
    countStepsToZ(gameMap, place, 0)
  );
  log(`Distances to Z: ${distancesToZ}`);

  return lowestCommonMultiple(distancesToZ);
}

const lowestCommonMultiple = (arr: number[]) => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function countStepsToZ(
  gameMap: GameMap,
  currentPlace: string,
  startingIndex: number
): number {
  let count = 0;
  let index = startingIndex;
  let path = gameMap.path;
  while (!currentPlace.endsWith('Z')) {
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

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}
