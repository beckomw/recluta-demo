// Test script for skills extraction with ambiguous terms
// This tests the fix for false positives like "go" in "go to market"

const Utils = {
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

        items.forEach(item => {
            // Skip if too long (likely a full sentence/requirement)
            if (item.length > 100) {
                // Try to extract skills from the sentence with validation
                const pattern = new RegExp(`\\b(${knownSkills.join('|')})\\b`, 'gi');
                let match;
                while ((match = pattern.exec(item)) !== null) {
                    if (isValidMatch(match[1], item, match.index)) {
                        extractedSkills.push(match[1]);
                    }
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
                    /(?:experience (?:with|in|using)|knowledge of|proficiency in|familiar with|expertise in|skilled in|working with)\s+([^,\.]+)/gi
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

                // Try to extract known technologies with validation
                const techPattern = new RegExp(`\\b(${knownSkills.join('|')})\\b`, 'gi');
                let techMatch;
                while ((techMatch = techPattern.exec(item)) !== null) {
                    if (isValidMatch(techMatch[1], item, techMatch.index)) {
                        extractedSkills.push(techMatch[1]);
                    }
                }
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
        console.log(`  Input: "${testCase.input}"`);
        console.log(`  Extracted: [${skills.join(', ')}]`);
        passed++;
    } else {
        console.log(`✗ Test ${index + 1}: ${testCase.name}`);
        console.log(`  Input: "${testCase.input}"`);
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
