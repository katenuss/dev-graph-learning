function generate_hamrand_sequence(NUM_ITERS, BLOCK_ID) {

  //intended format: { stimulus: "img/planet1.png", data: { correct_response: 'f' }},

  // NOTE: javascript zero-indexes!!! //
  // var assert = require('assert')

  // const NUM_ITERS = 300 // testing only

  const NUM_NEIGHBORS = 4
  const NUM_STATES = 15

  const transitionMatrix = [
      [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0], //1
      [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0], //2
      [1,1,0,1,1,0,0,0,0,0,0,0,0,0,0], //3
      [1,1,1,0,0,1,0,0,0,0,0,0,0,0,0], //4
      [1,1,1,0,0,0,0,0,0,0,1,0,0,0,0], //5
      [0,0,0,1,0,0,1,0,1,1,0,0,0,0,0], //6
      [0,0,0,0,0,1,0,1,1,1,0,0,0,0,0], //7
      [0,0,0,0,0,0,1,0,1,1,0,1,0,0,0], //8
      [0,0,0,0,0,1,1,1,0,1,0,0,0,0,0], //9
      [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0], //10
      [0,0,0,0,1,0,0,0,0,0,0,0,1,1,1], //11
      [0,0,0,0,0,0,0,1,0,0,0,0,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
      [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0]
  ]

  const forwardSeq = [1, 3, 5, 11, 13, 15, 14, 12, 8, 10, 9, 7, 6, 4, 2, 1, 3, 5, 11, 13, 15, 14, 12, 8, 10, 9, 7, 6, 4, 2];

  const backwardSeq = [2, 4, 6, 7, 9, 10, 8, 12, 14, 15, 13, 11, 5, 3, 1, 2, 4, 6, 7, 9, 10, 8, 12, 14, 15, 13, 11, 5, 3, 1];

  // not zero-indexing bc these are the actual image indices
  
  let allPaths = []

  /* assert((NUM_ITERS % NUM_STATES) == 0) */

  let NUM_BLOCKS = Math.ceil(NUM_ITERS / NUM_STATES);

  // pick starting condition
  var pickCond = Math.random();
  var pickForwardBackward 
  
  if (pickCond < 0.5) {
    var condition = 'random';
  } else {
    pickForwardBackward = Math.random()
    if (pickCond < 0.5) {
      var condition = 'hamiltonian_forward';
    } else {
      var condition = 'hamiltonian_backward';
    }
  }

  let odd_cond
  let even_cond
  if (condition === 'random'){
    odd_cond = 'random'
    even_cond = 'hamiltonian'
  } else if (condition.includes('hamiltonian')) {
    odd_cond = 'hamiltonian'
    even_cond = 'random'
  }

  var fullSeq = []
  let thisSeq 
  let fullCond = [] // random, ham, etc for data
  let condArray // random, ham, etc for data
  
  let idx_start
  let idx_end

  for (let bl = 0; bl <= NUM_BLOCKS-1; bl++) {
    
    thisSeq = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    condArray = []
    if ((bl % 2) == 0) { // even number
      condition = even_cond;
    } else {
      condition = odd_cond;
    }
    if (condition === 'hamiltonian') {
      pickFwdBwd = Math.random()
      if (pickFwdBwd < 0.5) {
        condition = 'hamiltonian_forward';
      } else {
        condition = 'hamiltonian_backward';
      }
    }

    if (bl===0){
      var currentState = getRandomInt(1, NUM_STATES) 
    }
    // console.log(condition)
    if (condition==='random') {
        for (let itr = 0; itr <= NUM_STATES-1; itr++) { 
            adjacentStates = getAllIndexes(transitionMatrix[currentState-1],1) 
            nextState = adjacentStates[getRandomInt(0,NUM_NEIGHBORS-1)]
            nextState = nextState + 1
            thisSeq[itr] = nextState
            currentState = nextState
        }
        fullSeq = fullSeq.concat(thisSeq)
    } else if (condition==='hamiltonian_forward') {
          idx_start = forwardSeq.findIndex(forwardSeq => forwardSeq === currentState) // zero indexing!
          idx_end   = idx_start + NUM_STATES
          thisSeq = forwardSeq.slice(idx_start+1,idx_end+1)
          // console.log(thisSeq)
          fullSeq = fullSeq.concat(thisSeq)
    } else if (condition==='hamiltonian_backward') {
          idx_start = backwardSeq.findIndex(backwardSeq => backwardSeq === currentState) // zero indexing!
          idx_end   = idx_start + NUM_STATES
          thisSeq = backwardSeq.slice(idx_start+1,idx_end+1)
          fullSeq = fullSeq.concat(thisSeq)
    }


    currentState = thisSeq.at(-1)
    
    //assert(thisSeq.length==NUM_STATES)
    //console.log(thisSeq.length)
    
    if (bl === 0) {
      fullSeq = thisSeq
      condArray = new Array(NUM_STATES).fill(condition).flat();
    } else {
      condArray = new Array(NUM_STATES).fill(condition).flat();
    }
    fullCond = fullCond.concat(condArray)
    // console.log(fullSeq)
  }

  for (let itr = 0; itr <= NUM_ITERS-1; itr++) {
    allPaths[itr] = {stimulus: 'img/' + 'planet' + fullSeq[itr] + '.png', 
                    //data: {block: BLOCK_ID, cond: fullCond[itr]}
                    data: {block: BLOCK_ID, cond: fullCond[itr]}
                    }
  }
  console.log(allPaths)
  return allPaths
 
    
  ///////////////////// functions //////////////////////////////
  function getRandomInt(min,max){
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
