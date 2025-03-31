import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";
import { LLMResponseSchema } from "../utils/types";
import { UserDetails } from "../database_functions/UserDetails";
import { getClaimDetails } from "../database_functions/ClaimDetails";
import { InsurancePolicyDetails } from "../database_functions/InsurancePolicyDetails";

const memory = new BufferMemory()

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.2
});

const parser = StructuredOutputParser.fromZodSchema(LLMResponseSchema);

const load_prompt = () => {
    const template = `
    You are a HealthCare Claims Inquiry Agent. You are supposed to answer queries related to the claims 
    raised by members. Answer Briefly. Make sure you are speaking like a human. Based on the member data, claim data, policy data answer the user's message:

    previous_chat : {previous_chat}
    
    Member Data : {memberData}
    Claim Data : {claimData}
    Plan Data : {policies}
    
    message : {message}

    {format_instructions}
    `;
    
    return ChatPromptTemplate.fromTemplate(template);
}

const load_chain = async () => {
    const prompt = load_prompt();
    return prompt.pipe(model).pipe(parser);
}

export async function process_claims({userId,message}:{userId:string,message:string}): Promise<string> {
    try {
        const chain = await load_chain();
        await memory.chatHistory.addMessage(new HumanMessage(message));
        const PolicyHolderData = await UserDetails(userId);
        const ClaimData = await getClaimDetails(userId);
        const InsurancePolicies = await InsurancePolicyDetails();
        const response = await chain.invoke({
            memberData: PolicyHolderData,
            claimData: ClaimData,
            policies: InsurancePolicies,
            message: message,
            previous_chat: await memory.chatHistory.getMessages(),
            format_instructions: parser.getFormatInstructions()
        });
        await memory.chatHistory.addMessage(new AIMessage(response.result));
        return response.result;
    } 
    catch (error) {
        console.error('Error processing claims:', error);
        throw error;
    }
}