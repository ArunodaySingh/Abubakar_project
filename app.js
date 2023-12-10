const { default: axios } = require("axios");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const DataSchema = require("./modal/dataschema");
const app = express();
dotenv.config();
const connectDB = require("./config/db");

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const insertDataIntoMongoDB = async (data) => {
  try {
    await DataSchema.insertMany(data);
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
  }
};

const hodInfoApi = async () => {
  try {
    const alreadyHavedata = await DataSchema.find();
    if (alreadyHavedata.length === 0) {
      const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
      const Arrayofdata = Object.values(response.data);
      const top10data = Arrayofdata.slice(0, 10);
      const filteredData = top10data.map((record) => ({
        store_name: record.name,
        last: record.last,
        buy: record.buy,
        sell: record.sell,
        volume: record.volume,
        base_unit: record.base_unit,
      }));
      await insertDataIntoMongoDB(filteredData);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchData = async () => {
  const data = await DataSchema.find();
  return data;
};

// Handle the root URL ("/") and send the index.html file
app.get("/", async (req, res) => {
  await hodInfoApi();
  const data = await fetchData();
  res.render("index", { data: data });
});

app.listen(3000, (error) => {
  if (!error) {
    connectDB();
    console.log("Server Connected");
  }
});
