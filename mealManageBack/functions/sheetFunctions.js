import { JWT } from "google-auth-library";
import { google } from "googleapis";
import config from "../utils/config.js";


export const authReadOnly = new JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export const authWrite = new JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const  getSheetData = async (sheetName, range) => {
    try {
        // const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authReadOnly });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: config.spreadsheetId,
            range: `${sheetName}!${range}`, // IMPORTANT: Include sheet name in range
        });

        const values = response.data.values;
        if (!values) {
            // console.log(`No data found in sheet "${sheetName}", range "${range}".`);
            return [];
        }
        // console.log(`Data from sheet "${sheetName}", range "${range}":`);
        // values.forEach(row => console.log(row)); //  Consider NOT logging the data here, return it.
        return values;

    } catch (error) {
        console.error(`Error fetching data from sheet "${sheetName}", range "${range}":`, error);
        throw error; // Re-throw the error for the caller to handle
    }
}


export const writeSheetData = async (sheetName, range, values) => {
     try {
        const sheets = google.sheets({ version: 'v4', auth: authWrite });

        // console.log("Updating range:", `${sheetName}!${range}`);
        // console.log("With values:", values);

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: config.spreadsheetId,
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

export const appendSheetData = async (sheetName, range, values) => {
    try {
        const sheets = google.sheets({ version: 'v4', auth: authWrite });

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: config.spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });
        // console.log("Append response:", response.data);
    } catch (error) {
        console.error("Error during appendSheetData:", error.response?.data || error.message);
    }
}