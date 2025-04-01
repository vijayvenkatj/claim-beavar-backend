import { prisma } from "../utils/prisma/prisma";
import { InsurancePolicy } from "../utils/types";


export const InsurancePolicyDetails = async()  => {
    const InsurancePolicies: InsurancePolicy[] = (await prisma.insurancePolicy.findMany({})).map(policy => ({
        ...policy,
        totalCoverageLimit: policy.totalCoverageLimit.toNumber(),
        annualPremium: policy.annualPremium.toNumber(),
    }));
    return InsurancePolicies;
}

export const InsurancePolicyDetailsByClaim = async(claimId: string)  => {
    const InsurancePolicy = await prisma.insurancePolicy.findFirst({
        where: {
            Claim: {
                some: {
                    id: claimId
                }
            }
        }
    });

    if (!InsurancePolicy) {
        throw new Error(`Insurance policy not found for claim ID: ${claimId}`);
    }

    const formattedInsurancePolicy: InsurancePolicy = {
        ...InsurancePolicy,
        totalCoverageLimit: InsurancePolicy.totalCoverageLimit.toNumber(),
        annualPremium: InsurancePolicy.annualPremium.toNumber(),
    };
    return formattedInsurancePolicy;

}