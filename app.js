// ===================================
// Application Core
// Navigation & State Management
// ===================================

class App {
    constructor() {
        this.currentView = 'resume';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadInitialData();
    }

    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === viewName) {
                tab.classList.add('active');
            }
        });

        // Update active view section
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewName;

        // Refresh data for the new view
        if (viewName === 'comparison') {
            comparisonEngine.loadSelectors();
        } else if (viewName === 'dashboard') {
            // Load dashboard data
            if (typeof dashboardManager !== 'undefined') {
                dashboardManager.loadDashboard();
            }
        }
    }

    loadInitialData() {
        // Initialize managers
        resumeManager.loadResumes();
        jobManager.loadJobs();
    }
}

// ===================================
// Storage Helper
// ===================================

const Storage = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }
};

// ===================================
// Utility Functions
// ===================================

const Utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    extractSkills(text) {
        if (!text) return [];

        // First, split by common delimiters
        let items = text.split(/[,\n;•]+/).map(s => s.trim()).filter(s => s.length > 0);

        const extractedSkills = [];

        // Known skill patterns (technologies, languages, frameworks, tools)
        const knownSkills = [
            // Languages
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala',
            // Frontend
            'React', 'Vue', 'Angular', 'Svelte', 'Next\\.js', 'Nuxt', 'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Bootstrap',
            // Backend
            'Node\\.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Rails', 'Laravel', 'ASP\\.NET',
            // Databases
            'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Oracle',
            // Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'GitHub Actions', 'Terraform',
            // Tools
            'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Figma', 'Sketch', 'Photoshop',
            // Other
            'REST', 'GraphQL', 'API', 'Microservices', 'CI/CD', 'Agile', 'Scrum', 'TDD', 'Linux', 'Unix'
        ];

        items.forEach(item => {
            // Skip if too long (likely a full sentence/requirement)
            if (item.length > 100) {
                // Try to extract skills from the sentence
                const pattern = new RegExp(`\\b(${knownSkills.join('|')})\\b`, 'gi');
                const matches = item.match(pattern);
                if (matches) {
                    extractedSkills.push(...matches);
                }
                return;
            }

            // If item is short enough, check if it's a skill or sentence
            const wordCount = item.split(/\s+/).length;

            // If it's 1-4 words, likely a skill
            if (wordCount <= 4) {
                extractedSkills.push(item);
            } else {
                // More than 4 words - try to extract key phrases
                // Look for patterns like "experience with X", "knowledge of X", "proficiency in X"
                const skillPatterns = [
                    /(?:experience (?:with|in|using)|knowledge of|proficiency in|familiar with|expertise in|skilled in|working with)\s+([^,\.]+)/gi,
                    /\b(${knownSkills.join('|')})\b/gi
                ];

                skillPatterns.forEach(pattern => {
                    let match;
                    const regex = new RegExp(pattern.source, pattern.flags);
                    while ((match = regex.exec(item)) !== null) {
                        if (match[1]) {
                            // Clean up the extracted skill
                            const skill = match[1].trim().replace(/\s+and\s+.*/i, '');
                            if (skill.split(/\s+/).length <= 4) {
                                extractedSkills.push(skill);
                            }
                        }
                    }
                });

                // If no patterns matched, try to extract known technologies
                const techPattern = new RegExp(`\\b(${knownSkills.join('|')})\\b`, 'gi');
                const techMatches = item.match(techPattern);
                if (techMatches) {
                    extractedSkills.push(...techMatches);
                }
            }
        });

        // Clean up and deduplicate
        const cleaned = extractedSkills
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 50) // Skip very long items
            .map(s => {
                // Remove common prefixes
                return s.replace(/^(strong|solid|good|excellent|proven)\s+/i, '')
                    .replace(/\s+(skills?|experience|knowledge)$/i, '')
                    .trim();
            });

        return [...new Set(cleaned)]; // Remove duplicates
    },

    normalizeSkill(skill) {
        return skill.toLowerCase().trim();
    },

    showNotification(message, type = 'success') {
        // Simple notification (can be enhanced with a toast library)
        console.log(`[${type.toUpperCase()}] ${message}`);

        // You could add a toast notification here
        // For now, we'll use a simple alert for important messages
        if (type === 'error') {
            alert(message);
        }
    }
};

// ===================================
// Accordion Toggle Function
// ===================================

function toggleAccordion(button) {
    const item = button.parentElement;
    const wasActive = item.classList.contains('active');

    // Close all accordions
    document.querySelectorAll('.accordion-item').forEach(acc => {
        acc.classList.remove('active');
    });

    // Open clicked accordion if it wasn't active
    if (!wasActive) {
        item.classList.add('active');
    }
}

// ===================================
// Initialize App
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new App();

    // Landing Page CTA Button
    const getStartedBtn = document.getElementById('get-started-btn');
    const appSection = document.getElementById('app-section');

    // Scroll to app section
    const scrollToApp = () => {
        appSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', scrollToApp);
    }

    // Reset Data Button
    const resetDataBtn = document.getElementById('reset-data-btn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            const confirmed = confirm(
                '⚠️ WARNING: This will permanently delete ALL your data including:\n\n' +
                '• Your profile information\n' +
                '• All resumes\n' +
                '• All job postings\n' +
                '• Comparison history\n' +
                '• Progress, XP, and achievements\n\n' +
                'This action CANNOT be undone!\n\n' +
                'Are you sure you want to continue?'
            );

            if (confirmed) {
                // Double confirmation for safety
                const doubleConfirm = confirm(
                    'Last chance! Are you ABSOLUTELY sure?\n\n' +
                    'Click OK to permanently delete everything.'
                );

                if (doubleConfirm) {
                    // Clear all localStorage
                    localStorage.clear();

                    // Show success message
                    alert('✅ All data has been cleared successfully!\n\nThe page will now reload.');

                    // Reload page
                    window.location.reload();
                }
            }
        });
    }
});
