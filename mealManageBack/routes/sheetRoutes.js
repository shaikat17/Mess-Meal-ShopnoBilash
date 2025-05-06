import express from "express";
import { google } from "googleapis";
import { getSheetData, writeSheetData, authReadOnly, authWrite, appendSheetData } from "../functions/sheetFunctions.js";
import config from "../utils/config.js";

const router = express.Router();

// Express route to get data from Google Sheets
router.get('/', async (req, res) => {
    const sheetName = req.query.sheetName; // e.g., "April 25"

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }
    try {
        const data1 = await getSheetData(sheetName, "L2:L7");
        const names = data1.flat();
        console.log("🚀 ~ router.get ~ names:", names)
        
        const data = await getSheetData(sheetName, "A1:R44"); //changed here
        const Mealdata = {
            "basicData": {
                "month": data[0][6],
                "totalMeal": data[5][4],
                "totalBazar": data[4][4],
                "totalExtraSpend": data[7][2],
                "babulVai": data[3][4],
                "perMeal": data[6][4],
                "extraPer": data[8][2],
            },
            [names[0].toLowerCase()]: {
                "extraSpend": data[3][2],
                "mealCost": data[1][12],
                "houseWifi": data[1][13],
                "didi": data[1][14],
                "total": data[1][15],
                "totalExtra": data[1][16],
                "debitCredit": data[1][17],
                "totalMeal": data[42][1],
                "totalBazar": data[31][10],
            },
            [[names[2].toLowerCase()]]: {
                "extraSpend": data[2][2],
                "mealCost": data[3][12],
                "houseWifi": data[3][13],
                "didi": data[3][14],
                "total": data[3][15],
                "totalExtra": data[3][16],
                "debitCredit": data[3][17],
                "totalMeal": data[42][3],
                "totalBazar": data[31][12],
            },
            [names[1].toLowerCase()]: {
                "extraSpend": data[6][2],
                "mealCost": data[2][12],
                "houseWifi": data[2][13],
                "didi": data[2][14],
                "total": data[2][15],
                "totalExtra": data[2][16],
                "debitCredit": data[2][17],
                "totalMeal": data[42][2],
                "totalBazar": data[31][9],
            },
            [names[5].toLowerCase()]: {
                "extraSpend": data[1][2],
                "mealCost": data[6][12],
                "houseWifi": data[6][13],
                "didi": data[6][14],
                "total": data[6][15],
                "totalExtra": data[6][16],
                "debitCredit": data[6][17],
                "totalMeal": data[42][6],
                "totalBazar": data[31][14],
            },
            [names[4].toLowerCase()]: {
                "extraSpend": data[4][2],
                "mealCost": data[5][12],
                "houseWifi": data[5][13],
                "didi": data[5][14],
                "total": data[5][15],
                "totalExtra": data[5][16],
                "debitCredit": data[5][17],
                "totalMeal": data[42][5],
                "totalBazar": data[31][13],
            },
            [names[3].toLowerCase()]: {
                "extraSpend": data[5][2],
                "mealCost": data[4][12],
                "houseWifi": data[4][13],
                "didi": data[4][14],
                "total": data[4][15],
                "totalExtra": data[4][16],
                "debitCredit": data[4][17],
                "totalMeal": data[42][4],
                "totalBazar": data[31][11],
            },
        }
        res.json(Mealdata); // Send the data as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data from Google Sheets' });
    }
});

// Route to fetch the list of sheets
router.get("/list", async (req, res) => {

    try {
        // const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authReadOnly });

        const response = await sheets.spreadsheets.get({
            spreadsheetId: config.spreadsheetId,
        }); 
        const sheetsList = response.data.sheets.map(sheet => sheet.properties.title);
        res.json(sheetsList); // Send the list of sheets as JSON
    } catch (error) {
        console.error('Error fetching sheet list:', error);
        res.status(500).json({ error: 'Failed to retrieve sheet list from Google Sheets' });
    }
});

// Route to fetch all data from a specific sheet
router.get("/all", async (req, res) => {
    const sheetName = req.query.sheetName; // e.g., "April 25"
    const range = req.query.range || "A1:R44"; // Default range if not provided
    console.log(sheetName)
    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }
    try {
        const data = await getSheetData(sheetName, range);
        res.json(data); // Send the data as JSON
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data from Google Sheets' });
    }
});

// Route to add extra
router.post('/extra', async (req, res) => {
    const sheetName = req.query.sheetName;
    const { name, amount } = req.body;

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }

    try {
        const data = await getSheetData(sheetName, "B2:B7");
        const flatNames = data.flat();

        const rowIndex = flatNames.findIndex(n => n.toLowerCase() === name.toLowerCase());

        if (rowIndex === -1) {
            return res.status(404).json({ error: "Name not found in sheet." });
        }

        // The extra spend column is C (i.e., column index 2), and row offset is +2 because we started from B2
        const cell = `C${rowIndex + 2}`;
        const formattedAmount = parseFloat(amount);
        await writeSheetData(sheetName, cell, [[formattedAmount]]);

        res.json({ success: true, message: `Extra spend for ${name} updated to ${amount}` });
    } catch (error) {
        console.error('Error updating extra spend:', error);
        res.status(500).json({ error: "Failed to update extra spend in Google Sheet." });
    }
});


// Route to get names
router.get('/names', async (req, res) => {
    const sheetName = req.query.sheetName;

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }

    try {
        const data = await getSheetData(sheetName, "L2:L7");
        const names = data.flat(); // Or: data.map(row => row[0]);
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data from Google Sheets" });
    }
});

// Route to add meal
router.post('/addmeal', async (req, res) => {
    const sheetName = req.query.sheetName;
    const { date, name, numOfMeal } = req.body;

    // console.log("hello", sheetName, date, name, numOfMeal);
    const columnIndex = {
        0: "B",
        1: "C",
        2: "D",
        3: "E",
        4: "F",
        5: "G",
    }
    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }
    if(numOfMeal < 0){
        return res.status(400).json({ error: "Number of Meals should be greater than zero." });
    }
    
    try {
        const result1 = await getSheetData(sheetName, "A12:A42");
        const dates = result1.flat();

        const result2 = await getSheetData(sheetName, "B11:G42");
        const names = result2[0].flat();

        console.log(date, name, numOfMeal);

        const dateIndex = dates.findIndex(d => d.toLowerCase() === date.toLowerCase());

        const nameIndex = names.findIndex(n => n.toLowerCase() === name.toLowerCase());

        if (dateIndex === -1 || nameIndex === -1) {
            return res.status(404).json({ error: "Date or Name not found in sheet." });
        }
        // const names = data.flat(); // Or: data.map(row => row[0]);

        const cell = `${columnIndex[nameIndex]}${dateIndex + 12}`;
        const formattedAmount = parseFloat(numOfMeal);

        await writeSheetData(sheetName, cell, [[formattedAmount]]);

        res.json({ success: true, message: `Number of Meals for ${name} on ${date} updated to ${numOfMeal}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data from Google Sheets" });
    }

});


// Route to get meal table
router.get('/mealtable', async (req, res) => {
    const sheetName = req.query.sheetName;

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }

    try {
        const data = await getSheetData(sheetName, "A11:G42");

        data.map(row => {
            row.map((item, index) => {
                console.log(item)
            })
        })

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data from Google Sheets" });
    }
})

// Route to add bazar
router.post('/addbazar', async (req, res) => {
    const sheetName = req.query.sheetName;
    const { name, amount } = req.body;

    const columnIndex = {
        0: "J",
        1: "K",
        2: "L",
        3: "M",
        4: "N",
        5: "O",
    }

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }

    if (!name || !amount) {
        return res.status(400).json({ error: "Name and amount are required." });
    }

    try {
        const data = await getSheetData(sheetName, "J12:O12");
        const flatNames = data.flat(); // Or: data.map(row => row[0]);

        const rowIndex = flatNames.findIndex(n => n.toLowerCase() === name.toLowerCase());

        if (rowIndex === -1) {
            return res.status(404).json({ error: "Name not found in sheet." });
        }
        
        const formattedAmount = parseFloat(amount);
        const columnLetter = columnIndex[rowIndex];
        const colRange = `${columnLetter}13:${columnLetter}`;

        const colRes = await getSheetData(sheetName, colRange);

        // Find the first empty row
        const firstEmptyRowIndex = colRes.findIndex(row => row.length === 0 || row[0] === '')+13;

        await writeSheetData(sheetName, `${columnLetter}${firstEmptyRowIndex}`, [[formattedAmount]]);

        res.json({ success: true, message: `Bazar for ${name} added to ${amount}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data from Google Sheets" });
    }
});

export default router;