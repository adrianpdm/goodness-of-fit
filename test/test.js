var GOF = require("../dist/index")
var expect = require("chai").expect
var data = [1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1]

describe("test GOD", () => {
	it("should return result", () => {
		let test = GOF.ofNormalAndLognormal(data, true)
		console.log(test)
	})
	it("should return result", () => {
		let test = GOF.ofExponential(data)
		console.log(test)
	})
	it("should return result", () => {
		let test = GOF.ofWeibull(data)
		console.log(test)
	})

})