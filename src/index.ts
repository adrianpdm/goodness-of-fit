import lilliefors from "./distributionTable/lilliefors"
import Utils from "./utils"

let jstat = require('jstat')

class Result {
    name: string
    accepted: boolean
    equation: string
    testingStat: number
    testingCriteria: number | Array<number>

    constructor(name: string, accepted: boolean, equation: string, testingStat: number, testingCriteria: number | Array<number>) {
        this.name = name
        this.accepted = accepted
        this.equation = equation
        this.testingStat = testingStat
        this.testingCriteria = testingCriteria
    }
}

function KSTest(alpha:number, data: Array<number>, ofNormal: boolean): Result {

    data = data.sort((a, b) => a - b)

    let {mean, stdev} = ofNormal
        ? Utils.normal(data)
        : Utils.lognormal(data)

    let dataset: Array<{ d1: number, d2: number }> = []

    data.forEach((val, i) => {
        let x = ofNormal
            ? val
            : Math.log(val)

        let cdf = ofNormal
            ? jstat.normal.cdf(x, mean, stdev)
            : jstat.lognormal.cdf(x, mean, stdev)

        let index = i + 1
        let d1 = cdf - ((index - 1) / data.length)
        let d2 = (index / data.length) - cdf
        dataset.push({
            d1,
            d2
        })
    })

    let maxD1: number,
        maxD2: number,
        testingCriteria: number,
        testingStat: number,
        accepted: boolean,
        equation: string = "D\u2081 < D\u2080"

    maxD1 = Math.max(...dataset.map(data => {
        return data.d1
    }))

    maxD2 = Math.max(...dataset.map(data => {
        return data.d2
    }))

    testingCriteria = lilliefors.getValue(alpha, data.length)
    testingStat = Math.max(maxD1, maxD2)
    accepted = testingStat < testingCriteria

    return new Result("Kolmogorov-Smirnov", accepted, equation, testingStat, testingCriteria)

}

function Mann(alpha: number, data: Array<number>): Result {

    data = data.sort((a, b) => a - b)

    let k1: number = Math.floor(data.length / 2),
        k2: number = Math.floor((data.length - 1) / 2)

    let mData: Array<number> = [],
        lnData: Array<number> = []

    for (let i = 0; i < data.length - 1; i++) {
        let index = i + 1
        let z1 = Math.log(-1 * Math.log(1 - ((index - 0.5) / (data.length + 0.25))))
        let z2 = Math.log(-1 * Math.log(1 - ((index + 1 - 0.5) / (data.length + 0.25))))

        mData.push(z2 - z1)
    }

    for (let i = 0; i < data.length - 1; i++) {
        let t1 = Math.log(data[i])
        let t2 = Math.log(data[i + 1])
        lnData.push((t2 - t1) / mData[i])
    }

    let dividend: number = 0,
        divisor: number = 0

    for (let i = 0; i < data.length; i++) {
        if (i < k1) {
            dividend += lnData[i]
            continue
        }

        if (i < data.length - 1) {
            divisor += lnData[i]
        }
    }

    let dof1: number = 2 * k2,
        dof2: number = 2 * k1,
        testingStat: number = (k2 * dividend) / (k1 * divisor)

    let equation: string = "M < F(alpha, df1, df2)",
        testingCriteria: number = jstat.centralF.inv(1 - alpha, dof1, dof2),
        accepted: boolean = testingStat < testingCriteria

    return new Result("Mann", accepted, equation, testingStat, testingCriteria)

}

function Bartlett(alpha: number, data: Array<number>): Result {

    let sum: number = 0,
        sumLn: number = 0

    for (let i = 0; i < data.length; i++) {
        sum += data[i] / data.length
        sumLn += Math.log(data[i]) / data.length
    }

    let dividend: number = 2 * data.length * (Math.log(sum) - sumLn),
        divisor: number = 1 + ((data.length + 1) / (6 * data.length))

    let x1: number = jstat.chisquare.inv(alpha / 2, data.length - 1),
        x2: number = jstat.chisquare.inv(1 - (alpha / 2), data.length - 1),
        testingStat: number = dividend / divisor,
        accepted: boolean = x1 < testingStat && testingStat < x2,
        equation: string = "\u03c7\u2081 < B < \u03c7\u2082"

    return new Result("Bartlett", accepted, equation, testingStat, [x1, x2])

}

export {Result}

export default {

    ofNormalAndLognormal(alpha: number, data: Array<number>, ofNormal: boolean) {
        return KSTest(alpha, data, ofNormal)
    },

    ofExponential(alpha: number, data: Array<number>) {
        return Bartlett(alpha, data)
    },

    ofWeibull(alpha: number, data: Array<number>) {
        return Mann(alpha, data)
    }
}