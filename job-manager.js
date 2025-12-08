// ===================================
// Job Manager
// Handle job posting CRUD operations
// ===================================

class JobManager {
    constructor() {
        this.jobs = [];
        this.storageKey = 'app_jobs';
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.loadJobs();
    }

    setupForm() {
        const form = document.getElementById('job-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveJob();
        });
    }

    saveJob() {
        const formData = {
            id: this.currentEditId || Utils.generateId(),
            title: document.getElementById('job-title').value.trim(),
            company: document.getElementById('job-company').value.trim(),
            location: document.getElementById('job-location').value.trim(),
            url: document.getElementById('job-url').value.trim(),
            description: document.getElementById('job-description').value.trim(),
            requirements: document.getElementById('job-requirements').value.trim(),
            createdAt: this.currentEditId ?
                this.jobs.find(j => j.id === this.currentEditId)?.createdAt : Date.now(),
            updatedAt: Date.now()
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.jobs.findIndex(j => j.id === this.currentEditId);
            if (index !== -1) {
                this.jobs[index] = formData;
            }
            this.currentEditId = null;
        } else {
            // Add new
            this.jobs.push(formData);
        }

        Storage.set(this.storageKey, this.jobs);
        this.renderJobs();
        this.resetForm();

        Utils.showNotification('Job posting saved successfully!');
    }

    loadJobs() {
        const stored = Storage.get(this.storageKey);
        this.jobs = stored || [];
        this.renderJobs();
    }

    renderJobs() {
        const container = document.getElementById('jobs-list');

        if (this.jobs.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💼</div>
          <p>No job postings saved yet. Add your first job above!</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.jobs.map(job => {
            const requirements = Utils.extractSkills(job.requirements);
            const reqPreview = requirements.slice(0, 5).join(', ') +
                (requirements.length > 5 ? ` +${requirements.length - 5} more` : '');

            return `
        <div class="item-card" data-id="${job.id}">
          <div class="item-header">
            <div>
              <h3 class="item-title">${Utils.escapeHtml(job.title)}</h3>
              <p class="item-subtitle">${Utils.escapeHtml(job.company)}${job.location ? ` • ${Utils.escapeHtml(job.location)}` : ''}</p>
            </div>
            <div class="item-actions">
              <button class="btn btn-sm btn-secondary edit-job" data-id="${job.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-job" data-id="${job.id}">Delete</button>
            </div>
          </div>
          <div class="item-meta">
            <span class="tag">${requirements.length} requirements</span>
            <span class="tag">Added ${Utils.formatDate(job.createdAt)}</span>
          </div>
          ${reqPreview ? `<p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">${Utils.escapeHtml(reqPreview)}</p>` : ''}
        </div>
      `;
        }).join('');

        // Attach event listeners
        container.querySelectorAll('.edit-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editJob(btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteJob(btn.dataset.id);
            });
        });
    }

    editJob(id) {
        const job = this.jobs.find(j => j.id === id);
        if (!job) return;

        this.currentEditId = id;

        // Populate form
        document.getElementById('job-title').value = job.title;
        document.getElementById('job-company').value = job.company;
        document.getElementById('job-location').value = job.location;
        document.getElementById('job-url').value = job.url;
        document.getElementById('job-description').value = job.description;
        document.getElementById('job-requirements').value = job.requirements;

        // Scroll to form
        document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteJob(id) {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        this.jobs = this.jobs.filter(j => j.id !== id);
        Storage.set(this.storageKey, this.jobs);
        this.renderJobs();

        Utils.showNotification('Job posting deleted');
    }

    resetForm() {
        document.getElementById('job-form').reset();
        this.currentEditId = null;
    }

    getJob(id) {
        return this.jobs.find(j => j.id === id);
    }

    getAllJobs() {
        return this.jobs;
    }
}

// Initialize
const jobManager = new JobManager();
