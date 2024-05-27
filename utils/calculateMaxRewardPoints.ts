import Rules from "../constants/rules";
import Merchants from '../constants/merchants';
import {solve, Constraint, Solution, Model} from 'yalps';

interface Transaction {
    id: string,
    date: string,
    merchant_code: string,
    amount_cents: number
}

const calculateRewardPoints = (transactions: Array<Transaction>) => {

    // Intitialize HashMap to store spending per merchant
    let spendingPerMerchant = new Map<string, number>();
    // Accumulate spending per merchant
    for (const transaction of transactions) {
        const merch = transaction.merchant_code 
        const amount_cents = transaction.amount_cents
        spendingPerMerchant.set(merch, (spendingPerMerchant.get(merch) ?? 0) + amount_cents)
    }

    /* Use a linear programming optimization library to find optimal reward given rules, and expenditure

    Alternative solutions were explored, with Dynamic-programming algorithms and Greedy solutions, 
    but this by far had the best balance of Efficiency and Extensibility (as far as being able to handle a generic set of rules)
    */

    // Start by adding constraints based off total sum of spending on transactions
    /*
        Constraints are in key value pairs of

        (MERCHANT_VAR, {max: TOTAL_SPENDING_FROM_ALL_TRANSACTIONS})
    */
    let constraints = new Map<string, Constraint>()
    for (const merchant of Object.values(Merchants)) {
        let spending = spendingPerMerchant.get(merchant)
        if (spending) {
            constraints.set(merchant, {max: spending})
            // Need to accumulate spending on all merchants, into the ALL category
            let allValue = constraints.get(Merchants.ALL as string) ? constraints.get(Merchants.ALL as string)?.max as number + spending: spending
            constraints.set(Merchants.ALL as string, {max: allValue})

        } else if (merchant != Merchants.ALL as string){
            constraints.set(merchant , {max: 0})
        } else {
            let allValue = constraints.get(Merchants.ALL as string) ? constraints.get(Merchants.ALL as string)?.max as number: 0
            constraints.set(Merchants.ALL as string, { max: allValue})
        }
    }

    // Next add variables based off rules, with correspoding equation based off rule cost on each merchant
    /*
        Variables and corresponding equations are defined by

        RULE_VAR = Map([(MERCHANT_VAR_1 * coeff_1) ... ,(MERCHANT_VAR_N, coeff_n), (POINTS_VAR, points), (ALL_MERCHANT_VAR, coeff_total_cost)])

        where coeff_i represents the cost it takes to apply the rule once, on that specific MERCHANT_VAR_i
    */
    interface variables{
        [key:string]: Map<string,number>
    }
    let rules:variables = {}
    for (let rule of Rules){
        let ruleEquation = new Map<string, number>()
        let netLoss = 0
        for (let requirement of rule.requirements){
            ruleEquation.set(requirement.merchant, requirement.cents)
            netLoss += requirement.cents
        }

        // Need to once again, add an ALL merchant that accumulates total cost to apply the rule
        ruleEquation.set(Merchants.ALL as string, netLoss)
        ruleEquation.set("points", rule.points)

       rules[`${rule.number}`] = ruleEquation
    }

    // Next construct our Linear Programming optimization scenario, with our dynamically constructed constraints and variables
    let model: Model = {
        // We are maximizing for POINTS_VAR
        direction: "maximize",
        objective: "points",
        constraints: constraints,
        variables:rules,
        // We only want to apply rules in whole numbers
        integers: true
    }

    const solution: Solution = solve(model)


    // Next we want to Aggregate the Points per Transaction, we do this using our already solved optimal application of rules

    // ideally would not copy, would like to figure out a more optimized solution with less memory usage
    let transactionCopy = structuredClone(transactions);

    interface transactionPoints{
        [key:string]: number
    }
    let pointsPerTransaction: transactionPoints= {}


    // Iterate through all rules
    for(const rule of Rules){


        const ruleNumber = rule.number
        const rulePoints = rule.points
        const ruleRequirements = rule.requirements

        // find how many times we applied the rule in our optimal solution
        const ruleApplication= solution.variables.find((variable) => parseInt(variable[0]) == ruleNumber) 
        const numberApplications = ruleApplication ? ruleApplication[1]: 0


        // if didn't apply no need to continue
        if (numberApplications <= 0) {
            continue
        }

        // next we go through each individual transaction for the rule, applying that rule to each transation
        for(let transaction of transactionCopy){
            const id = transaction.id
            const merchant = transaction.merchant_code 
            const amount_cents = transaction.amount_cents

            // we find the details of the relevant requirement, based on what the Merchant of the transaction is
            let relevantRequirement;
            // special case if the rule contains an ALL/rest of merchants
            if (ruleRequirements.find((requirements) => requirements.merchant == Merchants.ALL as string)) {
                relevantRequirement = ruleRequirements.find((requirement) => requirement.merchant == Merchants.ALL)
            } else {
                relevantRequirement = ruleRequirements.find((requirement) => requirement.merchant == merchant) 
            }
 
            let cost = relevantRequirement? relevantRequirement.cents: 0

            // Next we apply our deduction from our application of the rule

            // We apply as the rule as much as we can, limited by the amount we solved in our optimal implementation, as well as the maximum based on the cost of the transaction 
            const maxApplications = Math.min(numberApplications * cost, Math.floor(amount_cents / cost))
            
            
            // We update our transaction cost, deducted with what we've applied with our rule
            transaction.amount_cents -= maxApplications * cost
            // We accumulate the points from our rule application in an result object
            pointsPerTransaction[id] =  (pointsPerTransaction[id] ?? 0) + maxApplications * rulePoints

            // For the ALL/rest requirement, we have to also update our number of applications (since the applications are split among multiple merchants)
            if (ruleRequirements.find((requirements) => requirements.merchant == Merchants.ALL as string)) {
                const idx = solution.variables.findIndex(elem => parseInt(elem[0]) == ruleNumber)
                solution.variables[idx][1] -= maxApplications
            }
        }
    }

    return {
        maxRewardPoints: solution.result + 0,
        pointsPerTransaction: pointsPerTransaction
    }
}

export default calculateRewardPoints