# Credit Card Reward Points Calculator!
An Express Application for Easy Calculation of Optimal Credit Card Rewards!

# Introduction

For this Capital One technical skills challenge, I have created an Express.js app, written in TypeScript. The App serves an endpoint `rewards/calculateRewardPoints` in order to take in transactions in the request body, and output the maximum attainable reward points, as well as the reward points gained per transaction. The application is also set up Jest for unit tests, and some starting tests have been written

# How to run the Application

1. Run command `npm install` in order to install all dependencies
2. Run command `npm run prestart` in order to transpile TypeScript, configured in a /dist folder
3. Run command `npm run start` in order to start the application
4. Run command `npm run test` in order to run all unit tests through Jest

There is also the option of running the server in development mode with live code-refresh using nodemon, this can be done through the command `npm run dev`

# Testing the Application

Along with the provided unit tests for the maxRewardsPoint function, to test the application the user can directly submit a get request to the `rewards/calculateRewardPoints` endpoint. The server is configured to run on port 8000, therefore `http://localhost:8000/rewards/calculateRewardPoints` will be the endpoint. The request can be submitted through curl, or a separate platform like Postman. The only requirement is a JSON request body of the following format

```
{
    "transactions": [
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
}
```

The response body should contain both the maximum reward points, as well as the reward points per transaction in the following format.

```
{
    "maxRewardPoints": 90,
    "pointsPerTransaction": {
        "T1": 80,
        "T2": 10,
        "T3": 5
    }
}
```


# Algorithm Development and Software Design Decisions

This program was technically difficult to develop because of the algorithmic complexity of obtaining the maximum reward points. The goal with the algorithm, was to make it maintainable and extendable to any generic set of rules, and any number of merchants and transactions. This proved to be difficult, especially given an optimization problem like this is difficult to generalize. In the development process, I tried out numerous algorithms that followed a Dynamic Programming approach, as well as a Greedy approach based on the given rules. Both algorithms, had hard-coded aspects are were not as extendible, reliable, or as effecient as the solution I eventually settled on. Noticing that this was a linear programming optimization problem, I used  a linear programming optimization library, to write the rules in as linear equations, and the expenditures for each merchant as constraints. This allowed the algorithm to be written as a linear programming problem, and allowed me to leverage this efficient library

In the development of the express app, I made sure to take care with validation and edge cases. Hence my choice using TypeScript. I also made sure to right in run-time type validation for the API endpoint in express with explicit type checking. The decision to setup a unit testing framework, and right some starting tests was also to ensure the robustness, and reliability of the application. I also aimed to use the DRY principle in my development, using Enums, centralized constants, and reusable functions where I could in order to reduce repetitive code.
