# 🧬 SeqSync

SeqSync is a modern bioinformatics tool designed to demystify complex sequence alignment algorithms. Bridging the gap between Computational Biology and Frontend Engineering, it provides a real-time, interactive environment for exploring DNA alignment.

## ✨ Features

- **Dual Algorithm Support**: Global and local alignment with side-by-side comparison
- **Interactive Matrices**: Color-coded DP tables with optimal path highlighting
- **Real-time Statistics**: Identity percentage, matches, mismatches, and gap counts
- **Dark/Light Theme**: GitHub-inspired professional design with theme persistence
- **Custom Scoring**: Adjustable match, mismatch, and gap penalties
- **Quick Examples**: Pre-loaded DNA and protein sequences

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/seqsync.git
cd seqsync

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🛠️ Tech Stack

- **React 19** - Modern UI with hooks (useState, useMemo)
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with theme system
- **JavaScript ES6+** - Clean, documented algorithms

## 📖 Algorithms

### Needleman-Wunsch (Global Alignment)
Finds optimal end-to-end alignment using dynamic programming with cumulative gap penalties.

**Complexity**: O(m×n) time, O(m×n) space

### Smith-Waterman (Local Alignment)
Finds optimal subsequence alignment with zero floor for negative scores.

**Complexity**: O(m×n) time, O(m×n) space

## 🎨 Screenshots

![SeqSync Interface](screenshot.png)

## 📝 Usage

1. **Enter Sequences**: Input two DNA/protein sequences
2. **Select Algorithm**: Choose Global, Local, or Both
3. **Adjust Scoring** (Optional): Customize match/mismatch/gap penalties
4. **View Results**: See aligned sequences and DP matrices with optimal paths

