import express from 'express'
import cors from 'cors'


const app = express();
app.use(cors());
app.use(express.json());

export const claimRouter = express.Router();

claimRouter.get('/', async (req, res) => {
    console.log("Hello World");
    res.send("Hello World");
});
