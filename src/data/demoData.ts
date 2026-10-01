import { Analysis, Resume, User } from '../types';

export const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  targetRole: 'Senior Backend Engineer',
  preferredIndustry: 'Cloud & AI Infrastructure',
  createdAt: '2026-08-15T09:30:00Z',
  preferences: {
    emailNotifications: true,
    analysisNotifications: true,
    theme: 'light',
  },
};

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Senior Backend Engineer (Python / FastAPI / Cloud)',
    company: 'Nexus Scale Labs',
    text: `Job Title: Senior Backend Engineer
Location: Remote / San Francisco, CA
Experience: 4+ years

About the Role:
We are seeking an experienced Senior Backend Engineer to architect, build, and optimize high-throughput distributed microservices. You will work closely with frontend engineers, AI researchers, and infrastructure teams to deliver resilient, sub-second API pipelines.

Key Responsibilities:
- Design, implement, and maintain high-performance asynchronous REST and GraphQL APIs using Python, FastAPI, and PostgreSQL.
- Architect scalable background processing pipelines using Redis queues, Celery, and Docker containerized deployments.
- Build resilient CI/CD pipelines (GitHub Actions) and deploy microservices on AWS (ECS, RDS, S3).
- Implement enterprise-grade security, OAuth2/JWT authentication, rate limiting, and database query optimization.
- Mentor junior engineers and conduct rigorous architectural code reviews.

Requirements:
- 4+ years of backend software engineering experience with Python and frameworks like FastAPI or Django.
- Deep expertise in relational database design, indexing, and query tuning in PostgreSQL.
- Solid understanding of Docker, container orchestration with Kubernetes, and modern cloud platforms (AWS/GCP).
- Hands-on experience with asynchronous I/O, event-driven architectures, and caching systems (Redis).
- Proven track record of shipping production features with automated test coverage and CI/CD.`,
  },
  {
    title: 'Staff Full-Stack Engineer (React / TypeScript / Node)',
    company: 'Veloce Data Systems',
    text: `Job Title: Staff Full-Stack Engineer
Location: New York, NY (Hybrid)

Role Summary:
Looking for a Staff Full-Stack Engineer to lead frontend architecture and real-time backend microservices. 

Core Requirements:
- Expert-level TypeScript, modern React 19, Next.js or Vite, and Tailwind CSS.
- Node.js or Python backend microservices, PostgreSQL, and Redis caching.
- State management, WebSockets for collaborative live streaming data, and canvas/WebGL visualization.
- Strong grounding in system design, CI/CD, Docker, and AWS deployment.
- High aesthetic standard and appreciation for clean typography, micro-interactions, and accessibility.`,
  },
  {
    title: 'AI / ML Platform Engineer',
    company: 'Synthetix AI',
    text: `Job Title: AI / ML Platform Engineer
Requirements:
- Strong programming in Python, PyTorch, and Hugging Face pipelines.
- Experience with LLM orchestration (LangChain, LlamaIndex), Vector DBs (Pinecone, pgvector).
- FastAPI backend serving with low latency inference endpoints.
- Kubernetes, Docker, and AWS SageMaker/EKS experience.
- Continuous evaluation pipelines, token usage tracking, and caching.`,
  },
];

export const DEMO_RESUME: Resume = {
  id: 'resume-demo-1',
  userId: 'demo-user-1',
  fileName: 'Alex_Morgan_Senior_Software_Engineer.pdf',
  fileSize: 142800,
  fileType: 'application/pdf',
  uploadedAt: '2026-09-28T14:20:00Z',
  lastScore: 87,
  parsedText: `Alex Morgan
San Francisco, CA | alex.morgan@example.com | github.com/alexmorgan | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Senior Backend Engineer with 5+ years of experience engineering high-throughput microservices, REST APIs, and distributed database systems. Adept in Python, FastAPI, PostgreSQL, Docker, and asynchronous architectures. Passionate about system latency reduction and automated deployment pipelines.

TECHNICAL SKILLS
Languages: Python, TypeScript, SQL, Bash
Frameworks & Libraries: FastAPI, Flask, SQLAlchemy, Pydantic, Express.js
Databases & Storage: PostgreSQL, Redis, SQLite, AWS S3
DevOps & Cloud: Docker, Git, GitHub Actions, AWS (EC2, RDS), Linux
Core Concepts: REST APIs, Asynchronous Programming, JWT Auth, Microservices, Unit Testing

PROFESSIONAL EXPERIENCE
Senior Backend Developer | CloudScale Inc. | 2024 – Present
- Architected and deployed 6 core microservices using Python and FastAPI, handling 14,000+ requests per minute with an average p99 latency under 45ms.
- Migrated legacy monolithic database queries to optimized PostgreSQL schemas with strategic b-tree and partial indexing, reducing slow query occurrences by 64%.
- Integrated JWT authentication and role-based access control (RBAC) across public endpoints, safeguarding sensitive enterprise financial records.
- Spearheaded adoption of Docker containerization across development workflows, eliminating local environment discrepancies and cutting onboarding time by 50%.

Software Engineer | Apex Tech Solutions | 2021 – 2024
- Developed REST API endpoints using Python and Flask for customer analytics dashboards serving 120,000 active monthly users.
- Implemented asynchronous background jobs and caching layers using Redis, decreasing peak server load during end-of-quarter reporting by 38%.
- Built automated test suites using pytest with 88% code coverage, catching regressions prior to production releases.
- Collaborated closely with React frontend teams to define typed API contracts and OpenAPI specifications.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2017 – 2021

PROJECTS
- Real-Time Metric Aggregator: Open-source telemetry pipeline built with Python, FastAPI, and Redis stream processing, starring 420+ GitHub repositories.
- Distributed Job Scheduler: Lightweight worker system handling fault-tolerant async execution with exponential backoff.`,
  sections: {
    contact: 'San Francisco, CA | alex.morgan@example.com',
    summary: 'Senior Backend Engineer with 5+ years of experience engineering high-throughput microservices...',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'SQL', 'REST APIs', 'Git', 'Linux'],
    experience: [
      'Senior Backend Developer | CloudScale Inc. (2024-Present)',
      'Software Engineer | Apex Tech Solutions (2021-2024)',
    ],
    education: ['B.S. in Computer Science, UC Berkeley (2021)'],
  },
};

export const DEMO_ANALYSIS: Analysis = {
  id: 'analysis-demo-1',
  userId: 'demo-user-1',
  resumeId: 'resume-demo-1',
  resumeFileName: 'Alex_Morgan_Senior_Software_Engineer.pdf',
  jobTitle: 'Senior Backend Engineer (Python / FastAPI / Cloud)',
  jobDescription: SAMPLE_JOB_DESCRIPTIONS[0].text,
  createdAt: '2026-09-28T14:25:00Z',
  atsScore: 87,
  jobMatchScore: 91,
  keywordScore: 84,
  skillScore: 86,
  isDemo: true,
  scoreBreakdown: {
    atsCompatibility: {
      name: 'ATS Compatibility',
      score: 87,
      explanation: 'Clean single-column structure, standard section headings, and searchable text without complex graphic tables.',
      status: 'excellent',
    },
    contentQuality: {
      name: 'Content Quality',
      score: 82,
      explanation: 'Solid engineering tone with strong action verbs. Several bullet points could feature more quantifiable business outcomes.',
      status: 'good',
    },
    keywordOptimization: {
      name: 'Keyword Optimization',
      score: 91,
      explanation: 'Exceptional density of core stack terms (FastAPI, Python, PostgreSQL, Docker) matching the employer requirements.',
      status: 'excellent',
    },
    formatting: {
      name: 'Formatting & Layout',
      score: 90,
      explanation: 'Consistent date formats, clear typography hierarchy, and standard margins conforming to ATS parser rules.',
      status: 'excellent',
    },
    experienceRelevance: {
      name: 'Experience Relevance',
      score: 85,
      explanation: 'Directly applicable backend engineering tenure at scale with clear progression in technical ownership.',
      status: 'good',
    },
    skillsMatch: {
      name: 'Skills Match',
      score: 88,
      explanation: 'Covers 18 out of 21 explicit tech and architecture requirements extracted from the target role.',
      status: 'excellent',
    },
  },
  strengths: [
    'Strong technical skill section directly aligning with modern Python & FastAPI backend stacks.',
    'Clear measurable performance metrics (e.g. "14,000+ requests per minute", "p99 latency under 45ms").',
    'High density of high-intent keywords naturally embedded in experience bullet points.',
    'Standardized single-column layout ensuring seamless parsing by Workday, Greenhouse, and Lever.',
  ],
  areasToImprove: [
    'Expand on Kubernetes container orchestration experience, which is explicitly highlighted in the job description.',
    'Add specific CI/CD pipeline accomplishments (e.g. GitHub Actions deployment frequency or test automation runtimes).',
    'Include mentoring or technical leadership examples to solidify Senior/Lead positioning.',
    'Elaborate on data modeling trade-offs and query tuning methods in PostgreSQL.',
  ],
  matchedSkills: [
    'Python',
    'FastAPI',
    'PostgreSQL',
    'REST APIs',
    'Docker',
    'AWS (EC2, RDS, S3)',
    'Redis',
    'Asynchronous I/O',
    'JWT Authentication',
    'SQLAlchemy',
    'Git',
    'Linux',
    'Microservices',
    'Unit Testing (pytest)',
    'OpenAPI / Swagger',
    'Query Optimization',
    'System Design',
    'Distributed Systems',
  ],
  missingSkills: [
    'Kubernetes',
    'Celery',
    'GraphQL',
  ],
  recommendedSkills: [
    'Kubernetes (EKS)',
    'Celery / Task Queues',
    'CI/CD Pipelines (GitHub Actions)',
    'GraphQL Schema Design',
    'Prometheus / Grafana Telemetry',
  ],
  keywords: {
    matched: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Redis',
      'REST APIs',
      'Microservices',
      'Asynchronous',
      'Authentication',
      'JWT',
      'Indexing',
    ],
    missing: [
      'Kubernetes',
      'Celery',
      'GraphQL',
      'Container Orchestration',
    ],
    overused: [
      'Engineered',
      'Developed',
    ],
  },
  recommendations: [
    {
      id: 'rec-1',
      category: 'Keywords & ATS',
      problem: 'Missing critical container orchestration keyword (Kubernetes) required by the target job description.',
      whyItMatters: 'ATS parsers look for exact keyword parity for infrastructure requirements; missing Kubernetes lowers automatic ranking.',
      currentBullet: 'Docker containerization across development workflows...',
      suggestedImprovement: 'Containerized microservices with Docker and deployed reproducible staging environments using Kubernetes (Minikube / Helm), accelerating test velocity by 40%.',
      impactScore: '+6% ATS Score',
    },
    {
      id: 'rec-2',
      category: 'Impact & Metrics',
      problem: 'Bullet point describes building REST API endpoints without highlighting performance or efficiency gains.',
      whyItMatters: 'Senior-level engineering roles evaluate candidates on measurable system improvements rather than task completion.',
      currentBullet: 'Developed REST API endpoints using Python and Flask for customer analytics dashboards serving 120,000 active monthly users.',
      suggestedImprovement: 'Architected high-throughput REST API endpoints in Python/FastAPI that reduced analytical query processing time by 42% for 120,000+ monthly active users.',
      impactScore: '+5% Content Score',
    },
    {
      id: 'rec-3',
      category: 'Experience Relevance',
      problem: 'Job posting emphasizes automated CI/CD pipelines, but the resume mentions testing without pipeline deployment specifics.',
      whyItMatters: 'Demonstrating end-to-end delivery guarantees you can independently ship production code on day one.',
      currentBullet: 'Built automated test suites using pytest with 88% code coverage, catching regressions prior to production releases.',
      suggestedImprovement: 'Implemented automated CI/CD workflows using GitHub Actions and pytest (88% test coverage), reducing deployment pipeline duration from 25 to 7 minutes.',
      impactScore: '+4% Match Score',
    },
    {
      id: 'rec-4',
      category: 'Impact & Metrics',
      problem: 'Database optimization is mentioned without specifying the technical mechanism used.',
      whyItMatters: 'Staff and hiring managers look for concrete database indexing patterns (partial indexes, EXPLAIN ANALYZE) to verify seniority.',
      currentBullet: 'Migrated legacy monolithic database queries to optimized PostgreSQL schemas with strategic b-tree and partial indexing...',
      suggestedImprovement: 'Optimized mission-critical PostgreSQL schemas via composite indexing and query plan analysis, slashing slow transactions (>500ms) by 64% under peak load.',
      impactScore: '+3% Quality Score',
    },
    {
      id: 'rec-5',
      category: 'Formatting & Structure',
      problem: 'Action verb repetition across consecutive positions ("Developed", "Built").',
      whyItMatters: 'Varying strong technical verbs conveys broader initiative, technical leadership, and ownership.',
      currentBullet: 'Developed REST API endpoints...',
      suggestedImprovement: 'Engineered and scaled distributed REST endpoints...',
      impactScore: '+2% ATS Score',
    },
    {
      id: 'rec-6',
      category: 'Keywords & ATS',
      problem: 'Target job specifies background workers (Celery/queues); current resume only mentions Redis caching.',
      whyItMatters: 'Queue processing shows you understand asynchronous decoupling in modern backend platforms.',
      currentBullet: 'Implemented asynchronous background jobs and caching layers using Redis...',
      suggestedImprovement: 'Engineered distributed background task queues using Redis and Celery, offloading 4.5M monthly asynchronous report calculations from the primary HTTP thread.',
      impactScore: '+5% Job Match',
    },
    {
      id: 'rec-7',
      category: 'Experience Relevance',
      problem: 'Missing mention of technical mentorship, a key responsibility in Senior Backend Engineer briefs.',
      whyItMatters: 'Employers hiring for $150k+ roles look for force multipliers who lift team capabilities through code reviews and mentoring.',
      currentBullet: 'Collaborated closely with React frontend teams to define typed API contracts...',
      suggestedImprovement: 'Mentored 4 junior and mid-level engineers in distributed systems design, asynchronous Python practices, and rigorous code reviews.',
      impactScore: '+4% Leadership Score',
    },
  ],
  executiveSummary: 'Alex’s resume is a remarkably strong candidate profile for the Senior Backend Engineer role with an overall 91% job match. The candidate possesses strong production pedigree in Python, FastAPI, PostgreSQL, and asynchronous backend architectures. Adding concrete mentions of Kubernetes orchestration and GitHub Actions CI/CD workflows, alongside framing bullet points around quantified performance metrics, will position Alex in the top 5% of applicant rankings.',
};
