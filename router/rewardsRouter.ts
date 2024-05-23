import express, { Router, Request, Response, NextFunction } from 'express'
import Errors from '../constants/errors';
import calculateMaxRewardPoints from '../utils/calculateMaxRewardPoints';

const router: Router = express.Router();

router.get('/calculateRewardPoints', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.transactions || !Array.isArray(req.body.transactions)) {
            throw new Error(Errors.INVALID_TYPE)
        }
        req.body.transactions.forEach((element: any) => {
            if (typeof element.id != 'string'
                || typeof element.date != 'string'
                || typeof element.merchant_code != 'string' 
                || typeof element.amount_cents != 'number') {

                throw new Error(Errors.INVALID_TYPE)
            }
        });

        const result = calculateMaxRewardPoints(req.body.transactions)

        res.send(result)

    } catch (err: any) {
        if (err.message == Errors.INVALID_TYPE) {
            res.statusMessage = "Invalid Request Format"
            res.sendStatus(400).end()
        } else {
            res.statusMessage = "Internal Server Error"
            res.sendStatus(500).end()
        }
    }




});

export default router