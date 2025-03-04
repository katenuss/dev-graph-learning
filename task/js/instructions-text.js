// OPENING INSTRUCTIONS 
var instructions_text1 = [
  {
    stimulus:
      "<p>In this game, you are a scientist on board a space shuttle. </p><p> On each mission, you will visit planets all across the universe.</p>" + 
      '<img src="img/controlroom.jpg" width=300vw>',
      audio: 'audio/instructions/instruct1.mp3'
  },
  {
    stimulus: "<p>Here are a few planets you might see:</p>" +
      '<img src="img/practice1.png" width=200vw><img src="img/practice2.png" width=200vw><img src="img/practice3.png" width=200vw>',
      audio: 'audio/instructions/instruct2.mp3'
  },
  {
    stimulus: "<p>Your job as a scientist is to record which direction the winds are moving on each planet.</p>" + 
      "<p>There are two types of wind directions:</p>" +
      '<img src="img/practice1_left.png" width=200vw><img src="img/practice1_right.png" width=200vw>',
      audio: 'audio/instructions/instruct3.mp3'
  },
  {
    stimulus:
      "<p>If the winds are moving this way, press the letter <strong>F</strong> on the keyboard as fast as you can.</p>" +
      '<img src="img/leftwind.png" width=250vw>',
      audio: 'audio/instructions/instruct4.mp3'
  },
  {
    stimulus:
      "<p>If the winds are moving this way, press the letter <strong>J</strong> on the keyboard as fast as you can.</p>" +
      '<img src="img/rightwind.png" width=350vw>',
      audio: 'audio/instructions/instruct5.mp3'
  },
  {
    stimulus:
      "<p>You will have 1 second to respond. Try to respond before the time runs out!",
      audio: 'audio/instructions/instruct6.mp3'
  },
  {
    stimulus:
      "<p>The planets you will visit will look different from each other.</p><p>You should respond <strong>only</strong> based on wind direction.",
      audio: 'audio/instructions/instruct7.mp3'
  },
  {
    stimulus:
      "<p> Ready to start the practice round? </p>" + 
      "<p> Remember, press <strong>F</strong> or <strong>J</strong> depending on the wind direction." +
      '<br><img src="img/categorize_planet_example.png"',
      audio: 'audio/instructions/instruct8.mp3'
  }];

// INSTRUCTIONS AFTER PRACTICE with feedback
var instructions_text2 = [
  {
    stimulus: 
      "<p>Great, now try a short practice mission. </p>" +
      "<p> This time, you will have 1 second to respond and you won't know whether you pressed the right or wrong key for each planet.</p>" ,
    audio: ['audio/instructions/instruct8a.mp3']
  },
 ]

// INSTRUCTIONS AFTER PRACTICE without feedback
var instructions_text2a = [
    {
      stimulus:
        "<p>Great job with the practice round.</p>" + 
        "<p>During real missions, you won't know whether you pressed the right or wrong key for each planet.</p>" +
        "<p>But between missions, we will tell you how you did overall.</p>",
      audio: ['audio/instructions/instruct9a.mp3']
    },
    {
      stimulus:
        "<p>Try your best! You will be paid a bonus based on how many correct responses you make!</p>" + 
        "<p>Responses that are too slow will not count toward your bonus.</p>",
    audio: ['audio/instructions/instruct9b.mp3']
    },
    {
      stimulus: "<p>You are almost ready to start the real game.</p><p> First, we are going to ask you some questions about how the game works.</p>",
      audio: 'audio/instructions/instruct10.mp3',
      choices: ['Proceed to questions.']
    }]


// COMPREHENSION QUESTIONS
var comp_question_text1 = [
  {
    stimulus: "<p> <b> True or False? </b> </p>" +
      "<p> You will be paid a bonus based on how many correct responses you make.</p>",
    audio_stim: ['audio/instructions/comp1.mp3'],
    correct_button: 0,
    right_response: "<p><b> That's right! </b> Try your best.<br>You will be paid a bonus based on how many correct responses you make.<br>Responses that are too slow will not count toward your bonus.</p>",
    right_audio: ['audio/instructions/comp1_true.mp3'],
    wrong_response: "<p><b> Incorrect. </b>You will be paid a bonus based on how many correct responses you make. <br>Responses that are too slow will not count toward your bonus. So, try your best! </p>",
    wrong_audio: ['audio/instructions/comp1_false.mp3']
  }];

var comp_question_text2 = [
  {
    stimulus: "<p> <b> True or False? </b> </p>" +
      "<p> The color of the planet indicates which button you should press. </p>",
    audio_stim: ['audio/instructions/comp2.mp3'],
    correct_button: 1,
    right_response: "<p><b> That's right! </b> The color does not tell you which button you should press. Only the wind direction matters. </p>",
    right_audio: ['audio/instructions/comp2_true.mp3'],
    wrong_response: "<p><b> Incorrect. </b>The color does not tell you which button you should press. Only the wind direction matters. </p>",
    wrong_audio: ['audio/instructions/comp2_false.mp3'],
  }];

var comp_question_text3 = [
  {
    stimulus: "<p> <b> True or False? </b> </p>" +
      "<p> You have as much time as you want to make each response. </p>",
    audio_stim: ['audio/instructions/comp3.mp3'],
    correct_button: 1,
    right_response: "<p> <b> That's right! </b> You should respond as quickly as you can.<br>You will only have 1 second to make each response.<br>Responses that are too slow will not count toward your bonus.</p>",
    right_audio: ['audio/instructions/comp3_true.mp3'],
    wrong_response: "<p> <b>Incorrect.</b> You should respond as quickly as you can.<br>You will only have 1 second to make each response.<br>Responses that are too slow will not count toward your bonus.</p>",
    wrong_audio: ['audio/instructions/comp3_false.mp3'],
  }];

var comp_question_text4 = [
  {
    stimulus: "<p> <b> True or False? </b> </p>" +
      "<p> You should press either <strong>F</strong> or <strong>J</strong> depending on the wind direction. </p>",
    audio_stim: ['audio/instructions/comp4.mp3'],
    correct_button: 0,
    right_response: "<p> <b>That's right! </b> You should press either <strong>F</strong> or <strong>J</strong> depending on the wind direction. </p>",
    right_audio: ['audio/instructions/comp4_true.mp3'],
    wrong_response: "<p> <b>Incorrect.</b> You <i>should</i> press either <strong>F</strong> or <strong>J</strong> depending on the wind direction. </p>",
    wrong_audio: ['audio/instructions/comp4_false.mp3']
  }];

// INSTRUCTIONS AFTER COMPREHENSION QUESTIONS
var instructions_text3 = [
  {
    stimulus:
      "<p> Nice work! It is now time to start the real game.<p></p>You will go on two missions to record wind directions of different planets.<p></p>Each one will take about 5 minutes. You will get to take a break between missions.<p>" +
      "<p> Remember, press <strong>F</strong> or <strong>J</strong> depending on the wind direction. Good luck!" +
      '<br><img src="img/categorize_planet_example.png"',
    audio: 'audio/instructions/instruct11.mp3',
    choices: ['Start the first expedition!']
  }]

// INSTRUCTIONS AFTER COMPREHENSION QUESTIONS
var parse_instructions_text = [
  {
    stimulus:
      "<p>Now it's time for a new mission!"+
      "<p>In this new mission, you will see the same planets you have seen before, one at a time.</p>" + 
      "<p>The winds are calm now, so you won't have to report the wind direction.</p>" +
      "<p>Planets will just look like this:</p>" + 
      '<img src="img/planet6.png" width=200vw>',
      audio: 'audio/instructions/instruct12.m4a'
  },
  {
    stimulus:
      "<p>The planets you have seen actually come from different galaxies!</p>"+
      "<p>You will see planets one at a time.</b></p>" +
      "<p>We need you to tell us when you think you traveled to a different galaxy.</b></p>",
      audio: 'audio/instructions/instruct13.mp3'
  },
  {
    stimulus:
      "<p>Press the <strong>SPACEBAR</strong> when you think you traveled to a different galaxy.</p>" +
      "<p>Don't worry, just go with your gut.</p>"+
      '<img src="img/spacebar.png">',
      audio: 'audio/instructions/instruct13b.mp3'
  },
  {
    stimulus:
      "<p>Each galaxy has many planets.</p>."+
      "<p>So, not every planet you see means you traveled to a different galaxy.</p>" +
      "<p>Only press when you think you traveled to a different galaxy.</p>",
      audio: 'audio/instructions/instruct14.mp3'
  },
  {
    stimulus: "<p>Great! You will have 1 second to respond. Try to respond before the time runs out! </p>"+
    "<p>Please pay attention. You'll be asked about the galaxies later.</p>",
    audio: 'audio/instructions/instruct15.mp3'
  },
  { 
    stimulus:
    "<p>Before you start, we are going to ask you some questions about how the game works.</p>",
    audio: 'audio/instructions/instruct16.mp3',
    choices: ['Ready!'],
    
  }
  ]

  var parse_comp_text_1 = [
    {
      stimulus: "<p> <b> True or False? </b> </p>" +
        "<p> For this new mission, you will need to respond F or J to report the wind direction of each planet. </p>",
      audio_stim: 'audio/instructions/parsecomp1.mp3',
      correct_button: 1,
      right_response: "<p> <b> That's right! </b> You don't need to report the wind direction anymore.</p><p>Just press <strong>SPACE</strong> when you think you've traveled to a different galaxy. </p>",
      right_audio: 'audio/instructions/parsecomp1_true.mp3',
      wrong_response: "<p> <b>Incorrect.</b> You don't need to report the wind direction anymore. Just press <strong>SPACE</strong> when you think you've traveled to a different galaxy. </p>",
      wrong_audio: 'audio/instructions/parsecomp1_false.mp3',
    }];

    var parse_comp_text_2 = [
      {
        stimulus: "<p> <b> True or False? </b> </p>" +
          "<p>You should press spacebar for every planet.</p>",
        audio_stim: 'audio/instructions/parsecomp2.mp3',
        correct_button: 1,
        right_response: "<p> <b>That's right! </b>Each galaxy has many planets.<br>So, not every planet you see means you traveled to a different galaxy.<br>Only press when you think you've traveled to a different galaxy.</p>",
        right_audio: 'audio/instructions/parsecomp2_true.mp3',
        wrong_response: "<p> <b>Incorrect.</b> Each galaxy has many planets.<br>So, not every planet you see means you traveled to a different galaxy.<br>Only press when you think you've traveled to a different galaxy.</p>",
        wrong_audio: 'audio/instructions/parsecomp2_false.mp3',
      }];
  

  // INSTRUCTIONS AFTER COMPREHENSION QUESTIONS
  var parse_ready_text = [
    {
      stimulus:
        '<img src="img/spacelaunch.png" width = 300px>' +
        "<p>It's time to start your new mission! You will go on four different missions.</p><p>Each one will take a few minutes and you will get a break between missions.</p>" +
        "<p>Remember, press the <strong>SPACEBAR</strong> when you think you've traveled to a different galaxy.</p>" +
        '<img src="img/spacebar.png">',
      audio: 'audio/instructions/instruct17.mp3',
      choices: ['Ready!']
    }]

  var reconstruction_instructions_text = [
    {
      stimulus:
        "<p>Thank you for all your work as a scientist!</p>"+
        "<p>Finally, based on your experience visiting all the planets, we want you to map </p><p>out how you think the planets are spread out across the universe.</p>" +
        '<img src="img/starmap.jpg" width=300px>',
        audio: 'audio/instructions/graph1.mp3',
    
    },
    {
      stimulus:
        "<p>Planets are <b>close</b> in the universe if they were seen next to each other during your missions.</p>"+
        "<p>Planets from the same galaxy are close to each other.</p>",
        audio: 'audio/instructions/graph2.mp3',
    },
    { 
      stimulus:
        "<p>Planets are <b>far</b> away from each other in the universe</p><p>if they were not seen next to each other during your missions. </p>",
        audio: 'audio/instructions/graph3.mp3',
    },
    { 
      stimulus:
        "<p>You will see all the planets from your missions, and we want you </p><p>to group planets according to how close you think they are in the universe.</p>",
        // '<img src="img/telescope.png" width=300px>',
        audio: 'audio/instructions/graph4.mp3',
        choices: ['Ready!']
    }]