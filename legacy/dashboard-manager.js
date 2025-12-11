class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        // Will be called when dashboard view is activated
    }

    loadDashboard() {
        this.updateProgressDisplay();
        this.renderJourneyRoadmap();
        this.updateStatsCards();
        this.renderBestSkills();
        this.renderSkillsInsights();
        this.renderAchievements();
        this.renderRecentActivity();
    }

    defineJourneyStages() {
        return [
            {
                id: 'getting_started',
                name: 'Getting Started',
                icon: '🎯',
                color: '#FF6B6B',
                description: 'Build your resume and understand your skills',
                requirements: {
                    resumes: 1,
                    totalSkills: 5
                },
                tips: [
                    'Create your first resume with accurate skills',
                    'List at least 5 professional skills',
                    'Include your work experience'
                ]
            },
            {
                id: 'job_discovery',
                name: 'Job Discovery',
                icon: '🔍',
                color: '#4ECDC4',
                description: 'Find and save job postings that interest you',
                requirements: {
                    jobs: 3
                },
                tips: [
                    'Add at least 3 job postings',
                    'Include detailed job requirements',
                    'Copy full job descriptions for better analysis'
                ]
            },
            {
                id: 'skills_analysis',
                name: 'Skills Analysis',
                icon: '📊',
                color: '#95E1D3',
                description: 'Compare your resume to jobs and identify gaps',
                requirements: {
                    comparisons: 5
                },
                tips: [
                    'Compare your resume with different jobs',
                    'Complete at least 5 comparisons',
                    'Review matching and missing skills carefully'
                ]
            },
            {
                id: 'skill_building',
                name: 'Skill Building',
                icon: '📈',
                color: '#F38181',
                description: 'Improve your skills and increase match scores',
                requirements: {
                    comparisons: 10,
                    averageMatch: 50
                },
                tips: [
                    'Update your resume with new skills',
                    'Focus on high-demand skills',
                    'Aim for 50%+ average match score'
                ]
            },
            {
                id: 'application_ready',
                name: 'Application Ready',
                icon: '✅',
                color: '#AA96DA',
                description: 'Achieve strong match scores, ready to apply',
                requirements: {
                    comparisons: 15,
                    averageMatch: 70,
                    bestMatch: 80
                },
                tips: [
                    'Target 70%+ average match score',
                    'Achieve at least one 80%+ match',
                    'Tailor your resume for best matches'
                ]
            },
            {
                id: 'job_hunt_success',
                name: 'Job Hunt Success',
                icon: '🏆',
                color: '#FCBAD3',
                description: 'Master your job search process',
                requirements: {
                    comparisons: 25,
                    averageMatch: 75,
                    bestMatch: 90
                },
                tips: [
                    'Maintain 75%+ average match score',
                    'Achieve 90%+ perfect matches',
                    'Keep comparing and improving'
                ]
            }
        ];
    }

    getCurrentStageIndex() {
        const stages = this.defineJourneyStages();
        const stats = analytics.getStats();
        const jobs = jobManager.getAllJobs();
        const resumes = resumeManager ? resumeManager.getAllResumes() : [];

        // Count total skills across all resumes
        let totalSkills = 0;
        resumes.forEach(resume => {
            const skills = Utils.extractSkills(resume.skills);
            totalSkills += skills.length;
        });

        const userProgress = {
            resumes: resumes.length,
            jobs: jobs.length,
            comparisons: stats.totalComparisons,
            averageMatch: stats.averageMatch,
            bestMatch: stats.bestMatch,
            totalSkills: totalSkills
        };

        // Find the highest stage the user has completed
        let currentStageIndex = 0;

        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            const isComplete = this.isStageComplete(stage, userProgress);

            if (isComplete && i < stages.length - 1) {
                currentStageIndex = i + 1;
            } else if (!isComplete) {
                break;
            }
        }

        return currentStageIndex;
    }

    isStageComplete(stage, userProgress) {
        const req = stage.requirements;

        if (req.resumes && userProgress.resumes < req.resumes) return false;
        if (req.jobs && userProgress.jobs < req.jobs) return false;
        if (req.comparisons && userProgress.comparisons < req.comparisons) return false;
        if (req.averageMatch && userProgress.averageMatch < req.averageMatch) return false;
        if (req.bestMatch && userProgress.bestMatch < req.bestMatch) return false;
        if (req.totalSkills && userProgress.totalSkills < req.totalSkills) return false;

        return true;
    }

    getStageProgress(stage, userProgress) {
        const req = stage.requirements;
        let totalChecks = 0;
        let completedChecks = 0;

        if (req.resumes !== undefined) {
            totalChecks++;
            if (userProgress.resumes >= req.resumes) completedChecks++;
        }
        if (req.jobs !== undefined) {
            totalChecks++;
            if (userProgress.jobs >= req.jobs) completedChecks++;
        }
        if (req.comparisons !== undefined) {
            totalChecks++;
            if (userProgress.comparisons >= req.comparisons) completedChecks++;
        }
        if (req.averageMatch !== undefined) {
            totalChecks++;
            if (userProgress.averageMatch >= req.averageMatch) completedChecks++;
        }
        if (req.bestMatch !== undefined) {
            totalChecks++;
            if (userProgress.bestMatch >= req.bestMatch) completedChecks++;
        }
        if (req.totalSkills !== undefined) {
            totalChecks++;
            if (userProgress.totalSkills >= req.totalSkills) completedChecks++;
        }

        return totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;
    }

    renderJourneyRoadmap() {
        const stages = this.defineJourneyStages();
        const currentStageIndex = this.getCurrentStageIndex();
        const stats = analytics.getStats();
        const jobs = jobManager.getAllJobs();
        const resumes = resumeManager ? resumeManager.getAllResumes() : [];

        let totalSkills = 0;
        resumes.forEach(resume => {
            const skills = Utils.extractSkills(resume.skills);
            totalSkills += skills.length;
        });

        const userProgress = {
            resumes: resumes.length,
            jobs: jobs.length,
            comparisons: stats.totalComparisons,
            averageMatch: stats.averageMatch,
            bestMatch: stats.bestMatch,
            totalSkills: totalSkills
        };

        // Render roadmap
        const roadmapContainer = document.getElementById('journey-roadmap');
        roadmapContainer.innerHTML = `
            <div class="roadmap-path">
                ${stages.map((stage, index) => {
                    const isComplete = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const progress = this.getStageProgress(stage, userProgress);

                    return `
                        <div class="roadmap-stage ${isComplete ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${index > currentStageIndex ? 'locked' : ''}">
                            <div class="stage-connector ${isComplete ? 'completed' : ''}"></div>
                            <div class="stage-milestone" style="--stage-color: ${stage.color}">
                                <div class="stage-icon">${stage.icon}</div>
                                ${isCurrent && progress > 0 && progress < 100 ? `
                                    <svg class="stage-progress-ring" width="80" height="80">
                                        <circle cx="40" cy="40" r="36" stroke="#e0e0e0" stroke-width="4" fill="none"></circle>
                                        <circle cx="40" cy="40" r="36" stroke="${stage.color}" stroke-width="4" fill="none"
                                            stroke-dasharray="226.19" stroke-dashoffset="${226.19 - (226.19 * progress / 100)}"
                                            transform="rotate(-90 40 40)"></circle>
                                    </svg>
                                ` : ''}
                                ${isComplete ? '<div class="stage-checkmark">✓</div>' : ''}
                            </div>
                            <div class="stage-info">
                                <h3 class="stage-name">${stage.name}</h3>
                                <p class="stage-description">${stage.description}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Render current stage details
        this.renderCurrentStageDetails(stages[currentStageIndex], userProgress);
    }

    renderCurrentStageDetails(stage, userProgress) {
        const container = document.getElementById('current-stage-details');
        const progress = this.getStageProgress(stage, userProgress);
        const isComplete = progress === 100;

        let requirementsList = '';
        const req = stage.requirements;

        if (req.resumes !== undefined) {
            const done = userProgress.resumes >= req.resumes;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">Create ${req.resumes} resume${req.resumes > 1 ? 's' : ''}</span>
                    <span class="requirement-progress">${userProgress.resumes}/${req.resumes}</span>
                </div>
            `;
        }
        if (req.jobs !== undefined) {
            const done = userProgress.jobs >= req.jobs;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">Add ${req.jobs} job posting${req.jobs > 1 ? 's' : ''}</span>
                    <span class="requirement-progress">${userProgress.jobs}/${req.jobs}</span>
                </div>
            `;
        }
        if (req.comparisons !== undefined) {
            const done = userProgress.comparisons >= req.comparisons;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">Complete ${req.comparisons} comparison${req.comparisons > 1 ? 's' : ''}</span>
                    <span class="requirement-progress">${userProgress.comparisons}/${req.comparisons}</span>
                </div>
            `;
        }
        if (req.averageMatch !== undefined) {
            const done = userProgress.averageMatch >= req.averageMatch;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">Achieve ${req.averageMatch}% average match</span>
                    <span class="requirement-progress">${userProgress.averageMatch}%/${req.averageMatch}%</span>
                </div>
            `;
        }
        if (req.bestMatch !== undefined) {
            const done = userProgress.bestMatch >= req.bestMatch;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">Achieve ${req.bestMatch}% best match</span>
                    <span class="requirement-progress">${userProgress.bestMatch}%/${req.bestMatch}%</span>
                </div>
            `;
        }
        if (req.totalSkills !== undefined) {
            const done = userProgress.totalSkills >= req.totalSkills;
            requirementsList += `
                <div class="requirement-item ${done ? 'completed' : ''}">
                    <span class="requirement-icon">${done ? '✓' : '○'}</span>
                    <span class="requirement-text">List ${req.totalSkills}+ skills</span>
                    <span class="requirement-progress">${userProgress.totalSkills}/${req.totalSkills}</span>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="current-stage-card">
                <div class="current-stage-header">
                    <div class="current-stage-icon" style="background: ${stage.color}">${stage.icon}</div>
                    <div class="current-stage-title-section">
                        <h3 class="current-stage-title">${isComplete ? '✓ Completed: ' : 'Current Stage: '}${stage.name}</h3>
                        <p class="current-stage-subtitle">${stage.description}</p>
                    </div>
                    <div class="current-stage-progress-circle">
                        <svg width="60" height="60">
                            <circle cx="30" cy="30" r="26" stroke="#e0e0e0" stroke-width="4" fill="none"></circle>
                            <circle cx="30" cy="30" r="26" stroke="${stage.color}" stroke-width="4" fill="none"
                                stroke-dasharray="163.36" stroke-dashoffset="${163.36 - (163.36 * progress / 100)}"
                                transform="rotate(-90 30 30)"></circle>
                        </svg>
                        <span class="progress-percentage">${Math.round(progress)}%</span>
                    </div>
                </div>

                <div class="current-stage-body">
                    <div class="requirements-section">
                        <h4 class="section-title">Requirements</h4>
                        <div class="requirements-list">
                            ${requirementsList}
                        </div>
                    </div>

                    <div class="tips-section">
                        <h4 class="section-title">Tips to Progress</h4>
                        <ul class="tips-list">
                            ${stage.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    updateProgressDisplay() {
        const progress = gamification.getProgress();

        // Update level displays
        document.getElementById('level-text').textContent = progress.level;
        document.getElementById('level-display').textContent = progress.level;

        // Update XP bar
        const currentLevelXP = progress.xp % 500;
        const percentage = (currentLevelXP / 500) * 100;
        const xpBar = document.getElementById('xp-bar');
        const xpText = document.getElementById('xp-text');

        if (xpBar && xpText) {
            xpBar.style.width = `${percentage}%`;
            xpText.textContent = `${currentLevelXP} / 500 XP`;
        }

        // Update streak
        const streakDays = document.getElementById('streak-days');
        if (streakDays) {
            streakDays.textContent = progress.streak || 0;
        }
    }

    updateStatsCards() {
        const stats = analytics.getStats();
        const jobs = jobManager.getAllJobs();

        document.getElementById('stat-comparisons').textContent = stats.totalComparisons;
        document.getElementById('stat-jobs').textContent = jobs.length;
        document.getElementById('stat-avg-match').textContent = `${stats.averageMatch}%`;
        document.getElementById('stat-best-match').textContent = `${stats.bestMatch}%`;
    }

    renderBestSkills() {
        const container = document.getElementById('best-skills-container');
        const bestSkills = this.getBestSkills();

        if (bestSkills.length > 0) {
            container.innerHTML = bestSkills.map((skill, index) => `
                <div class="best-skill-card">
                    <div class="best-skill-rank">#${index + 1}</div>
                    <div class="best-skill-content">
                        <div class="best-skill-name">${Utils.escapeHtml(skill.skill)}</div>
                        <div class="best-skill-stats">
                            <span class="best-skill-matches">${skill.matchCount} matches</span>
                            <span class="best-skill-percentage">${skill.matchRate}% match rate</span>
                        </div>
                    </div>
                    <div class="best-skill-badge">⭐</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty-state">Start comparing jobs to see your best skills!</p>';
        }
    }

    getBestSkills() {
        // Get all comparisons
        const comparisons = analytics.comparisonHistory;
        if (comparisons.length === 0) return [];

        // Count how many times each skill appears in matching skills
        const skillMatches = {};
        const skillTotal = {};

        comparisons.forEach(comp => {
            comp.matchingSkills.forEach(skill => {
                const normalized = Utils.normalizeSkill(skill);
                skillMatches[normalized] = (skillMatches[normalized] || 0) + 1;
                skillTotal[normalized] = (skillTotal[normalized] || 0) + 1;
            });

            comp.missingSkills.forEach(skill => {
                const normalized = Utils.normalizeSkill(skill);
                skillTotal[normalized] = (skillTotal[normalized] || 0) + 1;
            });
        });

        // Calculate match rate and sort
        const bestSkills = Object.entries(skillMatches)
            .map(([skill, matchCount]) => ({
                skill,
                matchCount,
                totalAppearances: skillTotal[skill],
                matchRate: Math.round((matchCount / skillTotal[skill]) * 100)
            }))
            .filter(s => s.matchCount >= 2) // Only show skills that matched at least twice
            .sort((a, b) => b.matchCount - a.matchCount)
            .slice(0, 6); // Top 6

        return bestSkills;
    }

    renderSkillsInsights() {
        const topSkills = analytics.getTopSkills(8);
        const missingSkills = analytics.getMostMissingSkills(8);

        const topSkillsContainer = document.getElementById('top-skills-list');
        const missingSkillsContainer = document.getElementById('missing-skills-list');

        if (topSkills.length > 0) {
            topSkillsContainer.innerHTML = topSkills.map((item, index) => `
                <div class="skill-rank-item">
                    <span class="skill-rank-number">${index + 1}</span>
                    <span class="skill-rank-name">${Utils.escapeHtml(item.skill)}</span>
                    <span class="skill-rank-count">${item.count}</span>
                </div>
            `).join('');
        } else {
            topSkillsContainer.innerHTML = '<p class="empty-state">No data yet</p>';
        }

        if (missingSkills.length > 0) {
            missingSkillsContainer.innerHTML = missingSkills.map((item, index) => `
                <div class="skill-rank-item missing">
                    <span class="skill-rank-number">${index + 1}</span>
                    <span class="skill-rank-name">${Utils.escapeHtml(item.skill)}</span>
                    <span class="skill-rank-count">${item.count}</span>
                </div>
            `).join('');
        } else {
            missingSkillsContainer.innerHTML = '<p class="empty-state">No gaps yet!</p>';
        }
    }

    renderAchievements() {
        const container = document.getElementById('achievements-container');
        const unlocked = gamification.getUnlockedAchievements();
        const locked = gamification.getLockedAchievements();

        const allAchievements = [...unlocked.map(a => ({ ...a, unlocked: true })), ...locked.map(a => ({ ...a, unlocked: false }))];

        container.innerHTML = allAchievements.map(achievement => `
            <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-badge-icon">${achievement.icon}</div>
                <div class="achievement-badge-name">${achievement.name}</div>
                <div class="achievement-badge-desc">${achievement.description}</div>
                ${achievement.unlocked ? '<div class="achievement-badge-status">✓ Unlocked</div>' : '<div class="achievement-badge-status">🔒 Locked</div>'}
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        const activity = analytics.getRecentActivity(5);

        if (activity.length > 0) {
            container.innerHTML = activity.map(item => `
                <div class="activity-item">
                    <div class="activity-icon">📊</div>
                    <div class="activity-content">
                        <div class="activity-title">Compared <strong>${Utils.escapeHtml(item.jobTitle)}</strong></div>
                        <div class="activity-meta">
                            <span class="activity-match ${item.matchScore >= 70 ? 'good' : item.matchScore >= 50 ? 'moderate' : 'low'}">${item.matchScore}% match</span>
                            <span class="activity-date">${Utils.formatDate(item.timestamp)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty-state">No activity yet. Start comparing jobs!</p>';
        }
    }
}

// Initialize
const dashboardManager = new DashboardManager();
