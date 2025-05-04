import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/sheetRoutes.js";
// import router from "./routes/router.js";

const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000;

// sheet routes
app.use('/api/sheets', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app; // Export the app for testing or other purposes
