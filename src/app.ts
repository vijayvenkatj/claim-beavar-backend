import express from 'express'
import cors from 'cors'
import { UserDetails } from './database_functions/UserDetails';
import { chatRouter } from './chat/chatRouter';



const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());


app.get('/', async(req, res) => {
  res.send(await UserDetails("bb9ebbaa-bf17-4d9f-a867-a3f23d30bc44"))
})

app.use('/api/chat',chatRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});