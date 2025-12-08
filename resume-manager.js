// ===================================
// Resume Manager
// Handle resume CRUD operations
// ===================================

class ResumeManager {
    constructor() {
        this.resumes = [];
        this.storageKey = 'app_resumes';
        this.profileStorageKey = 'app_user_profile';
        this.currentEditId = null;
        this.userProfile = this.loadUserProfile();

        // Configure PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        this.init();
    }

    loadUserProfile() {
        const stored = Storage.get(this.profileStorageKey);
        return stored || {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            zipcode: ''
        };
    }

    saveUserProfile() {
        Storage.set(this.profileStorageKey, this.userProfile);
    }

    init() {
        this.setupForm();
        this.setupPDFUpload();
        this.loadResumes();
        this.populateContactFields();
    }

    populateContactFields() {
        // Pre-fill contact info from user profile
        if (this.userProfile.firstName) {
            document.getElementById('resume-first-name').value = this.userProfile.firstName;
        }
        if (this.userProfile.lastName) {
            document.getElementById('resume-last-name').value = this.userProfile.lastName;
        }
        if (this.userProfile.email) {
            document.getElementById('resume-email').value = this.userProfile.email;
        }
        if (this.userProfile.zipcode) {
            document.getElementById('resume-zipcode').value = this.userProfile.zipcode;
        }
    }

    setupPDFUpload() {
        const pdfInput = document.getElementById('resume-pdf');
        const statusDiv = document.getElementById('pdf-status');

        if (!pdfInput) return;

        pdfInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.type !== 'application/pdf') {
                this.showPDFStatus('Please upload a PDF file', 'error');
                return;
            }

            this.showPDFStatus('Processing PDF...', 'processing');

            try {
                const text = await this.extractTextFromPDF(file);
                this.populateFromPDFText(text);
                this.showPDFStatus('✓ PDF processed! Review and edit the extracted information below.', 'success');
            } catch (error) {
                console.error('PDF processing error:', error);
                this.showPDFStatus('Error processing PDF. Please fill out the form manually.', 'error');
            }
        });
    }

    async extractTextFromPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Build text with proper spacing
            let lastY = null;
            const pageLines = [];
            let currentLine = '';

            textContent.items.forEach(item => {
                // Check if we're on a new line (Y position changed significantly)
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                    if (currentLine.trim()) {
                        pageLines.push(currentLine.trim());
                    }
                    currentLine = item.str;
                } else {
                    // Same line, add space if needed
                    if (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
                        currentLine += ' ';
                    }
                    currentLine += item.str;
                }
                lastY = item.transform[5];
            });

            // Add last line
            if (currentLine.trim()) {
                pageLines.push(currentLine.trim());
            }

            fullText += pageLines.join('\n') + '\n\n';
        }

        return fullText;
    }

    populateFromPDFText(text) {
        // Extract name (usually first line or near top)
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        // Try to find name - usually first substantial line, but must be short
        if (lines.length > 0) {
            const firstLine = lines[0].trim();
            // Name should be short (under 50 chars), 2-3 words, capitalized
            if (firstLine.length < 50 && /^[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/.test(firstLine)) {
                const nameParts = firstLine.split(/\s+/);
                if (nameParts.length === 2) {
                    document.getElementById('resume-first-name').value = nameParts[0];
                    document.getElementById('resume-last-name').value = nameParts[1];
                } else if (nameParts.length === 3) {
                    // Handle middle name/initial
                    document.getElementById('resume-first-name').value = nameParts[0];
                    document.getElementById('resume-last-name').value = nameParts.slice(1).join(' ');
                }
            }
        }

        // Extract email
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
            document.getElementById('resume-email').value = emailMatch[0];
        }

        // Extract phone
        const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        if (phoneMatch) {
            document.getElementById('resume-phone').value = phoneMatch[0];
        }

        // Extract zipcode
        const zipcodeMatch = text.match(/\b\d{5}\b/);
        if (zipcodeMatch) {
            document.getElementById('resume-zipcode').value = zipcodeMatch[0];
        }

        // Extract skills - look for common patterns
        let extractedSkills = [];

        // Pattern 1: "Languages & More:" or "Skills:" followed by list
        const skillsSectionMatch = text.match(/(?:Languages?\s*&?\s*More|Skills?|Technologies?|Technical Skills?):\s*([^\n]+(?:\n[^\n]+)*?)(?=\n[A-Z\s]+:|$)/i);
        if (skillsSectionMatch) {
            const skillsText = skillsSectionMatch[1];
            // Split by common delimiters
            const skills = skillsText.split(/[,•|\/\n]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
            extractedSkills.push(...skills);
        }

        // Pattern 2: Common tech keywords in text
        const techKeywords = [
            'Python', 'JavaScript', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
            'React', 'Angular', 'Vue', 'Node\\.?js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring',
            'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap',
            'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins',
            'Git', 'GitHub', 'GitLab', 'CI/CD',
            'Linux', 'Ubuntu', 'Debian', 'Unix',
            'Blender', 'Photoshop', 'Illustrator', 'Figma',
            'Salesforce', 'Tableau', 'Power BI'
        ];

        const keywordPattern = new RegExp(`\\b(${techKeywords.join('|')})\\b`, 'gi');
        const foundKeywords = text.match(keywordPattern) || [];

        // Deduplicate and add
        const uniqueKeywords = [...new Set(foundKeywords.map(k => k.trim()))];
        extractedSkills.push(...uniqueKeywords);

        // Deduplicate all skills
        extractedSkills = [...new Set(extractedSkills)].filter(s => s.length > 1);

        // Populate skills field
        if (extractedSkills.length > 0) {
            document.getElementById('resume-skills').value = extractedSkills.join(', ');
        }

        // Put full text in experience field - education and certs will be auto-extracted on save
        document.getElementById('resume-experience').value = text.trim();

        // Scroll to form
        document.getElementById('resume-form').scrollIntoView({ behavior: 'smooth' });
    }

    showPDFStatus(message, type) {
        const statusDiv = document.getElementById('pdf-status');
        statusDiv.textContent = message;
        statusDiv.className = `pdf-status ${type}`;
        statusDiv.classList.remove('hidden');
    }

    setupForm() {
        const form = document.getElementById('resume-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveResume();
        });
    }

    saveResume() {
        // Save/update user profile (contact info)
        this.userProfile = {
            firstName: document.getElementById('resume-first-name').value.trim(),
            lastName: document.getElementById('resume-last-name').value.trim(),
            email: document.getElementById('resume-email').value.trim(),
            zipcode: document.getElementById('resume-zipcode').value.trim()
        };
        this.saveUserProfile();

        const experienceText = document.getElementById('resume-experience').value.trim();

        // Auto-extract education and certifications from experience text
        const education = this.extractEducation(experienceText);
        const certifications = this.extractCertifications(experienceText);

        // Save resume version (skills, experience, etc.)
        const formData = {
            id: this.currentEditId || Utils.generateId(),
            title: document.getElementById('resume-title')?.value.trim() || 'My Resume',
            summary: document.getElementById('resume-summary').value.trim(),
            skills: document.getElementById('resume-skills').value.trim(),
            experience: experienceText,
            education: education,
            certifications: certifications,
            createdAt: this.currentEditId ?
                this.resumes.find(r => r.id === this.currentEditId)?.createdAt : Date.now(),
            updatedAt: Date.now()
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.resumes.findIndex(r => r.id === this.currentEditId);
            if (index !== -1) {
                this.resumes[index] = formData;
            }
            this.currentEditId = null;
        } else {
            // Add new
            this.resumes.push(formData);
        }

        Storage.set(this.storageKey, this.resumes);
        this.renderResumes();
        this.resetForm();

        Utils.showNotification('Resume saved successfully!');

        // Track in gamification
        if (typeof gamification !== 'undefined') {
            gamification.trackAction('add_resume');
        }
    }

    extractEducation(text) {
        // Look for education section
        const educationMatch = text.match(/(?:EDUCATION|Education)([\s\S]*?)(?=EXPERIENCE|CERTIFICATIONS|SKILLS|$)/i);
        if (educationMatch) {
            return educationMatch[1].trim();
        }

        // Look for degree keywords
        const degreeKeywords = ['Bachelor', 'Master', 'PhD', 'Associate', 'Diploma', 'B.S.', 'M.S.', 'B.A.', 'M.A.', 'University', 'College', 'Institute'];
        const lines = text.split('\n');
        const educationLines = lines.filter(line =>
            degreeKeywords.some(keyword => line.includes(keyword))
        );

        return educationLines.join('\n');
    }

    extractCertifications(text) {
        // Look for certifications section
        const certsMatch = text.match(/(?:CERTIFICATIONS?|LICENSES?|Certifications?|Licenses?)([\s\S]*?)(?=EDUCATION|EXPERIENCE|SKILLS|$)/i);
        if (certsMatch) {
            return certsMatch[1].trim();
        }

        // Look for certification keywords
        const certKeywords = ['Certified', 'Certification', 'License', 'AWS', 'Azure', 'Google Cloud', 'PMP', 'CISSP', 'CompTIA'];
        const lines = text.split('\n');
        const certLines = lines.filter(line =>
            certKeywords.some(keyword => line.includes(keyword)) && !line.match(/EXPERIENCE|EDUCATION/i)
        );

        return certLines.join('\n');
    }

    loadResumes() {
        const stored = Storage.get(this.storageKey);
        this.resumes = stored || [];
        this.renderResumes();
    }

    renderResumes() {
        const container = document.getElementById('resume-list');

        if (this.resumes.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <p>No resumes saved yet. Create your first resume above!</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.resumes.map(resume => {
            const skillsList = Utils.extractSkills(resume.skills);
            const skillsPreview = skillsList.slice(0, 5).join(', ') +
                (skillsList.length > 5 ? ` +${skillsList.length - 5} more` : '');

            const fullName = `${this.userProfile.firstName} ${this.userProfile.lastName}`.trim() || 'Unnamed';
            const resumeTitle = resume.title || 'My Resume';

            return `
        <div class="item-card" data-id="${resume.id}">
          <div class="item-header">
            <div>
              <h3 class="item-title">${Utils.escapeHtml(resumeTitle)}</h3>
              <p class="item-subtitle">${Utils.escapeHtml(fullName)} • ${Utils.escapeHtml(this.userProfile.email || 'No email')}</p>
            </div>
            <div class="item-actions">
              <button class="btn btn-sm btn-secondary edit-resume" data-id="${resume.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-resume" data-id="${resume.id}">Delete</button>
            </div>
          </div>
          <div class="item-meta">
            <span class="tag">${skillsList.length} skills</span>
            <span class="tag">Updated ${Utils.formatDate(resume.updatedAt)}</span>
          </div>
          ${skillsPreview ? `<p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">${Utils.escapeHtml(skillsPreview)}</p>` : ''}
        </div>
      `;
        }).join('');

        // Attach event listeners
        container.querySelectorAll('.edit-resume').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editResume(btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-resume').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteResume(btn.dataset.id);
            });
        });
    }

    editResume(id) {
        const resume = this.resumes.find(r => r.id === id);
        if (!resume) return;

        this.currentEditId = id;

        // Populate resume-specific fields only (contact info stays from profile)
        document.getElementById('resume-title').value = resume.title || '';
        document.getElementById('resume-summary').value = resume.summary || '';
        document.getElementById('resume-skills').value = resume.skills || '';
        document.getElementById('resume-experience').value = resume.experience || '';

        // Scroll to form
        document.getElementById('resume-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteResume(id) {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        this.resumes = this.resumes.filter(r => r.id !== id);
        Storage.set(this.storageKey, this.resumes);
        this.renderResumes();

        Utils.showNotification('Resume deleted');
    }

    resetForm() {
        document.getElementById('resume-form').reset();
        this.currentEditId = null;
    }

    getResume(id) {
        return this.resumes.find(r => r.id === id);
    }

    getAllResumes() {
        return this.resumes;
    }
}

// Initialize
const resumeManager = new ResumeManager();
