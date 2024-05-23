import calculateRewardPoints from "../utils/calculateMaxRewardPoints";

interface Transaction {
    id: string,
    date: string,
    merchant_code: string,
    amount_cents: number
}

test('Should return 0 reward points with empty transaction object', () => {
    const transactions: Array<Transaction> = []
    const result = calculateRewardPoints(transactions)
    expect(result.maxRewardPoints).toEqual(0)
    expect(result.pointsPerTransaction).toEqual({})
});


test('Example test case should return correct reward points, and correct points per transaction object', () => {
    const transactions: Array<Transaction> = [
        {
            "id": "T1",
            "date": "2021-05-09",
            "merchant_code" : "sportcheck", 
            "amount_cents": 2500

        },
         {
            "id": "T2",
            "date": "2021-05-09",
            "merchant_code" : "tim_hortons", 
            "amount_cents": 1000

        },
        {
            "id": "T3",
            "date": "2021-05-09",
            "merchant_code" : "the_bay", 
            "amount_cents": 500

        }
    ]
    const result = calculateRewardPoints(transactions)
    expect(result.maxRewardPoints).toEqual(90)
    expect(result.pointsPerTransaction).toEqual({
        "T1":80,
        "T2": 10,
        "T3": 5
    })
});



