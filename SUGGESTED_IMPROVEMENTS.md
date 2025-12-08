# Suggested PDF Processing Improvements

Based on the analysis in `PDF_ANALYSIS_REPORT.md`, here are code snippets for recommended improvements:

## 1. Add File Size Limit (HIGH PRIORITY)

**Location:** `resume-manager.js:66-73`

**Current code:**
```javascript
pdfInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        this.showPDFStatus('Please upload a PDF file', 'error');
        return;
    }
```

**Improved code:**
```javascript
pdfInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        this.showPDFStatus('Please upload a PDF file', 'error');
        return;
    }

    // Add file size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
        this.showPDFStatus('PDF file too large. Maximum size is 5MB.', 'error');
        pdfInput.value = ''; // Clear the input
        return;
    }
```

---

## 2. Improve Name Extraction (HIGH PRIORITY)

**Location:** `resume-manager.js:138`

**Current regex:**
```javascript
if (firstLine.length < 50 && /^[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/.test(firstLine)) {
```

**Problem:** Fails on names like "O'Brien", "McDonald", "Dr. Smith PhD"

**Improved regex:**
```javascript
// More flexible pattern that handles:
// - Apostrophes: O'Brien
// - Hyphens: Mary-Jane
// - Internal capitals: McDonald
// - Prefixes: van der Berg, de la Cruz
// - Titles: Dr., PhD (filtered out separately)
const namePattern = /^(?:Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?)?\s*([A-Z][a-zA-Z'\-]+(?:\s+(?:van|von|de|del|della|da|le|la|di|dos|das|dos|der|den|del)\s+)?(?:\s+[A-Z][a-zA-Z'\-\.]+)+)\s*(?:PhD|Ph\.D\.|Jr\.?|Sr\.?|I{1,3}|IV|V)?$/;

if (firstLine.length < 100 && namePattern.test(firstLine.trim())) {
    const match = firstLine.trim().match(namePattern);
    if (match && match[1]) {
        const cleanName = match[1].trim();
        const nameParts = cleanName.split(/\s+/);

        if (nameParts.length >= 2) {
            document.getElementById('resume-first-name').value = nameParts[0];
            document.getElementById('resume-last-name').value = nameParts.slice(1).join(' ');
        }
    }
}
```

---

## 3. Add ZIP+4 Support (HIGH PRIORITY)

**Location:** `resume-manager.js:164`

**Current code:**
```javascript
const zipcodeMatch = text.match(/\b\d{5}\b/);
```

**Improved code:**
```javascript
// Support both 12345 and 12345-6789 formats
const zipcodeMatch = text.match(/\b\d{5}(-\d{4})?\b/);
if (zipcodeMatch) {
    // Extract just the 5-digit portion for the form field
    const zipcode = zipcodeMatch[0].split('-')[0];
    document.getElementById('resume-zipcode').value = zipcode;
}
```

---

## 4. Add Progress Indicator (MEDIUM PRIORITY)

**Location:** `resume-manager.js:75-84`

**Current code:**
```javascript
this.showPDFStatus('Processing PDF...', 'processing');

try {
    const text = await this.extractTextFromPDF(file);
    this.populateFromPDFText(text);
    this.showPDFStatus('✓ PDF processed! Review and edit the extracted information below.', 'success');
} catch (error) {
    console.error('PDF processing error:', error);
    this.showPDFStatus('Error processing PDF. Please fill out the form manually.', 'error');
}
```

**Improved code:**
```javascript
this.showPDFStatus('Processing PDF...', 'processing');

try {
    const text = await this.extractTextFromPDF(file, (progress) => {
        // Update progress during extraction
        this.showPDFStatus(`Processing PDF... ${progress}%`, 'processing');
    });

    this.showPDFStatus('Analyzing content...', 'processing');
    this.populateFromPDFText(text);

    this.showPDFStatus('✓ PDF processed! Review and edit the extracted information below.', 'success');

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
        const statusDiv = document.getElementById('pdf-status');
        statusDiv.classList.add('hidden');
    }, 5000);
} catch (error) {
    console.error('PDF processing error:', error);
    this.showPDFStatus(`Error: ${error.message || 'Could not process PDF'}. Please fill out the form manually.`, 'error');
}
```

**Update extractTextFromPDF to support progress:**
```javascript
async extractTextFromPDF(file, onProgress = null) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Report progress
        if (onProgress) {
            const progress = Math.round((i / totalPages) * 100);
            onProgress(progress);
        }

        // ... rest of extraction logic ...
    }

    return fullText;
}
```

---

## 5. Add Email Validation After Extraction (MEDIUM PRIORITY)

**Location:** `resume-manager.js:152-155`

**Current code:**
```javascript
const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
if (emailMatch) {
    document.getElementById('resume-email').value = emailMatch[0];
}
```

**Improved code:**
```javascript
const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
if (emailMatch) {
    const email = emailMatch[0];

    // Basic validation: no dots at start/end, valid TLD
    if (this.isValidEmail(email)) {
        document.getElementById('resume-email').value = email;
    }
}

// Add helper method to ResumeManager class
isValidEmail(email) {
    // More thorough email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}
```

---

## 6. Store Raw Extracted Text (MEDIUM PRIORITY)

**Purpose:** Allow users to debug extraction or re-parse manually

**Location:** After `resume-manager.js:78-79`

**Add this to the ResumeManager class:**
```javascript
// In the PDF upload handler
try {
    const text = await this.extractTextFromPDF(file);

    // Store raw text in a data attribute for debugging
    const experienceField = document.getElementById('resume-experience');
    experienceField.dataset.rawPdfText = text;

    this.populateFromPDFText(text);
    this.showPDFStatus('✓ PDF processed! Review and edit the extracted information below.', 'success');
} catch (error) {
    // ...
}
```

**Add a "Show Raw Text" button for debugging:**
```javascript
// In index.html, add after the PDF upload section:
<button type="button" id="show-raw-text" class="btn btn-sm btn-secondary" style="display:none;">
    Show Raw Extracted Text
</button>
<div id="raw-text-display" class="hidden" style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; max-height: 300px; overflow-y: auto;"></div>

// In resume-manager.js, add event listener:
document.getElementById('show-raw-text')?.addEventListener('click', () => {
    const rawText = document.getElementById('resume-experience').dataset.rawPdfText;
    const displayDiv = document.getElementById('raw-text-display');

    if (rawText) {
        displayDiv.textContent = rawText;
        displayDiv.classList.toggle('hidden');
    }
});
```

---

## 7. Expand Skills Keywords (LOW PRIORITY)

**Location:** `resume-manager.js:182-192`

**Add more keywords:**
```javascript
const techKeywords = [
    // Programming Languages
    'Python', 'JavaScript', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl', 'Objective-C', 'Dart', 'Elixir', 'Haskell',

    // Web Frameworks
    'React', 'Angular', 'Vue', 'Node\\.?js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring',
    'Laravel', 'Rails', 'ASP\\.NET', 'Next\\.?js', 'Nuxt', 'Svelte', 'Ember',

    // Frontend
    'HTML', 'CSS', 'SCSS', 'SASS', 'Less', 'Tailwind', 'Bootstrap', 'Material-UI', 'Ant Design',
    'Webpack', 'Vite', 'Parcel', 'Babel', 'Redux', 'MobX', 'Zustand',

    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'MariaDB',
    'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra', 'Neo4j', 'CouchDB', 'Firebase',

    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
    'CircleCI', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Heroku', 'Vercel', 'Netlify',

    // Tools & Platforms
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Slack', 'Trello',
    'Linux', 'Ubuntu', 'Debian', 'Unix', 'macOS', 'Windows Server',

    // Design & Creative
    'Blender', 'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'InDesign',
    'After Effects', 'Premiere Pro', 'AutoCAD', 'Maya', 'Unity', 'Unreal Engine',

    // Business & Analytics
    'Salesforce', 'Tableau', 'Power BI', 'Excel', 'SAP', 'Workday', 'QuickBooks',
    'HubSpot', 'Marketo', 'Google Analytics', 'Mixpanel', 'Amplitude',

    // Testing & QA
    'Jest', 'Mocha', 'Cypress', 'Selenium', 'Playwright', 'JUnit', 'PyTest',
    'TestNG', 'Postman', 'JMeter', 'Cucumber',

    // Mobile Development
    'iOS', 'Android', 'React Native', 'Flutter', 'Xamarin', 'Ionic', 'SwiftUI',

    // Data Science & ML
    'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'Jupyter',
    'Apache Spark', 'Hadoop', 'Airflow', 'MLflow', 'Databricks',

    // Other
    'GraphQL', 'REST API', 'gRPC', 'WebSocket', 'OAuth', 'JWT', 'SAML', 'SSO',
    'Microservices', 'Serverless', 'CI/CD', 'Agile', 'Scrum', 'TDD', 'BDD'
];
```

---

## Implementation Priority

### Immediate (Do Now):
1. ✅ File size limit - Prevents crashes
2. ✅ Name extraction improvements - Better user experience
3. ✅ ZIP+4 support - More accurate data

### Short-term (This Week):
4. Progress indicator - Better UX for large files
5. Email validation - Data quality
6. Raw text storage - Debugging capability

### Long-term (Future):
7. Expanded skills keywords - Better extraction
8. Self-host PDF.js - Reduced CDN dependency
9. OCR support - Handle scanned PDFs
10. Configurable extraction rules - Flexibility

---

## Testing After Implementation

For each improvement, test with:

1. **File size limit:**
   - [ ] Upload 6MB PDF (should reject)
   - [ ] Upload 4MB PDF (should process)

2. **Name extraction:**
   - [ ] "John O'Brien"
   - [ ] "Dr. Jane Smith PhD"
   - [ ] "Mary-Jane Watson"
   - [ ] "Juan de la Cruz"

3. **ZIP+4:**
   - [ ] "12345-6789" (should extract "12345")
   - [ ] "12345" (should still work)

4. **Progress indicator:**
   - [ ] Upload multi-page PDF
   - [ ] Verify progress updates

---

**Note:** Implement high-priority improvements first, then test thoroughly before moving to medium/low priority items.
