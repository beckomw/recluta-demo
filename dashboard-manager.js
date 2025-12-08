class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        // Will be called when dashboard view is activated
    }

    loadDashboard() {
        this.updateProgressDisplay();
        this.updateStatsCards();
        this.renderBestSkills();
        this.renderSkillsInsights();
        this.renderAchievements();
        this.renderRecentActivity();
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
