import Merchants from './merchants'

interface Rule {
    number: number;
    points: number;
    requirements: Array<Requirement>;
}

interface Requirement {
    cents: number;
    merchant: Merchants;
}

const Rules = Object.freeze([
    {
        number: 1,
        points: 500,
        requirements: [
            {
                cents: 7500,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
            {
                cents: 2500,
                merchant: Merchants.TIM_HORTONS
            } as Requirement,
            {
                cents: 2500,
                merchant: Merchants.SUBWAY
            } as Requirement
        ]
    } as Rule,
    {
        number: 2,
        points: 300,
        requirements: [
            {
                cents: 7500,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
            {
                cents: 2500,
                merchant: Merchants.TIM_HORTONS
            } as Requirement,
        ]
    } as Rule,
    {
        number: 3,
        points: 200,
        requirements: [
            {
                cents: 7500,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
        ]
    } as Rule,
    {
        number: 4,
        points: 150,
        requirements: [
            {
                cents: 2500,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
            {
                cents: 1000,
                merchant: Merchants.TIM_HORTONS
            } as Requirement,
            {
                cents:1000,
                merchant: Merchants.SUBWAY
            } as Requirement
        ]

    } as Rule,
    {
        number: 5,
        points: 75,
        requirements: [
            {
                cents: 2500,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
            {
                cents: 1000,
                merchant: Merchants.TIM_HORTONS
            } as Requirement,
        ]
    } as Rule,
    {
        number: 6,
        points: 75,
        requirements: [
            {
                cents: 2000,
                merchant: Merchants.SPORTCHEK
            } as Requirement,
        ]
    } as Rule,
    {
        number:7,
        points: 1,
        requirements: [
            {
                cents: 100,
                merchant: Merchants.ALL
            } as Requirement
        ] 
    } as Rule
]);

export default Rules;