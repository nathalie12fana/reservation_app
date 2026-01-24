require("dotenv").config(); // charge les variables d'environnement depuis .env

module.exports = {
  datasources: {
    db: {
      adapter: "mysql",
      url: process.env.DATABASE_URL,
    },
  },
};

