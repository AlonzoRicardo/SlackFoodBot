function grouping(arr) {
  //random order
  arr.sort(function () {
    return .5 - Math.random();
  })

  let copyArr = arr.map(e => e)
  let groupSize = 7;
  let newArr = []

  while (!Number.isInteger((arr.length / groupSize))) {
    //when not integer this runs
    let spliced = arr.splice(0, groupSize)
    newArr.push(spliced);
  }

  if (newArr.length < 1) {
    //exact groups
    for (let i = 0; i < arr.length; i++) {
      let spliced = arr.splice(0, groupSize)
      newArr.push(spliced);
    }
  }

  while ((newArr[newArr.length - 1].length) < newArr[0].length) {
    //decides which algorithm makes the groups
    if (copyArr.length >= 15) {
      //while groups
      let count = 0;
      while ((newArr[newArr.length - 1].length) < (newArr[0].length)) {
        //reset counter
        if (count >= newArr.length - 1) {
          count = 0;
        }
        let spliced = newArr[count].splice(0, 1)
        newArr[newArr.length - 1].push(spliced[0]);
        count += 1;
      }
    } else {
      //for groups
      for (let i = 0; i < newArr.length; i++) {
        let spliced = newArr[i].splice(0, 1)
        newArr[newArr.length - 1].push(spliced[0]);
      }
    }
  }
  return newArr
}

function checkIfArrayFullOfLeaders(groupsArr, leaderArr) {
  let result = false;
  for (var i = 0; i < groupsArr.length; i++) {
    let isFull = groupsArr[i].every((e) => leaderArr.includes(e))
    if (isFull) {
      result = isFull;
    }
  }
  return result
}

function formGroups(includedPeople, leaders) {
  let resultArray;
  let result = true;
  while (result === true) {
    let _includedPeople = [...includedPeople];
    let normalizedGroups = grouping(_includedPeople)
    result = checkIfArrayFullOfLeaders(normalizedGroups, leaders)
    resultArray = [...normalizedGroups]
  }
  return resultArray
}

module.exports = formGroups