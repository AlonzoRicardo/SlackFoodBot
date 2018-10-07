module.exports = function (arr, header) {
    newArr = [...arr];
    let message = header;
    
    newArr.map(e => {
        message += `<@${e}> `
    })
    
    return message
}