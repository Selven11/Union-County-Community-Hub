const WORD_LIST = [
  "ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN",
  "AGENT","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIKE","ALIGN","ALIVE","ALLEY",
  "ALLOW","ALONE","ALONG","ALTER","ANGEL","ANGER","ANGLE","ANGRY","ANIME","ANKLE",
  "ANNEX","APART","APPLE","APPLY","ARENA","ARGUE","ARISE","ARMOR","ARSON","ASIDE",
  "ASKED","ASSET","ATLAS","ATTIC","AVOID","AWARD","AWARE","AWFUL","BASIC","BASIS",
  "BATCH","BEACH","BEGAN","BEGIN","BEING","BELOW","BENCH","BIRTH","BLACK","BLADE",
  "BLAME","BLAND","BLANK","BLAST","BLAZE","BLEED","BLESS","BLIND","BLOCK","BLOOD",
  "BLOOM","BLOWN","BOARD","BONUS","BOOST","BOOTH","BOUND","BRAIN","BRAND","BRAVE",
  "BREAD","BREAK","BREED","BRICK","BRIDE","BRIEF","BRING","BROKE","BROOK","BRUSH",
  "BUILD","BUILT","BUNCH","BURST","BUYER","CABIN","CABLE","CAMEL","CANDY","CARRY",
  "CATCH","CAUSE","CEDAR","CHAIR","CHAOS","CHARM","CHASE","CHEAP","CHECK","CHEEK",
  "CHESS","CHEST","CHIEF","CHILD","CHINA","CHOIR","CIVIC","CIVIL","CLAIM","CLASS",
  "CLEAN","CLEAR","CLERK","CLICK","CLIFF","CLIMB","CLING","CLOCK","CLOSE","CLOTH",
  "CLOUD","COACH","COAST","COLOR","COMET","COMIC","CORAL","COUNT","COURT","COVER",
  "CRACK","CRAFT","CRANE","CRASH","CRAZY","CREAM","CREEK","CRISP","CROSS","CROWD",
  "CROWN","CRUSH","CURVE","CYCLE","DAILY","DANCE","DEALT","DEATH","DEBUT","DELAY",
  "DEPOT","DEPTH","DERBY","DEVIL","DIGIT","DIRTY","DISCO","DITCH","DIZZY","DODGE",
  "DONOR","DOUBT","DOUGH","DRAFT","DRAIN","DRAMA","DRANK","DRAWN","DREAD","DREAM",
  "DRIED","DRIFT","DRILL","DRINK","DRIVE","DROVE","DYING","EAGER","EAGLE","EARLY",
  "EARTH","EIGHT","ELITE","EMPTY","ENEMY","ENJOY","ENTER","ENTRY","EQUIP","ERROR",
  "EVENT","EVERY","EXACT","EXIST","EXTRA","FABLE","FACED","FAITH","FALLS","FALSE",
  "FANCY","FATAL","FAULT","FEAST","FENCE","FETCH","FEVER","FIBER","FIELD","FIFTH",
  "FIGHT","FINAL","FIRST","FIXED","FLAME","FLASH","FLEET","FLESH","FLOAT","FLOOD",
  "FLOOR","FLOUR","FLOWN","FLUID","FOCUS","FORCE","FORGE","FORTH","FORUM","FOUND",
  "FRESH","FRONT","FROST","FROZE","FRUIT","FUNNY","GHOST","GIANT","GIVEN","GIVER",
  "GLASS","GLOOM","GLOVE","GLUED","GOING","GRACE","GRADE","GRAIN","GRAND","GRANT",
  "GRAPE","GRASP","GRASS","GRAVE","GREAT","GREEN","GREET","GRIEF","GRILL","GRIND",
  "GROAN","GROSS","GROUP","GROVE","GROWN","GUARD","GUESS","GUEST","GUIDE","GUILD",
  "GUILT","GUISE","HABIT","HAPPY","HARSH","HASTE","HAUNT","HAVEN","HEART","HEAVY",
  "HEDGE","HELLO","HENCE","HINGE","HIPPO","HOIST","HOLLY","HONOR","HORSE","HOTEL",
  "HUMAN","HUMOR","HURRY","IDEAL","IMAGE","INDEX","INPUT","ISSUE","IVORY","JAPAN",
  "JEWEL","JOKER","JUDGE","JUICE","JUICY","JUMBO","KNACK","KNIFE","KNOCK","KNOWN",
  "LABEL","LARGE","LASER","LATER","LAUGH","LAYER","LEARN","LEASE","LEAVE","LEGAL",
  "LEVEL","LIGHT","LIMIT","LIVER","LOCAL","LODGE","LOGIC","LOOSE","LOVER","LUCKY",
  "LYING","MAGIC","MAJOR","MAKER","MANOR","MARCH","MATCH","MAYOR","MEDIA","MERCY",
  "MERIT","METAL","MIGHT","MINOR","MINUS","MIXED","MODEL","MONEY","MONTH","MORAL",
  "MOTOR","MOUNT","MOUSE","MOUTH","MOVED","MOVIE","MUSIC","NADIR","NAIVE","NASTY",
  "NAVAL","NICHE","NIGHT","NOBLE","NOISE","NORTH","NOTED","NOVEL","NURSE","NYMPH",
  "OASIS","OCCUR","OCEAN","OFFER","OFTEN","ORDER","OTHER","OUTER","OWNER","OXIDE",
  "OZONE","PAINT","PANIC","PAPER","PARTY","PATCH","PAUSE","PEACE","PEACH","PEARL",
  "PHASE","PHONE","PHOTO","PIANO","PIECE","PILOT","PITCH","PLACE","PLAIN","PLANK",
  "PLANT","PLATE","PLAZA","PLEAD","PLUCK","POINT","POLAR","POPPY","PORCH","POSED",
  "POWER","PRESS","PRICE","PRIDE","PRIME","PRINT","PRIOR","PRIZE","PROBE","PRONE",
  "PROOF","PROSE","PROUD","PROVE","PROXY","PSALM","PURSE","QUEEN","QUERY","QUEST",
  "QUICK","QUIET","QUOTA","QUOTE","RADAR","RADIO","RAISE","RALLY","RANCH","RANGE",
  "RAPID","REACH","READY","REALM","REBEL","REFER","REIGN","REMIX","RENEW","REPLY",
  "REPAY","REUSE","RIDER","RIGHT","RIGID","RISKY","RIVAL","RIVER","ROBOT","ROCKY",
  "ROMAN","ROUGH","ROUND","ROUTE","ROYAL","RULER","RURAL","SADLY","SAINT","SALAD",
  "SAUCE","SCALE","SCARE","SCENE","SCOPE","SCORE","SCOUT","SEIZE","SENSE","SERVE",
  "SETUP","SEVEN","SHADE","SHAKE","SHALL","SHAME","SHAPE","SHARE","SHARP","SHIFT",
  "SHINE","SHIRT","SHOCK","SHOOT","SHORE","SHORT","SHOUT","SHRUG","SIEGE","SIGHT",
  "SIGMA","SILLY","SINCE","SIXTH","SIXTY","SKILL","SKULL","SLATE","SLEEP","SLICE",
  "SLIDE","SLOPE","SMART","SMELL","SMILE","SMOKE","SNAKE","SOLAR","SOLVE","SORRY",
  "SOUTH","SPACE","SPARE","SPARK","SPEAK","SPEED","SPEND","SPENT","SPICE","SPOKE",
  "SPORT","SPRAY","SQUAD","STACK","STAFF","STAGE","STAIN","STAKE","STALE","STAND",
  "STARK","START","STATE","STEEL","STEEP","STEER","STERN","STILL","STOCK","STONE",
  "STOOD","STORE","STORM","STORY","STOVE","STRAW","STRIP","STUCK","STUDY","STYLE",
  "SUGAR","SUITE","SUNNY","SUPER","SURGE","SWAMP","SWEEP","SWEET","SWEPT","SWIFT",
  "SWORD","TABLE","TAKEN","TASTE","TEACH","TENSE","TENTH","THEME","THERE","THESE",
  "THICK","THING","THINK","THIRD","THOSE","THREE","THREW","THROW","THUMB","TIDAL",
  "TIGER","TIGHT","TIMER","TIRED","TITLE","TODAY","TOKEN","TOPIC","TOTAL","TOUCH",
  "TOUGH","TOWER","TOXIC","TRACK","TRADE","TRAIL","TRAIN","TRAIT","TRAMP","TRASH",
  "TREAD","TREND","TRIAL","TRICK","TRIED","TROOP","TROUT","TRUCK","TRULY","TRUMP",
  "TRUNK","TRUST","TRUTH","TUMOR","TUNER","TWEAK","TWICE","TWIST","ULTRA","UNDER",
  "UNION","UNTIL","UPPER","UPSET","URBAN","USAGE","VALVE","VALUE","VIGOR","VIRAL",
  "VISIT","VISTA","VITAL","VIVID","VOCAL","VOICE","VOTER","VOWED","WASTE","WATCH",
  "WATER","WEARY","WEAVE","WEDGE","WEIGH","WEIRD","WHEEL","WHERE","WHILE","WHITE",
  "WHOLE","WHOSE","WIDER","WIDTH","WITCH","WITTY","WOMAN","WOMEN","WORLD","WORRY",
  "WORSE","WORST","WORTH","WOUND","WRATH","WRIST","WRITE","WRONG","YACHT","YIELD",
  "YOUNG","YOURS","YOUTH","ZEBRA","ZESTY"
];

const OUR_WORD_LIST = [
    "UNION", "DINER", "CLARK", "TAXES", "SHORE"
];

let targetWord   = "";
let currentRow   = 0;
let currentInput = [];
let gameOver     = false;

const board      = document.getElementById("board");
const keyboard   = document.getElementById("keyboard");
const msgBox     = document.getElementById("message-box");
const newGameBtn = document.getElementById("new-game-btn");

function getTile(row, col) {
  return board.querySelector(`.board-row:nth-child(${row + 1}) .tile:nth-child(${col + 1})`);
}

function getKey(letter) {
  return keyboard.querySelector(`.key[data-key="${letter}"]`);
}

function buildBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("board-row");
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function handleLetter(letter) {
  if (gameOver || currentInput.length >= 5) return;
  currentInput.push(letter);
  const tile = getTile(currentRow, currentInput.length - 1);
  tile.textContent = letter;
  tile.classList.add("filled");
}

function handleBackspace() {
  if (gameOver || currentInput.length === 0) return;
  const tile = getTile(currentRow, currentInput.length - 1);
  tile.textContent = "";
  tile.classList.remove("filled");
  currentInput.pop();
}

function handleEnter() {
  if (gameOver) return;
  if (currentInput.length < 5) {
    showMessage("Not enough letters");
    shakeRow(currentRow);
    return;
  }

  const guess = currentInput.join("");

  if (!WORD_LIST.includes(guess) && !OUR_WORD_LIST.includes(guess)) {
    showMessage("Not in word list");
    shakeRow(currentRow);
    return;
  }

  revealRow(guess);
}

function revealRow(guess) {
  const target = targetWord.split("");
  const result = Array(5).fill("absent");
  const remaining = [...target];

  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    const tile = getTile(currentRow, i);
    const delay = i * 300;

    setTimeout(() => {
      tile.classList.add("flip");
      setTimeout(() => {
        tile.classList.add(result[i]);
      }, 250);
    }, delay);

    setTimeout(() => {
      updateKey(guess[i], result[i]);
    }, delay + 300);
  }

  setTimeout(() => {
    checkWinLose(guess, result);
  }, 5 * 300 + 300);

  currentRow++;
  currentInput = [];
}

function updateKey(letter, state) {
  const key = getKey(letter);
  if (!key) return;
  const priority = { correct: 3, present: 2, absent: 1 };
  const currentState = key.dataset.state || "";
  if ((priority[state] || 0) > (priority[currentState] || 0)) {
    key.classList.remove("correct", "present", "absent");
    key.classList.add(state);
    key.dataset.state = state;
  }
}

function checkWinLose(guess, result) {
  const won = result.every(r => r === "correct");

  if (won) {
    gameOver = true;
    const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
    showMessage(msgs[currentRow - 1] || "You got it!");
    bounceRow(currentRow - 1);
    endGame();
  } else if (currentRow >= 6) {
    gameOver = true;
    showMessage(targetWord, 4000);
    endGame();
  }
}

function bounceRow(row) {
  for (let c = 0; c < 5; c++) {
    setTimeout(() => {
      getTile(row, c).classList.add("bounce");
    }, c * 100);
  }
}

function shakeRow(row) {
  for (let c = 0; c < 5; c++) {
    const tile = getTile(row, c);
    tile.classList.add("shake");
    tile.addEventListener("animationend", () => tile.classList.remove("shake"), { once: true });
  }
}

function endGame() {
  setTimeout(() => {
    newGameBtn.classList.remove("hidden");
  }, 1000);
}

let msgTimeout;
function showMessage(text, duration = 1800) {
  clearTimeout(msgTimeout);
  msgBox.textContent = text;
  msgBox.classList.remove("hidden");
  msgTimeout = setTimeout(() => {
    msgBox.classList.add("hidden")
  }, duration);
}

function startGame() {
  targetWord   = OUR_WORD_LIST[Math.floor(Math.random() * OUR_WORD_LIST.length)];
  currentRow   = 0;
  currentInput = [];
  gameOver     = false;

  buildBoard();
  resetKeyboard();
  newGameBtn.classList.add("hidden");
  msgBox.classList.add("hidden");
}

function resetKeyboard() {
  keyboard.querySelectorAll(".key").forEach(k => {
    k.classList.remove("correct", "present", "absent");
    delete k.dataset.state;
  });
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (key === "ENTER")           handleEnter();
  else if (key === "BACKSPACE")  handleBackspace();
  else if (/^[A-Z]$/.test(key)) handleLetter(key);
});

keyboard.addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;
  const k = btn.dataset.key;
  if (k === "ENTER")           handleEnter();
  else if (k === "BACKSPACE")  handleBackspace();
  else handleLetter(k);
});

newGameBtn.addEventListener("click", startGame);

startGame();