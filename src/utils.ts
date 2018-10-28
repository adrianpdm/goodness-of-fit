interface DescriptiveStat {
    mean?: number
    stdev?: number,
}

export default abstract class Utils {

    static normal (data: Array<number>): DescriptiveStat{
        let mean: number = 0

        for (let i = 0; i < data.length; i++){
            mean += (data[i] / data.length)
        }

        let stdev: number = 0
        for (let i = 0; i < data.length; i++){
            stdev += Math.pow((data[i] - mean), 2)
        }
        stdev = Math.sqrt(stdev / (data.length - 1))

        return {
            mean,
            stdev,
        }
    }

    static lognormal (data: Array<number>): DescriptiveStat{
        let mean: number = 0,
            stdev: number = 0
        for (let i = 0; i < data.length; i++){
            mean += (Math.log(data[i]) / data.length)
        }

        for (let i = 0; i < data.length; i++){
            stdev += Math.pow((Math.log(data[i]) - mean), 2)
        }

        return {
            mean,
            stdev
        }
    }
}