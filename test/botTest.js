const assert = require('chai').assert;
const formGroups = require('../randomGrouping')
const testPeople = require('../config/seed.json')

//Testing seeds
const testArray = [];
testPeople.map(e => testArray.push(e.userID))
const testArrayLeaders = [...testArray].splice(0, 12)
let result = formGroups(testArray, testArrayLeaders)

describe('formGroups Function', () => {
    it('should return an array', () => {
        assert.typeOf(result, 'array')
    })

    it("groups's lengths should range between 4 and 7", () => {
        result.map(e => {
            assert.isAtLeast(e.length, 4)
            assert.isAtMost(e.length, 7)
        })
    })

    it("when 8 people are included, function should return 2 arrays of 4 people", () => {
        const arr = [...testPeople].splice(0, 8)
        const newArr = formGroups(arr, ['test', 'test', 'test'])
        assert.equal(newArr.length, 2)
        newArr.map(e => {
            assert.equal(e.length, 4)
        })
    })
})