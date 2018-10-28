interface LillieforsCriticalValues {
    [index: string]: Array<number>
}

let value: LillieforsCriticalValues = {
    "0.01": [.417, .405, .364, .348, .331, .311, .294, .284, .275, .268, .261, .257, .250, .245, .239, .235, .231],
    "0.05": [.381, .337, .319, .300, .285, .271, .258, .249, .242, .234, .227, .220, .213, .206, .200, .195, .190],
    "0.10": [.352, .315, .294, .276, .261, .249, .239, .230, .223, .214, .207, .201, .195, .189, .184, .179, .174],
    "0.15": [.319, .299, .277, .258, .244, .233, .224, .217, .212, .202, .194, .187, .182, .177, .173, .169, .166],
    "0.20": [.300, .285, .265, .247, .233, .223, .215, .206, .199, .190, .183, .177, .173, .169, .166, .163, .160]
}

function getValue(alpha: number, sampleSize: number): number {
    let availableAlpha = Object.keys(value)

    if (!availableAlpha.includes(alpha.toFixed(2))){
        throw new Error("Unsupported alpha value. Expected one of these: 0.01, 0.05, 0.10, or 0.20")
    }

    if (sampleSize <= 3){
        throw new Error("Insufficient sample size. Expected >= 4, actual: " + sampleSize)
    }

    let criticalValue: number
    if (sampleSize <= 20){
        criticalValue = value[alpha.toFixed(2)][sampleSize - 4]
    } else {
        let dividend: number = 0
        switch (alpha.toFixed(2)){
            case "0.01":
                dividend = 1.031
                break
            case "0.05":
                dividend = 0.886
                break
            case "0.10":
                dividend = 0.805
                break
            case "0.15":
                dividend = 0.768
                break
            case "0.20":
                dividend = 0.736
                break
            default:
                break
        }
        criticalValue =  dividend / Math.sqrt(sampleSize)
    }

    return criticalValue
}

export default {getValue}