// ============================================================
//  wordGenerator.js
//  Project : TypeShift
//  Author  : Devansh Singh
// ============================================================

const WORD_LISTS = {
  easy: [
    "the","and","for","are","but","not","you","all","can","her",
    "was","one","our","out","day","get","has","him","his","how",
    "man","new","now","old","see","two","way","who","boy","did",
    "its","let","put","say","she","too","use","dad","mom","run",
    "sun","fun","big","cat","dog","sit","hat","map","red","bed",
    "top","cup","hot","job","log","mud","net","pan","rat","sad",
    "van","wet","yes","zip","arm","bag","car","ear","fig","gap",
    "hop","ice","jar","key","lip","nap","oak","pig","rug","sky",
    "toy","win","box","fly","cry","dry","try","spy","shy","joy",
    "ace","act","add","age","aid","aim","air","ant","ape","arc",
    "ash","ask","axe","bay","bit","bow","bug","bun","bus","buy",
    "bye","cod","cot","cow","cut","dew","dig","dim","dot","dug",
    "dye","egg","elm","end","eve","eye","fan","far","fat","fed",
    "fee","few","fin","fit","fix","fog","fox","fur","gel","gem",
    "gin","god","got","gum","gun","gut","guy","gym","ham","hay",
    "hen","hit","hug","hum","hut","imp","ivy","jam","jet","jog",
    "jot","jug","keg","kid","kin","kit","lad","lap","law","lay",
    "led","leg","lid","lit","lot","low","mad","mat","mob","mop",
    "nib","nil","nip","nod","nun","nut","oar","odd","oil","orb",
    "owl","own","pad","pal","pay","pea","pen","pet","pin","pit",
  ],

  common: [
    "the","be","to","of","and","in","that","have","it","for",
    "not","on","with","he","as","you","do","at","this","but",
    "his","by","from","they","we","say","her","she","or","an",
    "will","my","one","all","would","there","their","what","so",
    "up","out","if","about","who","get","which","go","me","when",
    "make","can","like","time","no","just","him","know","take",
    "people","into","year","your","good","some","could","them",
    "see","other","than","then","now","look","only","come","over",
    "think","also","back","after","use","how","our","work","first",
    "well","way","even","new","want","because","any","these","give",
    "day","most","us","great","between","need","large","often",
    "hand","high","place","hold","turn","help","start","city",
    "play","small","number","always","move","live","point","page",
    "letter","answer","found","study","still","learn","plant","food",
    "keep","feet","land","side","without","once","book","hear",
    "stop","idea","fish","north","base","read","door","sure",
    "dark","ball","heavy","pair","circle","language","story",
    "science","road","rain","rule","pull","cold","voice","fall",
    "power","drive","front","teach","week","green","quick","sleep",
    "warm","free","minute","strong","mind","clear","fact","street",
    "able","across","age","almost","along","already","area","baby",
    "become","before","began","being","below","best","better","body",
    "both","bring","built","called","came","cause","change","check",
    "class","close","color","common","contain","control","cover",
    "cross","cut","death","different","done","down","draw","each",
    "early","earth","east","enough","ever","every","example","eyes",
    "face","far","father","feel","few","field","fire","form",
    "four","game","girl","given","glass","gone","group","grow",
    "half","hard","head","heard","heart","heat","home","horse",
    "hour","house","human","hundred","instead","kept","kind","known",
    "last","later","less","level","light","line","list","little",
    "long","love","made","many","matter","might","money","more",
    "morning","mother","much","must","name","never","next","night",
    "none","nothing","notice","open","order","outside","own","part",
    "past","path","person","picture","piece","plan","poor","possible",
    "problem","process","program","public","quite","real","really",
    "reason","rest","result","right","river","rock","room","same",
    "seem","self","sense","serve","set","ship","show","since",
    "size","slow","something","sometimes","soon","south","space",
    "speak","speed","stand","stars","state","stay","step","store",
    "such","system","table","taken","talk","tell","thing","those",
    "thought","three","through","together","told","took","town",
    "tree","true","under","until","upon","used","usually","very",
    "walk","watch","water","where","while","white","wide","wind",
    "within","woman","women","word","world","write","young","zero",
  ],

  hard: [
    "aberration","ambiguous","anachronism","antithesis","arbitrary",
    "belligerent","benevolent","bureaucratic","cacophonous","circumspect",
    "clandestine","cognizant","complacent","convoluted","cryptographic",
    "debilitate","demagogue","despondent","dilapidated","discrepancy",
    "egregious","eloquence","ephemeral","equivocate","exacerbate",
    "fallacious","fastidious","formidable","frivolous","gratuitous",
    "gregarious","hegemony","hypocritical","idiosyncratic","impetuous",
    "incongruous","inquisitive","insidious","intransigent","juxtapose",
    "labyrinthine","loquacious","magnanimous","malevolent","meticulous",
    "nonchalant","obfuscate","obstreperous","omniscient","ostentatious",
    "paradoxical","perfidious","perspicacious","philanthropic","pragmatic",
    "precipitous","presumptuous","prevaricate","propitious","querulous",
    "quintessential","recalcitrant","reciprocate","remonstrate","resilient",
    "sagacious","sanguine","serendipitous","soliloquy","sophisticated",
    "spurious","stoic","surreptitious","tenacious","trepidation",
    "ubiquitous","unequivocal","vacillate","venerable","veracious",
    "vicarious","vindictive","vivacious","volatile","voracious"
  ],
};

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getWordList(difficulty = "common") {
  const list = WORD_LISTS[difficulty];

  if (!list) {
    throw new Error(
      `TypeShift: "${difficulty}" is not a valid difficulty. Please use easy, common, or hard.`
    );
  }

  return [...new Set(list)];
}

function _buildWordArray(pool, count) {
  const result = [];
  let available = shuffle(pool);
  let retryCount = 0;
  const maxRetries = pool.length * 3;

  while (result.length < count) {
    if (available.length === 0) {
      available = shuffle(pool);
      retryCount = 0;
    }

    const word = available.shift();
    const last = result[result.length - 1];

    if (word === last) {
      available.push(word);
      retryCount++;

      if (retryCount > maxRetries) {
        result.push(word);
        retryCount = 0;
      }
      continue;
    }

    result.push(word);
    retryCount = 0;
  }

  return result;
}

function generateWords(count = 30, difficulty = "common") {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(
      `TypeShift: count should be a positive number, but got: ${count}`
    );
  }

  const pool = getWordList(difficulty);
  return _buildWordArray(pool, count);
}

function generateFromCustomList(list, count = 30) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("TypeShift: Please pass a non-empty array of words.");
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new Error(
      `TypeShift: count should be a positive number, but got: ${count}`
    );
  }

  const pool = [
    ...new Set(list.map((w) => String(w).trim()).filter(Boolean)),
  ];

  if (pool.length === 0) {
    throw new Error(
      "TypeShift: No valid words found in the list after cleaning."
    );
  }

  return _buildWordArray(pool, count);
}

export {
  generateWords,
  generateFromCustomList,
  getWordList,
  shuffle,
};

// Browser support
if (typeof window !== "undefined") {
  window.TypeShift = {
    generate: generateWords,
    generateFromCustomList,
    getWordList,
    shuffle,
  };
}