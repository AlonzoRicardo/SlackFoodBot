 function grouping(arr) {
    //random order
    
    arr.sort(function () {
      return .5 - Math.random();
    })
  
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
  
    while((newArr[newArr.length -1].length) < newArr[0].length) {
      //averages the lengths of the arrays.
     
      for(let i = 0; i < newArr.length; i++) {
        let spliced = newArr[i].splice(0, 1)
        newArr[newArr.length - 1].push(spliced[0]);
      }
    }
  
    return newArr
  }

  module.exports = grouping;