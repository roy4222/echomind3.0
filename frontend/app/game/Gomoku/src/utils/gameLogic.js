/**
 * 初始化棋盤
 * @param {number} size - 棋盤大小
 * @returns {Array} - 初始化的二維棋盤
 */
export const initializeBoard = (size = 15) => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

/**
 * 檢查是否有連續五個相同的棋子
 * @param {Array} board - 當前棋盤狀態
 * @param {number} row - 最後一步的行號
 * @param {number} col - 最後一步的列號
 * @param {string} player - 玩家棋子類型 ('black' 或 'white')
 * @returns {boolean} - 是否獲勝
 */
export const checkWinner = (board, row, col, player) => {
  const size = board.length;
  const directions = [
    [0, 1],   // 水平方向 →
    [1, 0],   // 垂直方向 ↓
    [1, 1],   // 右下對角線 ↘
    [1, -1]   // 左下對角線 ↙
  ];

  for (const [dx, dy] of directions) {
    let count = 1;  // 當前位置

    // 正向檢查 →
    for (let i = 1; i < 5; i++) {
      const newRow = row + (i * dx);
      const newCol = col + (i * dy);

      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    // 反向檢查 ←
    for (let i = 1; i < 5; i++) {
      const newRow = row - (i * dx);
      const newCol = col - (i * dy);

      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    // 如果有連續5個相同的棋子，則獲勝
    if (count >= 5) {
      return true;
    }
  }

  return false;
};

/**
 * 獲取遊戲狀態文字
 * @param {string|null} winner - 勝利者
 * @param {boolean} isBlackNext - 是否輪到黑棋
 * @returns {string} - 狀態文字
 */
export const getGameStatus = (winner, isBlackNext) => {
  if (winner) return `贏家: ${winner === 'black' ? '黑棋' : '白棋'}`;
  return `當前玩家: ${isBlackNext ? '黑棋' : '白棋'}`;
};

/**
 * 判斷棋盤是否已滿
 * @param {Array} board - 當前棋盤狀態
 * @returns {boolean} - 棋盤是否已滿
 */
export const isBoardFull = (board) => {
  for (const row of board) {
    for (const cell of row) {
      if (cell === null) {
        return false;
      }
    }
  }
  return true;
};

/**
 * 分析棋型模式
 * @param {Array} line - 長度為5的棋型
 * @returns {Object} - 包含黑棋、白棋、空格數量和是否連續的信息
 */
const analyzePattern = (line) => {
  const blackCount = line.filter(cell => cell === 'black').length;
  //過濾黑色棋子
  const whiteCount = line.filter(cell => cell === 'white').length;
  //過濾白色棋子
  const emptyCount = line.filter(cell => cell === null).length;
  //過濾空格棋子

  // 檢查是否連續（沒有被對方棋子分隔）
  let isConsecutiveBlack = false;
  let isConsecutiveWhite = false;

  if (blackCount > 0 && whiteCount === 0) {
    isConsecutiveBlack = false;  // 預設為 false
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 'black') {
        let consecutiveCount = 1;  // 計算連續區域內的黑子數
        let emptySpaces = 0;      // 計算空格數
        let j = i + 1;

        while (j < line.length && emptySpaces <= 1) {  // 最多允許一個空格
          if (line[j] === 'black') {
            consecutiveCount++;
          } else if (line[j] === null) {
            emptySpaces++;
          }
          j++;
        }

        if (consecutiveCount === blackCount && emptySpaces <= 1) {
          isConsecutiveBlack = true;
          break;
        }
      }
    }
  }

  if (whiteCount > 0 && blackCount === 0) {
    isConsecutiveWhite = true;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 'white') {
        let j = i;
        while (j < line.length && (line[j] === 'white' || line[j] === null)) {
          j++;
        }
        if (j - i >= whiteCount) {
          isConsecutiveWhite = true;
          break;
        }
      }
    }
  }

  return {
    blackCount,
    whiteCount,
    emptyCount,
    isConsecutiveBlack,
    isConsecutiveWhite
  };
};

/**
 * 計算棋型得分
 * @param {Array} line - 一行棋子
 * @param {string} aiPlayer - AI的棋子類型
 * @param {string} humanPlayer - 人類玩家的棋子類型
 * @returns {number} - 該行的評分
 */
const evaluateLine = (line, aiPlayer, humanPlayer) => {
  // 使用模式分析
  const pattern = analyzePattern(line);
  const { blackCount, whiteCount, emptyCount, isConsecutiveBlack, isConsecutiveWhite } = pattern;

  // 獲取AI和人類玩家的棋子計數
  const aiCount = aiPlayer === 'black' ? blackCount : whiteCount;
  const humanCount = humanPlayer === 'black' ? blackCount : whiteCount;
  const isConsecutiveAI = aiPlayer === 'black' ? isConsecutiveBlack : isConsecutiveWhite;
  const isConsecutiveHuman = humanPlayer === 'black' ? isConsecutiveBlack : isConsecutiveWhite;

  // 如果同時有AI棋子和人類棋子，則此行無價值=>不會得分
  if (aiCount > 0 && humanCount > 0) {
    return 0;
  }

  // AI棋子評分
  if (aiCount > 0 && isConsecutiveAI) {
    if (aiCount === 5) return 100000;
    if (aiCount === 4 && emptyCount === 1) return 20000;
    if (aiCount === 3 && emptyCount === 2) return 8000; // 提高活三的評分
    if ((aiCount === 2 && emptyCount === 3) || (aiCount === 4 && emptyCount === 0)) return 800;
    if ((aiCount === 1 && emptyCount === 4) || (aiCount === 3 && emptyCount === 1)) return 150;
  }

  // 人類棋子評分（防守）
  if (humanCount > 0 && isConsecutiveHuman) {
    if (humanCount === 4 && emptyCount === 1) return 50000;
    if (humanCount === 3 && emptyCount === 2) return 15000; // 提高活三的防守權重
    if (humanCount === 2 && emptyCount === 3) return 1000;
    if (humanCount === 1 && emptyCount === 4) return 200;
  }

  return 0;
};

/**
 * 評估特定位置的價值
 * @param {Array} board - 當前棋盤狀態
 * @param {number} row - 行號
 * @param {number} col - 列號
 * @param {string} player - 玩家類型
 * @returns {number} - 位置價值
 */
const evaluatePosition = (board, row, col, player) => {
  const size = board.length;
  const opponent = player === 'black' ? 'white' : 'black';
  let value = 0;

  // 檢查周圍8個方向
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const [dx, dy] of directions) {
    // 檢查該方向上的連子情況
    let playerCount = 0;
    let emptyCount = 0;

    // 向該方向檢查4步
    for (let step = 1; step <= 4; step++) {
      const newRow = row + step * dx;
      const newCol = col + step * dy;

      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        break;
      }

      if (board[newRow][newCol] === player) {
        playerCount++;
      } else if (board[newRow][newCol] === null) {
        emptyCount++;
      } else {
        break;
      }
    }

    // 向相反方向檢查
    for (let step = 1; step <= 4; step++) {
      const newRow = row - step * dx;
      const newCol = col - step * dy;

      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        break;
      }

      if (board[newRow][newCol] === player) {
        playerCount++;
      } else if (board[newRow][newCol] === null) {
        emptyCount++;
      } else {
        break;
      }
    }

    // 根據連子情況評分
    if (playerCount >= 4) {
      value += 10000;  // 接近獲勝
    } else if (playerCount === 3 && emptyCount >= 1) {
      value += 1000;   // 潛在的活三
    } else if (playerCount === 2 && emptyCount >= 2) {
      value += 100;    // 潛在的活二
    }
  }

  return value;
};

/**
 * 評估棋局分數
 * @param {Array} board - 當前棋盤狀態
 * @param {string} aiPlayer - AI的棋子類型
 * @param {string} humanPlayer - 人類玩家的棋子類型
 * @returns {number} - 棋局的總評分
 */
const evaluateBoard = (board, aiPlayer, humanPlayer) => {
  const size = board.length;
  let score = 0;

  // 評估所有行
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 5; col++) { //減五因為要看是否有連續五個
      const line = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
        board[row][col + 4]
      ];
      score += evaluateLine(line, aiPlayer, humanPlayer);
    }
  }

  // 評估所有列
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 5; row++) {
      const line = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
        board[row + 4][col]
      ];
      score += evaluateLine(line, aiPlayer, humanPlayer);
    }
  }

  // 評估所有右下對角線
  for (let row = 0; row <= size - 5; row++) {
    for (let col = 0; col <= size - 5; col++) {
      const line = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
        board[row + 4][col + 4]
      ];
      score += evaluateLine(line, aiPlayer, humanPlayer);
    }
  }

  // 評估所有左下對角線
  for (let row = 0; row <= size - 5; row++) {
    for (let col = 4; col < size; col++) {
      const line = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
        board[row + 4][col - 4]
      ];
      score += evaluateLine(line, aiPlayer, humanPlayer);
    }
  }

  return score;
};

/**
 * 尋找雙活三（Double Live Three）的位置
 * @param {Array} board - 當前棋盤狀態
 * @param {string} player - 玩家棋子類型
 * @returns {Array} - 需要堵住的位置陣列 [[row, col], ...]
 */
const findDoubleLiveThree = (board, player) => {
  const size = board.length;
  const threatPositions = new Set(); // 使用 Set 避免重複位置

  // 檢查所有位置
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // 檢查四個方向
      const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
      ];

      for (const [dx, dy] of directions) {
        // 獲取當前位置的五子連線
        const line = [];
        const positions = []; // 記錄每個位置的座標

        for (let i = -2; i <= 2; i++) { //-2 -1 0 1 2 (0為中心點)
          const r = row + i * dx;
          const c = col + i * dy;
          if (r >= 0 && r < size && c >= 0 && c < size) {
            line.push(board[r][c]); //.push() --> 新增新的元素到陣列(用於陣列)//.add用於Set
            positions.push([r, c]); //line新增元素 position新增座標位址
          } else {
            line.push('OUT');
            positions.push(null);
          }
        }

        // 檢查是否為活三：空-黑-黑-黑-空
        if (
          line[0] === null &&
          line[1] === player &&
          line[2] === player &&
          line[3] === player &&
          line[4] === null
        ) {
          // 將兩端的空位加入威脅位置
          if (positions[0]) threatPositions.add(JSON.stringify(positions[0])); // 左邊空位 .stringify()將 JavaScript 物件或值轉換為 JSON 字串
          if (positions[4]) threatPositions.add(JSON.stringify(positions[4])); // 右邊空位
        }
      }
    }
  }

  // 將 Set 轉回陣列並解析座標
  return Array.from(threatPositions).map(pos => JSON.parse(pos));
  // 將 JSON 字串轉回陣列
  // Array.from() 將 Set 轉回陣列，例如['[3,4]', '[5,6]']
  // .map() 將每個字串解析為陣列
  // 輸入：['[3,4]', '[5,6]']
  // 輸出：[[3,4], [5,6]]
};

/**
 * 電腦AI下棋
 * @param {Array} board - 當前棋盤狀態，二維陣列
 * @param {string} aiPlayer - AI的棋子類型 ('black' 或 'white')
 * @param {string} difficulty - 難度 ('easy', 'medium', 'hard')
 * @returns {Array} - AI選擇的位置 [row, col]
 */
export const computerMove = (board, aiPlayer, difficulty) => {
  const size = board.length;
  const humanPlayer = aiPlayer === 'black' ? 'white' : 'black';

  // 找到所有空格子
  const emptySquares = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) {
        emptySquares.push([row, col]);
      }
    }
  }

  // 如果沒有空格，返回無效位置
  if (emptySquares.length === 0) return [-1, -1];

  // 如果是第一步，優先選擇中心位置
  if (emptySquares.length === size * size) {
    const center = Math.floor(size / 2);
    return [center, center];
  }

  // 立即防守和進攻檢查 - 不考慮難度
  // 1. 檢查是否能贏 - 所有難度都會嘗試直接獲勝
  for (const [row, col] of emptySquares) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    //因為是不同的物件引用，所以要用JSON.stringify()轉換成字串再轉回物件
    
    boardCopy[row][col] = aiPlayer;
    if (checkWinner(boardCopy, row, col, aiPlayer)) {
      return [row, col];
    }
  }

  // 2. 阻止對手立即獲勝 - 所有難度都會阻止對手直接獲勝（簡單模式也有較高機率會防守）
  const threatPositions = [];
  for (const [row, col] of emptySquares) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy[row][col] = humanPlayer;
    if (checkWinner(boardCopy, row, col, humanPlayer)) {
      if (difficulty === 'easy' && Math.random() < 0.8) {
        return [row, col]; // 簡單模式有80%機率會阻止對手獲勝
      } else if (difficulty !== 'easy') {
        return [row, col]; // 中等和困難模式總是阻止對手獲勝
      }
      threatPositions.push([row, col]);
    }
  }

  // 雙活三防守邏輯
  const doubleLiveThreeBlocks = findDoubleLiveThree(board, humanPlayer);
  if (doubleLiveThreeBlocks.length > 0) {
    // 優先堵住雙活三的延伸點
    // 若有多個，隨機選一個
    const idx = Math.floor(Math.random() * doubleLiveThreeBlocks.length);
    return doubleLiveThreeBlocks[idx];
  }

  // 如果簡單難度沒有阻止玩家獲勝，但有威脅存在
  if (difficulty === 'easy' && threatPositions.length > 0 && Math.random() < 0.5) {
    // 50%機率隨機選擇一個非威脅位置
    const nonThreatPositions = emptySquares.filter(([r, c]) =>
      !threatPositions.some(([tr, tc]) => r === tr && c === tc)
    );
    if (nonThreatPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * nonThreatPositions.length);
      return nonThreatPositions[randomIndex];
    }
  }

  // 3. 識別和防守潛在威脅（如活三等）
  const potentialThreats = [];
  for (const [row, col] of emptySquares) {
    // 檢查這個位置是否能形成玩家的活三或以上威脅
    const threatValue = evaluatePosition(board, row, col, humanPlayer);
    if (threatValue >= 1000) { // 活三及以上威脅
      potentialThreats.push({ row, col, value: threatValue });
    }
  }

  // 優先處理最高威脅（中等和困難模式）
  if (potentialThreats.length > 0 && difficulty !== 'easy') {
    potentialThreats.sort((a, b) => b.value - a.value);
    const highestThreat = potentialThreats[0];

    // 困難模式總是應對最高威脅，中等模式有85%機率應對
    if (difficulty === 'hard' || (difficulty === 'medium' && Math.random() < 0.85)) {
      return [highestThreat.row, highestThreat.col];
    }
  }

  // 簡單難度下隨機下棋的機率提高
  if (difficulty === 'easy' && Math.random() < 0.7) {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }

  // 計算每個空格的得分，根據難度選擇最佳移動
  let bestScore = -Infinity;
  let bestMoves = [];

  // 對於困難模式，只考慮靠近已有棋子的位置，提高效率
  const candidateSquares = difficulty === 'hard'
    ? emptySquares.filter(([row, col]) => countAdjacentPieces(board, row, col) > 0)
    : emptySquares;

  // 如果沒有符合條件的候選位置，使用所有空位
  const squaresToEvaluate = candidateSquares.length > 0 ? candidateSquares : emptySquares;

  for (const [row, col] of squaresToEvaluate) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy[row][col] = aiPlayer;

    // 計算這一步的得分
    let moveScore = 0;

    // 評估棋局分數
    moveScore = evaluateBoard(boardCopy, aiPlayer, humanPlayer);

    // 困難模式時考慮更多戰略因素
    if (difficulty === 'hard') {
      // 優先選擇靠近已有棋子的位置
      const adjacentScore = countAdjacentPieces(board, row, col) * 15;
      moveScore += adjacentScore;

      // 優先選擇中心區域的位置
      const centerRow = Math.floor(size / 2);
      const centerCol = Math.floor(size / 2);
      const distanceToCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );
      moveScore -= distanceToCenter * 5; // 提高中心位置的重要性

      // 額外防守檢查 - 檢查這一步是否可以同時防守多個威脅
      let blockedThreats = 0;
      for (const [checkRow, checkCol] of emptySquares) {
        if (checkRow !== row || checkCol !== col) {
          const tempBoard = JSON.parse(JSON.stringify(boardCopy));
          tempBoard[checkRow][checkCol] = humanPlayer;
          // 如果這步棋後人類仍有獲勝的地方，則降低評分
          if (checkWinner(tempBoard, checkRow, checkCol, humanPlayer)) {
            moveScore -= 3000; // 顯著降低評分
            blockedThreats--;
          }

          // 檢查這步棋是否阻止了潛在威脅
          const currentThreatValue = evaluatePosition(board, checkRow, checkCol, humanPlayer);
          const newThreatValue = evaluatePosition(tempBoard, checkRow, checkCol, humanPlayer);
          if (currentThreatValue > 500 && newThreatValue < currentThreatValue) {
            blockedThreats++;
          }
        }
      }
      moveScore += blockedThreats * 500; // 獎勵能阻止多個威脅的位置

      // 檢查這步棋是否能形成連續的棋子線
      const aiValue = evaluatePosition(boardCopy, row, col, aiPlayer);
      moveScore += aiValue * 0.8; // 鼓勵形成自己的威脅
    }

    // 更新最佳移動
    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMoves = [[row, col]];
    } else if (moveScore === bestScore) {
      bestMoves.push([row, col]);
    }
  }

  // 如果是簡單難度，有50%的機會選擇次優解
  if (difficulty === 'easy' && bestMoves.length > 1 && Math.random() < 0.5) {
    // 移除最佳移動
    bestMoves.shift();
  }

  // 如果是中等難度，有20%的機會選擇次優解
  if (difficulty === 'medium' && bestMoves.length > 1 && Math.random() < 0.2) {
    // 移除最佳移動
    bestMoves.shift();
  }

  // 從最佳移動中隨機選擇一個
  const randomIndex = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[randomIndex];
};

/**
 * 計算周圍已有的棋子數量
 * @param {Array} board - 當前棋盤狀態
 * @param {number} row - 行號
 * @param {number} col - 列號
 * @returns {number} - 周圍棋子數量
 */
const countAdjacentPieces = (board, row, col) => {
  const size = board.length;
  let count = 0;

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (dx === 0 && dy === 0) continue; // 跳過自身

      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size &&
        board[newRow][newCol] !== null
      ) {
        // 距離為1的位置權重更高
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        count += distance === 1 ? 3 : 1; // 提高緊鄰棋子的權重
      }
    }
  }

  return count;
};