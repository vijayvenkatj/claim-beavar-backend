import { prisma } from "../utils/prisma/prisma";

export const UserDetails = async(userId: string)  => {
    const Users = await prisma.policyHolder.findMany({
        where: {
            id: userId
        },
        include: {
            ContactInfo: true,
            InsurancePolicy: true,
            RiskProfile: true
        }
    })
    return Users;
}