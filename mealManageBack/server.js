import express from "express";
import cors from "cors";
import "dotenv/config";
import cron from 'node-cron';
import router from "./routes/sheetRoutes.js";
// import router from "./routes/router.js";

const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000;

// sheet routes
app.use('/api/sheets', router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// This is not works on vercel, so commented out

// cron.schedule(
//   '42 23 29 * *',
//   async () => {
//     try {
//       console.log("Running API call on 28th...");

//       const response = await fetch("https://meal-manage-back.vercel.app/api/sheets/bazarlist", {
//         method: "POST",
//       });

//       const data = await response.json();
//       console.log("API call completed:");
//     } catch (error) {
//       console.error("Error during scheduled API call:", error.message);
//     }
//   },
//   {
//     timezone: 'Asia/Dhaka',
//   }
// );


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app; // Export the app for testing or other purposes
