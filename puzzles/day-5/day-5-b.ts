/**
 * 
 * --- Part Two ---

Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

seeds: 79 14 55 13

This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?

 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const REGEX = /^seeds|([a-z]+-[a-z]+-[a-z]+)/g;
const REGEX_NUMBER = /\d+/g;

const TRACE = false;

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);
  let relations = parseRelations(data);

  let locations: number[] = [];
  
  let seeds = relations.seeds;
  for (let i = 0; i < seeds.length; i = i + 2) {
    let startSeed = seeds[i];
    let lastSeed = seeds[i] + seeds[i+1];
    for (let seed = startSeed; seed < lastSeed; seed++) {
      locations.push(relations.resolveLocation(seed));
    }
  }

  log(`Locations: ${locations}`);
  return Math.min(...locations);
}

function parseRelations(data: string[]): Relations {
  let relations = new Relations();
  let iterator = data[Symbol.iterator]();

  let maps: Map<string, CleverMap> = new Map([
    ["seed-to-soil", relations.seedsToSoil],
    ["soil-to-fertilizer", relations.soilToFertilizer],
    ["fertilizer-to-water", relations.fertilizerToWater],
    ["water-to-light", relations.waterToLight],
    ["light-to-temperature", relations.lightToTemperature],
    ["temperature-to-humidity", relations.temperatureToHumidity],
    ["humidity-to-location", relations.humidityToLocation]
  ]);

  let iterResult: IteratorResult<string, any>;
  while(!(iterResult = iterator.next()).done) {
    let line: string = iterResult.value;
    log(`Line: ${line}`);
    if(line === "") {
      log("Empty line");
      continue;
    }
    let sectionKey = (line.match(REGEX) as RegExpMatchArray)[0];
    log(chalk.bgCyan(`Section: ${sectionKey}`))
    if (sectionKey === "seeds") {
      let match = line.match(REGEX_NUMBER);
      relations.seeds = match ? match.map(str => +str) : [];
      log(`Seeds: ${relations.seeds}`);
    } else {
      let map = maps.get(sectionKey) as CleverMap;
      consumeMap(map, iterator);
      log(chalk.bgMagenta("Map: ") + map.toString());
      
    }
  }
  return relations;
}

function consumeMap(cleverMap: CleverMap, iterator: IterableIterator<string>) {
  let iterResult: IteratorResult<string, any>;
  while((iterResult = iterator.next())) {
    let line = iterResult.value;
    if(iterResult.done || line == "") {
      return;
    }
    log("Consume Line: " + line);
    let match = line.match(REGEX_NUMBER);
    if(match) {
      cleverMap.add(new MapEntry(+match[0], +match[1], +match[2]));
    }
  }
}

class Relations {
  seeds: number[] = []
  seedsToSoil: CleverMap = new CleverMap();
  soilToFertilizer: CleverMap = new CleverMap();
  fertilizerToWater: CleverMap = new CleverMap();
  waterToLight: CleverMap = new CleverMap();
  lightToTemperature: CleverMap = new CleverMap();
  temperatureToHumidity: CleverMap = new CleverMap();
  humidityToLocation: CleverMap = new CleverMap();

  resolveLocation(seed: number): number {
    let transitions = [
      this.seedsToSoil, 
      this.soilToFertilizer, 
      this.fertilizerToWater, 
      this.waterToLight, 
      this.lightToTemperature, 
      this.temperatureToHumidity, 
      this.humidityToLocation
    ]

      let step = seed;
      for (const transition of transitions) {
        step = transition.getRelation(step);
      }

      log(chalk.bgRedBright(`Seed ${seed} resolved to ${step}.`))
      return step;
  }
}

class CleverMap {
  map: MapEntry[]= [];

  public add(entry: MapEntry) {
    this.map.push(entry);
  }

  public getRelation(source: number): number{

    log("Get realtion for source: " + source);
    log("Map: " + this.map)
    for (const mapEntry of this.map) {
      if(mapEntry.sourceStart <= source && mapEntry.sourceStart + mapEntry.length >= source) {
        let resolution = (mapEntry.destionationStart + source - mapEntry.sourceStart);
        log("Relation found, Dest: " + resolution);
        return resolution;
      }
    }
    log ("Relation not found, returning source: " + source);
    return source;
  }

  public toString(): string {
    return `CleverMap: ${this.map}\n`;
  }
} 

class MapEntry{
  sourceStart: number;
  destionationStart: number;
  length: number;

  constructor (destStart: number, sourceStart: number, length: number) {
    this.destionationStart = destStart;
    this.sourceStart = sourceStart;
    this.length = length;
  }

  public toString(): string {
    return `MapEntry: [${this.destionationStart}, ${this.sourceStart}, ${this.length}]\n`;
  }
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}