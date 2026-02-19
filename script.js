console.log("JS読み込まれた");

let allWords = [];
let historySets = [];
const MAX_HISTORY = 5;

let currentWordCount = 1;
let gameState = "start";
let wordsLoaded = false;
let countInterval = null;

const startScreen = document.getElementById("startScreen");
const countScreen = document.getElementById("countScreen");
const wordScreen = document.getElementById("wordScreen");

const wordCountEl = document.getElementById("wordCount");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const startBtn = document.getElementById("startBtn");

/* ワード読み込み */
fetch("words.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON読み込み失敗");
    return res.json();
  })
  .then(data => {
    allWords = data;
    wordsLoaded = true;
    startBtn.disabled = false; // ← 読み込み完了で有効化
  })
  .catch(err => {
    console.error(err);
  });

/* ＋－操作 */
minusBtn.addEventListener("click", () => {
  if (currentWordCount > 1) {
    currentWordCount--;
    wordCountEl.textContent = currentWordCount;
  }
});

plusBtn.addEventListener("click", () => {
  if (currentWordCount < 4) {
    currentWordCount++;
    wordCountEl.textContent = currentWordCount;
  }
});

/* スタート */
startBtn.addEventListener("click", () => {
  if (gameState !== "start") return;
  if (!wordsLoaded) return;

  startCountSequence();
});

/* ワード画面タップ */
wordScreen.addEventListener("click", () => {
  if (gameState !== "words") return;

  startCountSequence();
});

/* 画面切替 */
function showScreen(id) {
  startScreen.classList.add("hidden");
  countScreen.classList.add("hidden");
  wordScreen.classList.add("hidden");

  document.getElementById(id).classList.remove("hidden");
}

/* カウント開始 */
function startCountSequence() {
  if (countInterval) {
    clearInterval(countInterval);
    countInterval = null;
  }

  gameState = "counting";
  showScreen("countScreen");

  let num = 3;
  countScreen.textContent = num;

  countInterval = setInterval(() => {
    num--;
    if (num > 0) {
      countScreen.textContent = num;
    } else {
      clearInterval(countInterval);
      countInterval = null;
      showWords();
    }
  }, 1000);
}

/* ワード表示 */
function showWords() {
  const words = generateWords(currentWordCount);
  renderWords(words);

  gameState = "words";
  showScreen("wordScreen");
}

/* ワード生成 */
function generateWords(count) {
  const recentWords = historySets.flat();
  const available = allWords.filter(word => !recentWords.includes(word));
  console.log("allWords:", allWords.length);

  shuffle(available);

  const selected = available.slice(0, count);

  historySets.push(selected);

  if (historySets.length > MAX_HISTORY) {
    historySets.shift();
  }

  return selected;
}

/* シャッフル */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* レンダリング */
function renderWords(words) {
  wordScreen.innerHTML = "";

  if (words.length === 1) {
    wordScreen.style.gridTemplateColumns = "1fr";
    wordScreen.style.gridTemplateRows = "1fr";
  } else if (words.length === 2) {
    wordScreen.style.gridTemplateColumns = "1fr 1fr";
    wordScreen.style.gridTemplateRows = "1fr";
  } else if (words.length === 3) {
    wordScreen.style.gridTemplateColumns = "repeat(3, 1fr)";
    wordScreen.style.gridTemplateRows = "1fr";
  } else if (words.length === 4) {
    wordScreen.style.gridTemplateColumns = "repeat(2, 1fr)";
    wordScreen.style.gridTemplateRows = "repeat(2, 1fr)";
  }

  words.forEach(word => {
    const div = document.createElement("div");
    div.className = "word";
    div.textContent = word;

    div.style.backgroundColor = getRandomColor();

    wordScreen.appendChild(div);
  });
}
