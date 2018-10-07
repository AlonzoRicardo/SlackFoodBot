function selectLeaderFromArrays(groups, prevLeaders) {
    
    let newLeaders = [];
    let randomLeader;  
    let selectedGroups = [...groups]

    selectedGroups.map((e) => {
        randomLeader = e[Math.floor(Math.random() * e.length)];
        while(prevLeaders.includes(randomLeader)){
            randomLeader = e[Math.floor(Math.random() * e.length)];
        }
        newLeaders.push(randomLeader)
    })
    return newLeaders
}

module.exports = selectLeaderFromArrays;