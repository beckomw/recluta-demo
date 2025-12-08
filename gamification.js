// ===================================
// Gamification System
// XP, Levels, Achievements, Streaks
// ===================================

class GamificationSystem {
    constructor() {
        this.storageKey = 'app_user_progress';
        this.progress = this.loadProgress();
        this.achievements = this.defineAchievements();
    }

    loadProgress() {
        const stored = Storage.get(this.storageKey);
        return stored || {
            xp: 0,
            level: 1,
            achievements: [],
            streak: 0,
            lastActive: Date.now(),
            stats: {
                totalComparisons: 0,
                totalJobs: 0,
                totalResumes: 0,
                bestMatch: 0,
                daysActive: 1
            }
        };
    }

    saveProgress() {
        Storage.set(this.storageKey, this.progress);
    }

    defineAchievements() {
        return [
            {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first job comparison',
                icon: '🎯',
                condition: (stats) => stats.totalComparisons >= 1,
                xpReward: 50
            },
            {
                id: 'job_hunter',
                name: 'Job Hunter',
                description: 'Add 10 job postings',
                icon: '💼',
                condition: (stats) => stats.totalJobs >= 10,
                xpReward: 100
            },
            {
                id: 'skill_master',
                name: 'Skill Master',
                description: 'List 50+ skills in your resume',
                icon: '⭐',
                condition: (stats) => stats.totalSkills >= 50,
                xpReward: 150
            },
            {
                id: 'perfect_match',
                name: 'Perfect Match',
                description: 'Achieve a 90%+ match score',
                icon: '🏆',
                condition: (stats) => stats.bestMatch >= 90,
                xpReward: 200
            },
            {
                id: 'persistent',
                name: 'Persistent',
                description: 'Stay active for 5 consecutive days',
                icon: '🔥',
                condition: (stats) => stats.streak >= 5,
                xpReward: 250
            },
            {
                id: 'comparison_pro',
                name: 'Comparison Pro',
                description: 'Complete 25 job comparisons',
                icon: '📊',
                condition: (stats) => stats.totalComparisons >= 25,
                xpReward: 300
            },
            {
                id: 'resume_builder',
                name: 'Resume Builder',
                description: 'Create 3 different resumes',
                icon: '📝',
                condition: (stats) => stats.totalResumes >= 3,
                xpReward: 100
            }
        ];
    }

    addXP(amount, action) {
        this.progress.xp += amount;

        // Check for level up
        const newLevel = Math.floor(this.progress.xp / 500) + 1;
        if (newLevel > this.progress.level) {
            this.progress.level = newLevel;
            this.showLevelUp(newLevel);
        }

        this.saveProgress();
        this.updateDisplay();
    }

    trackAction(action, data = {}) {
        // Update streak
        this.updateStreak();

        // Track specific actions
        switch (action) {
            case 'comparison':
                this.progress.stats.totalComparisons++;
                this.addXP(100, 'comparison');
                if (data.matchScore > this.progress.stats.bestMatch) {
                    this.progress.stats.bestMatch = data.matchScore;
                }
                break;
            case 'add_job':
                this.progress.stats.totalJobs++;
                this.addXP(25, 'add_job');
                break;
            case 'add_resume':
                this.progress.stats.totalResumes++;
                this.addXP(50, 'add_resume');
                break;
        }

        // Check for new achievements
        this.checkAchievements(data);
        this.saveProgress();
    }

    updateStreak() {
        const now = Date.now();
        const lastActive = this.progress.lastActive;
        const daysSince = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

        if (daysSince === 0) {
            // Same day, no change
            return;
        } else if (daysSince === 1) {
            // Next day, increment streak
            this.progress.streak++;
            this.progress.stats.daysActive++;
        } else {
            // Streak broken
            this.progress.streak = 1;
        }

        this.progress.lastActive = now;
    }

    checkAchievements(extraData = {}) {
        const stats = { ...this.progress.stats, ...extraData, streak: this.progress.streak };

        this.achievements.forEach(achievement => {
            // Skip if already unlocked
            if (this.progress.achievements.includes(achievement.id)) {
                return;
            }

            // Check condition
            if (achievement.condition(stats)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.progress.achievements.push(achievement.id);
        this.addXP(achievement.xpReward, 'achievement');
        this.showAchievementUnlock(achievement);
        this.saveProgress();
    }

    showLevelUp(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <div class="level-up-text">
                    <h3>Level Up!</h3>
                    <p>You've reached Level ${level}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <h3>Achievement Unlocked!</h3>
                    <p><strong>${achievement.name}</strong></p>
                    <p class="achievement-desc">${achievement.description}</p>
                    <p class="achievement-xp">+${achievement.xpReward} XP</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    updateDisplay() {
        // Update XP bar
        const xpBar = document.getElementById('xp-bar');
        const xpText = document.getElementById('xp-text');
        const levelText = document.getElementById('level-text');

        if (xpBar && xpText && levelText) {
            const currentLevelXP = this.progress.xp % 500;
            const percentage = (currentLevelXP / 500) * 100;

            xpBar.style.width = `${percentage}%`;
            xpText.textContent = `${currentLevelXP} / 500 XP`;
            levelText.textContent = `Level ${this.progress.level}`;
        }
    }

    getProgress() {
        return this.progress;
    }

    getUnlockedAchievements() {
        return this.achievements.filter(a =>
            this.progress.achievements.includes(a.id)
        );
    }

    getLockedAchievements() {
        return this.achievements.filter(a =>
            !this.progress.achievements.includes(a.id)
        );
    }
}

// Initialize
const gamification = new GamificationSystem();
