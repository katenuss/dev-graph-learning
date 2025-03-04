function generate_learning_sequence(NUM_ITERS, BLOCK_ID) {
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
    
    let pickCond = Math.random()
    let allPaths = []
    let correctResp = [] // should go in a settings.js file ideally
    
    if (pickCond < 0.5) {
        allPaths[0] = {
            stimulus: 'img/' + 'planet' + PLANET_MAPPINGS[INITIAL_STATE] + '_' + 'left' + '.png',
            //stimulus: 'img/' + 'planet' + INITIAL_STATE + '.png',
            data: {correct_response: 'f', block: BLOCK_ID}} 
    } else if (pickCond >= 0.5) { // >= is correct
        allPaths[0] = {
            stimulus: 'img/' + 'planet' + PLANET_MAPPINGS[INITIAL_STATE] + '_' + 'right' + '.png',
            //stimulus: 'img/' + 'planet' + INITIAL_STATE + '.png',
            data: {correct_response: 'j', block: BLOCK_ID}} 
    }
    
    currentState = INITIAL_STATE // executes first as planned

    // generate sequence of planets
    for (let itr = 1; itr <= NUM_ITERS-1; itr++) { // start from 2nd index (itr=1) bc first is init
        adjacentStates = getAllIndexes(transitionMatrix[currentState],1) // get all indices that have a 1
        nextState = adjacentStates[getRandomInt(0,NUM_NEIGHBORS-1)]

        pickCond = Math.random()
        if (pickCond < 0.5) {
            nextCond = 'left'
            correctResp = 'f'
        } else if (pickCond >= 0.5) {
            nextCond = 'right'
            correctResp = 'j'
        }

        allPaths[itr] = {
            stimulus: 'img/' + 'planet' + PLANET_MAPPINGS[nextState] + '_' + nextCond + '.png', 
            //stimulus: 'img/' + 'planet' + nextState.toString() + '.png', 
            data: {correct_response: correctResp, block: BLOCK_ID}
            
        }
        
        currentState = nextState
    } 

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

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
  }

function generate_practice_sequence(NUM_ITERS) {
    let allPaths = []
    // define variable planet to be random choice between 1,2,3, or 4
    let practicePlanets = [1,2,3,4]
    let planet = practicePlanets.sample()

    for (let itr = 0; itr <= NUM_ITERS-1; itr++){
        let pickCond = Math.random()
        if (pickCond < 0.5) {
            nextCond = 'left'
            correctResp = 'f'
        } else if (pickCond >= 0.5) {
            nextCond = 'right'
            correctResp = 'j'
        }

        allPaths[itr] = {
            stimulus: 'img/' + 'practice' + planet + '_' + nextCond + '.png', 
            data: {correct_response: correctResp, block: 'practice'}
        }

        // select a new planet out of possible choices 1,2,3,4 that is not equal to the current planet
        let newPlanet = practicePlanets.filter(function(item) {
            return item !== planet
        })
        planet = newPlanet.sample()
    }
    return allPaths

}
