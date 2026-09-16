# Engineering Guidelines & Agent Skills

This workspace is configured with production-grade engineering workflows and skills located in `.agents/skills/`.

## Skill-Driven Execution Model

When addressing tasks, follow the appropriate engineering lifecycle and activate the corresponding skill:

| Phase / Intent | Skill | Location |
|---|---|---|
| **Clarify Requirements** | `interview-me` | [.agents/skills/interview-me/SKILL.md](file:///.agents/skills/interview-me/SKILL.md) |
| **Concept / Variant Exploration** | `idea-refine` | [.agents/skills/idea-refine/SKILL.md](file:///.agents/skills/idea-refine/SKILL.md) |
| **Specification & PRD** | `spec-driven-development` | [.agents/skills/spec-driven-development/SKILL.md](file:///.agents/skills/spec-driven-development/SKILL.md) |
| **Quality Bar & Standards** | `constraint-driven-development` | [.agents/skills/constraint-driven-development/SKILL.md](file:///.agents/skills/constraint-driven-development/SKILL.md) |
| **Task Breakdown & Planning** | `planning-and-task-breakdown` | [.agents/skills/planning-and-task-breakdown/SKILL.md](file:///.agents/skills/planning-and-task-breakdown/SKILL.md) |
| **Implementation** | `incremental-implementation` | [.agents/skills/incremental-implementation/SKILL.md](file:///.agents/skills/incremental-implementation/SKILL.md) |
| **UI & UX Engineering** | `frontend-ui-engineering` | [.agents/skills/frontend-ui-engineering/SKILL.md](file:///.agents/skills/frontend-ui-engineering/SKILL.md) |
| **API & Service Design** | `api-and-interface-design` | [.agents/skills/api-and-interface-design/SKILL.md](file:///.agents/skills/api-and-interface-design/SKILL.md) |
| **Testing (TDD)** | `test-driven-development` | [.agents/skills/test-driven-development/SKILL.md](file:///.agents/skills/test-driven-development/SKILL.md) |
| **Browser DevTools Testing** | `browser-testing-with-devtools` | [.agents/skills/browser-testing-with-devtools/SKILL.md](file:///.agents/skills/browser-testing-with-devtools/SKILL.md) |
| **Debugging & Errors** | `debugging-and-error-recovery` | [.agents/skills/debugging-and-error-recovery/SKILL.md](file:///.agents/skills/debugging-and-error-recovery/SKILL.md) |
| **Code Review & Quality** | `code-review-and-quality` | [.agents/skills/code-review-and-quality/SKILL.md](file:///.agents/skills/code-review-and-quality/SKILL.md) |
| **Code Simplification** | `code-simplification` | [.agents/skills/code-simplification/SKILL.md](file:///.agents/skills/code-simplification/SKILL.md) |
| **Performance Optimization** | `performance-optimization` | [.agents/skills/performance-optimization/SKILL.md](file:///.agents/skills/performance-optimization/SKILL.md) |
| **Security & Hardening** | `security-and-hardening` | [.agents/skills/security-and-hardening/SKILL.md](file:///.agents/skills/security-and-hardening/SKILL.md) |
| **Observability & Logging** | `observability-and-instrumentation` | [.agents/skills/observability-and-instrumentation/SKILL.md](file:///.agents/skills/observability-and-instrumentation/SKILL.md) |
| **Documentation & ADRs** | `documentation-and-adrs` | [.agents/skills/documentation-and-adrs/SKILL.md](file:///.agents/skills/documentation-and-adrs/SKILL.md) |
| **Git Workflow** | `git-workflow-and-versioning` | [.agents/skills/git-workflow-and-versioning/SKILL.md](file:///.agents/skills/git-workflow-and-versioning/SKILL.md) |
| **CI/CD & Automation** | `ci-cd-and-automation` | [.agents/skills/ci-cd-and-automation/SKILL.md](file:///.agents/skills/ci-cd-and-automation/SKILL.md) |
| **Release & Ship** | `shipping-and-launch` | [.agents/skills/shipping-and-launch/SKILL.md](file:///.agents/skills/shipping-and-launch/SKILL.md) |
| **Skill Meta-Orchestration** | `using-agent-skills` | [.agents/skills/using-agent-skills/SKILL.md](file:///.agents/skills/using-agent-skills/SKILL.md) |

## Core Principles

1. **Spec & Plan First**: Never jump straight to heavy code changes when requirements or scope are non-trivial. Define specifications and atomic tasks.
2. **Incremental Slices**: Make focused, testable changes one step at a time.
3. **Verification as Proof**: Verify fixes and features using unit tests, API tests, or browser devtools verification.
4. **Code Review & Simplification**: Review across correctness, security, performance, and simplicity before considering tasks done.
