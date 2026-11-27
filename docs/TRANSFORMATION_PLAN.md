# SysProgs Transformation Plan

Status: Foundation phase
Working branch: feat/learning-platform-foundation
Baseline reviewed: main at 2c073b7a74bdfef625fda577fcde9f2ad87be75a

## Product direction
SysProgs is an independent, practical technical-learning platform. Systems programming is the first learning domain; the longer-term scope can expand into software engineering and adjacent coding disciplines. The promise: help learners understand concepts, practise skills, build projects and demonstrate competence.

## Repository audit

### Existing strengths
- A 16-module systems-programming curriculum in five phases.
- Module content split across README, concepts, examples, labs and real-world notes.
- A Python generator that creates web/data/modules.json.
- A vanilla JavaScript PWA with sidebar, module reader, table of contents, search, theme toggle and local progress.
- SVG diagrams and an interactive-SVG helper.
- A local-first workflow using Python's static HTTP server.

### Findings and risks
1. Presentation is documentation-first. The app renders a module as a Markdown document; it does not yet provide distinct course overview, lesson sequence, media rail, lab workspace or assessment flow.
2. Content is not consistently structured. The generator concatenates README and concepts, truncates rendered lesson text at 18,000 characters and discovers only a limited set of code extensions. Videos, citations, captions, quizzes, labs and prerequisites are not first-class data.
3. Progress is device-local. Completion is stored in localStorage at module level; it cannot synchronise across devices or represent lesson-level mastery.
4. The learning loop is incomplete. Labs are referenced in Markdown, but there is no submission workflow, code execution service, automated assessment or feedback model.
5. Interface styles have drifted. Some styles are duplicated across CSS files; the token palette is paper/ink while parts of the shell and code presentation retain dark-theme assumptions. The manifest theme colour also differs from the light default.
6. Some copy and navigation are prototype-oriented. The home page includes local server instructions and an external OpenCode link. These belong in developer documentation, not a learner-facing dashboard.
7. Content accuracy needs editorial review. Hardware latency, instruction timing, ABI details and platform-specific build commands should be labelled as approximate or platform-dependent and checked against primary references.
8. No production backend is present in the reviewed files. Authentication, cloud profiles, enrolment, subscriptions, content administration, analytics and secure code execution remain future capabilities.

## Keep, improve, defer

| Keep | Improve now | Defer until validated |
|---|---|---|
| Existing 16-module sequence | Structured lesson schema | Multi-domain catalogue expansion |
| Markdown source content | Course and lesson presentation | Paid subscriptions |
| Python content generation | Media/resource rendering | Verified certificates |
| SVG diagrams and examples | Lesson-level progress model | Community features |
| Lightweight PWA approach | Responsive accessibility | Full remote code execution at scale |

## Target learner journey
1. Discover a learning path.
2. Review outcomes, prerequisites, effort and projects.
3. Start a lesson.
4. Learn through explanation, diagrams, code and curated media.
5. Practise with guided exercises and labs.
6. Check understanding with formative questions.
7. Complete a project or competency assessment.
8. Review progress and recommended next steps.

## UI/UX workstreams
- Learner dashboard: continue learning, paths, recent activity, recommendations and search.
- Course overview: purpose, audience, level, effort, outcomes, prerequisites, syllabus, projects and tools.
- Lesson workspace: left course outline, central lesson content, right contextual contents/resources; collapsible rails on mobile.
- Practice workspace: exercise brief, starter code, constraints, examples, editor/output where supported, hints, reset/run/submit and completion criteria.

## Content system
Move from one Markdown blob per module to a structured lesson model. Keep Markdown for authored prose, but represent media, code, references, quizzes and labs as typed blocks. See content/schema/lesson.schema.json and content/templates/lesson-template.md. Keep the current generator as the compatibility path until the new renderer exists. Do not delete or rename existing module files during migration.

## First four modules: editorial redesign
Preserve the existing curriculum order and technical scope.

### 00 — Orientation
1. What systems programming means
2. User space, libraries and kernel boundary
3. System calls versus library calls
4. Toolchain and development environment
5. Compile, run, inspect and trace a first program
6. Guided lab: compare printf and write
7. Knowledge check and readiness checkpoint

### 01 — Machine and hardware
1. Bits, bytes and number representation
2. CPU, registers and instruction cycle
3. Memory hierarchy and locality
4. Endianness and byte representation
5. Alignment, structure layout and padding
6. Guided labs: hexdump and structure inspection
7. Performance experiment: sequential versus strided access

### 02 — Assembly
1. ISA, registers and instruction encoding
2. x86-64 registers and basic instructions
3. Stack, calls and function frames
4. System calls and ABI
5. Calling conventions across SysV and Windows x64
6. ARM64 and RISC-V comparison
7. Guided labs: hello-world, function call and disassembly reading

### 03 — C
1. Compilation pipeline and translation units
2. Types, expressions, control flow and functions
3. Arrays, pointers and strings
4. Memory lifetime: stack, static storage and heap
5. Allocation, ownership discipline and failure handling
6. Undefined, implementation-defined and unspecified behaviour
7. Files, descriptors and portable system interfaces
8. Debugging, sanitizers and practical labs

## Implementation sequence

### Milestone 1 — Foundation
- [x] Audit repository and record constraints.
- [x] Define learner experience and UI layout.
- [x] Define structured lesson schema.
- [x] Define reusable authoring template.
- [ ] Add a first structured lesson and validate it.
- [ ] Build a first course/lesson UI prototype against fixture data.

### Milestone 2 — Content and rendering
- Build typed renderers for prose, image/diagram, video, code, callout, resource, quiz and lab blocks.
- Update the generator to emit structured course and lesson JSON.
- Preserve a Markdown fallback for legacy modules.
- Add content validation and broken-media/reference checks.

### Milestone 3 — First four modules
- Convert module 00 first as the end-to-end reference.
- Review technical accuracy and add primary references.
- Convert modules 01–03 using the same schema and components.
- Add objectives, knowledge checks and labs to each lesson.

### Milestone 4 — Interactive learning
- Add lesson progress and versioned local persistence.
- Add quiz scoring and explanatory feedback.
- Add client-side exercises only for safe, bounded tasks.
- Design a separate isolated execution service for native code and systems labs. Never execute learner code in the web app process.

### Milestone 5 — Production readiness
- Accessibility, keyboard navigation and responsive QA.
- Performance budgets, image optimisation and offline behaviour.
- Automated tests for content parsing and rendering.
- Backend and account synchronisation after the learning loop is validated.

## Acceptance criteria for the first release slice
- A learner can open a course, understand outcomes and navigate lessons.
- A lesson can render prose, code, image/diagram, YouTube embed, external reference, callout, quiz and lab blocks.
- Media includes captions/attribution and fallback links.
- Code blocks have language labels and copy controls.
- Lesson progress is distinct from course completion.
- The interface works on desktop and mobile and supports keyboard navigation.
- Existing Markdown modules still render during migration.

## Technical direction
Keep the existing static PWA running while the new experience is prototyped. Avoid a wholesale framework migration before the content model and UX are proven. If accounts, protected content or a backend become necessary, evaluate a React/Next.js application with a typed API and PostgreSQL. Use server-rendered content by default and add client interactivity only where needed.

For native code labs, use an isolated execution environment with strict CPU, memory, time, filesystem and network limits. This is a separate security-sensitive service, not a frontend feature.

## Decision log
- SysProgs remains a standalone project.
- Systems programming remains the first learning domain.
- Existing curriculum order and technical scope are preserved in the first redesign.
- Structured content and UI are developed in parallel, with the schema as their contract.
- No paid plans, community features or broad domain expansion in the first implementation slice.
