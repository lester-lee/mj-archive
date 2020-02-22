const T = require('../models/Tile');
const uuidv4 = require('uuid/v4');

// Lodash
const remove = require('lodash/remove');
const shuffle = require('lodash/shuffle');

function createGame(id) {
  // game model?
  id = id || uuidv4();
  let wall = createWall();
  let hands = createHands(wall);
  let melds = findFlowers(hands, wall); 

  return {
    id: id,
    curPlayer: 0,
    wall: wall,
    hands: hands,
    melds: melds,
    discardPile: [[], [], [], []],
  }
}

/* Game Initialization */

function createWall() {
  let wall = [];

  wall = wall.concat(createTiles([T.BAMBOO, T.NUMBER, T.DOTS], 9, 4, 0));
  wall = wall.concat(createTiles([T.WIND], 4, 4, 108));
  wall = wall.concat(createTiles([T.DRAGON], 3, 4, 124));
  wall = wall.concat(createTiles([T.FLOWER, T.SEASON], 4, 1, 136));

  wall = shuffle(wall);

  return wall;
}

function createTiles(suits, max_rank, num_copies, idx) {
  let tiles = [];
  for (let suit of suits) {
    for (let r = 1; r <= max_rank; r++) {
      for (let c = 0; c < num_copies; c++) {
        tiles.push(new T.Tile(suit, r, idx++))
      }
    }
  }
  return tiles;
}

function createHands(wall) {
  let hands = [];
  for (let i = 0; i < 4; i++) {
    // First player gets 14 tiles
    let size = i ? 13 : 14;
    hands.push(wall.splice(0, size));
    hands[i].sort(T.compareTiles);
  }
  return hands;
}

function findFlowers(hands, wall) {
  let melds = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    let flowers = remove(hands[i], t => t.suit >= T.FLOWER);
    while (flowers.length) {
      melds[i].push(...flowers);
      hands[i].push(...wall.splice(0, flowers.length));
      flowers = remove(hands[i], t => t.suit >= T.FLOWER);
    }
    melds[i].sort(T.compareTiles);
    hands[i].sort(T.compareTiles);
  }
  return melds;
}

/* Game Turn */

function handleDiscard(game, playerNum, discard) {
  remove(game.hands[playerNum], (t) => t.id === discard.id);
  game.discardPile[playerNum].push(discard);
}

function progressGame(game) {
  // Increment player num
  const playerNum = (game.curPlayer + 1) % 4;
  game.curPlayer = playerNum;

  const hand = game.hands[playerNum];
  const meld = game.melds[playerNum];

  // Handle draw (flowers)
  let draw = game.wall.pop();
  while (draw.suit >= T.FLOWER) {
    meld.push(draw);
    draw = game.wall.pop();
  }
  hand.push(draw);

  hand.sort(T.compareTiles);
  meld.sort(T.compareTiles);
}

function canGong(hand, tile) {
  let numFound = 0;
  // Replcae with lodash (maybe?)
  for (let t of hand) {
    if (T.equals(t, tile)) {
      numFound++;
    }
  }
  return numFound == 3;
}

function canPong(hand, tile) {
  // TODO: m0erge with canGong possibly
  let numFound = 0;
  // Replace with lodash (maybe?)
  for (let t of hand) {
    if (T.equals(t, tile)) {
      numFound++;
    }
  }
  return numFound == 2;
}

function canChow(hand, tile) {
  // TODO: easier way of doing bitmap?
  let check = [0,0,0,0,0,0,0,0,0,0]
  check[tile.rank] = 1;
  for (let t of hand){
    if (t.suit == tile.suit && Math.abs(tile.rank - t.rank) <= 2){
      check[t.rank] = 1;
    }
  }
  let bitmap = check.join("");
  return bitmap.indexOf("111");
}

module.exports = {
  createGame,
  handleDiscard,
  progressGame
}