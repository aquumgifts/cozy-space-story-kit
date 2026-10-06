// =============================================================================
//  YOUR STORY GOES HERE
//  Edit this file to write your own story. index.html is the engine: you don't
//  need to touch it unless you want to change how things look or work.
// =============================================================================

// ---------- Title and end screens ----------
const GAME = {
  title1: "COZY SPACE",          // big title, first line
  title2: "SHIFT",               // big title, second line (purple)
  subtitle: "a tiny story on a cozy space station",
  hint: "Click, Space or Enter to talk · M mute",
  cast: ["ada", "rosa", "lin", "gus", "bot", "zib"],   // portraits shown on the title screen
  music: "cozy-menu",            // a file in assets/music/ (without .wav), or "" for none
  // The end screen: return the lines to show. `state` holds your flags.
  endTitle: "SHIFT COMPLETE",
  endLines: (state) => [
    `Kindness: ${state.kindness || 0} / 3`,
    state.kindness === 3 ? "The whole crew loves you. Best ending!" : "Try again and see what changes.",
  ],
  link: { label: "GET THE ASSETS", url: "https://itch.io/c/8266575" },   // set to null to hide the button
};

// ---------- Characters ----------
// key: { name shown in the name tag, sheet file in assets/sheets/ (7 frames of 96 x 96:
//        neutral, happy, sad, angry, surprised, talk closed, talk open) }
const CHARACTERS = {
  ada: { name: "Captain Ada", sheet: "captain-ada" },
  rosa: { name: "Engineer Rosa", sheet: "engineer-rosa" },
  lin: { name: "Doctor Lin", sheet: "doctor-lin" },
  gus: { name: "Mechanic Gus", sheet: "mechanic-gus" },
  bot: { name: "B0-T", sheet: "robot-b0t" },
  zib: { name: "Zib", sheet: "alien-zib" },
  kai: { name: "Pilot Kai", sheet: "pilot-kai" },
  noor: { name: "Officer Noor", sheet: "officer-noor" },
  mia: { name: "Cadet Mia", sheet: "cadet-mia" },
};

// ---------- Backgrounds ----------
// Two kinds:
//   { space: "nebula-violet-tile" | "nebula-teal-tile", planet: true/false, window: true/false, props: [...] }
//   { image: "scenes/<file>", x, y }   (x, y = where to draw it; omit them to center it over stars)
// props: [file in assets/props/, x, y]
const BACKGROUNDS = {
  bridge: { space: "nebula-violet-tile", planet: true, window: true, props: [["console", 20, 92], ["server-rack", 268, 64], ["plant-monstera", 240, 86]] },
  dock: { space: "nebula-teal-tile", planet: true, window: true, ship: true },
  corridor: { image: "scenes/example-level", x: -32, y: -10 },
  lab: { image: "scenes/example-lab" },
  room: { image: "scenes/example-room" },
};

// ---------- The story ----------
// Every node has an id (the key) and some of these fields:
//   bg:      background key (see BACKGROUNDS)
//   who:     character key (see CHARACTERS); leave it out for narration
//   mood:    "neutral" | "happy" | "sad" | "angry" | "surprised" (neutral talks while typing)
//   text:    what is said. Can be a function: (state) => "..."
//   next:    id of the next node, or "end" for the end screen. Can be a function too.
//   choices: [{ text, next, if: (state) => true/false, do: (state) => { ... } }]
//            `if` hides a choice, `do` changes your flags when it is picked.
//   do:      (state) => { ... } runs when the player leaves this node
//   sound:   a sound in assets/sfx/ (without .wav) to play when the node starts
// `state` is a plain object for your flags: state.fuse = true, state.kindness = 2, ...
// The story starts at the node called "start".
const kind = (s) => { s.kindness = (s.kindness || 0) + 1; };

const STORY = {
  start: { bg: "bridge", who: "ada", mood: "happy", text: "Welcome aboard, Cadet! Your first shift on Station Aquum, and of course the power picked today to act up.", next: "a2" },
  a2: { bg: "bridge", who: "ada", mood: "neutral", text: "A cargo ship docks in ten minutes. The reactor has to be at full power before then.", next: "a3" },
  a3: { bg: "bridge", who: "ada", mood: "neutral", text: "Rosa says it needs three things: a fuse, a coolant cell and a new chip. Ask the crew. They'll help you.", next: "hub" },

  hub: { bg: "corridor", text: "Where do you go?", choices: [
    { text: "Engineering (Rosa)", next: "r1", if: (s) => !s.fuse },
    { text: "Med bay (Doctor Lin)", next: "l1", if: (s) => !s.coolant },
    { text: "Workshop (Gus)", next: "g1", if: (s) => !s.chip },
    { text: "Back to the reactor!", next: "x1", if: (s) => s.fuse && s.coolant && s.chip },
  ] },

  r1: { bg: "lab", who: "rosa", mood: "surprised", text: "Oh! You're the new cadet? Perfect timing. Hold this. And this. Careful, that one's warm.", next: "r2", sound: "door-open" },
  r2: { bg: "lab", who: "rosa", mood: "happy", text: "Here's the fuse. It's my last spare, so please don't drop it in your coffee.", next: "r3" },
  r3: { bg: "lab", text: "You take the fuse.", choices: [
    { text: "\"Thanks, Rosa. I'll be careful.\"", next: "r4a", do: kind },
    { text: "\"Is it... safe?\"", next: "r4b" },
  ] },
  r4a: { bg: "lab", who: "rosa", mood: "happy", text: "See? I knew I'd like you. Now go, the reactor's getting grumpy!", next: "hub", do: (s) => { s.fuse = true; } },
  r4b: { bg: "lab", who: "rosa", mood: "neutral", text: "Mostly! It only sparks when someone's looking at it. So don't look.", next: "hub", do: (s) => { s.fuse = true; } },

  l1: { bg: "room", who: "lin", mood: "neutral", text: "A coolant cell? I keep one in the fridge. Next to my sandwich. Don't ask.", next: "l2", sound: "door-open" },
  l2: { bg: "room", who: "lin", mood: "sad", text: "...The cell is wrapped around the sandwich, actually. I was saving that sandwich.", next: "l3" },
  l3: { bg: "room", text: "Doctor Lin looks at the sandwich.", choices: [
    { text: "\"Take half of my lunch.\"", next: "l4a", do: kind },
    { text: "\"Sorry, it's an emergency!\"", next: "l4b" },
  ] },
  l4a: { bg: "room", who: "lin", mood: "happy", text: "Cadet, you're going to fit right in here. The cell is yours.", next: "hub", do: (s) => { s.coolant = true; } },
  l4b: { bg: "room", who: "lin", mood: "neutral", text: "Fair. Go, go! And wash your hands, it was next to the mustard.", next: "hub", do: (s) => { s.coolant = true; } },

  g1: { bg: "corridor", who: "gus", mood: "angry", text: "Who's banging on my door? Oh. A cadet. Hmph.", next: "g2" },
  g2: { bg: "corridor", who: "gus", mood: "neutral", text: "A chip, eh? I've got one. Took it out of the coffee machine last spring.", next: "g3" },
  g3: { bg: "corridor", text: "Gus holds out the chip, slowly.", choices: [
    { text: "\"I'll help fix the coffee machine later.\"", next: "g4a", do: kind },
    { text: "\"Thanks, Gus.\"", next: "g4b" },
  ] },
  g4a: { bg: "corridor", who: "gus", mood: "happy", text: "Ha! Now that's a promise I'll hold you to. Off you go.", next: "hub", do: (s) => { s.chip = true; } },
  g4b: { bg: "corridor", who: "gus", mood: "neutral", text: "Go on, then. And close the door, it's drafty.", next: "hub", do: (s) => { s.chip = true; } },

  x1: { bg: "lab", who: "bot", mood: "surprised", text: "POWER LEVELS RISING. Please do not lick the reactor.", next: "d1", sound: "powerup" },
  d1: { bg: "dock", who: "zib", mood: "happy", text: "Greetings, Station Aquum! The lights are on! I bring forty crates of space tea.", next: "d2", sound: "thruster" },
  d2: { bg: "dock", who: "ada", mood: (s) => (s.kindness === 3 ? "happy" : "neutral"),
    text: (s) => (s.kindness === 3 ? "The whole crew told me how kind you were today. Welcome home, Cadet."
      : "Not bad for a first shift, Cadet. Tomorrow, take a little more time with the crew."), next: "end" },
};
