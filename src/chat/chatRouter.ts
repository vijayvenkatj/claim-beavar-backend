import express from 'express'
import cors from 'cors'
import { process_claims } from './chatAssistant';


const app = express();
app.use(cors());
app.use(express.json());

export const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
    const { userId, message } = req.query as { userId: string; message: string };

    const response = await process_claims({ userId, message });
    if (response) {
        res.send({ data: response });
    } else {
        res.status(404).send({ error: "Error processing" });
    }
});
