import express from 'express'
import cors from 'cors'
import { update_claim } from './claimAnalyser';


const app = express();
app.use(cors());
app.use(express.json());

export const claimRouter = express.Router();


claimRouter.post('/', async (req, res) => {
    console.log("Request Received",req.body.record)
    const result = await update_claim(req.body.record.claimId);
    console.log(result)
    res.send(result);
});
