// makes it so each day has its own seed --> same puzzles for the same day

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function getDailySeed(difficulty) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${difficulty}`;
  return parseInt(dateStr);
}

// generates the solved sudoku board with all numbers filled in

function generateSolved(rng) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function possible(b, r, c, n) {
    for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[br + i][bc + j] === n) return false;
    return true;
  }

  function solve(b) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (b[r][c] === 0) {
        const nums = [1,2,3,4,5,6,7,8,9].sort(() => rng() - 0.5);
        for (const n of nums) {
          if (possible(b, r, c, n)) { b[r][c] = n; if (solve(b)) return true; b[r][c] = 0; }
        }
        return false;
      }
    }
    return true;
  }

  solve(board);
  return board;
}

// takes the solved sudoku board and rnaodmly removes some of the numbers to create the starting board

function makePuzzle(solved, clues, rng) {
  const puzzle = solved.map(r => [...r]);
  const cells = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c]);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  let removed = 0;
  const target = 81 - clues;
  for (const [r, c] of cells) {
    if (removed >= target) break;
    puzzle[r][c] = 0;
    removed++;
  }
  return puzzle;
}

// Generates the puzzle for the day depending on seed + manages clock + other logistics while playing

let solved, puzzle, player, selected, history;
let timerInterval, seconds, gameOver;
let cluesCount = 36;

function init() {
  const seed = getDailySeed(cluesCount);
  const rng = mulberry32(seed);
  solved = generateSolved(rng);
  puzzle = makePuzzle(solved, cluesCount, rng);
  player = puzzle.map(r => [...r]);
  selected = null;
  history = [];
  gameOver = false;
  seconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(tick, 1000);
  document.getElementById('status').textContent = '';
  document.getElementById('status').className = 'status';
  renderGrid();
  updateTimer();
}

function resetProgress() {
  player = puzzle.map(r => [...r]);
  history = [];
  gameOver = false;
  seconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(tick, 1000);
  document.getElementById('status').textContent = '';
  document.getElementById('status').className = 'status';
  renderGrid();
  updateTimer();
}

function tick() {
  if (!gameOver) { seconds++; updateTimer(); }
}

function updateTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}


function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = r;
    cell.dataset.col = c;
    if (puzzle[r][c] !== 0) cell.classList.add('given');
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.readOnly = true;
    if (player[r][c] !== 0) input.value = player[r][c];
    cell.appendChild(input);
    cell.addEventListener('click', () => selectCell(r, c));
    grid.appendChild(cell);
  }
  applyHighlights();
}

function getCell(r, c) {
  return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function applyHighlights() {
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'matched', 'selected', 'error'));
  if (selected === null) return;
  const [sr, sc] = selected;
  const val = player[sr][sc];
  for (let i = 0; i < 9; i++) {
    getCell(sr, i)?.classList.add('highlighted');
    getCell(i, sc)?.classList.add('highlighted');
  }
  const br = Math.floor(sr / 3) * 3, bc = Math.floor(sc / 3) * 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) getCell(br + i, bc + j)?.classList.add('highlighted');
  if (val !== 0) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (player[r][c] === val) getCell(r, c)?.classList.add('matched');
    }
  }
  getCell(sr, sc)?.classList.add('selected');
}

function refreshCell(r, c) {
  const cell = getCell(r, c);
  if (!cell) return;
  cell.querySelector('input').value = player[r][c] !== 0 ? player[r][c] : '';
  applyHighlights();
}

function selectCell(r, c) {
  selected = [r, c];
  applyHighlights();
}

// updates input form user + checks if things are correct

function enterDigit(n) {
  if (selected === null || gameOver) return;
  const [r, c] = selected;
  if (puzzle[r][c] !== 0) return;
  history.push({ r, c, prev: player[r][c] });
  player[r][c] = n;
  refreshCell(r, c);
  checkWin();
}

function undo() {
  if (!history.length) return;
  const { r, c, prev } = history.pop();
  player[r][c] = prev;
  refreshCell(r, c);
}

function checkAll() {
  let hasError = false;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const cell = getCell(r, c);
    if (!cell) continue;
    cell.classList.remove('error');
    if (player[r][c] !== 0 && puzzle[r][c] === 0 && player[r][c] !== solved[r][c]) {
      cell.classList.add('error');
      hasError = true;
    }
  }
}

function checkWin() {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (player[r][c] !== solved[r][c]) return;
  gameOver = true;
  clearInterval(timerInterval);
  const st = document.getElementById('status');
  st.textContent = `Solved in ${document.getElementById('timer').textContent}! 🎉`;
  st.className = 'status win';
}

// for the keyboard

document.addEventListener('keydown', e => {
  if (gameOver) return;
  if (e.key >= '1' && e.key <= '9') { enterDigit(+e.key); return; }
  if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { enterDigit(0); return; }
  if (!selected) return;
  const [r, c] = selected;
  const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (moves[e.key]) {
    e.preventDefault();
    const [dr, dc] = moves[e.key];
    selectCell(Math.max(0, Math.min(8, r + dr)), Math.max(0, Math.min(8, c + dc)));
  }
});

// for the number pad

const numpad = document.getElementById('numpad');
for (let n = 1; n <= 9; n++) {
  const btn = document.createElement('button');
  btn.className = 'num-btn';
  btn.textContent = n;
  btn.addEventListener('click', () => enterDigit(n));
  numpad.appendChild(btn);
}
const eraseBtn = document.createElement('button');
eraseBtn.className = 'num-btn erase';
eraseBtn.textContent = 'Erase';
eraseBtn.addEventListener('click', () => enterDigit(0));
numpad.appendChild(eraseBtn);

// all the buttons at the top 

document.getElementById('new-btn').addEventListener('click', resetProgress);
document.getElementById('check-btn').addEventListener('click', checkAll);
document.getElementById('undo-btn').addEventListener('click', undo);

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cluesCount = +btn.dataset.clues;
    init();
  });
});

// actually starting the game 

init();