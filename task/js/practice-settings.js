// var practice_left_block = {
//     type: 'categorize-image',
//     post_trial_gap: 1000,
//     choices: ['f', 'j'],
//     timeline: [
//         {stimulus: 'img/planet1_left.png', key_answer: 'f'},
//         {stimulus: 'img/planet9_left.png', key_answer: 'f'},
//         {stimulus: 'img/planet7_left.png', key_answer: 'f'},
//     ],
//     correct_text: "<p><strong>Correct!</strong></p>",
//     incorrect_text: "<p>Incorrect.</p>",
//     // force_correct_button_press: true,
//     prompt: "<p>Which way is the wind travelling on this planet?</p>"
// };

// var practice_right_block = {
//     type: 'categorize-image',
//     post_trial_gap: 1000,
//     choices: ['f', 'j'],
//     timeline: [
//         {stimulus: 'img/planet12_right.png', key_answer: 'j'},
//         {stimulus: 'img/planet3_right.png', key_answer: 'j'},
//         {stimulus: 'img/planet12_right.png', key_answer: 'j'},
//     ],
//     correct_text: "<p><strong>Correct!</strong></p>",
//     incorrect_text: "<p>Incorrect.</p>",
//     // force_correct_button_press: true,
//     prompt: "<p>Which way is the wind travelling on this planet?</p>"
// }

var practice_both_block = {
    type: 'categorize-image',
    post_trial_gap: 1000,
    choices: ['f', 'j'],
    timeline: [
        {stimulus: 'img/practice1_left.png', key_answer: 'f'},
        {stimulus: 'img/practice4_left.png', key_answer: 'f'},
        {stimulus: 'img/practice3_left.png', key_answer: 'f'},
        {stimulus: 'img/practice3_right.png', key_answer: 'j'},
        {stimulus: 'img/practice2_right.png', key_answer: 'j'},
        {stimulus: 'img/practice1_right.png', key_answer: 'j'},
        {stimulus: 'img/practice3_left.png', key_answer: 'f'},
        {stimulus: 'img/practice4_right.png', key_answer: 'j'},
        {stimulus: 'img/practice2_right.png', key_answer: 'j'},
        {stimulus: 'img/practice4_left.png', key_answer: 'f'}
    ],
    correct_text: '<p style="font-size:25px;font-weight:bold;color:green">Correct!</strong></p>',
    incorrect_text: '<p style="font-size:25px;font-weight:bold;">Incorrect. Press the <i>other</i> key.</strong></p>',
    show_stim_with_feedback: true,
    show_feedback_on_timeout: true,
    force_correct_button_press: true,
    prompt: '<p style="font-size:25px">Which way is the wind travelling on this planet?</p>'
};