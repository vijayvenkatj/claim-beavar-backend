import { prisma } from "../utils/prisma/prisma";
import { Claim } from "../utils/types";

export const getClaimDetails = async(userId: string)  => {
    const Claims: Claim[] = (await prisma.claim.findMany({
        where: {
            policyHolderId: userId
        }
    })).map(claim => ({
        ...claim,
        claimDetails: claim.claimDetails ? claim.claimDetails : "",
        estimatedLoss: claim.estimatedLoss.toNumber(),
        actualLoss: claim.actualLoss ? claim.actualLoss.toNumber() : undefined
    }));

    return Claims;
}

export const getClaimDetailsById = async(claimId: string)  => {
    const Claim = await prisma.claim.findFirst({
        where: {
            id: claimId
        }
    });

    if (!Claim) {
        throw new Error(`Claim not found for claim ID: ${claimId}`);
    }

    const formattedClaim: Claim = {
        ...Claim,
        claimDetails: Claim.claimDetails ? Claim.claimDetails : "",
        estimatedLoss: Claim.estimatedLoss.toNumber(),
        actualLoss: Claim.actualLoss ? Claim.actualLoss.toNumber() : undefined
    };
    return formattedClaim;

}
