import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pc } from "./db";


export async function embedText(text: string) {
  try {
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-embedding-exp-03-07",
    });

    const vector = await embeddingModel.embedDocuments([text]);
    return vector[0];
  } 
  catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate text embedding");
  }
}

export async function storeEmbedding(text: string) {
  try {
    const embedding = await embedText(text);
    console.log(embedding.length)
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME!);
    
    await pineconeIndex.upsert([
      {
        id: 'PDF',
        values: embedding,
        metadata: { text }
      }
    ]);

    console.log("Embedding successfully stored in Pinecone");
  } 
  catch (error) {
    console.error("Error storing embedding in Pinecone:", error);
    throw new Error("Failed to store embedding in Pinecone");
  }
}
