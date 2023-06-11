require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () =>
    console.log("Mongo is doing its thing")
);

if (process.env.DEV = "true") {
  //logic for connecting to memory server
  (async () => {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  })();
} else {
  mongoose.connect(process.env.MONGO_URI);
}
app.listen(PORT, () => {
  console.log(`We are hot and rollin' on port ${PORT}`);
});
