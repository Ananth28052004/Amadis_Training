require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');

async function sync() {
  await sequelize.sync({ force: true });
  console.log('Database synced. "users" table created.');

  await User.bulkCreate([
    { name: 'Preethi', email: 'preethi@gmail.com', age: 25 },
    { name: 'Arun', email: 'arun@gmail.com', age: 28 },
  ]);
  console.log('Sample users inserted.');

  await sequelize.close();
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
