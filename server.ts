import express, { Express, Request, Response } from "express";
import {isArray} from 'class-validator'
import cors from 'cors';
import rewardsRouter from './router/rewardsRouter'

const port = 8000;

const app: Express = express();

// Specify requests only from frontend app
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
  res.send("Credit Rewards App");
});

app.use('/rewards', rewardsRouter)


app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});