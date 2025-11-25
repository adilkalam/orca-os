# Data Quality Rubric - OS 2.0

**Domain:** Data Analysis & Engineering
**Version:** 1.0
**Last Updated:** 2025-11-20

---

## Scoring Overview

**Total Score:** 0-100 points across 4 dimensions (25 points each)

**Scoring Interpretation:**
- **90-100:** Excellent - Production-ready, best practices followed
- **75-89:** Good - Minor improvements needed
- **60-74:** Fair - Significant issues to address
- **0-59:** Poor - Major rework required

---

## Dimension 1: Data Quality & Integrity (0-25 points)

### 1.1 Data Validation (0-10 points)

**Excellent (9-10 points):**
- Input validation on all data sources
- Schema validation enforced
- Data type checking comprehensive
- Null/missing value handling explicit
- Edge cases identified and handled
- Data quality tests written

**Good (7-8 points):**
- Most data validated
- Basic schema checks
- Type checking present
- Some null handling
- Few edge cases covered

**Fair (5-6 points):**
- Minimal validation
- No schema enforcement
- Limited type checking
- Poor null handling
- Edge cases ignored

**Poor (0-4 points):**
- No validation
- Data integrity not considered
- No type safety
- Crashes on null values

**Validation Examples:**
```python
# ❌ BAD - No validation
df = pd.read_csv(file_path)
result = df['column'].mean()  # Crashes if column missing

# ✅ GOOD - Validated
import pandera as pa

schema = pa.DataFrameSchema({
    "column": pa.Column(float, checks=pa.Check.ge(0)),
    "date": pa.Column(pa.DateTime)
})
df = schema.validate(pd.read_csv(file_path))
```

### 1.2 Data Cleaning (0-8 points)

**Excellent (7-8 points):**
- Duplicates identified and handled
- Outliers detected and addressed
- Inconsistent formats standardized
- Missing data imputed appropriately
- Data transformations documented
- Cleaning pipeline reproducible

**Good (5-6 points):**
- Duplicates removed
- Some outlier handling
- Basic standardization
- Simple imputation
- Some documentation

**Fair (3-4 points):**
- Minimal cleaning
- No outlier detection
- Inconsistent formats remain
- No imputation strategy

**Poor (0-2 points):**
- No cleaning performed
- Dirty data used directly
- Quality issues ignored

### 1.3 Data Documentation (0-7 points)

**Excellent (6-7 points):**
- Data dictionary complete
- Column descriptions clear
- Data lineage documented
- Assumptions stated explicitly
- Sample data provided
- Update frequency noted
- Contact/owner identified

**Good (4-5 points):**
- Basic data dictionary
- Some descriptions
- Partial lineage
- Few assumptions stated

**Fair (2-3 points):**
- Minimal documentation
- Unclear descriptions
- No lineage
- Assumptions not stated

**Poor (0-1 points):**
- No documentation
- Undocumented columns
- Unknown sources

---

## Dimension 2: Analysis Quality (0-25 points)

### 2.1 Methodology (0-10 points)

**Excellent (9-10 points):**
- Appropriate statistical methods used
- Assumptions validated
- Hypotheses clearly stated
- Confidence intervals/p-values reported
- Multiple methods compared
- Limitations acknowledged
- Reproducible analysis

**Good (7-8 points):**
- Reasonable methods used
- Basic assumption checks
- Some hypothesis testing
- Some statistical reporting
- Generally reproducible

**Fair (5-6 points):**
- Questionable methods
- No assumption validation
- Weak hypothesis testing
- Missing statistical rigor
- Hard to reproduce

**Poor (0-4 points):**
- Inappropriate methods
- No statistical foundation
- No hypothesis testing
- Not reproducible

**Common Issues:**
```python
# ❌ BAD - No assumption checking
from scipy import stats
t_stat, p_value = stats.ttest_ind(group1, group2)

# ✅ GOOD - Validate assumptions
# Check normality
_, p_norm1 = stats.shapiro(group1)
_, p_norm2 = stats.shapiro(group2)

if p_norm1 > 0.05 and p_norm2 > 0.05:
    # Normal - use t-test
    t_stat, p_value = stats.ttest_ind(group1, group2)
else:
    # Non-normal - use Mann-Whitney U
    u_stat, p_value = stats.mannwhitneyu(group1, group2)
```

### 2.2 Visualization Quality (0-8 points)

**Excellent (7-8 points):**
- Appropriate chart types chosen
- Clear titles and labels
- Legends present and readable
- Color palette accessible
- No chart junk
- Axes scaled appropriately
- Context provided

**Good (5-6 points):**
- Reasonable chart types
- Basic labels present
- Legends included
- Readable colors
- Mostly clear

**Fair (3-4 points):**
- Poor chart type choices
- Missing labels
- No legends
- Confusing colors
- Hard to interpret

**Poor (0-2 points):**
- Wrong chart types
- No labels
- Illegible
- Misleading

**Visualization Principles:**
- Bar charts for comparisons
- Line charts for trends over time
- Scatter plots for relationships
- Histograms for distributions
- Box plots for summary statistics
- Heatmaps for correlation matrices

### 2.3 Insights & Conclusions (0-7 points)

**Excellent (6-7 points):**
- Key findings clearly stated
- Insights actionable
- Evidence supports conclusions
- Confidence levels noted
- Limitations discussed
- Recommendations specific
- Business context provided

**Good (4-5 points):**
- Findings identified
- Some actionable insights
- Reasonable conclusions
- Some limitations noted

**Fair (2-3 points):**
- Vague findings
- Non-actionable insights
- Weak conclusions
- No limitations discussed

**Poor (0-1 points):**
- No clear findings
- No insights
- Unsupported conclusions

---

## Dimension 3: Code Quality (0-25 points)

### 3.1 Code Organization (0-8 points)

**Excellent (7-8 points):**
- Clear project structure
- Logical file organization
- Functions properly abstracted
- Reusable code components
- Config separated from code
- No code duplication
- README with setup instructions

**Good (5-6 points):**
- Reasonable structure
- Some organization
- Some abstraction
- Limited reusability
- Basic README

**Fair (3-4 points):**
- Poor structure
- Messy organization
- No abstraction
- Heavy duplication
- No README

**Poor (0-2 points):**
- No structure
- Single file chaos
- No organization

**Project Structure Example:**
```
data-project/
├── data/
│   ├── raw/          # Original data
│   ├── processed/    # Cleaned data
│   └── results/      # Analysis outputs
├── notebooks/        # Jupyter notebooks
├── src/              # Source code
│   ├── data_cleaning.py
│   ├── analysis.py
│   └── visualization.py
├── tests/            # Unit tests
├── config.yml        # Configuration
├── requirements.txt  # Dependencies
└── README.md         # Documentation
```

### 3.2 Code Readability (0-9 points)

**Excellent (8-9 points):**
- Clear variable names (no single letters)
- Functions well-named and focused
- Comments explain "why" not "what"
- Consistent formatting
- Type hints used (Python)
- Docstrings present
- PEP 8 / style guide followed

**Good (6-7 points):**
- Good naming
- Reasonable functions
- Some comments
- Mostly consistent
- Some type hints

**Fair (4-5 points):**
- Poor naming (x, data1, temp)
- Long functions
- Few comments
- Inconsistent style
- No type hints

**Poor (0-3 points):**
- Cryptic naming
- Massive functions
- No comments
- No style

**Readability Example:**
```python
# ❌ BAD
def p(d):
    x = d.mean()
    y = d.std()
    return (d - x) / y

# ✅ GOOD
def standardize_data(data: pd.Series) -> pd.Series:
    """
    Standardize data to have mean=0 and std=1 (z-score normalization).

    Args:
        data: Pandas Series to standardize

    Returns:
        Standardized series with mean=0, std=1
    """
    mean = data.mean()
    std = data.std()
    return (data - mean) / std
```

### 3.3 Testing & Error Handling (0-8 points)

**Excellent (7-8 points):**
- Unit tests for key functions
- Edge cases tested
- Proper exception handling
- Informative error messages
- Logging implemented
- Test coverage >80%
- CI/CD for tests

**Good (5-6 points):**
- Some unit tests
- Basic error handling
- Some logging
- Coverage 50-80%

**Fair (3-4 points):**
- Few tests
- Minimal error handling
- No logging
- Coverage <50%

**Poor (0-2 points):**
- No tests
- No error handling
- Crashes on errors

---

## Dimension 4: Technical Standards (0-25 points)

### 4.1 Performance & Efficiency (0-10 points)

**Excellent (9-10 points):**
- Efficient algorithms chosen
- Vectorized operations (no loops where avoidable)
- Memory usage optimized
- Large datasets handled appropriately (chunking/streaming)
- Query optimization (SQL/database)
- Caching implemented where beneficial
- Performance benchmarked

**Good (7-8 points):**
- Reasonable efficiency
- Some vectorization
- Acceptable memory usage
- Basic optimization

**Fair (5-6 points):**
- Inefficient code
- Unnecessary loops
- High memory usage
- No optimization

**Poor (0-4 points):**
- Extremely inefficient
- Runs out of memory
- Hours to execute simple operations

**Performance Examples:**
```python
# ❌ BAD - Loop (slow)
results = []
for index, row in df.iterrows():
    results.append(row['value'] * 2)
df['doubled'] = results

# ✅ GOOD - Vectorized (fast)
df['doubled'] = df['value'] * 2

# ❌ BAD - Load entire dataset
df = pd.read_csv('huge_file.csv')  # 10GB file, crashes

# ✅ GOOD - Chunked processing
for chunk in pd.read_csv('huge_file.csv', chunksize=10000):
    process_chunk(chunk)
```

### 4.2 Reproducibility (0-8 points)

**Excellent (7-8 points):**
- Random seeds set
- Environment captured (requirements.txt/environment.yml)
- Data versioning implemented
- Pipeline fully automated
- Docker container provided
- Can run end-to-end without manual steps
- Results consistent across runs

**Good (5-6 points):**
- Seeds set
- Dependencies listed
- Mostly automated
- Generally reproducible

**Fair (3-4 points):**
- No seeds
- Missing dependencies
- Manual steps required
- Hard to reproduce

**Poor (0-2 points):**
- Not reproducible
- Missing critical dependencies
- Results vary randomly

**Reproducibility Checklist:**
- [ ] Random seed set (np.random.seed, random.seed)
- [ ] Environment file (requirements.txt, environment.yml)
- [ ] Data version/source documented
- [ ] Pipeline script exists
- [ ] README with run instructions
- [ ] Input data available or documented
- [ ] Expected outputs documented

### 4.3 Security & Privacy (0-7 points)

**Excellent (6-7 points):**
- No credentials in code
- PII handled appropriately
- Data anonymization where required
- Secure data storage
- Access controls implemented
- Compliance considered (GDPR, HIPAA)
- Audit trail present

**Good (4-5 points):**
- Credentials in env vars
- Some PII awareness
- Basic security
- Some access controls

**Fair (2-3 points):**
- Some credentials exposed
- PII not protected
- Minimal security
- No access controls

**Poor (0-1 points):**
- Credentials in code
- PII exposed
- No security consideration

**Security Examples:**
```python
# ❌ BAD
db_password = "mypassword123"
conn = psycopg2.connect(
    host="localhost",
    user="admin",
    password=db_password
)

# ✅ GOOD
import os
from dotenv import load_dotenv

load_dotenv()
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)
```

---

## Quality Gate Thresholds

**Gate Status by Score:**

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ **PASS** | Excellent - Ship it |
| 75-89 | ⚠️ **CAUTION** | Good - Address minor issues before ship |
| 60-74 | 🔴 **FAIL** | Significant issues - Fix before proceeding |
| 0-59 | 🚫 **BLOCK** | Major rework required |

**Critical Issues (Automatic FAIL):**
- Credentials hardcoded in code
- PII exposed without protection
- Completely non-reproducible analysis
- Data integrity compromised
- Wrong statistical methods producing misleading results

---

## Scoring Example

### Example: Customer Churn Analysis

**Dimension 1: Data Quality & Integrity (20/25)**
- Data Validation: 8/10 (schema validated, minor edge cases)
- Data Cleaning: 7/8 (duplicates removed, outliers handled)
- Data Documentation: 5/7 (basic data dictionary, no lineage)

**Dimension 2: Analysis Quality (18/25)**
- Methodology: 7/10 (logistic regression, assumptions checked)
- Visualization Quality: 6/8 (clear charts, minor label issues)
- Insights & Conclusions: 5/7 (actionable insights, limited context)

**Dimension 3: Code Quality (16/25)**
- Code Organization: 6/8 (reasonable structure, some duplication)
- Code Readability: 7/9 (good naming, consistent style)
- Testing & Error Handling: 3/8 (no tests, basic error handling)

**Dimension 4: Technical Standards (21/25)**
- Performance & Efficiency: 8/10 (vectorized, efficient)
- Reproducibility: 7/8 (seeds set, fully automated)
- Security & Privacy: 6/7 (credentials in env, PII handled)

**Total: 75/100 - CAUTION**

**Issues to Address:**
1. ⚠️ No unit tests (code quality)
2. ⚠️ Missing data lineage documentation
3. ⚠️ Limited business context in conclusions

**Recommendation:** Address testing gap before production deployment. Acceptable for internal use.

---

## Anti-Pattern Library

### 1. Iterating Instead of Vectorizing
```python
# ❌ BAD
total = 0
for value in df['revenue']:
    total += value
average = total / len(df)

# ✅ GOOD
average = df['revenue'].mean()
```

### 2. No Data Validation
```python
# ❌ BAD
df = pd.read_csv('data.csv')
result = df['amount'].sum() / df['quantity'].sum()

# ✅ GOOD
import pandera as pa

schema = pa.DataFrameSchema({
    "amount": pa.Column(float, pa.Check.ge(0)),
    "quantity": pa.Column(int, pa.Check.gt(0))
})
df = schema.validate(pd.read_csv('data.csv'))
result = df['amount'].sum() / df['quantity'].sum()
```

### 3. Magic Numbers Everywhere
```python
# ❌ BAD
df = df[df['age'] > 18]
df = df[df['score'] < 100]

# ✅ GOOD
MIN_AGE = 18
MAX_SCORE = 100
df = df[(df['age'] > MIN_AGE) & (df['score'] < MAX_SCORE)]
```

### 4. Non-Reproducible Analysis
```python
# ❌ BAD
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y)

# ✅ GOOD
RANDOM_SEED = 42
X_train, X_test, y_train, y_test = train_test_split(
    X, y, random_state=RANDOM_SEED
)
```

---

## Related Documents

- **Orchestrator Framework:** `.claude/orchestration/reference/orchestrator-framework.md`
- **Data Agent Prompts:** `~/.claude/agents/data-*.md`

---

## Changelog

- **2025-11-20:** Initial data rubric created

---

_Data Quality Rubric v1.0 - Apply to all data deliverables_
