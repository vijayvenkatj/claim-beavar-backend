import express from 'express'
import cors from 'cors'
import { chatRouter } from './chat/chatRouter';
import { claimRouter } from './claim_analysis/claimRouter';
import { connectRedis } from './utils/redis/init';
import { pdfloader } from './context_feeder/loader';

const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());

connectRedis();
pdfloader();
console.log("Loadeed")

app.get('/', async(req, res) => {
  res.send("You are in the backend of Claim Beavar !")
})

app.use('/api/chat',chatRouter);
app.use('/api/claims_update',claimRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});