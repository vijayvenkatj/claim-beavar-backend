import express from 'express'
import cors from 'cors'
import { process_claims } from './chatAssistant';
import { redisClient } from '../utils/redis/init';


const app = express();
app.use(cors());
app.use(express.json());

export const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
    const { userId, message } = req.query as { userId: string; message: string };
    console.log(userId, message);

    if (!userId || !message) {
        res.status(400).send({ error: "Missing required fields" });
        return;
    }
    const cacheKey = `${userId}:${message}`;
    const TTL_SECONDS = 120;

    const cacheResponse = await redisClient.get(cacheKey);
    if (cacheResponse) {
        console.log("Cache hit");
        res.send({ data: JSON.parse(cacheResponse) });
        return;
    }
    else {
        console.log("Cache miss");
        const response = await process_claims({ userId, message });
        if (response) {
            await redisClient.setEx(cacheKey,TTL_SECONDS,JSON.stringify(response));
            res.send({ data: response });
        }
        else {
            res.status(404).send({ error: "Error processing" });
        } 
    }
});
