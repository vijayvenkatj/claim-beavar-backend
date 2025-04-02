import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ClaimAssessment, ClaimAssessmentSchema } from "../utils/types";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { claimSpecificDetails, getClaimDetailsById } from "../database_functions/ClaimDetails";
import { CreateClaimAssessment } from "../database_functions/ClaimAssessment";
import { prisma } from "../utils/prisma/prisma";
import { getInsurancePolicyDetails, getUserDetails } from "./helperFunctions";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});



const parser = StructuredOutputParser.fromZodSchema(ClaimAssessmentSchema);

const load_prompt = () => {
    const template = `
    You are a Claims Assessor. You are supposed to assess the claims raised by the policy holders.
    Based on the claim details,user details ,policy details and specific details, you are supposed to assess the claim and provide the recommended action.
    Make sure you are speaking like a human. Based on the claim data, answer the user's message:

    claim_data = {claimData}
    user_details = {userDetails}
    policy_details = {policyDetails}
    specific_details = {claimSpecificDetail}

    {format_instructions}
    `
    return ChatPromptTemplate.fromTemplate(template);
}

const load_chain = async () => {
    const prompt = load_prompt();
    return prompt.pipe(model).pipe(parser);
}
 

const assess_claim = async(claimId: string): Promise<ClaimAssessment> => {
    const chain = await load_chain();

    const claimData = await getClaimDetailsById(claimId);

    const userDetails = await getUserDetails(claimData?.policyHolderId!);
    const policyDetails = await getInsurancePolicyDetails(claimData?.id!);

    const claimSpecificDetail = await claimSpecificDetails(claimData?.id!, claimData?.claimType!);
    
    const result:ClaimAssessment = await chain.invoke({claimData, userDetails, policyDetails,claimSpecificDetail,format_instructions: parser.getFormatInstructions()});
    return result;
}

export const update_claim = async(claimId: string) => {
    const ClaimAssessment = await assess_claim(claimId);
    try {
        await CreateClaimAssessment(ClaimAssessment);
        await prisma.claim.update({
            where: {
                id: ClaimAssessment.claimId
            },
            data: {
                complexity: ClaimAssessment.additionalReview ? "COMPLEX": "SIMPLE",
                status: ClaimAssessment.recommendedAction
            }
        })
        console.log(`Claim Assessment updated for claim ID: ${ClaimAssessment.claimId}`);
    }
    catch (error) {
        console.error(`Error updating claim assessment: ${error}`);
    }
    return ClaimAssessment;
}