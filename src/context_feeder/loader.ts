import { storeEmbedding } from "./embedding";
import pdfParse from "pdf-parse";
import fs from "fs";

export const pdfloader = async () => {
    try {
        const pdf = await fs.readFileSync("./data/context.pdf");
        const data = await pdfParse(pdf);
        const text = data.text;
        console.log("PDF text extracted successfully");
        await storeEmbedding(text);
        console.log("Embedding successfully stored in Pinecone");
    } 
    catch (error) {
        console.error("Error processing PDF:", error);
    }
}