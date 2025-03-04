function generate_parsing_sequence(NUM_ITERS, BLOCK_ID) {
    //intended format: { stimulus: "img/planet1.png", data: { correct_response: 'f' }},

    const NUM_NEIGHBORS = 4
    const NUM_STATES = 15

    const transitionMatrix = [
        [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
        [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
        [1,1,0,1,1,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,1,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,1,0,0,1,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,1,0,1,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,0,0,1,1,1],
        [0,0,0,0,0,0,0,1,0,0,0,0,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0]
    ]

    const INITIAL_STATE = getRandomInt(0, NUM_STATES-1) 
    let allPaths = []
    allPaths[0] = {stimulus: 'img/' + 'planet' + PLANET_MAPPINGS[INITIAL_STATE] + '.png', data: {block: BLOCK_ID}} 

    currentState = INITIAL_STATE // executes first as planned

    // generate sequence of planets
    for (let itr = 1; itr <= NUM_ITERS-1; itr++) { // start from 2nd index (itr=1) bc first is init
        adjacentStates = getAllIndexes(transitionMatrix[currentState],1) // get all indices that have a 1
        nextState = adjacentStates[getRandomInt(0,NUM_NEIGHBORS-1)]

        allPaths[itr] = {
            stimulus: 'img/' + 'planet' + PLANET_MAPPINGS[nextState] + '.png', 
            data: {block: BLOCK_ID}
            
        }
        
        currentState = nextState
    } 

    // console.log(allPaths)
    return allPaths

    /* ///////////////////// functions ////////////////////////////// */
    function getRandomInt(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }
}
