// ===================================
// Analytics System
// Data analysis and insights
// ===================================

class AnalyticsSystem {
    constructor() {
        this.comparisonHistory = this.loadComparisonHistory();
    }

    loadComparisonHistory() {
        return Storage.get('app_comparison_history') || [];
    }

    saveComparisonHistory() {
        Storage.set('app_comparison_history', this.comparisonHistory);
    }

    recordComparison(resumeId, jobId, result) {
        const record = {
            id: Utils.generateId(),
            resumeId,
            jobId,
            matchScore: result.matchPercentage,
            matchingSkills: result.matchingSkills,
            missingSkills: result.missingSkills,
            timestamp: Date.now(),
            applied: false
        };

        this.comparisonHistory.push(record);
        this.saveComparisonHistory();

        // Track in gamification
        gamification.trackAction('comparison', {
            matchScore: result.matchPercentage,
            totalSkills: result.matchingSkills.length + result.missingSkills.length
        });

        return record;
    }

    markAsApplied(comparisonId) {
        const comparison = this.comparisonHistory.find(c => c.id === comparisonId);
        if (comparison) {
            comparison.applied = true;
            this.saveComparisonHistory();
        }
    }

    getTopSkills(limit = 10) {
        const skillCounts = {};

        this.comparisonHistory.forEach(comparison => {
            [...comparison.matchingSkills, ...comparison.missingSkills].forEach(skill => {
                const normalized = Utils.normalizeSkill(skill);
                skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
            });
        });

        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([skill, count]) => ({ skill, count }));
    }

    getMostMissingSkills(limit = 10) {
        const skillCounts = {};

        this.comparisonHistory.forEach(comparison => {
            comparison.missingSkills.forEach(skill => {
                const normalized = Utils.normalizeSkill(skill);
                skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
            });
        });

        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([skill, count]) => ({ skill, count }));
    }

    getAverageMatchScore() {
        if (this.comparisonHistory.length === 0) return 0;

        const sum = this.comparisonHistory.reduce((acc, c) => acc + c.matchScore, 0);
        return Math.round(sum / this.comparisonHistory.length);
    }

    getMatchScoreTrend() {
        // Get last 10 comparisons
        return this.comparisonHistory
            .slice(-10)
            .map(c => ({
                score: c.matchScore,
                date: Utils.formatDate(c.timestamp)
            }));
    }

    getApplicationFunnel() {
        const total = this.comparisonHistory.length;
        const applied = this.comparisonHistory.filter(c => c.applied).length;

        return {
            compared: total,
            applied: applied,
            conversionRate: total > 0 ? Math.round((applied / total) * 100) : 0
        };
    }

    getRecentActivity(limit = 5) {
        return this.comparisonHistory
            .slice(-limit)
            .reverse()
            .map(c => {
                const job = jobManager.getJob(c.jobId);
                const resume = resumeManager.getResume(c.resumeId);

                return {
                    ...c,
                    jobTitle: job?.title || 'Unknown Job',
                    resumeName: resume ? `${resume.firstName} ${resume.lastName}` : 'Unknown Resume'
                };
            });
    }

    getStats() {
        return {
            totalComparisons: this.comparisonHistory.length,
            averageMatch: this.getAverageMatchScore(),
            bestMatch: Math.max(...this.comparisonHistory.map(c => c.matchScore), 0),
            totalApplied: this.comparisonHistory.filter(c => c.applied).length
        };
    }
}

// Initialize
const analytics = new AnalyticsSystem();
