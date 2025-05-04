import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import 'dotenv/config'; // Load environment variables
import e from 'express';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Load the service account credentials.
const credentials = {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Specify the ID of the Google Spreadsheet.
const spreadsheetId = process.env.SPREADSHEET_ID; // Replace with your actual spreadsheet ID;

/**
 * Retrieves data from a specific sheet and range within a Google Spreadsheet.
 *
 * @param {string} sheetName The name of the sheet to retrieve data from (e.g., 'Sheet1', 'Data').
 * @param {string} range The range of cells to retrieve (e.g., 'A1:C10').
 * @returns {Promise<any[][]>} A promise that resolves to a 2D array of values, or an empty array if no data is found.  Rejects on error.
 */
async function getSheetData(sheetName, range) {
    const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    try {
        // const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth});

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!${range}`, // IMPORTANT: Include sheet name in range
        });

        const values = response.data.values;
        if (!values) {
            console.log(`No data found in sheet "${sheetName}", range "${range}".`);
            return [];
        }
        console.log(`Data from sheet "${sheetName}", range "${range}":`);
        // values.forEach(row => console.log(row)); //  Consider NOT logging the data here, return it.
        return values;

    } catch (error) {
        console.error(`Error fetching data from sheet "${sheetName}", range "${range}":`, error);
        throw error; // Re-throw the error for the caller to handle
    }
}

async function writeSheetData(sheetName, range, values) {
    const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // console.log("Updating range:", `${sheetName}!${range}`);
        // console.log("With values:", values);

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });

        // console.log("Update response:", response.data);
    } catch (error) {
        console.error("Error during writeSheetData:", error.response?.data || error.message);
    }
}


// all data
app.get('/sheets/all', async (req, res) => {
    const sheetName = req.query.sheetName; // e.g., "April 25"
    const range = req.query.range || "A1:R44"; // Default range if not provided
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
// Get the list of sheets in the spreadsheet
app.get('/sheets/list', async (req, res) => {
    const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    try {
        // const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth});

        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        }); 
        const sheetsList = response.data.sheets.map(sheet => sheet.properties.title);
        res.json(sheetsList); // Send the list of sheets as JSON
    } catch (error) {
        console.error('Error fetching sheet list:', error);
        res.status(500).json({ error: 'Failed to retrieve sheet list from Google Sheets' });
    }
});

// Express route to get data from Google Sheets
app.get('/sheets', async (req, res) => {
    const sheetName = req.query.sheetName; // e.g., "April 25"

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }
    try {
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
            "shaikat": {
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
            "ajoy": {
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
            "shanto": {
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
            "himel": {
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
            "pranto": {
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
            "somir": {
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

app.get('/sheets/names', async (req, res) => {
    console.log('Hello from /sheets/names');
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

app.post('/sheets/extra', async (req, res) => {
    const sheetName = req.query.sheetName;

    const { name, amount } = req.body;

    // console.log("Received data:", req.body);
    // console.log("Sheet name:", sheetName);

    if (!sheetName) {
        return res.status(400).json({ error: "Sheet name is required." });
    }

    const data = await getSheetData(sheetName, "B2:B7");
    const flatNames = data.flat();

    const rowIndex = flatNames.findIndex(n => n.toLowerCase() === name.toLowerCase());

    // console.log(rowIndex)

    if (rowIndex === -1) {
        return res.status(404).json({ error: "Name not found in the sheet." });
    }

    const sheetRow = rowIndex + 2;
    const formattedValue = parseFloat(amount);

    await writeSheetData(sheetName, `C${sheetRow}`, [[formattedValue]]);

    res.status(200).json({ message: "Money added successfully." });
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export default app; // Export the app for testing or other purposes