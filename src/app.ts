import express from 'express'
import cors from 'cors'
import { UserDetails } from './database_functions/UserDetails';
import { chatRouter } from './chat/chatRouter';
import { claimRouter } from './claim_analysis/claimRouter';



const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());


app.get('/', async(req, res) => {
  res.send("You are in the backend of Claim Beavar !")
})

app.use('/api/chat',chatRouter);
app.use('/api/claims_update',claimRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});