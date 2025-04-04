import { pc } from "./db";
import { embedText } from "./embedding";

export const retriever = async(query: string): Promise<string> => {
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME!);
    const queryEmbedding = await embedText(query);

    const queryResult = await pineconeIndex.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true,
    })

    const relevantTexts = queryResult.matches.map((match) => match.metadata?.text).join("\n");
    return relevantTexts;
}