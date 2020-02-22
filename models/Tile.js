// Suits
const BAMBOO = 0;
const NUMBER = 1;
const DOTS = 2;
const WIND = 3;
const DRAGON = 4;
const FLOWER = 5;
const SEASON = 6;

class Tile {
  constructor(suit, rank, id, isDown=false){
    this.suit = suit;
    this.rank = rank;
    this.id = id;
    this.isDown = isDown;
    this.url = `/img/tiles/${this.getTileImageUrl()}.png`;
    this.downUrl = '/img/tiles/down.png';
  }

  getTileImageUrl(){
    if (this.isDown) { return 'down'; }
    switch(this.suit){
      case BAMBOO:
        return `bamboo${this.rank}`;
      case NUMBER:
        return `man${this.rank}`;
      case DOTS:
        return `pin${this.rank}`;
      case WIND:
        return `wind${this.rank}`;
      case DRAGON:
        return `dragon${this.rank}`;
      case FLOWER:
        return `flower${this.rank}`;
      case SEASON:
        return `season${this.rank}`;
    }
  }
}

function compareTiles(t1, t2) {
  if (t1.suit !== t2.suit){
    return t1.suit - t2.suit
  }
  return t1.rank - t2.rank;
}

function equals(t1,t2){
  return t1.suit === t2.suit && t1.rank === t2.rank;
}

module.exports = {
  Tile,
  compareTiles,
  equals,
  NUMBER,
  BAMBOO,
  DOTS,
  WIND,
  DRAGON,
  FLOWER,
  SEASON,
}