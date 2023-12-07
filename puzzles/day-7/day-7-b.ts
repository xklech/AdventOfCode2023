/**
 * 
 * --- Part Two ---

To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

    32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
    KK677 is now the only two pair, making it the second-weakest hand.
    T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.

With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?

Your puzzle answer was 250577259.

 * 
 */

import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TRACE = false;

const CARDS = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

export async function day7b(dataPath?: string) {
  const data = await readData(dataPath);
  let hands = data.map<Hand>((line) => new Hand(line, true));

  hands = hands.sort(compareHands).reverse();
  log(hands.toString());

  let res = 0;
  for (const hand of hands) {
    res += hand.bid * (hands.indexOf(hand) + 1);
  }

  return res;
}

enum Hands {
  Unknown,
  FiveOfAKind,
  FourOfAKind,
  FullHouse,
  ThreeOfAKind,
  TwoPair,
  OnePair,
  HighCard,
}

class Hand {
  cards: string;
  bestCards: string;
  bid: number;
  hand: Hands;

  constructor(line: string, expand = false) {
    let split = line.split(' ');
    this.cards = split[0];
    this.bid = +split[1];
    this.bestCards = expand
      ? this.bestJacksVariations(this.cards, this.bid).cards
      : this.cards;
    this.hand = this.eval();
  }

  private bestJacksVariations(cards: string, bid: number): Hand {
    let index = cards.indexOf('J');
    if (index === -1) {
      return new Hand(`${cards} ${bid}`);
    }
    let result: Hand | null = null;
    while (index !== -1) {
      for (let i = 0; i < CARDS.length - 1; i++) {
        let newCardsStr =
          cards.substring(0, index) + CARDS[i] + cards.substring(index + 1);
        let bestJack = this.bestJacksVariations(newCardsStr, bid);
        result =
          result === null
            ? bestJack
            : compareHands(result, bestJack) < 0
            ? result
            : bestJack;
      }
      index = cards.indexOf('J', index + 1);
    }

    return result!;
  }

  private eval(): Hands {
    let map = new Map<string, number>();

    [...this.bestCards].forEach((card) => {
      map.set(card, map.has(card) ? map.get(card)! + 1 : 1);
    });

    switch (map.size) {
      case 1:
        return Hands.FiveOfAKind;
      case 2:
        if ([...map.values()][0] === 1 || [...map.values()][0] === 4) {
          return Hands.FourOfAKind;
        } else {
          return Hands.FullHouse;
        }
      case 3:
        for (const value of map.values()) {
          if (value === 3) {
            return Hands.ThreeOfAKind;
          } else if (value === 2) {
            return Hands.TwoPair;
          }
        }
      case 4:
        return Hands.OnePair;
      case 5:
        return Hands.HighCard;
      default:
        return Hands.Unknown;
    }
  }

  public toString(): string {
    return `Hand - Cards: ${this.cards}, Best Cards: ${this.bestCards} Bid: ${
      this.bid
    }, Hand: ${Hands[this.hand]}\n`;
  }
}

function compareHands(a: Hand, b: Hand): number {
  if (a.hand === b.hand) {
    for (let i = 0; i < a.cards.length; i++) {
      let chA = a.cards[i];
      let chB = b.cards[i];
      if (chA !== chB) {
        return CARDS.indexOf(chA) - CARDS.indexOf(chB);
      }
    }
  }
  return a.hand - b.hand;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

function log(msg: string) {
  if (TRACE) console.log(msg);
}
