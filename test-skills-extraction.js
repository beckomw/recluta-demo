// Test script for skills extraction with ambiguous terms
// This tests the fix for false positives like "go" in "go to market"
// and the fix for non-technical phrases being extracted as skills

const Utils = {
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
    }
};

// Test cases
const testCases = [
    {
        name: 'Should NOT extract "go" from "go to market"',
        input: 'We need to go to market quickly with this product',
        shouldNotInclude: ['go'],
        shouldInclude: []
    },
    {
        name: 'Should extract "Go" from "Go programming"',
        input: 'Experience with Go programming and backend development',
        shouldInclude: ['Go'],
        shouldNotInclude: []
    },
    {
        name: 'Should extract "Go" from "knowledge of Go"',
        input: 'Strong knowledge of Go and Python',
        shouldInclude: ['Go', 'Python'],
        shouldNotInclude: []
    },
    {
        name: 'Should NOT extract "go" from "go for it"',
        input: 'Let\'s go for it and implement this feature',
        shouldNotInclude: ['go'],
        shouldInclude: []
    },
    {
        name: 'Should extract capitalized "Go" when standalone',
        input: 'Go, Python, JavaScript, React',
        shouldInclude: ['Go', 'Python', 'JavaScript', 'React'],
        shouldNotInclude: []
    },
    {
        name: 'Should NOT extract "swift" from "swift response"',
        input: 'We need a swift response to this issue',
        shouldNotInclude: ['Swift'],
        shouldInclude: []
    },
    {
        name: 'Should extract "Swift" from "Swift development"',
        input: 'iOS Swift development experience required',
        shouldInclude: ['Swift'],
        shouldNotInclude: []
    },
    {
        name: 'Should extract other languages normally',
        input: 'Python, JavaScript, TypeScript, Java, and Ruby experience',
        shouldInclude: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Ruby'],
        shouldNotInclude: []
    },
    {
        name: 'Should NOT extract "rust" from "rust prevention"',
        input: 'Metal rust prevention is important',
        shouldNotInclude: ['Rust'],
        shouldInclude: []
    },
    {
        name: 'Should extract "Rust" from "Rust language"',
        input: 'Rust language and Go language experience',
        shouldInclude: ['Rust', 'Go'],
        shouldNotInclude: []
    },
    // NEW: Test for non-technical phrases that were being extracted incorrectly
    {
        name: 'Should NOT extract non-technical phrases as skills',
        input: `typescript
you build software that's clear
dependable
and designed to evolve with the team's needs
curiosity
adaptability
and a growth mindset
a team player who is willing and happy to help
interesting
diverse
funny
and loving people`,
        shouldInclude: ['TypeScript'],
        shouldNotInclude: ['dependable', 'curiosity', 'adaptability', 'interesting', 'diverse', 'funny']
    },
    {
        name: 'Should extract technical skills from job posting prose',
        input: `What you'll bring:
software engineering (experience in ecommerce a plus)
next.js
and graphql (familiarity with prisma and kafka is a plus)
restful apis and web application architecture`,
        shouldInclude: ['Next.js', 'GraphQL', 'Prisma', 'Kafka', 'RESTful'],
        shouldNotInclude: []
    },
    {
        name: 'Should NOT extract company culture phrases',
        input: `what you'll love about us:
we are a team of smart
interesting
diverse
funny
and loving people
we value fun`,
        shouldInclude: [],
        shouldNotInclude: ['smart', 'interesting', 'diverse', 'funny', 'fun']
    }
];

// Run tests
console.log('Running skills extraction tests...\n');
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    const skills = Utils.extractSkills(testCase.input);
    const skillsLower = skills.map(s => s.toLowerCase());

    let testPassed = true;
    let errors = [];

    // Check should include
    testCase.shouldInclude.forEach(skill => {
        if (!skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            testPassed = false;
            errors.push(`  ✗ Expected to find "${skill}" but it was not extracted`);
        }
    });

    // Check should not include
    testCase.shouldNotInclude.forEach(skill => {
        if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
            testPassed = false;
            errors.push(`  ✗ Should NOT have extracted "${skill}" but it was found`);
        }
    });

    if (testPassed) {
        console.log(`✓ Test ${index + 1}: ${testCase.name}`);
        console.log(`  Input: "${testCase.input.substring(0, 60)}${testCase.input.length > 60 ? '...' : ''}"`);
        console.log(`  Extracted: [${skills.join(', ')}]`);
        passed++;
    } else {
        console.log(`✗ Test ${index + 1}: ${testCase.name}`);
        console.log(`  Input: "${testCase.input.substring(0, 60)}${testCase.input.length > 60 ? '...' : ''}"`);
        console.log(`  Extracted: [${skills.join(', ')}]`);
        errors.forEach(err => console.log(err));
        failed++;
    }
    console.log('');
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
