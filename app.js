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
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'C', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala',
            'Perl', 'Haskell', 'Clojure', 'Erlang', 'Elixir', 'F#', 'OCaml', 'Lua', 'R', 'MATLAB', 'Julia', 'Dart', 'Groovy',
            'Assembly', 'COBOL', 'Fortran', 'Pascal', 'Visual Basic', 'VB\\.NET', 'Objective-C', 'Shell', 'Bash', 'PowerShell',
            // Frontend
            'React', 'Vue', 'Vue\\.js', 'Angular', 'Svelte', 'Next\\.js', 'Nuxt', 'Nuxt\\.js', 'Gatsby', 'Remix',
            'HTML', 'HTML5', 'CSS', 'CSS3', 'SCSS', 'Sass', 'Less', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'Material UI', 'MUI',
            'Chakra UI', 'Styled Components', 'Emotion', 'Webpack', 'Vite', 'Rollup', 'Parcel', 'esbuild', 'Babel',
            'jQuery', 'Backbone', 'Ember', 'Alpine\\.js', 'Lit', 'Preact', 'Solid', 'SolidJS', 'Qwik',
            // Backend
            'Node\\.js', 'Node', 'Express', 'Express\\.js', 'Fastify', 'Koa', 'Hapi', 'NestJS', 'Nest\\.js',
            'Django', 'Flask', 'FastAPI', 'Tornado', 'Pyramid', 'Bottle', 'Sanic', 'aiohttp',
            'Spring', 'Spring Boot', 'Hibernate', 'Maven', 'Gradle',
            'Rails', 'Ruby on Rails', 'Sinatra', 'Hanami',
            'Laravel', 'Symfony', 'CodeIgniter', 'CakePHP', 'Yii', 'Zend',
            'ASP\\.NET', '\\.NET', '\\.NET Core', 'Entity Framework', 'Blazor',
            'Gin', 'Echo', 'Fiber', 'Buffalo', 'Chi',
            'Phoenix', 'Ecto',
            'Actix', 'Rocket', 'Axum', 'Tokio',
            // Databases
            'SQL', 'PostgreSQL', 'Postgres', 'MySQL', 'MariaDB', 'SQLite', 'SQL Server', 'MSSQL', 'Oracle', 'Oracle DB',
            'MongoDB', 'Mongoose', 'Redis', 'Memcached', 'Elasticsearch', 'Elastic', 'Solr',
            'DynamoDB', 'Cassandra', 'CouchDB', 'CouchBase', 'RethinkDB', 'Neo4j', 'ArangoDB', 'InfluxDB', 'TimescaleDB',
            'Supabase', 'Firebase', 'Firestore', 'PlanetScale', 'Neon', 'Turso',
            'Prisma', 'Sequelize', 'TypeORM', 'Drizzle', 'Knex', 'SQLAlchemy', 'ActiveRecord',
            // Cloud & Infrastructure
            'AWS', 'Amazon Web Services', 'S3', 'EC2', 'Lambda', 'ECS', 'EKS', 'RDS', 'SQS', 'SNS', 'CloudFormation', 'CDK',
            'Azure', 'Microsoft Azure', 'Azure Functions', 'Azure DevOps',
            'GCP', 'Google Cloud', 'Cloud Functions', 'BigQuery', 'Cloud Run', 'GKE',
            'Heroku', 'Vercel', 'Netlify', 'Railway', 'Render', 'Fly\\.io', 'DigitalOcean', 'Linode', 'Cloudflare',
            // DevOps & CI/CD
            'Docker', 'Kubernetes', 'K8s', 'Helm', 'Istio', 'Envoy',
            'Jenkins', 'CircleCI', 'Travis CI', 'GitHub Actions', 'GitLab CI', 'Azure Pipelines', 'ArgoCD', 'Spinnaker',
            'Terraform', 'Pulumi', 'Ansible', 'Chef', 'Puppet', 'Salt', 'CloudFormation',
            'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Splunk', 'ELK', 'Logstash', 'Kibana', 'Jaeger', 'OpenTelemetry',
            'Nginx', 'Apache', 'HAProxy', 'Traefik', 'Caddy',
            // Version Control & Collaboration
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
            'Jira', 'Confluence', 'Asana', 'Trello', 'Linear', 'Notion', 'Monday',
            // Testing
            'Jest', 'Mocha', 'Chai', 'Jasmine', 'Karma', 'Cypress', 'Playwright', 'Puppeteer', 'Selenium', 'WebDriver',
            'pytest', 'unittest', 'nose', 'Robot Framework',
            'JUnit', 'TestNG', 'Mockito', 'Spock',
            'RSpec', 'Capybara', 'Minitest',
            'PHPUnit', 'Pest',
            'Vitest', 'Testing Library', 'React Testing Library', 'Enzyme',
            'Postman', 'Insomnia', 'Newman', 'k6', 'Artillery', 'Locust', 'JMeter', 'Gatling',
            // APIs & Protocols
            'REST', 'RESTful', 'GraphQL', 'gRPC', 'WebSockets', 'Socket\\.io', 'SOAP', 'JSON', 'XML', 'Protobuf',
            'OpenAPI', 'Swagger', 'API Gateway', 'Apollo', 'Relay', 'tRPC', 'Hasura',
            'OAuth', 'OAuth2', 'JWT', 'SAML', 'SSO', 'OpenID', 'Auth0', 'Okta', 'Keycloak',
            // Message Queues & Streaming
            'Kafka', 'RabbitMQ', 'ActiveMQ', 'ZeroMQ', 'NATS', 'Pulsar',
            'Celery', 'Sidekiq', 'BullMQ', 'Bull',
            // Mobile
            'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova', 'Capacitor', 'Expo',
            'iOS', 'Android', 'SwiftUI', 'UIKit', 'Jetpack Compose',
            // Data Science & ML
            'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'sklearn', 'Pandas', 'NumPy', 'SciPy',
            'Spark', 'Hadoop', 'Hive', 'Airflow', 'dbt', 'Snowflake', 'Databricks', 'Redshift',
            'Jupyter', 'Anaconda', 'Conda',
            'OpenAI', 'LangChain', 'Hugging Face', 'NLTK', 'spaCy',
            // Design & UI
            'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InVision', 'Zeplin', 'Framer',
            // Methodologies & Practices
            'Agile', 'Scrum', 'Kanban', 'Lean', 'XP', 'SAFe',
            'TDD', 'BDD', 'DDD', 'SOLID', 'OOP', 'FP', 'Clean Code', 'Design Patterns',
            'CI/CD', 'DevOps', 'DevSecOps', 'SRE', 'MLOps', 'GitOps', 'Infrastructure as Code', 'IaC',
            // Operating Systems
            'Linux', 'Unix', 'Ubuntu', 'CentOS', 'RHEL', 'Debian', 'Alpine', 'macOS', 'Windows', 'Windows Server',
            // Architecture
            'Microservices', 'Monolith', 'Serverless', 'Event-Driven', 'CQRS', 'Event Sourcing',
            'SOA', 'Service Mesh', 'API-first', 'Headless', 'JAMstack',
            // Security
            'OWASP', 'Penetration Testing', 'Security Audit', 'Vulnerability Assessment',
            'Encryption', 'SSL', 'TLS', 'HTTPS', 'SSH', 'VPN', 'Firewall',
            'WAF', 'IAM', 'RBAC', 'Zero Trust',
            // CMS & E-commerce
            'WordPress', 'Drupal', 'Contentful', 'Sanity', 'Strapi', 'Ghost', 'Webflow',
            'Shopify', 'Magento', 'WooCommerce', 'BigCommerce', 'Salesforce Commerce',
            // Gaming
            'Unity', 'Unreal Engine', 'Godot', 'Phaser', 'Three\\.js', 'WebGL', 'OpenGL', 'DirectX', 'Vulkan',
            // Blockchain
            'Solidity', 'Ethereum', 'Web3', 'Smart Contracts', 'Hardhat', 'Truffle', 'Foundry'
        ];

        // Normalized version of known skills for matching (lowercase, no escapes)
        const normalizedKnownSkills = new Set(
            knownSkills.map(s => s.replace(/\\\./g, '.').replace(/\\+/g, '+').toLowerCase())
        );

        // Ambiguous terms that could be common words (need stricter matching)
        const ambiguousTerms = {
            'Go': ['go to', 'go for', 'go with', 'go from', 'go into', 'go back', 'go through', 'go over', 'go ahead'],
            'Rust': ['rust proof', 'rust prevention', 'rust removal'],
            'Swift': ['swift action', 'swift response', 'swift transition'],
            'R': [' r ', ' r,', ' r.', ' r;']
        };

        // Helper function to check if a match is valid (not a false positive)
        const isValidMatch = (matchText, fullText, matchIndex) => {
            const lowerMatch = matchText.toLowerCase();

            // Check if this is an ambiguous term
            const ambiguousKey = Object.keys(ambiguousTerms).find(
                key => key.toLowerCase() === lowerMatch
            );

            if (ambiguousKey) {
                // For ambiguous terms, require exact case match OR technical context
                const isExactCase = matchText === ambiguousKey;

                // Extract context around the match (20 chars before and after)
                const contextStart = Math.max(0, matchIndex - 20);
                const contextEnd = Math.min(fullText.length, matchIndex + matchText.length + 20);
                const context = fullText.substring(contextStart, contextEnd).toLowerCase();

                // Check if it's in a negative context (e.g., "go to market")
                const hasNegativeContext = ambiguousTerms[ambiguousKey].some(
                    phrase => context.includes(phrase.toLowerCase())
                );

                // Check if it's in a technical context
                const technicalContexts = [
                    'programming', 'language', 'developer', 'development', 'code', 'coding',
                    'golang', 'rustlang', 'experience with', 'knowledge of', 'proficiency in',
                    'skilled in', 'expertise in', 'framework', 'library'
                ];
                const hasTechnicalContext = technicalContexts.some(
                    phrase => context.includes(phrase.toLowerCase())
                );

                // Valid if: exact case match AND no negative context, OR has technical context
                return (isExactCase && !hasNegativeContext) || hasTechnicalContext;
            }

            return true; // Non-ambiguous terms are always valid
        };

        // Helper function to check if an item is a known skill (exact or close match)
        const isKnownSkill = (item) => {
            const normalized = item.toLowerCase().trim();
            // Direct match
            if (normalizedKnownSkills.has(normalized)) {
                return true;
            }
            // Check for partial matches (e.g., "React.js" matches "React")
            for (const skill of normalizedKnownSkills) {
                if (normalized === skill ||
                    normalized.replace(/\.js$/i, '') === skill ||
                    normalized.replace(/js$/i, '') === skill) {
                    return true;
                }
            }
            return false;
        };

        // Helper to extract all known skills from any text
        const extractKnownSkillsFromText = (text) => {
            const pattern = new RegExp(`\\b(${knownSkills.join('|')})\\b`, 'gi');
            const found = [];
            let match;
            while ((match = pattern.exec(text)) !== null) {
                if (isValidMatch(match[1], text, match.index)) {
                    found.push(match[1]);
                }
            }
            return found;
        };

        items.forEach(item => {
            // First, always try to extract known skills from the item
            const foundSkills = extractKnownSkillsFromText(item);
            foundSkills.forEach(skill => extractedSkills.push(skill));

            // If item is very short (1-3 words) and matches a known skill exactly, add it
            const wordCount = item.split(/\s+/).length;
            if (wordCount <= 3 && isKnownSkill(item)) {
                extractedSkills.push(item);
            }

            // For longer items, also try to extract from "experience with X" patterns
            // but ONLY if the extracted part is a known skill
            if (wordCount > 3) {
                const skillPatterns = [
                    /(?:experience (?:with|in|using)|knowledge of|proficiency in|familiar with|expertise in|skilled in|working with)\s+([^,\.]+)/gi
                ];

                skillPatterns.forEach(pattern => {
                    let match;
                    const regex = new RegExp(pattern.source, pattern.flags);
                    while ((match = regex.exec(item)) !== null) {
                        if (match[1]) {
                            // Clean up the extracted skill
                            const skill = match[1].trim().replace(/\s+and\s+.*/i, '');
                            // Only add if it's a known skill or contains known skills
                            if (isKnownSkill(skill)) {
                                extractedSkills.push(skill);
                            } else {
                                // Try to extract known skills from this phrase
                                const nestedSkills = extractKnownSkillsFromText(skill);
                                nestedSkills.forEach(s => extractedSkills.push(s));
                            }
                        }
                    }
                });
            }
        });

        // Clean up and deduplicate
        const cleaned = extractedSkills
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 50) // Skip very long items
            .map(s => {
                // Remove common prefixes and suffixes
                return s.replace(/^(strong|solid|good|excellent|proven)\s+/i, '')
                    .replace(/^(and|or)\s+/i, '') // Remove leading conjunctions
                    .replace(/\s+(skills?|experience|knowledge)$/i, '')
                    .trim();
            })
            .filter(s => {
                // Final validation: only keep items that are known skills
                return isKnownSkill(s);
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
