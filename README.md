# SeqSync

A professional bioinformatics visualization tool for biological sequence alignment analysis.

## Overview

SeqSync is an interactive web-based platform designed for biological sequence alignment analysis. It implements and visualizes fundamental computational biology algorithms, providing real-time dynamic programming matrix visualization that makes complex algorithmic processes transparent and understandable. The application serves both educational purposes and practical bioinformatics research, offering a unique bridge between theoretical algorithm understanding and practical application. All processing occurs client-side, ensuring complete data privacy and security for sensitive sequence data.

## Problem Statement

**Core Challenge**

Biological sequence alignment is fundamental to computational biology but often lacks algorithmic transparency.

**Critical Applications**

- **Evolutionary Analysis**
  - Identify conserved regions across species
  - Trace genetic relationships and phylogenetic trees
  - Study molecular evolution patterns

- **Functional Annotation**
  - Predict protein function from sequence similarity
  - Compare unknown sequences against known databases
  - Infer biological roles of newly discovered genes

- **Mutation Detection**
  - Locate sequence variations in genomic data
  - Identify disease-causing mutations
  - Support personalized medicine initiatives

- **Drug Discovery**
  - Analyze target protein sequences
  - Design therapeutic compounds
  - Predict drug-protein interactions

**The Gap in Existing Tools**

- Traditional command-line tools (BLAST, Clustal) provide results without showing computational process
- Black-box algorithms limit understanding for students and researchers
- Lack of real-time visualization for parameter tuning

**SeqSync Solution**

- Visual insight into scoring matrix computation
- Real-time algorithm behavior demonstration
- Interactive parameter adjustment for educational exploration
- Transparent dynamic programming mechanics

## Key Features

**Algorithm Implementation**

- Needleman-Wunsch algorithm for global end-to-end alignment
- Smith-Waterman algorithm for local subsequence alignment
- Side-by-side comparison mode for algorithmic analysis
- Customizable scoring matrices (match, mismatch, gap penalties)
- O(m×n) time complexity with optimized performance
- Epsilon-based numerical stability for float operations

**Visualization Capabilities**

- Color-coded dynamic programming matrices
  - Positive scores highlighted in distinct color
  - Negative scores marked for easy identification
  - Zero values clearly differentiated
- Optimal path traceback highlighting through matrix
- Real-time alignment statistics display
  - Identity percentage calculation
  - Match and mismatch counts
  - Gap insertion tracking
  - Alignment score reporting
- Interactive score adjustments with immediate recalculation

**User Experience**

- Dark and light theme support for extended analysis sessions
- Pre-loaded example sequences (DNA, protein, similar, different)
- Responsive interface design for desktop and tablet devices
- Client-side processing ensuring data privacy
- Clean, professional GitHub-inspired UI
- No server-side data transmission required

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/dininduakalanka/SeqSync.git
cd SeqSync

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the application at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Technical Architecture

**Frontend Framework**

- React 19 with functional components and hooks
  - useState for state management
  - useMemo for computation optimization
  - Efficient re-rendering patterns
- Vite for optimized build performance
  - Fast hot module replacement
  - Optimized production builds
  - Modern ES module support
- ESLint for code quality enforcement
  - React-specific linting rules
  - Consistent code style

**Algorithm Implementation**

- Pure JavaScript implementation
- O(m×n) time complexity
- O(m×n) space complexity for matrix storage
- Epsilon-based float comparison for numerical stability
- Comprehensive unit test coverage
- Modular design for algorithm extensibility
- Well-documented code with inline comments

**Performance Considerations**

- Memoized alignment computations using React.useMemo
  - Prevents unnecessary recalculations
  - Updates only when inputs change
- Efficient matrix rendering
  - Optimized for sequences up to 100 characters
  - Handles larger sequences with graceful degradation
- Responsive design patterns
  - Cross-device compatibility
  - Mobile-friendly interface
- Local storage for theme persistence
  - User preferences maintained across sessions

## Algorithm Details

### Needleman-Wunsch (Global Alignment)

**Purpose**: Optimal end-to-end sequence alignment using dynamic programming

**Best Used For**:
- Comparing sequences of similar length
- Finding overall similarity between sequences
- Complete alignment from start to finish

**Recurrence Relation**:
```
F(i,j) = max{
  F(i-1,j-1) + s(xi, yj),  // diagonal (match/mismatch)
  F(i-1,j) + gap,           // vertical (gap in seq2)
  F(i,j-1) + gap            // horizontal (gap in seq1)
}
```

**Key Characteristics**:
- Edges initialized with cumulative gap penalties
- Guarantees complete alignment from beginning to end
- Traceback starts from bottom-right corner (m,n)
- Penalizes gaps at sequence ends

**Complexity**: O(m×n) time, O(m×n) space

### Smith-Waterman (Local Alignment)

**Purpose**: Find optimal local subsequence alignment

**Best Used For**:
- Identifying conserved regions within longer sequences
- Finding similarity domains in proteins
- Detecting partial matches between sequences

**Recurrence Relation**:
```
F(i,j) = max{
  0,                        // reset to zero
  F(i-1,j-1) + s(xi, yj),
  F(i-1,j) + gap,
  F(i,j-1) + gap
}
```

**Key Characteristics**:
- All edges initialized to zero
- Allows score reset to zero (no negative accumulation)
- Traceback begins at maximum score in matrix
- Terminates when reaching zero
- Focuses on high-scoring regions only

**Complexity**: O(m×n) time, O(m×n) space

## Use Cases

**Academic Education**

- Teaching dynamic programming concepts in bioinformatics courses
- Demonstrating algorithm behavior with custom scoring schemes
- Comparing global vs. local alignment strategies
- Visualizing traceback paths for student understanding
- Interactive learning tool for computational biology
- Homework and assignment demonstrations

**Research Applications**

- Preliminary sequence analysis before database searches
- Understanding alignment scoring for BLAST parameter tuning
- Validating custom alignment implementations
- Testing scoring scheme effects on alignment quality
- Prototyping alignment strategies for specialized projects
- Quick validation of sequence relationships

**Clinical Genomics**

- Visualizing mutation positions in patient sequences
- Quality control for sequence alignment pipelines
- Educational tool for clinical bioinformatics training
- Understanding variant calling prerequisites
- Training molecular diagnostics personnel
- Demonstrating alignment principles to clinical staff

**Software Development**

- Reference implementation for alignment algorithms
- Testing bed for algorithm optimizations
- Educational resource for coding interviews
- Benchmarking dynamic programming implementations

## Usage Guide

**Step 1: Input Sequences**
- Enter first sequence in top text field
- Enter second sequence in bottom text field
- Sequences are case-insensitive (converted to uppercase)
- Accepts DNA nucleotides (A, C, G, T) or protein amino acids
- Use example buttons for quick testing

**Step 2: Select Algorithm**
- Choose "Global" for Needleman-Wunsch alignment
- Choose "Local" for Smith-Waterman alignment
- Choose "Both" to compare algorithms side-by-side

**Step 3: Configure Scoring (Optional)**
- Click "Advanced Options" to reveal scoring parameters
- Adjust match reward (default: +2)
- Adjust mismatch penalty (default: -1)
- Adjust gap penalty (default: -2)
- Changes recalculate alignment immediately

**Step 4: Analyze Results**
- Review alignment scores at top of each matrix
- Check identity percentage for sequence similarity
- View match, mismatch, and gap counts
- Examine aligned sequences with gap characters

**Step 5: Interpret Matrix**
- Color-coded cells indicate score values
  - Green/positive: High scores
  - Red/negative: Low scores
  - Gray/zero: Neutral scores
- Yellow highlighting shows optimal path
- Follow path from start to end for traceback

**Step 6: Compare Algorithms (Both Mode)**
- Observe differences in scoring matrices
- Compare final alignment scores
- Analyze how initialization affects results
- Understand when to use global vs. local alignment

## Project Structure

```
seqsync/
├── src/
│   ├── components/
│   │   └── SeqSync.jsx          # Main React component
│   ├── utils/
│   │   ├── alignmentLogic.js    # Algorithm implementations
│   │   └── alignmentLogic.test.js # Unit tests
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

## Development Roadmap

**Planned Enhancements**

- **File Format Support**
  - FASTA file import/export
  - GenBank format compatibility
  - CSV export for alignment statistics
  
- **Algorithm Extensions**
  - Multiple sequence alignment (MSA) visualization
  - Affine gap penalties
  - Banded alignment for long sequences
  - Semi-global alignment modes

- **Substitution Matrices**
  - BLOSUM series (BLOSUM62, BLOSUM80)
  - PAM matrices (PAM250, PAM120)
  - Custom matrix upload
  - Matrix comparison tools

- **Statistical Analysis**
  - E-value calculations
  - Bit score reporting
  - Statistical significance testing
  - Alignment confidence intervals

- **Integration Features**
  - NCBI sequence database queries
  - UniProt API integration
  - BLAST result import
  - Real-time database searches

- **Export Capabilities**
  - PDF report generation
  - PNG matrix export
  - JSON alignment data
  - Publication-ready figures

**Performance Optimization**

- Web Workers for long sequence processing
  - Non-blocking UI during computation
  - Progress indicators for long operations
- Virtual scrolling for large matrices
  - Handle sequences over 1000 characters
  - Memory-efficient rendering
- Progressive rendering techniques
  - Incremental matrix display
  - Lazy loading for large datasets
- Algorithm optimizations
  - Memory-efficient implementations
  - Hirschberg's algorithm for space optimization

## Contributing

Contributions are welcome to enhance SeqSync's capabilities.

**Guidelines**:
- Follow ESLint configuration for code style
- Write unit tests for new algorithms
- Update documentation for feature additions
- Consider performance impact on matrix operations
- Maintain backward compatibility
- Add inline code comments for complex logic

**How to Contribute**:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-algorithm`)
3. Commit changes with descriptive messages
4. Write or update tests
5. Push to branch (`git push origin feature/new-algorithm`)
6. Submit pull request with detailed description

**Areas for Contribution**:
- Additional alignment algorithms
- Performance optimizations
- UI/UX improvements
- Documentation enhancements
- Test coverage expansion
- Bug fixes and error handling

## License

This project is available for educational and research purposes.

## Contact

**Developer**: Dinindu Akalanka  
**Repository**: [github.com/dininduakalanka/SeqSync](https://github.com/dininduakalanka/SeqSync)  
**Live Demo**: [dininduakalanka.github.io/SeqSync](https://dininduakalanka.github.io/SeqSync/)

## References

- Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *Journal of Molecular Biology*, 48(3), 443-453.
- Smith, T. F., & Waterman, M. S. (1981). Identification of common molecular subsequences. *Journal of Molecular Biology*, 147(1), 195-197.
- Durbin, R., Eddy, S. R., Krogh, A., & Mitchison, G. (1998). *Biological Sequence Analysis*. Cambridge University Press.

