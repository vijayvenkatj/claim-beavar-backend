import { InsurancePolicyDetailsByClaim } from "../database_functions/InsurancePolicyDetails";
import { UserDetails } from "../database_functions/UserDetails";
import { redisClient } from "../utils/redis/init"



export const getUserDetails = async(policyHolderId: string) => {
    const cacheKey = `User:${policyHolderId}`;
    const cacheResponse = await redisClient.get(cacheKey);
    if(!cacheResponse) {
        console.log("Cache miss");
        const policyHolderDetails = await UserDetails(policyHolderId);
        await redisClient.set(cacheKey,JSON.stringify(policyHolderDetails));
        return policyHolderDetails;
    }
    console.log("Cache hit");
    return JSON.parse(cacheResponse!);
}

export const getInsurancePolicyDetails = async(claimId: string) => {
    const cacheKey = `Policy:${claimId}`;
    const cacheResponse = await redisClient.get(cacheKey);
    if(!cacheResponse) {
        console.log("Cache miss");
        const claims = await InsurancePolicyDetailsByClaim(claimId);
        await redisClient.set(cacheKey,JSON.stringify(claims));
        return claims;
    }
    console.log("Cache hit");
    return JSON.parse(cacheResponse!);
}

