import Sequelize from 'sequelize';
const sequelize = new Sequelize('postgres://mahjong:thirteenorphans@localhost:5432/mahjong');

const models = {
  Game: sequelize.import('./Game'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;