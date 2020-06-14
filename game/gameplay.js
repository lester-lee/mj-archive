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

    // Tiles
    wall: wall,
    hands: hands,
    melds: melds,
    discards: [[], [], [], []],
    lastDiscard: null,

    // Seating
    curWind: 0,
    dealerNum: 0,

    // Players
    players: [],
    curPlayer: 0,
    shownHands: [0, 0, 0, 0],
    chowPlayer: -1,
    pongPlayer: -1,
    gongPlayer: -1,

    // Turn Management
    claimAccepted: false,

    // Methods
    addPlayer: function (username) {
      if (!this.players.includes(username)) {
        this.players.push(username);
      }
    },
    getPlayerNum: function (username) {
      return this.players.indexOf(username);
    }
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
function progressPlayer(game) {
  // Increment player num
  const playerNum = (game.curPlayer + 1) % 4;
  game.curPlayer = playerNum;
}

function progressWind(game) {
  game.curWind = (game.curWind + 1) % 4;
}

// Move discard from hand to discard pile
function handleDiscard(game, playerNum, discard) {
  remove(game.hands[playerNum], (t) => t.id === discard.id);
  game.discards[playerNum].push(discard);
  game.lastDiscard = discard;
}

function handleDraw(game){
  const playerNum = game.curPlayer;
  const hand = game.hands[playerNum];
  const meld = game.melds[playerNum];

  // Keep adding flowers to melds if drawn
  let draw = game.wall.pop();
  while (draw.suit >= T.FLOWER) {
    meld.push(draw);
    draw = game.wall.pop();
  }
  hand.push(draw);

  hand.sort(T.compareTiles);
  meld.sort(T.compareTiles);
}

function handleChow(game, p, c){
  let discard = game.discards;
}

// p: num of player who pong
function handlePong(game, p){
  let discard = game.discards[game.curPlayer].pop();

  game.curPlayer = p;

  // Find tiles from hand
  let tiles;
  let hand = game.hands[p];

  // Make sure only 2 tiles are removed
  tiles = [];
  let numFound = 0;
  for (let i = 0; i < hand.length; i++){
    if (T.equals(hand[i], discard) && numFound < 2){
      numFound++;
      tiles.push(hand[i]);
      hand[i].suit = -1; // mark for deletion
    }
  }
  remove(hand, (t) => t.suit == -1);

  // Add tiles to melds
  let melds = game.melds[p];
  melds.push(discard);
  game.melds[p] = melds.concat(tiles);
}

function handleGong(game, p){
  let prevPlayerNum = ((game.curPlayer - 1 % 4) + 4) % 4;
  let discard = game.discards[prevPlayerNum].pop();

  game.curPlayer = p;

  // Find tiles from hand
  let tiles;
  let hand = game.hands[p];
  tiles = remove(hand, (t) => T.equals(t, discard));

  // Add tiles to melds
  let melds = game.melds[p];
  melds.push(discard);
  game.melds[p] = melds.concat(tiles);

  // Draw from wall
  handleDraw(game);
}

/**
 * Check to see if any user needs to be prompted for melds
 */
function checkMelds(game) {
  // Check chow
  const nextPlayerNum = (game.curPlayer + 1) % 4;
  const nextHand = game.hands[nextPlayerNum];

  console.log(nextPlayerNum);

  // findChows returns [-1, -1, -1] if no chow exists
  let chows = findChows(nextHand, game.lastDiscard);
  let chowExists = chows.reduce((x,y) => x + y, 0) > -3;
  game.chowPlayer = chowExists ? nextPlayerNum : -1;

  // Reset
  game.pongPlayer = -1;
  game.gongPlayer = -1;

  // Check pong & gong
  let pongExists = false;
  for (let p = 0; p < 4; p++){
    let hand = game.hands[p];
    let count = countTile(hand, game.lastDiscard);
    if (count == 2){  // found pong
      game.pongPlayer = p;
      pongExists = true;
    }
    if (count == 3){ // found gong
      game.gongPlayer = p;
    }
  }

  return {chows, chowExists, pongExists};
}

// Used mainly for finding pong / gong
function countTile(hand, tile) {
  let numFound = 0;
  for (let t of hand) {
    if (T.equals(t, tile)) {
      numFound++;
    }
  }
  return numFound;
}

// Use bitmap to see if tile fits within chow in hand
function findChows(hand, tile) {
  // Cannot chow winds or dragons
  if (tile.suit >= T.WIND){
    return [-1, -1, -1];
  }
  // Index+1 corresponds to rank
  let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let t of hand) {
    if (t.suit == tile.suit && Math.abs(tile.rank - t.rank) <= 2) {
      check[t.rank] = 1;
    }
  }
  check[tile.rank] = 2;

  let bitmap = check.join("");

  return [bitmap.indexOf("211"), bitmap.indexOf("121"), bitmap.indexOf("112")];
}

module.exports = {
  createGame,
  progressPlayer,
  checkMelds,
  handleDiscard,
  handleDraw,
  handlePong,
  handleGong,
}