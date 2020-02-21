const game = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    discard: DataTypes.JSON,
    wall: DataTypes.JSON,
    hands: DataTypes.JSON,
    currentPlayerId: DataTypes.STRING,
  });

  return Game;
};

export default game;