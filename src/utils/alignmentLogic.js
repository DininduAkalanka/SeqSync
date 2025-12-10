/**
 * Sequence Alignment Algorithms
 * Implements Needleman-Wunsch (Global) and Smith-Waterman (Local) with traceback.
 * Time: O(m×n), Space: O(m×n)
 */

/** Default scoring system (BLOSUM/PAM conventions) */
export const DEFAULT_SCORES = {
  match: 2,        // Reward for matching characters (positive reinforcement)
  mismatch: -1,    // Penalty for mismatches (biological mutations are costly)
  gap: -2,         // Gap penalty (insertions/deletions are expensive in evolution)
};

/**
 * Needleman-Wunsch Algorithm (Global Alignment)
 * Finds optimal end-to-end alignment with cumulative gap penalties.
 * 
 * Recurrence: F(i,j) = max{F(i-1,j-1)+s(xi,yj), F(i-1,j)+gap, F(i,j-1)+gap}
 * 
 * @param {string} seq1 - First sequence
 * @param {string} seq2 - Second sequence
 * @param {object} scores - {match, mismatch, gap}
 * @returns {object} {matrix, path, alignedSeq1, alignedSeq2, score}
 */
export function needlemanWunsch(
  seq1, 
  seq2, 
  scores = DEFAULT_SCORES
) {
  if (!seq1 || !seq2 || seq1.length === 0 || seq2.length === 0) {
    throw new Error('Both sequences must be non-empty');
  }
  
  const m = seq1.length;
  const n = seq2.length;
  
  // Initialize matrix with dimensions (m+1) x (n+1)
  const matrix = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Initialize edges with cumulative gap penalties (global alignment)
  for (let i = 0; i <= m; i++) matrix[i][0] = i * scores.gap;
  for (let j = 0; j <= n; j++) matrix[0][j] = j * scores.gap;
  
  // Fill matrix using dynamic programming
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = seq1[i - 1];
      const char2 = seq2[j - 1];
      const matchScore = char1 === char2 ? scores.match : scores.mismatch;
      
      const diagonal = matrix[i - 1][j - 1] + matchScore;
      const up = matrix[i - 1][j] + scores.gap;
      const left = matrix[i][j - 1] + scores.gap;
      
      matrix[i][j] = Math.max(diagonal, up, left);
    }
  }
  
  // Traceback from (m,n) to (0,0) to reconstruct alignment
  const path = [];
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  
  let i = m;
  let j = n;
  const epsilon = 1e-10;
  
  while (i > 0 || j > 0) {
    path.push({ row: i, col: j });
    
    if (i === 0) {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
      continue;
    }
    if (j === 0) {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
      continue;
    }
    
    const currentScore = matrix[i][j];
    const char1 = seq1[i - 1];
    const char2 = seq2[j - 1];
    const matchScore = char1 === char2 ? scores.match : scores.mismatch;
    
    const diagonalScore = matrix[i - 1][j - 1] + matchScore;
    const upScore = matrix[i - 1][j] + scores.gap;
    const leftScore = matrix[i][j - 1] + scores.gap;
    
    if (Math.abs(currentScore - diagonalScore) < epsilon) {
      alignedSeq1 = char1 + alignedSeq1;
      alignedSeq2 = char2 + alignedSeq2;
      i--; j--;
    } 
    else if (Math.abs(currentScore - upScore) < epsilon) {
      alignedSeq1 = char1 + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } 
    else if (Math.abs(currentScore - leftScore) < epsilon) {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = char2 + alignedSeq2;
      j--;
    }
    else {
      alignedSeq1 = char1 + alignedSeq1;
      alignedSeq2 = char2 + alignedSeq2;
      i--; j--;
    }
  }
  
  path.push({ row: 0, col: 0 });
  return {
    matrix,
    path: path.reverse(),
    alignedSeq1,
    alignedSeq2,
    score: matrix[m][n],
    algorithm: 'Needleman-Wunsch'
  };
}

/**
 * Smith-Waterman Algorithm (Local Alignment)
 * Finds optimal subsequence alignment with zero floor (no negative scores).
 * 
 * Recurrence: F(i,j) = max{0, F(i-1,j-1)+s(xi,yj), F(i-1,j)+gap, F(i,j-1)+gap}
 * 
 * @param {string} seq1 - First sequence
 * @param {string} seq2 - Second sequence
 * @param {object} scores - {match, mismatch, gap}
 * @returns {object} {matrix, path, alignedSeq1, alignedSeq2, score, startPos, endPos}
 */
export function smithWaterman(
  seq1, 
  seq2, 
  scores = DEFAULT_SCORES
) {
  if (!seq1 || !seq2 || seq1.length === 0 || seq2.length === 0) {
    throw new Error('Both sequences must be non-empty');
  }
  
  const m = seq1.length;
  const n = seq2.length;
  
  // Initialize matrix (edges remain 0 for local alignment)
  const matrix = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  let maxScore = 0;
  let maxPos = { row: 0, col: 0 };
  
  // Fill matrix with local alignment scoring
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = seq1[i - 1];
      const char2 = seq2[j - 1];
      const matchScore = char1 === char2 ? scores.match : scores.mismatch;
      
      const diagonal = matrix[i - 1][j - 1] + matchScore;
      const up = matrix[i - 1][j] + scores.gap;
      const left = matrix[i][j - 1] + scores.gap;
      
      matrix[i][j] = Math.max(0, diagonal, up, left);
      
      if (matrix[i][j] > maxScore) {
        maxScore = matrix[i][j];
        maxPos = { row: i, col: j };
      }
    }
  }
  
  // Traceback from max score to zero
  const path = [];
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  
  let i = maxPos.row;
  let j = maxPos.col;
  const epsilon = 1e-10;
  
  while (i > 0 && j > 0 && matrix[i][j] > epsilon) {
    path.push({ row: i, col: j });
    
    const currentScore = matrix[i][j];
    const char1 = seq1[i - 1];
    const char2 = seq2[j - 1];
    const matchScore = char1 === char2 ? scores.match : scores.mismatch;
    
    const diagonalScore = matrix[i - 1][j - 1] + matchScore;
    const upScore = matrix[i - 1][j] + scores.gap;
    const leftScore = matrix[i][j - 1] + scores.gap;
    
    if (Math.abs(currentScore - diagonalScore) < epsilon) {
      alignedSeq1 = char1 + alignedSeq1;
      alignedSeq2 = char2 + alignedSeq2;
      i--; j--;
    } 
    else if (Math.abs(currentScore - upScore) < epsilon) {
      alignedSeq1 = char1 + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } 
    else if (Math.abs(currentScore - leftScore) < epsilon) {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = char2 + alignedSeq2;
      j--;
    } 
    else {
      break;
    }
  }
  
  path.push({ row: i, col: j });
  return {
    matrix,
    path: path.reverse(),
    alignedSeq1,
    alignedSeq2,
    score: maxScore,
    startPos: { row: i, col: j },
    endPos: maxPos,
    algorithm: 'Smith-Waterman'
  };
}

/**
 * Format alignment for display with match indicators (|, :, space)
 * @param {string} seq1 - Aligned sequence with gaps
 * @param {string} seq2 - Aligned sequence with gaps
 * @returns {string} Formatted alignment string
 */
export function formatAlignment(seq1, seq2) {
  if (seq1.length !== seq2.length) {
    throw new Error('Aligned sequences must have equal length');
  }
  
  let matchLine = '';
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] === seq2[i]) {
      matchLine += '|';  // Perfect match
    } else if (seq1[i] === '-' || seq2[i] === '-') {
      matchLine += ' ';  // Gap
    } else {
      matchLine += ':';  // Mismatch
    }
  }
  
  return `${seq1}\n${matchLine}\n${seq2}`;
}

/**
 * Calculate alignment statistics (matches, mismatches, gaps, identity %)
 * @param {string} seq1 - Aligned sequence
 * @param {string} seq2 - Aligned sequence
 * @returns {object} {matches, mismatches, gaps, alignmentLength, identity, similarity}
 */
export function calculateAlignmentStats(seq1, seq2) {
  if (seq1.length !== seq2.length) {
    throw new Error('Aligned sequences must have equal length');
  }
  
  let matches = 0;
  let mismatches = 0;
  let gaps = 0;
  
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] === '-' || seq2[i] === '-') {
      gaps++;
    } else if (seq1[i] === seq2[i]) {
      matches++;
    } else {
      mismatches++;
    }
  }
  
  const alignmentLength = seq1.length;
  const identity = ((matches / alignmentLength) * 100).toFixed(2);
  const similarity = (((matches + mismatches) / alignmentLength) * 100).toFixed(2);
  
  return {
    matches,
    mismatches,
    gaps,
    alignmentLength,
    identity: `${identity}%`,
    similarity: `${similarity}%`,
  };
}


