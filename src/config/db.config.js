//All the configuration settings here for different environment this setting would be modified accordingly
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Mass4Pass",
  DB: "sonata",
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};