const T = require('../models/Tile');
const uuidv4 = require('uuid/v4');

// Lodash
const remove = require('lodash/remove');
const shuffle = require('lodash/shuffle');

// Constants
const EMPTY = -1;
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

function createGame(id) {
  // game model?
  id = id || uuidv4();
  let wall = createWall();
  let hands = createHands(wall, 0); // 0 is first dealer
  let melds = findFlowers(hands, wall);

  return {
    id: id,

    // Tiles
    wall: wall,
    isWallEmpty: false,
    hands: hands,
    melds: melds,
    discards: [[], [], [], []],
    lastDiscard: new T.Tile(1, 1, -1, true),

    // Seating
    curWind: EAST,
    dealerNum: 0,
    winner: EMPTY,

    // Players
    players: [],
    curPlayer: EAST,
    shownHands: [0, 0, 0, 0],
    confirmCheck: [0, 0, 0, 0],
    chowPlayer: EMPTY,
    pongPlayer: EMPTY,
    gongPlayer: EMPTY,

    // Turn Management
    waitPong: false,

    // Methods
    addPlayer: function (username) {
      if (!this.players.includes(username)) {
        this.players.push(username);
      }
    },
    getPlayerNum: function (username) {
      return this.players.indexOf(username);
    },
    confirmedAll: function() {
      return this.confirmCheck.indexOf(0) == -1;
    },
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

function createHands(wall, dealerNum) {
  let hands = [];
  for (let i = 0; i < 4; i++) {
    let size = i == dealerNum ? 14 : 13; // Dealer gets 14 tiles
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

/* Game Progression */
function startNextRound(game){
  rotateSeats(game);
  resetGame(game);
  //console.log(game.dealerNum, game.curWind, game.curPlayer);
}

function resetGame(game){
  // Reset wall and hands
  game.wall = createWall();
  game.hands = createHands(game.wall, game.dealerNum);
  game.melds = findFlowers(game.hands, game.wall);

  game.shownHands = [0, 0, 0, 0];
  game.confirmCheck = [0, 0, 0, 0];
  game.chowPlayer = EMPTY;
  game.pongPlayer = EMPTY;
  game.gongPlayer = EMPTY;

  // Reset discards
  game.discards = [[], [], [], []];
  game.lastDiscard = new T.Tile(1,1,-1,true);
}

function rotateSeats(game){
  if (game.winner == game.dealerNum){
    return; // Nothing happens if dealer wins
  }
  // Update wind if dealer is North
  if (game.dealerNum == NORTH){
    game.curWind = (game.curWind + 1) % 4; // go to next wind
    game.dealerNum = EAST;
  }else{
    game.dealerNum++;
  }
  game.curPlayer = game.dealerNum; // dealer starts
}


/* Game Turn */
function progressPlayer(game) {
  // Increment player num
  const playerNum = (game.curPlayer + 1) % 4;
  game.curPlayer = playerNum;
}

// Move discard from hand to discard pile
function handleDiscard(game, playerNum, discard) {
  // Remove discard from hand and sort
  remove(game.hands[playerNum], (t) => t.id === discard.id);
  game.hands[playerNum].sort(T.compareTiles);

  // Update discard pile
  game.discards[playerNum].push(discard);
  game.lastDiscard = discard;
}

function handleDraw(game){
  const playerNum = game.curPlayer;
  const hand = game.hands[playerNum];
  const meld = game.melds[playerNum];

  if (game.wall.length <= 1){ // Check if last tile
    let draw = game.wall.pop();
    if (draw.suit >= T.FLOWER){
      meld.push(draw);
    }else{
      hand.push(draw);
    }
    game.isWallEmpty = true;
  }else{
    // Keep adding flowers to melds if drawn
    let draw = game.wall.pop();
    while (draw.suit >= T.FLOWER) {
      meld.push(draw);
      draw = game.wall.pop();
    }
    hand.push(draw);
  }
}

// p: num of player who chow
// c: type of chow; 1=100, 2=010, 3=001
function handleChow(game, p, c){
  removeOneTile = function(hand, suit, rank, tiles){
    for(let i = 0; i < hand.length; i++){
      let t = hand[i];
      if (t.suit == suit && t.rank == rank){
        tiles.push(t);
        t.suit = -1;
        return;
      }
    }
  }

  let discard = game.discards[game.curPlayer].pop();

  game.curPlayer = p;

  // Find tiles from hand according to c
  let tiles = [];
  let hand = game.hands[p];
  switch(c){
    case 1:
      removeOneTile(hand, discard.suit, discard.rank + 1, tiles);
      removeOneTile(hand, discard.suit, discard.rank + 2, tiles);
      break;
    case 2:
      removeOneTile(hand, discard.suit, discard.rank - 1, tiles);
      removeOneTile(hand, discard.suit, discard.rank + 1, tiles);
      break;
    case 3:
      removeOneTile(hand, discard.suit, discard.rank - 2, tiles);
      removeOneTile(hand, discard.suit, discard.rank - 1, tiles);
      break;
  }

  remove(hand, (t) => t.suit == -1);

  addToMelds(game, discard, p, tiles);
}

// p: num of player who pong
function handlePong(game, p){
  game.waitPong = false;

  let discard = game.discards[game.curPlayer].pop();

  game.curPlayer = p;

  // Find tiles from hand
  let tiles = [];
  let hand = game.hands[p];
  let numFound = 0; // Make sure only 2 tiles are removed
  for (let i = 0; i < hand.length; i++){
    if (T.equals(hand[i], discard) && numFound < 2){
      numFound++;
      tiles.push(hand[i]);
      hand[i].suit = -1; // mark for deletion
    }
  }
  remove(hand, (t) => t.suit == -1);

  addToMelds(game, discard, p, tiles);
}

function handleGong(game, p){
  game.waitPong = false;

  let discard = game.discards[game.curPlayer].pop();

  game.curPlayer = p;

  // Find tiles from hand
  let tiles;
  let hand = game.hands[p];
  tiles = remove(hand, (t) => T.equals(t, discard));

  // Add tiles to melds
  addToMelds(game, discard, p, tiles);
}

function addToMelds(game, discard, p, tiles){
  let melds = game.melds[p];
  tiles.push(discard);
  tiles.sort(T.compareTiles);
  game.melds[p] = melds.concat(tiles);
}

// Check to see if any user needs to be prompted for melds
function checkMelds(game) {
  // Check chow
  const nextPlayerNum = (game.curPlayer + 1) % 4;
  const nextHand = game.hands[nextPlayerNum];

  // findChows returns [-1, -1, -1] if no chow exists
  let {chowExists, chowTiles} = findChows(nextHand, game.lastDiscard);
  game.chowPlayer = chowExists ? nextPlayerNum : -1;

  // Reset
  game.pongPlayer = -1;
  game.gongPlayer = -1;

  // Check pong & gong
  let pongExists = false;
  for (let p = 0; p < 4; p++){
    let hand = game.hands[p];
    let count = countTile(hand, game.lastDiscard);
    if (count >= 2 && p != game.curPlayer){  // found pong from another player
      game.pongPlayer = p;
      pongExists = true;
    }
    if (count == 3){ // found gong
      game.gongPlayer = p;
    }
  }

  return {chowExists, chowTiles, pongExists};
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
    return {chowExists: false, chowTiles: [[], [], []]};
  }
  // Index+1 corresponds to rank
  let check = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8];

  for (let t of hand) {
    if (t.suit == tile.suit && Math.abs(tile.rank - t.rank) <= 2) {
      check[t.rank] = 0;
    }
  }
  check[tile.rank] = 1;

  let bitmap = check.join("");
  //console.log(bitmap);

  // Use bitmap to generate chow tiles
  let chowExists = false;
  let chowTiles = [[], [], []];

  let type100 = bitmap.indexOf("100");
  if (type100 > -1){
    chowExists = true;
    chowTiles[0] = [
      tile,
      new T.Tile(tile.suit, tile.rank+1, -1),
      new T.Tile(tile.suit, tile.rank+2, -1)
    ];
  }

  let type010 = bitmap.indexOf("010");
  if (type010 > -1){
    chowExists = true;
    chowTiles[1] = [
      new T.Tile(tile.suit, tile.rank-1, -1),
      tile,
      new T.Tile(tile.suit, tile.rank+1, -1)
    ];
  }

  let type001 = bitmap.indexOf("001");
  if (type001 > -1){
    chowExists = true;
    chowTiles[2] = [
      new T.Tile(tile.suit, tile.rank-2, -1),
      new T.Tile(tile.suit, tile.rank-1, -1),
      tile
    ];
  }

  return {chowExists, chowTiles};
}

module.exports = {
  createGame,
  progressPlayer,
  checkMelds,
  handleDiscard,
  handleDraw,
  handleChow,
  handlePong,
  handleGong,
  startNextRound,
}