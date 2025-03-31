import { prisma } from "../utils/prisma/prisma";
import { Claim } from "../utils/types";

export const getClaimDetails = async(userId: string)  => {
    const Claims: Claim[] = (await prisma.claim.findMany({
        where: {
            policyHolderId: userId
        }
    })).map(claim => ({
        ...claim,
        estimatedLoss: claim.estimatedLoss.toNumber(),
        actualLoss: claim.actualLoss ? claim.actualLoss.toNumber() : undefined
    }));

    return Claims;
}