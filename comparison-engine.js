// ===================================
// Comparison Engine
// Skills Gap Analysis & Matching
// ===================================

class ComparisonEngine {
  constructor() {
    this.selectedResumeId = null;
    this.selectedJobId = null;
    this.init();
  }

  init() {
    // Will be called when comparison view is activated
  }

  loadSelectors() {
    this.renderResumeSelector();
    this.renderJobSelector();
  }

  renderResumeSelector() {
    const container = document.getElementById('resume-selector');
    const resumes = resumeManager.getAllResumes();

    if (resumes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No resumes available. Create a resume first!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = resumes.map(resume => {
      const skillsList = Utils.extractSkills(resume.skills);
      const isSelected = this.selectedResumeId === resume.id;
      const profile = resumeManager.userProfile;
      const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Unnamed';
      const resumeTitle = resume.title || 'My Resume';

      return `
        <div class="item-card ${isSelected ? 'selected' : ''}" data-id="${resume.id}" onclick="comparisonEngine.selectResume('${resume.id}')">
          <div class="item-header">
            <div>
              <h4 class="item-title">${Utils.escapeHtml(resumeTitle)}</h4>
              <p class="item-subtitle">${Utils.escapeHtml(fullName)} • ${skillsList.length} skills</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderJobSelector() {
    const container = document.getElementById('job-selector');
    const jobs = jobManager.getAllJobs();

    if (jobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No jobs available. Add a job posting first!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs.map(job => {
      const requirements = Utils.extractSkills(job.requirements);
      const isSelected = this.selectedJobId === job.id;

      return `
        <div class="item-card ${isSelected ? 'selected' : ''}" data-id="${job.id}" onclick="comparisonEngine.selectJob('${job.id}')">
          <div class="item-header">
            <div>
              <h4 class="item-title">${Utils.escapeHtml(job.title)}</h4>
              <p class="item-subtitle">${Utils.escapeHtml(job.company)} • ${requirements.length} requirements</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  selectResume(id) {
    this.selectedResumeId = id;
    this.renderResumeSelector();
    this.runComparison();
  }

  selectJob(id) {
    this.selectedJobId = id;
    this.renderJobSelector();
    this.runComparison();
  }

  runComparison() {
    if (!this.selectedResumeId || !this.selectedJobId) {
      document.getElementById('analysis-results').classList.add('hidden');
      return;
    }

    const resume = resumeManager.getResume(this.selectedResumeId);
    const job = jobManager.getJob(this.selectedJobId);

    if (!resume || !job) return;

    const analysis = this.analyzeMatch(resume, job);
    this.displayResults(analysis, resume, job);
  }

  analyzeMatch(resume, job) {
    // Extract skills from resume
    const resumeSkills = Utils.extractSkills(resume.skills);
    const resumeSkillsNormalized = resumeSkills.map(s => Utils.normalizeSkill(s));

    // Extract requirements from job
    const jobRequirements = Utils.extractSkills(job.requirements);
    const jobRequirementsNormalized = jobRequirements.map(s => Utils.normalizeSkill(s));

    // Find matches and gaps
    const matchingSkills = [];
    const missingSkills = [];

    jobRequirements.forEach((req, index) => {
      const normalizedReq = jobRequirementsNormalized[index];

      // Check if resume has this skill (fuzzy matching)
      const hasSkill = resumeSkillsNormalized.some(skill => {
        // Exact match
        if (skill === normalizedReq) return true;

        // Partial match (one contains the other)
        if (skill.includes(normalizedReq) || normalizedReq.includes(skill)) return true;

        return false;
      });

      if (hasSkill) {
        matchingSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    // Calculate match percentage
    const matchPercentage = jobRequirements.length > 0
      ? Math.round((matchingSkills.length / jobRequirements.length) * 100)
      : 0;

    return {
      matchPercentage,
      matchingSkills,
      missingSkills,
      totalRequired: jobRequirements.length,
      totalMatched: matchingSkills.length
    };
  }

  displayResults(analysis, resume, job) {
    const resultsContainer = document.getElementById('analysis-results');
    resultsContainer.classList.remove('hidden');

    // Update match score
    const scoreElement = document.getElementById('match-percentage');
    scoreElement.textContent = `${analysis.matchPercentage}%`;

    // Color code the score
    const scoreCircle = document.querySelector('.score-circle');
    if (analysis.matchPercentage >= 80) {
      scoreCircle.style.color = 'var(--success-color)';
    } else if (analysis.matchPercentage >= 60) {
      scoreCircle.style.color = 'var(--warning-color)';
    } else {
      scoreCircle.style.color = 'var(--danger-color)';
    }

    // Update match message
    const messageElement = document.getElementById('match-message');
    let message = '';

    if (analysis.matchPercentage >= 80) {
      message = '🎯 Excellent match! You\'re highly competitive for this role.';
    } else if (analysis.matchPercentage >= 60) {
      message = '✓ Good match! Consider highlighting your transferable skills.';
    } else if (analysis.matchPercentage >= 40) {
      message = '⚠ Moderate match. You may need to address some skill gaps.';
    } else {
      message = '❌ Low match. This role may require significant upskilling.';
    }

    messageElement.textContent = message;

    // Display matching skills
    const matchingContainer = document.getElementById('matching-skills');
    if (analysis.matchingSkills.length > 0) {
      matchingContainer.innerHTML = analysis.matchingSkills.map(skill => `
        <div class="skill-item">${Utils.escapeHtml(skill)}</div>
      `).join('');
    } else {
      matchingContainer.innerHTML = '<p class="empty-state">No matching skills found</p>';
    }

    // Display missing skills
    const missingContainer = document.getElementById('missing-skills');
    if (analysis.missingSkills.length > 0) {
      missingContainer.innerHTML = analysis.missingSkills.map(skill => `
        <div class="skill-item missing">${Utils.escapeHtml(skill)}</div>
      `).join('');
    } else {
      missingContainer.innerHTML = '<p class="empty-state" style="color: var(--success-color);">🎉 You have all required skills!</p>';
    }

    // Display detailed comparison
    this.displayDetailedComparison(resume, job, analysis);

    // Record comparison in analytics
    analytics.recordComparison(this.selectedResumeId, this.selectedJobId, analysis);

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  displayDetailedComparison(resume, job, analysis) {
    const container = document.getElementById('detailed-comparison');

    const resumeSkills = Utils.extractSkills(resume.skills);
    const additionalSkills = resumeSkills.filter(skill => {
      const normalized = Utils.normalizeSkill(skill);
      return !analysis.matchingSkills.some(match =>
        Utils.normalizeSkill(match) === normalized ||
        Utils.normalizeSkill(match).includes(normalized) ||
        normalized.includes(Utils.normalizeSkill(match))
      );
    });

    container.innerHTML = `
      <div style="display: grid; gap: var(--spacing-md);">
        <div>
          <h4>📊 Match Summary</h4>
          <p style="color: var(--text-secondary);">
            You match <strong style="color: var(--primary-color);">${analysis.totalMatched} out of ${analysis.totalRequired}</strong> required skills/qualifications.
          </p>
        </div>

        ${additionalSkills.length > 0 ? `
          <div>
            <h4>💡 Your Additional Skills</h4>
            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
              Skills you have that weren't explicitly listed in the requirements:
            </p>
            <div class="item-meta">
              ${additionalSkills.map(skill => `<span class="tag tag-primary">${Utils.escapeHtml(skill)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div>
          <h4>🎯 Recommendation</h4>
          <p style="color: var(--text-secondary);">
            ${this.getRecommendation(analysis)}
          </p>
        </div>

        <div style="background: var(--bg-tertiary); padding: var(--spacing-md); border-radius: var(--radius-sm); border-left: 4px solid var(--primary-color);">
          <h4 style="margin-bottom: var(--spacing-sm);">📝 Next Steps</h4>
          <ul style="color: var(--text-secondary); margin-left: var(--spacing-md); line-height: 1.8;">
            ${this.getNextSteps(analysis).map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  getRecommendation(analysis) {
    if (analysis.matchPercentage >= 80) {
      return 'You\'re an excellent candidate for this position! Your skills align very well with the requirements. Focus on tailoring your resume to highlight these matching skills and prepare examples that demonstrate your expertise.';
    } else if (analysis.matchPercentage >= 60) {
      return 'You have a solid foundation for this role. While you may not meet every requirement, your core skills are aligned. Consider how your experience translates to the missing skills and be prepared to discuss your learning ability.';
    } else if (analysis.matchPercentage >= 40) {
      return 'This role is a stretch, but not impossible. You\'ll need to make a strong case for why your existing skills are transferable. Consider whether you\'re willing to invest time in learning the missing skills before or after applying.';
    } else {
      return 'This position requires skills significantly different from your current profile. Unless you have relevant experience not captured in your resume, you may want to focus on roles that better match your current skillset or invest in upskilling first.';
    }
  }

  getNextSteps(analysis) {
    const steps = [];

    if (analysis.matchPercentage >= 70) {
      steps.push('Tailor your resume to emphasize the matching skills');
      steps.push('Prepare specific examples of how you\'ve used these skills');
      steps.push('Research the company culture and values');
      steps.push('Apply with confidence!');
    } else if (analysis.matchPercentage >= 50) {
      steps.push('Highlight transferable skills in your cover letter');
      steps.push('Address skill gaps by showing willingness to learn');
      steps.push('Consider taking a quick online course in missing areas');
      steps.push('Network with people at the company if possible');
    } else {
      steps.push('Honestly assess if this role aligns with your career goals');
      steps.push('Consider upskilling in the missing areas before applying');
      steps.push('Look for similar roles with lower requirements');
      steps.push('Build projects that demonstrate the required skills');
    }

    return steps;
  }
}

// Initialize
const comparisonEngine = new ComparisonEngine();
