import { prisma } from "../utils/prisma/prisma";
import { ClaimAssessment } from "../utils/types";


export const CreateClaimAssessment = async(ClaimAssessment: ClaimAssessment) => {
    const existingClaimAssessment = await prisma.claimAssessment.findFirst({
        where: {
            claimId: ClaimAssessment.claimId
        }
    });
    if(existingClaimAssessment) {
        return existingClaimAssessment;
    }
    const createdClaimAssessment = await prisma.claimAssessment.create({
        data: {
            id: ClaimAssessment.id,
            claimId: ClaimAssessment.claimId,
            assessorName: ClaimAssessment.assessorName,
            assessmentDate: ClaimAssessment.assessmentDate,
            assessmentNotes: ClaimAssessment.assessmentNotes,
            recommendedAction: ClaimAssessment.recommendedAction,
            additionalReview: ClaimAssessment.additionalReview
        }
    })
    return createdClaimAssessment;
}