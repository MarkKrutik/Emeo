Midi.fromUrl("./C_major_scale.mid").then(midi => {

    const name = midi.name;
//get the tracks
midi.tracks.forEach(track => {
//tracks have notes and controlChanges

//notes are an array
const notes = track.notes;
notes.forEach(note => {
console.log(note.midi, note.time, note.duration, note.name);
})
var level1Notes = [];
notes.forEach(note =>{
level1Notes.push(note.midi);
})
console.log(level1Notes);
//the control changes are an object
//the keys are the CC number
//track.controlChanges[64];
//they are also aliased to the CC number's common name (if it has one)
//track.controlChanges.sustain.forEach(cc => {
//console.log(cc.ticks, cc.value, cc.time);
//})


//the track also has a channel and instrument
//track.instrument.name


var noteIndex = 0;
var correctNotes = 0;
document.getElementById("reset").addEventListener("click", resetButton);
document.getElementById("again").addEventListener("click", againButton);

if (navigator.requestMIDIAccess) {
console.log('WebMIDI is supported in this browser.');
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
console.log('WebMIDI is not supported in this browser.');
document.querySelector('.note-info').textContent = 'Error: This browser does not support WebMIDI.';
}

function onMIDISuccess(midiAccess) {

drawNotes(level1Notes[noteIndex]);


var inputs = midiAccess.inputs;
var outputs = midiAccess.outputs;

for (var input of midiAccess.inputs.values()) {
input.onmidimessage = getMIDIMessage;
}
}

function onMIDIFailure() {
    document.querySelector('.note-info').textContent = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getMIDIMessage(message) {
var command = message.data[0];
var note = message.data[1];
var velocity = message.data[2];

switch (command) {
case 144: // noteOn
    noteOnListener(note);
    break;
}
} 

function getNoteNameFromNumber(noteNum) {
var notes = "C C#D D#E F F#G G#A A#B ";
var octave;
var note;

octave = Math.floor(noteNum / 12 - 1);
note = notes.substring((noteNum % 12) * 2, (noteNum % 12) * 2 + 2);

return note;

}

function drawNotes(noteNum) {
/** reset sharps, special line notes **/

/** reset sharps, special line notes **/
document.querySelector(".accidental").classList.remove('sharp61','sharp63', 'sharp66', 'sharp68', 'sharp70');
document.querySelector("#whole-note").classList.remove('whole-note-line');

/* draw basic note */

document.querySelector("#whole-note").classList.add('whole-note');
document.querySelector('.whole-note').classList.add('note'+noteNum);

if (isSharp(noteNum)) {
document.querySelector(".accidental").classList.add('sharp'+noteNum);
} 

if (isSpecialLineNote(noteNum)) {
document.querySelector("#whole-note").setAttribute("src", "./images/wholenoteline.svg");
document.querySelector("#whole-note").classList.add("whole-note-line");
} else {
document.querySelector("#whole-note").setAttribute("src", "./images/wholenote.svg");
}
}

function isSharp(noteNum) {
var sharp = false;
switch (noteNum) {
case 61:
case 63:
case 66:
case 68:
case 70:
    sharp = true;
    break;
default:
    break;
}
return sharp;
}

function isSpecialLineNote(noteNum) {
var lineNote = false;
switch (noteNum) {
case 60:
case 61:  
    lineNote = true;
    break;
default: 
    break;
}
return lineNote;
}
function resetButton(){
noteIndex = 0;
correctNotes = 0;
document.querySelector('.staff').remove();
document.getElementById('reset').remove();
document.querySelector('.note-info').textContent = 'Thank you for playing!';
document.getElementById('again').add();   
}

function againButton(){
window.location.reload();
noteIndex = 0;
correctNotes = 0;
}
function noteOnListener(note) {
/* check for special notes first */

if (note >= 41 && note <=47) { // change bg color!
var rainbow = ["#d10000", "#ff6622", "#ffda21", "#33dd00", "#1133cc", "#220066", "#330044"];
document.querySelector("body").style.background = rainbow[note - 41];
} else {
if(note != level1Notes[noteIndex]){

document.querySelector('.accidental').classList.add('wrong');
document.querySelector("#whole-note").classList.add('wrong');
}

if(note == level1Notes[noteIndex]){  
document.querySelector('.accidental').classList.add('correct');
document.querySelector('#whole-note').classList.add('correct');
correctNotes++;
}


window.setTimeout(function(){
if (noteIndex < level1Notes.length - 1) {
        noteIndex++;
        document.querySelector('.accidental').classList.remove('correct', 'wrong');
        document.querySelector('#whole-note').classList.remove('correct', 'wrong');
        document.querySelector('.note-info').textContent = '';
        document.querySelector('.whole-note').classList.remove('note'+level1Notes[noteIndex-1]);
        drawNotes(level1Notes[noteIndex]);
   
}  else {
    document.querySelector('.staff').remove();
          document.getElementById('reset').remove();
          document.querySelector('.note-info').textContent = 'You played ' + correctNotes + ' out of ' + level1Notes.length + ' notes correctly.';
        noteIndex = 0;
        correctNotes = 0;
    }
}, 1500);
    
}  

}





})
})	