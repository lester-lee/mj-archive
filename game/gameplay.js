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

  checkMelds(game);
}

function progressWind(game) {
  game.curWind = (game.curWind + 1) % 4;
}

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

function handlePong(game, p){
  let prevPlayerNum = ((game.curPlayer - 1 % 4) + 4) % 4;
  let discard = game.discards[prevPlayerNum].pop();

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
  const playerNum = game.curPlayer;
  const curHand = game.hands[playerNum];
  game.chowPlayer = canChow(curHand, game.lastDiscard) ? playerNum : -1;


  // Reset
  game.pongPlayer = -1;
  game.gongPlayer = -1;

  // Check pong & gong
  for (let p = 0; p < 4; p++){
    let hand = game.hands[p];
    if(canPong(hand, game.lastDiscard)){
      game.pongPlayer = p;
    }
    if(canPong(hand, game.lastDiscard, gong=true)){
      game.gongPlayer = p;
    }
  }
}

// Try to find 2 (or 3) of the tile within hand
function canPong(hand, tile, gong = false) {
  const compare = gong ? 3 : 2;
  let numFound = 0;
  for (let t of hand) {
    if (T.equals(t, tile)) {
      numFound++;
    }
  }
  return numFound >= compare;
}

// Use bitmap to see if tile fits within chow in hand
function canChow(hand, tile) {
  // TODO: easier way of doing bitmap?
  let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  check[tile.rank] = 1;
  for (let t of hand) {
    if (t.suit == tile.suit && Math.abs(tile.rank - t.rank) <= 2) {
      check[t.rank] = 1;
    }
  }
  let bitmap = check.join("");
  return bitmap.indexOf("111") > 0;
}

function findPongs(hand){
  /*returns [
    [p1, p2],...
    [p1]...
  ]*/
}

function findChows(hand){
  /**
   * returns [[c1, c2], [c1..], [c1...]]
   */
}

module.exports = {
  createGame,
  progressPlayer,
  handleDiscard,
  handleDraw,
  handlePong,
  handleGong,
}