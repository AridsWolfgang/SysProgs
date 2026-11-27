# SysProgs UI/UX System

## Design intent
Build a focused technical-learning workspace: calm enough for deep reading, clear enough for beginners, and capable of presenting code, diagrams, video and exercises without feeling like a generic LMS.

## Information architecture
- Home: continue learning, paths, recent activity and recommendations.
- Explore: domains, learning paths and course catalogue.
- My learning: enrolled courses, saved lessons and progress.
- Course: overview, outcomes, syllabus, projects and requirements.
- Lesson: teaching content, media, code, references and checks.
- Practice: exercises, labs, coding tasks and feedback.
- Reference library: glossary, documentation, curated videos and articles.
- Profile: preferences and learning history (later, account-backed).

## Application shell
### Desktop
- Persistent left rail: brand, primary navigation, search and course outline inside a course.
- Top bar: breadcrumb, global search, theme and profile actions.
- Main canvas: readable maximum width; do not stretch long-form text across ultrawide screens.
- Optional contextual rail: table of contents, key terms and lesson resources.
- Lesson workspace: 220–260px outline, flexible content column and 240–280px context rail. Collapse the right rail at medium widths.

### Mobile
- One-column content.
- Course outline and resources open as accessible drawers.
- Persistent bottom navigation only for top-level destinations.
- Code blocks and tables scroll horizontally without causing page overflow.
- Video uses responsive 16:9 framing.

## Visual language
Use a dark-first neutral interface with an equally considered light theme. Retain the warmth of the current paper/ink direction in light mode while making dark mode consistent.

| Token | Dark | Light |
|---|---|---|
| Background | #0B1220 | #F7F8FA |
| Surface | #111C2E | #FFFFFF |
| Raised surface | #17243A | #F0F3F7 |
| Primary text | #F3F6FC | #172033 |
| Secondary text | #A7B4C8 | #596579 |
| Border | #26364D | #E0E6EE |
| Primary accent | #4F8CFF | #245FE5 |
| Secondary accent | #22C7B8 | #087F79 |
| Success | #35B779 | #16794B |
| Warning | #F3B64B | #946000 |
| Danger | #F07178 | #B42332 |

These are initial tokens to test for contrast, not immutable brand colours.

## Typography
- UI: Inter or a similarly legible sans-serif.
- Technical content: system sans-serif with comfortable line length.
- Code: JetBrains Mono or equivalent.
- Body copy: 16–18px, line-height 1.65–1.8.
- Long-form content width: approximately 68–76 characters.
- Clear hierarchy: page title, section heading, subsection, body and caption.

## Core components
1. CourseCard: domain, title, level, effort, progress and next action.
2. LearningPathHeader: purpose, outcomes, prerequisites and effort.
3. LessonOutline: sections, lesson state and current location.
4. LessonBlock: typed renderer for prose, callout, image, video, code, resource, quiz and lab.
5. CodeExample: language, filename, copy, optional output and explanation.
6. MediaFigure: responsive image/diagram, caption, alt text and attribution.
7. VideoEmbed: privacy-enhanced YouTube embed where available, title, creator and fallback link.
8. ResourceList: title, publisher, type, URL and access date.
9. KnowledgeCheck: single/multiple choice with explanation and retry.
10. LabBrief: objective, environment, steps, constraints, hints and completion criteria.
11. LessonProgress: not-started, in-progress and completed.
12. PreviousNextLesson: sequential navigation.

## Content rendering rules
- Do not render a whole course as one uninterrupted Markdown dump.
- Every section needs a meaningful heading and scannable structure.
- Images require descriptive alt text; diagrams also need a textual explanation.
- Video embeds require title, attribution and direct-link fallback. Never autoplay.
- Code blocks require language labels and copy actions.
- Tables need context and must remain usable on mobile.
- Callouts must be semantically typed: note, tip, warning or important.
- External resources should state why the learner should open them.
- Quizzes should explain why an answer is correct or incorrect.
- Labs should define expected output and completion criteria.

## Interaction and accessibility
- All controls are keyboard reachable with visible focus.
- Use semantic headings, landmarks, buttons and links.
- Do not rely on colour alone to communicate status.
- Respect reduced-motion preferences.
- Provide captions/transcripts when available for video.
- Maintain accessible contrast and touch target sizes.
- Persist progress after explicit learner action or clearly communicated automatic progress.
- Avoid interruptive popups and distracting gamification.

## Rendering states
Every route/component should define loading, empty, error and success states. Lesson content should remain readable if a third-party video or image host is unavailable.

## Implementation order
1. Tokens, typography and responsive shell.
2. Dashboard and course catalogue.
3. Course overview.
4. Lesson workspace and typed block renderers.
5. Quiz and lab components.
6. Learner progress and profile.
7. Accessibility and performance polish.
