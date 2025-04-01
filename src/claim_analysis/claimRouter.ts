import express from 'express'
import cors from 'cors'
import { update_claim } from './claimAnalyser';


const app = express();
app.use(cors());
app.use(express.json());

export const claimRouter = express.Router();


claimRouter.get('/', async (req, res) => {
    console.log(req.body)
    const result = await update_claim(req.body.record.claimId);
    res.send(result);
});
