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