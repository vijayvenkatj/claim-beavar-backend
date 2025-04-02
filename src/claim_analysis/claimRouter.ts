import express from 'express'
import cors from 'cors'
import { update_claim } from './claimAnalyser';
import { redisClient } from '../utils/redis/init';


const app = express();
app.use(cors());
app.use(express.json());

export const claimRouter = express.Router();


claimRouter.post('/', async (req, res) => {
    console.log("Request Received",req.body.record)
    const result = await update_claim(req.body.record.id);
    console.log(result)
    res.send(result);
});

claimRouter.post('/policy_update', async (req, res) => {
    console.log("Request Received");
    const claimId = req.body.record.id;
    const cacheKey = `Policy:${claimId}`
    await redisClient.del(cacheKey)
    console.log("Deleted Policy Cache")
    res.send("updated policy")
});


claimRouter.post('/user_update', async (req, res) => {
    console.log("Request Received");
    const policyHolderId = req.body.record.id;
    const cacheKey = `User:${policyHolderId}`;
    await redisClient.del(cacheKey)
    console.log("Deleted PolicyHolder Cache")
    res.send("updated user")
});
