var GOF = require("../dist/index")
var Lilliefors = require("../dist/distributionTable/lilliefors.js")
var utils = require("../dist/utils")

var expect = require("chai").expect

describe("lilliefors critical values", () => {
	it("should return value", () => {
		let alpha = 0.1
		let sampleSize = 15
		let value = Lilliefors.default.getValue(alpha, sampleSize)
		expect(value).to.equal(.201)
	})
})

describe("goodness-of-fit test for each supported distribution", () => {
	it("should return Result", () => {
		let normalDataset = [61.6, 63.4, 65.1, 65.5, 70.0, 72.3, 72.5, 72.7, 73.0, 75.3, 77.1, 78.4, 83.2, 83.5, 84.3]
		let {mean, stdev} = utils.default.normal(normalDataset)
		let test = GOF.default.ofNormalAndLognormal(0.1, normalDataset, true)
		console.log(mean, stdev)
	})
})