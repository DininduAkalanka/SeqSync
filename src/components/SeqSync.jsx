/**
 * SeqSync - Sequence Alignment Visualization
 * React component with dark/light theming
 */

import { useState, useMemo } from 'react';
import {
  needlemanWunsch,
  smithWaterman,
  formatAlignment,
  calculateAlignmentStats,
  DEFAULT_SCORES,
} from '../utils/alignmentLogic';
import './SeqSync.css';

const SeqSync = () => {
  const [seq1, setSeq1] = useState('ACGTGATCA');
  const [seq2, setSeq2] = useState('AGCTACCA');
  const [algorithm, setAlgorithm] = useState('both');
  const [scores, setScores] = useState(DEFAULT_SCORES);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('seqsync-theme') === 'dark'
  );

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('seqsync-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const globalResult = useMemo(() => {
    if (!seq1 || !seq2) return null;
    try {
      return needlemanWunsch(seq1.toUpperCase(), seq2.toUpperCase(), scores);
    } catch (error) {
      console.error('Global alignment error:', error);
      return null;
    }
  }, [seq1, seq2, scores]);

  const localResult = useMemo(() => {
    if (!seq1 || !seq2) return null;
    try {
      return smithWaterman(seq1.toUpperCase(), seq2.toUpperCase(), scores);
    } catch (error) {
      console.error('Local alignment error:', error);
      return null;
    }
  }, [seq1, seq2, scores]);

  const isInPath = (path, row, col) => {
    if (!path) return false;
    return path.some(cell => cell.row === row && cell.col === col);
  };

  const loadExample = (exampleType) => {
    const examples = {
      dna: { seq1: 'ACGTGATCA', seq2: 'AGCTACCA' },
      protein: { seq1: 'HEAGAWGHEE', seq2: 'PAWHEAE' },
      similar: { seq1: 'GGTTGACTA', seq2: 'GGTTGACTA' },
      different: { seq1: 'AAAAAAA', seq2: 'TTTTTTT' },
    };
    
    const example = examples[exampleType];
    if (example) {
      setSeq1(example.seq1);
      setSeq2(example.seq2);
    }
  };

  const getCellClass = (score) => {
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'zero';
  };

  const renderMatrix = (result, title, type) => {
    if (!result) return null;

    const { matrix, path } = result;
    const seq1Upper = seq1.toUpperCase();
    const seq2Upper = seq2.toUpperCase();

    return (
      <div className="matrix-card">
        <div className="matrix-header">
          <div className="matrix-title">
            <span className={`algorithm-badge ${type}`}>{type === 'global' ? 'NW' : 'SW'}</span>
            <h3>{title}</h3>
          </div>
          <div className="matrix-score">
            <span className="score-label">Score</span>
            <span className="score-value">{result.score}</span>
          </div>
        </div>
        <div className="matrix-scroll">
          <table className="score-matrix">
            <thead>
              <tr>
                <th className="corner-cell"></th>
                <th>ε</th>
                {seq2Upper.split('').map((char, idx) => (
                  <th key={idx}>{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <th>{i === 0 ? 'ε' : seq1Upper[i - 1]}</th>
                  {row.map((cell, j) => {
                    const inPath = isInPath(path, i, j);
                    const cellClass = inPath ? 'in-path' : getCellClass(cell);
                    
                    return (
                      <td 
                        key={j} 
                        className={cellClass}
                        data-score={cell}
                        title={`Position: (${i}, ${j}) • Score: ${cell}`}
                      >
                        <span className="cell-value">{cell}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAlignment = (result, type) => {
    if (!result) return null;

    const { alignedSeq1, alignedSeq2, score, algorithm } = result;
    const stats = calculateAlignmentStats(alignedSeq1, alignedSeq2);
    const formattedAlignment = formatAlignment(alignedSeq1, alignedSeq2);

    return (
      <div className="alignment-card">
        <div className="alignment-header">
          <div className="alignment-title">
            <span className={`algorithm-badge ${type}`}>{type === 'global' ? 'NW' : 'SW'}</span>
            <h3>{algorithm}</h3>
          </div>
          <div className="score-pill">{score}</div>
        </div>
        
        <div className="alignment-visual">
          <pre className="alignment-text">{formattedAlignment}</pre>
        </div>
        
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon identity">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.identity}</span>
              <span className="stat-label">Identity</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon matches">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.matches}</span>
              <span className="stat-label">Matches</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon mismatches">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.mismatches}</span>
              <span className="stat-label">Mismatches</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon gaps">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.gaps}</span>
              <span className="stat-label">Gaps</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`seqsync-app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-name">SeqSync</span>
            <span className="brand-version">v3.0</span>
          </div>
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar: Controls */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2 className="sidebar-heading">
              <svg className="heading-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Input Sequences
            </h2>
            
            <div className="input-field">
              <label htmlFor="seq1" className="input-label">
                <span>Sequence 1</span>
                <span className="sequence-length">{seq1.length} bp</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="seq1"
                  type="text"
                  value={seq1}
                  onChange={(e) => setSeq1(e.target.value.toUpperCase())}
                  placeholder="e.g., ACGTGATCA"
                  className="text-input monospace"
                />
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="seq2" className="input-label">
                <span>Sequence 2</span>
                <span className="sequence-length">{seq2.length} bp</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="seq2"
                  type="text"
                  value={seq2}
                  onChange={(e) => setSeq2(e.target.value.toUpperCase())}
                  placeholder="e.g., AGCTACCA"
                  className="text-input monospace"
                />
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h2 className="sidebar-heading">
              <svg className="heading-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Algorithm
            </h2>
            
            <div className="algorithm-selector">
              <button
                className={`algo-btn ${algorithm === 'global' ? 'active' : ''}`}
                onClick={() => setAlgorithm('global')}
              >
                <span className="algo-badge">NW</span>
                <span className="algo-name">Needleman-Wunsch</span>
                <span className="algo-type">Global</span>
              </button>
              <button
                className={`algo-btn ${algorithm === 'local' ? 'active' : ''}`}
                onClick={() => setAlgorithm('local')}
              >
                <span className="algo-badge">SW</span>
                <span className="algo-name">Smith-Waterman</span>
                <span className="algo-type">Local</span>
              </button>
              <button
                className={`algo-btn ${algorithm === 'both' ? 'active' : ''}`}
                onClick={() => setAlgorithm('both')}
              >
                <span className="algo-badge">Both</span>
                <span className="algo-name">Compare</span>
                <span className="algo-type">Side-by-Side</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h2 className="sidebar-heading">
              <svg className="heading-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Quick Examples
            </h2>
            
            <div className="example-grid">
              <button onClick={() => loadExample('dna')} className="example-btn">
                <svg className="example-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>DNA Sample</span>
              </button>
              <button onClick={() => loadExample('protein')} className="example-btn">
                <svg className="example-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Protein</span>
              </button>
              <button onClick={() => loadExample('similar')} className="example-btn">
                <svg className="example-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Identical</span>
              </button>
              <button onClick={() => loadExample('different')} className="example-btn">
                <svg className="example-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Mismatch</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section collapsible">
            <button
              className="collapsible-header"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <svg className={`collapse-icon ${showAdvanced ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Advanced Scoring</span>
            </button>
            
            {showAdvanced && (
              <div className="collapsible-content">
                <div className="score-controls">
                  <div className="score-field">
                    <label className="score-label">Match Reward</label>
                    <input
                      type="number"
                      value={scores.match}
                      onChange={(e) => setScores({...scores, match: parseInt(e.target.value)})}
                      className="score-input"
                    />
                  </div>
                  <div className="score-field">
                    <label className="score-label">Mismatch Penalty</label>
                    <input
                      type="number"
                      value={scores.mismatch}
                      onChange={(e) => setScores({...scores, mismatch: parseInt(e.target.value)})}
                      className="score-input"
                    />
                  </div>
                  <div className="score-field">
                    <label className="score-label">Gap Penalty</label>
                    <input
                      type="number"
                      value={scores.gap}
                      onChange={(e) => setScores({...scores, gap: parseInt(e.target.value)})}
                      className="score-input"
                    />
                  </div>
                  <button
                    onClick={() => setScores(DEFAULT_SCORES)}
                    className="reset-btn"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Reset to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Alignment Results */}
          <section className="results-section">
            <div className="section-header">
              <h2 className="section-title">Alignment Results</h2>
            </div>
            <div className={`results-grid ${algorithm === 'both' ? 'two-col' : 'one-col'}`}>
              {(algorithm === 'global' || algorithm === 'both') && renderAlignment(globalResult, 'global')}
              {(algorithm === 'local' || algorithm === 'both') && renderAlignment(localResult, 'local')}
            </div>
          </section>

          {/* Matrix Visualization */}
          <section className="results-section">
            <div className="section-header">
              <h2 className="section-title">Score Matrices</h2>
              <div className="legend">
                <span className="legend-item">
                  <span className="legend-dot in-path"></span>
                  Optimal Path
                </span>
                <span className="legend-item">
                  <span className="legend-dot positive"></span>
                  Positive
                </span>
                <span className="legend-item">
                  <span className="legend-dot zero"></span>
                  Zero
                </span>
                <span className="legend-item">
                  <span className="legend-dot negative"></span>
                  Negative
                </span>
              </div>
            </div>
            <div className={`results-grid ${algorithm === 'both' ? 'two-col' : 'one-col'}`}>
              {(algorithm === 'global' || algorithm === 'both') && 
                renderMatrix(globalResult, 'Needleman-Wunsch Matrix', 'global')}
              {(algorithm === 'local' || algorithm === 'both') && 
                renderMatrix(localResult, 'Smith-Waterman Matrix', 'local')}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SeqSync;
