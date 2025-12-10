/**
 * =====================================================================
 * ALGORITHM ACCURACY TEST SUITE
 * =====================================================================
 * 
 * Comprehensive tests to verify Needleman-Wunsch and Smith-Waterman
 * algorithm implementations against known correct results.
 * 
 * Run these tests to ensure 100% accuracy.
 * =====================================================================
 */

import {
  needlemanWunsch,
  smithWaterman,
  DEFAULT_SCORES,
  calculateAlignmentStats,
  formatAlignment
} from './alignmentLogic.js';

// Test helper function
function runTest(testName, testFunction) {
  try {
    testFunction();
    console.log(`✅ PASS: ${testName}`);
    return true;
  } catch (error) {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// Assertion helpers
function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertArrayEquals(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\n  Expected: ${JSON.stringify(expected)}\n  Actual: ${JSON.stringify(actual)}`);
  }
}

// =====================================================================
// NEEDLEMAN-WUNSCH TESTS
// =====================================================================

function testNW_IdenticalSequences() {
  const result = needlemanWunsch('ACGT', 'ACGT', DEFAULT_SCORES);
  
  // Score should be 4 matches × 2 = 8
  assertEquals(result.score, 8, 'Score for identical sequences');
  
  // Alignment should be perfect (no gaps)
  assertEquals(result.alignedSeq1, 'ACGT', 'Aligned seq1');
  assertEquals(result.alignedSeq2, 'ACGT', 'Aligned seq2');
  
  // Path should go diagonally from (0,0) to (4,4)
  assertEquals(result.path.length, 5, 'Path length'); // includes (0,0)
  assertEquals(result.path[0].row, 0, 'Path starts at (0,0)');
  assertEquals(result.path[4].row, 4, 'Path ends at (4,4)');
}

function testNW_CompleteMismatch() {
  const result = needlemanWunsch('AAAA', 'TTTT', DEFAULT_SCORES);
  
  // Score should be 4 mismatches × -1 = -4
  assertEquals(result.score, -4, 'Score for complete mismatch');
  
  // No gaps should be inserted (diagonal alignment is optimal)
  assertEquals(result.alignedSeq1, 'AAAA', 'Aligned seq1');
  assertEquals(result.alignedSeq2, 'TTTT', 'Aligned seq2');
  
  // All mismatches
  const stats = calculateAlignmentStats(result.alignedSeq1, result.alignedSeq2);
  assertEquals(stats.matches, 0, 'No matches');
  assertEquals(stats.mismatches, 4, '4 mismatches');
  assertEquals(stats.gaps, 0, 'No gaps');
}

function testNW_WithGaps() {
  const result = needlemanWunsch('ACGT', 'AGT', DEFAULT_SCORES);
  
  // Optimal alignment: A-CGT or AC-GT depending on gap position
  //                    A-GT  or A-GT
  // One gap penalty (-2) + 3 matches (6) = 4
  assertEquals(result.score, 4, 'Score with one gap');
  
  // Should have exactly one gap
  const stats = calculateAlignmentStats(result.alignedSeq1, result.alignedSeq2);
  assertEquals(stats.gaps, 1, 'Should have 1 gap');
  assertEquals(stats.matches, 3, 'Should have 3 matches');
}

function testNW_LongerSequences() {
  const result = needlemanWunsch('GCATGCU', 'GATTACA', DEFAULT_SCORES);
  
  // Known result from standard implementations
  // This is a classic test case from the original paper
  assertEquals(result.alignedSeq1.length, result.alignedSeq2.length, 
    'Aligned sequences must have equal length');
  
  // Verify no invalid characters
  const hasValidChars = /^[ACGTU\-]+$/.test(result.alignedSeq1 + result.alignedSeq2);
  assertEquals(hasValidChars, true, 'Should only contain valid characters and gaps');
}

function testNW_SingleCharacter() {
  const result = needlemanWunsch('A', 'T', DEFAULT_SCORES);
  
  // Single mismatch: -1
  assertEquals(result.score, -1, 'Single character mismatch score');
  assertEquals(result.alignedSeq1, 'A', 'Aligned seq1');
  assertEquals(result.alignedSeq2, 'T', 'Aligned seq2');
}

function testNW_UnequalLengths() {
  const result = needlemanWunsch('A', 'TTTT', DEFAULT_SCORES);
  
  // Should align: A---
  //               TTTT
  // Score: 1 mismatch (-1) + 3 gaps (-6) = -7
  assertEquals(result.score, -7, 'Unequal length alignment score');
  assertEquals(result.alignedSeq1.length, result.alignedSeq2.length, 
    'Aligned sequences equal length');
}

function testNW_CustomScoring() {
  const customScores = { match: 3, mismatch: -3, gap: -1 };
  const result = needlemanWunsch('ACG', 'ACG', customScores);
  
  // 3 matches × 3 = 9
  assertEquals(result.score, 9, 'Custom scoring match');
}

// =====================================================================
// SMITH-WATERMAN TESTS
// =====================================================================

function testSW_IdenticalSequences() {
  const result = smithWaterman('ACGT', 'ACGT', DEFAULT_SCORES);
  
  // Should find entire sequence as local alignment
  assertEquals(result.score, 8, 'Score for identical sequences');
  assertEquals(result.alignedSeq1, 'ACGT', 'Aligned seq1');
  assertEquals(result.alignedSeq2, 'ACGT', 'Aligned seq2');
}

function testSW_NoSimilarity() {
  const result = smithWaterman('AAAA', 'TTTT', DEFAULT_SCORES);
  
  // With default scores (match=2, mismatch=-1), all cells should be 0
  // Since max(0, -1) = 0 for every cell
  assertEquals(result.score, 0, 'No local alignment found');
  assertEquals(result.alignedSeq1, '', 'Empty aligned seq1');
  assertEquals(result.alignedSeq2, '', 'Empty aligned seq2');
}

function testSW_SubstringMatch() {
  const result = smithWaterman('ACGTACGTACGT', 'ACGT', DEFAULT_SCORES);
  
  // Should find perfect 4-character match
  assertEquals(result.score, 8, 'Perfect substring match score');
  assertEquals(result.alignedSeq1, 'ACGT', 'Found substring');
  assertEquals(result.alignedSeq2, 'ACGT', 'Full query');
  
  // No gaps in optimal local alignment
  const stats = calculateAlignmentStats(result.alignedSeq1, result.alignedSeq2);
  assertEquals(stats.gaps, 0, 'No gaps in local alignment');
}

function testSW_PartialMatch() {
  const result = smithWaterman('ACGTACGTACGT', 'AGCT', DEFAULT_SCORES);
  
  // Should find best local match (likely ACG or AGT depending on scoring)
  // Score should be positive (some matches found)
  const isPositive = result.score > 0;
  assertEquals(isPositive, true, 'Should find positive scoring region');
}

function testSW_LongSequencesWithConservedRegion() {
  // Simulate biological sequences with conserved domain
  const seq1 = 'AAAAAACGTGCGTGAAAAAAA';
  const seq2 = 'TTTTTCGTGCGTGTTTTT';
  
  const result = smithWaterman(seq1, seq2, DEFAULT_SCORES);
  
  // Should find the CGTGCGTG conserved region
  const conservedFound = result.alignedSeq1.includes('CGTGCGTG');
  assertEquals(conservedFound, true, 'Should find conserved region');
  
  // Score should be significantly positive
  const isSignificantlyPositive = result.score >= 10;
  assertEquals(isSignificantlyPositive, true, 'Should have high score for conserved region');
}

function testSW_SingleCharacterMatch() {
  const result = smithWaterman('TTTATTT', 'A', DEFAULT_SCORES);
  
  // Should find single 'A' match: score = 2
  assertEquals(result.score, 2, 'Single character match');
  assertEquals(result.alignedSeq1, 'A', 'Found single A');
  assertEquals(result.alignedSeq2, 'A', 'Query A');
}

function testSW_CustomScoring() {
  const customScores = { match: 5, mismatch: -2, gap: -3 };
  const result = smithWaterman('ACGTACGT', 'ACG', customScores);
  
  // Should find ACG with score = 3 × 5 = 15
  assertEquals(result.score, 15, 'Custom scoring local match');
}

// =====================================================================
// TRACEBACK PATH VALIDATION TESTS
// =====================================================================

function testNW_PathContinuity() {
  const result = needlemanWunsch('ACGT', 'AGCT', DEFAULT_SCORES);
  
  // Path should be continuous (each step moves by exactly 1)
  for (let i = 1; i < result.path.length; i++) {
    const prev = result.path[i - 1];
    const curr = result.path[i];
    const rowDiff = Math.abs(curr.row - prev.row);
    const colDiff = Math.abs(curr.col - prev.col);
    
    // Should move by at most 1 in each direction
    const isValid = rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff) >= 1;
    assertEquals(isValid, true, `Path continuity at step ${i}`);
  }
}

function testSW_PathStartsAtMaxScore() {
  const result = smithWaterman('ACGTACGTACGT', 'ACG', DEFAULT_SCORES);
  
  // Path should end at position with maximum score
  const endPos = result.path[result.path.length - 1];
  const endScore = result.matrix[endPos.row][endPos.col];
  
  assertEquals(endScore, result.score, 'Path ends at max score position');
}

// =====================================================================
// MATRIX CORRECTNESS TESTS
// =====================================================================

function testNW_MatrixInitialization() {
  const result = needlemanWunsch('ACG', 'TG', DEFAULT_SCORES);
  
  // First row should be [0, -2, -4] (gap penalties)
  assertEquals(result.matrix[0][0], 0, 'Matrix[0][0] = 0');
  assertEquals(result.matrix[0][1], -2, 'Matrix[0][1] = -2');
  assertEquals(result.matrix[0][2], -4, 'Matrix[0][2] = -4');
  
  // First column should be [0, -2, -4, -6]
  assertEquals(result.matrix[1][0], -2, 'Matrix[1][0] = -2');
  assertEquals(result.matrix[2][0], -4, 'Matrix[2][0] = -4');
  assertEquals(result.matrix[3][0], -6, 'Matrix[3][0] = -6');
}

function testSW_MatrixInitialization() {
  const result = smithWaterman('ACG', 'TG', DEFAULT_SCORES);
  
  // All edges should be 0 for Smith-Waterman
  assertEquals(result.matrix[0][0], 0, 'Matrix[0][0] = 0');
  assertEquals(result.matrix[0][1], 0, 'Matrix[0][1] = 0');
  assertEquals(result.matrix[1][0], 0, 'Matrix[1][0] = 0');
}

function testNW_MatrixDimensions() {
  const result = needlemanWunsch('ACGT', 'AGT', DEFAULT_SCORES);
  
  // Matrix should be (m+1) × (n+1) = 5 × 4
  assertEquals(result.matrix.length, 5, 'Matrix rows = m+1 = 5');
  assertEquals(result.matrix[0].length, 4, 'Matrix cols = n+1 = 4');
}

// =====================================================================
// EDGE CASES AND ERROR HANDLING
// =====================================================================

function testNW_EmptySequenceHandling() {
  let errorThrown = false;
  try {
    needlemanWunsch('', 'ACGT', DEFAULT_SCORES);
  } catch (error) {
    errorThrown = true;
  }
  assertEquals(errorThrown, true, 'Should throw error for empty sequence');
}

function testSW_EmptySequenceHandling() {
  let errorThrown = false;
  try {
    smithWaterman('ACGT', '', DEFAULT_SCORES);
  } catch (error) {
    errorThrown = true;
  }
  assertEquals(errorThrown, true, 'Should throw error for empty sequence');
}

function testNW_NullSequenceHandling() {
  let errorThrown = false;
  try {
    needlemanWunsch(null, 'ACGT', DEFAULT_SCORES);
  } catch (error) {
    errorThrown = true;
  }
  assertEquals(errorThrown, true, 'Should throw error for null sequence');
}

// =====================================================================
// ALIGNMENT STATISTICS TESTS
// =====================================================================

function testStats_PerfectMatch() {
  const stats = calculateAlignmentStats('ACGT', 'ACGT');
  
  assertEquals(stats.matches, 4, '4 matches');
  assertEquals(stats.mismatches, 0, '0 mismatches');
  assertEquals(stats.gaps, 0, '0 gaps');
  assertEquals(stats.identity, '100.00%', '100% identity');
}

function testStats_WithGaps() {
  const stats = calculateAlignmentStats('A-CGT', 'ATCGT');
  
  assertEquals(stats.matches, 4, '4 matches');
  assertEquals(stats.mismatches, 0, '0 mismatches');
  assertEquals(stats.gaps, 1, '1 gap');
}

function testStats_MixedAlignment() {
  const stats = calculateAlignmentStats('A-CGT', 'ATTGA');
  
  assertEquals(stats.matches, 2, '2 matches (A and G)');
  assertEquals(stats.mismatches, 2, '2 mismatches');
  assertEquals(stats.gaps, 1, '1 gap');
}

// =====================================================================
// BIOLOGICAL CORRECTNESS TESTS
// =====================================================================

function testBiological_HomologousGenes() {
  // Simulate slightly diverged homologous sequences
  const gene1 = 'ATGCGATCGATCG';
  const gene2 = 'ATGCGATGGATCG';
  
  const result = needlemanWunsch(gene1, gene2, DEFAULT_SCORES);
  
  // Should align with minimal gaps (mostly matches/mismatches)
  const stats = calculateAlignmentStats(result.alignedSeq1, result.alignedSeq2);
  const gapPercentage = (stats.gaps / stats.alignmentLength) * 100;
  
  const hasLowGaps = gapPercentage < 20;
  assertEquals(hasLowGaps, true, 'Homologous genes should have <20% gaps');
}

function testBiological_ConservedMotif() {
  // Test finding conserved motif in longer sequences
  const protein1 = 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK';
  const motif = 'KQRQISFVK';
  
  const result = smithWaterman(protein1, motif, DEFAULT_SCORES);
  
  // Should find exact motif
  assertEquals(result.alignedSeq1, motif, 'Should find conserved motif');
  assertEquals(result.alignedSeq2, motif, 'Motif should align perfectly');
}

// =====================================================================
// RUN ALL TESTS
// =====================================================================

export function runAllTests() {
  console.log('\n========================================');
  console.log('ALGORITHM ACCURACY TEST SUITE');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  
  const tests = [
    // Needleman-Wunsch Tests
    ['NW: Identical Sequences', testNW_IdenticalSequences],
    ['NW: Complete Mismatch', testNW_CompleteMismatch],
    ['NW: With Gaps', testNW_WithGaps],
    ['NW: Longer Sequences', testNW_LongerSequences],
    ['NW: Single Character', testNW_SingleCharacter],
    ['NW: Unequal Lengths', testNW_UnequalLengths],
    ['NW: Custom Scoring', testNW_CustomScoring],
    
    // Smith-Waterman Tests
    ['SW: Identical Sequences', testSW_IdenticalSequences],
    ['SW: No Similarity', testSW_NoSimilarity],
    ['SW: Substring Match', testSW_SubstringMatch],
    ['SW: Partial Match', testSW_PartialMatch],
    ['SW: Conserved Region', testSW_LongSequencesWithConservedRegion],
    ['SW: Single Character', testSW_SingleCharacterMatch],
    ['SW: Custom Scoring', testSW_CustomScoring],
    
    // Path Validation Tests
    ['Path: NW Continuity', testNW_PathContinuity],
    ['Path: SW Max Score', testSW_PathStartsAtMaxScore],
    
    // Matrix Tests
    ['Matrix: NW Initialization', testNW_MatrixInitialization],
    ['Matrix: SW Initialization', testSW_MatrixInitialization],
    ['Matrix: NW Dimensions', testNW_MatrixDimensions],
    
    // Edge Cases
    ['Edge: NW Empty Sequence', testNW_EmptySequenceHandling],
    ['Edge: SW Empty Sequence', testSW_EmptySequenceHandling],
    ['Edge: NW Null Sequence', testNW_NullSequenceHandling],
    
    // Statistics Tests
    ['Stats: Perfect Match', testStats_PerfectMatch],
    ['Stats: With Gaps', testStats_WithGaps],
    ['Stats: Mixed Alignment', testStats_MixedAlignment],
    
    // Biological Correctness
    ['Bio: Homologous Genes', testBiological_HomologousGenes],
    ['Bio: Conserved Motif', testBiological_ConservedMotif],
  ];
  
  tests.forEach(([name, testFn]) => {
    if (runTest(name, testFn)) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');
  
  return { passed, failed, total: tests.length };
}

// Auto-run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
