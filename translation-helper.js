// Add missing data-i18n attributes to HTML elements on page load
document.addEventListener('DOMContentLoaded', () => {
    // Resume form section headers and hints
    const resumeElements = {
        'h3.mt-lg': [
            { text: 'Resume Version', key: 'resumeVersion' },
            { text: 'Professional Summary', key: 'professionalSummary' },
            { text: 'Skills', key: 'skills' },
            { text: 'Work Experience', key: 'workExperience' }
        ],
        '.form-hint': [
            { contains: 'Give this resume version', key: 'resumeVersionHint' },
            { contains: 'Separate skills with commas', key: 'skillsHint' },
            { contains: 'Upload a PDF resume', key: 'uploadHint' },
            { contains: 'Include all technical skills', key: 'requirementsHint' }
        ],
        '.upload-text': [{ key: 'uploadText' }],
        '.divider-text': [{ text: 'OR', key: 'orDivider' }],
        'h3': [
            { contains: 'Quick Start', key: 'quickStart' }
        ]
    };

    // Apply attributes to resume section
    document.querySelectorAll('h3.mt-lg').forEach((el, index) => {
        const texts = ['Resume Version', 'Professional Summary', 'Skills', 'Work Experience'];
        const keys = ['resumeVersion', 'professionalSummary', 'skills', 'workExperience'];
        const textIndex = texts.findIndex(t => el.textContent.includes(t));
        if (textIndex >= 0 && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', keys[textIndex]);
        }
    });

    // Form hints
    document.querySelectorAll('.form-hint').forEach(el => {
        const text = el.textContent;
        if (text.includes('Give this resume version') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'resumeVersionHint');
        } else if (text.includes('Separate skills with commas') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'skillsHint');
        } else if (text.includes('Upload a PDF resume') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'uploadHint');
        } else if (text.includes('Include all technical skills') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'requirementsHint');
        }
    });

    // Upload text
    const uploadText = document.querySelector('.upload-text');
    if (uploadText && !uploadText.hasAttribute('data-i18n')) {
        uploadText.setAttribute('data-i18n', 'uploadText');
    }

    // OR divider
    const dividerText = document.querySelector('.divider-text');
    if (dividerText && !dividerText.hasAttribute('data-i18n')) {
        dividerText.setAttribute('data-i18n', 'orDivider');
    }

    // Quick Start header
    document.querySelectorAll('h3').forEach(el => {
        if (el.textContent.includes('Quick Start') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'quickStart');
        }
    });

    // Empty states
    document.querySelectorAll('.empty-state p').forEach(el => {
        const text = el.textContent;
        if (text.includes('No resumes saved yet') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'noResumesYet');
        } else if (text.includes('No job postings saved yet') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'noJobsYet');
        } else if (text.includes('No activity yet') && !el.hasAttribute('data-i18n')) {
            el.setAttribute('data-i18n', 'noActivityYet');
        }
    });

    // Dashboard elements
    const dashboardMappings = {
        'Keep going to unlock': 'keepGoing',
        'Start comparing jobs to see your best skills': 'startComparing',
        'No data yet': 'noDataYet',
        'No gaps yet': 'noGapsYet',
        'Locked': 'locked',
        'First Steps': 'firstSteps',
        'Complete your first job comparison': 'firstStepsDesc',
        'Job Hunter': 'jobHunter',
        'Add 10 job postings': 'jobHunterDesc',
        'Skill Master': 'skillMaster',
        'List 50+ skills': 'skillMasterDesc',
        'Perfect Match': 'perfectMatch',
        'Achieve a 90%+': 'perfectMatchDesc',
        'Persistent': 'persistent',
        'Stay active for 5': 'persistentDesc',
        'Comparison Pro': 'comparisonPro',
        'Complete 25 job': 'comparisonProDesc',
        'Resume Builder': 'resumeBuilder',
        'Create 3 different': 'resumeBuilderDesc'
    };

    // Apply dashboard mappings
    document.querySelectorAll('#dashboard-view p, #dashboard-view h3, #dashboard-view span').forEach(el => {
        const text = el.textContent.trim();
        for (const [contains, key] of Object.entries(dashboardMappings)) {
            if (text.includes(contains) && !el.hasAttribute('data-i18n')) {
                el.setAttribute('data-i18n', key);
                break;
            }
        }
    });

    // Form labels without data-i18n
    const labelMappings = {
        'Summary': 'summaryLabel',
        'Resume Title': 'resumeTitleLabel',
        'Job Posting URL': 'jobURL',
        'Requirements & Qualifications': 'requirements'
    };

    document.querySelectorAll('label.form-label').forEach(el => {
        const text = el.textContent.trim();
        for (const [labelText, key] of Object.entries(labelMappings)) {
            if (text.includes(labelText) && !el.hasAttribute('data-i18n')) {
                el.setAttribute('data-i18n', key);
                break;
            }
        }
    });

    // Card titles
    document.querySelectorAll('.card-title').forEach(el => {
        const text = el.textContent.trim();
        const titleMappings = {
            'Saved Resumes': 'savedResumes',
            'Saved Job Postings': 'savedJobs',
            'Your Progress': 'yourProgress',
            'Your Best Skills': 'yourBestSkills',
            'Most In-Demand': 'mostInDemand',
            'Skills to Learn': 'skillsToLearn',
            'Achievements': 'achievements',
            'Recent Activity': 'recentActivity'
        };

        for (const [titleText, key] of Object.entries(titleMappings)) {
            if (text === titleText && !el.hasAttribute('data-i18n')) {
                el.setAttribute('data-i18n', key);
                break;
            }
        }
    });

    // Card subtitles
    document.querySelectorAll('.card-subtitle').forEach(el => {
        const text = el.textContent.trim();
        const subtitleMappings = {
            'Skills you have that match job requirements most often': 'bestSkillsDesc',
            'Top skills across all jobs': 'topSkillsDesc',
            'Most common gaps': 'missingSkillsDesc',
            'Unlock badges by reaching milestones': 'achievementsDesc'
        };

        for (const [subText, key] of Object.entries(subtitleMappings)) {
            if (text.includes(subText) && !el.hasAttribute('data-i18n')) {
                el.setAttribute('data-i18n', key);
                break;
            }
        }
    });

    // Now trigger translation update
    if (typeof updateAllTranslations === 'function') {
        updateAllTranslations();
    }
});
