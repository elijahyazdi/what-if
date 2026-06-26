# Prototype Feature Integration — Action Plan

**Project:** What Could You Do? (What If?)
**Plan author:** Claude (Opus 4.7)
**Date:** 2026-04-29
**Owner:** Scott Arakawa
**Status:** Open questions resolved 2026-04-29 — see §7. Awaiting green light on multi-context approach before Phase 0 begins.

---

## 0. Codebase Reality Check

Before any features ship, three things about the current codebase need to be acknowledged because they shape *every* deliverable below:

| Reality | Implication |
|---|---|
| Entire app is one 2,082-line file ([WireframeApp.tsx](WireframeApp.tsx)) | Adding 10 features in-line will make it unworkable. **A modest refactor is a prerequisite, not an optional cleanup.** |
| Prompts are hardcoded, duplicated between Home ([:500](WireframeApp.tsx#L500)) and Prompt screen ([:853](WireframeApp.tsx#L853)), 12 total | Deliverable #1 (DB schema) is **load-bearing for every other deliverable**. Until prompts come from a single source, every feature has to be retro-fitted. |
| The 290-prompt XLSX referenced in CLAUDE.md is not in the repo | Real content has to be located/imported before #1 can be built against real data. |
| Favorites already exist in state ([:844](WireframeApp.tsx#L844)) but don't persist; AsyncStorage is barely used | We need a small, consistent persistence layer before the reflection flow, personalization, and modules pile more state on top. |

Recommendation: spend ~1 day on a **foundational refactor** before deliverable #2 — split WireframeApp.tsx into `screens/`, `components/`, `data/`, `db/`, `hooks/`, `types/`. This pays back across every feature below. I've folded this into Phase 0 of the plan.

---

## 1. Architecture Decisions This Plan Assumes

These are my recommended defaults. **Each one is overrideable** — see "Open Questions" at the end. I'm calling them out here so the plan reads as a coherent whole.

| Decision | Recommendation | Why |
|---|---|---|
| Data layer (local) | **SQLite via `expo-sqlite`** (already supported by Expo 54) | Lets us ship offline-first, run real queries, and migrate to a hosted DB later without rewriting the UI. JSON files would block Mad Libs / personalization / reflection persistence. |
| Backend (when needed) | **Supabase** (Postgres + Auth + Row-Level Security + free tier) | Mirrors SQLite schema 1:1, has React Native SDK, and RLS makes the privacy-first/Professional tier story straightforward. Can be deferred until after deliverable #5. |
| Auth | **Defer to Phase 2** — anonymous device ID until then | Avoids gating the prototype on login flows. |
| State management | **React Context + custom hooks** for now (we already use Context for theme); revisit Zustand if we hit prop-drilling pain | The codebase has zero global state today; jumping to Redux/Zustand is premature. |
| Premium gating | **Local feature flags** for prototype, RevenueCat later | StoreKit/Play Billing is its own project — don't entangle. |
| TTS | Stay on browser SpeechSynthesis on web, switch to **`expo-speech`** for native (currently the audio button is a no-op on native, [:913](WireframeApp.tsx#L913)) | Already half-built — finishing it is cheap. |
| Refactor | Break WireframeApp.tsx into per-screen files **before** starting feature work | See Reality Check above. |

---

## 2. Phased Roadmap

The 10 deliverables are reordered slightly within the priority bands you gave to respect dependencies — but the priority order is preserved (e.g., #1 still ships first, #10 still ships last). I've grouped them into 4 phases.

### Phase 0 — Foundations (prerequisite, ~3–4 days)
- Refactor WireframeApp.tsx into modular files
- Stand up `expo-sqlite` with a migration runner
- Build a typed data-access layer (`db/repositories/*.ts`)
- Persist existing favorites + dark mode through it
- Locate or rebuild the 290-prompt XLSX and write the importer

### Phase 1 — Core Content Loop (deliverables 1, 2, 3, 6)
The heart of the product: a real prompt library with rich tips, world-building, and richer navigation. Ships a usable v1.

### Phase 2 — Conversation Modes (deliverables 4, 5, 9)
Adds the kids-ask-parents flip, the post-conversation reflection flow, and lightweight personalization. Turns the app from "browse prompts" into "have a conversation series."

### Phase 3 — Premium & Support (deliverables 7, 8, 10)
Premium-gated Mad Libs builder, the FAQ + safety-resource layer (including the "I'm concerned" flow), and the educational modules / course framework. These all depend on auth + tier gating, hence last.

---

## 3. Per-Deliverable Detail

### Deliverable #1 — Database schema: prompts + kickstarters/tips + tags/categories + world building

**What "done" looks like:**
- A SQLite database initialized on first launch with seed data from the 290-prompt library
- Typed TS models + repositories: `PromptRepo`, `TipRepo`, `TagRepo`, `WorldBuildingRepo`
- Home + Prompt screens read from the DB, not hardcoded arrays
- Importer script that converts the XLSX into seed JSON committed to the repo

**Proposed schema (SQLite — Postgres-compatible names):**

```sql
-- 1. Prompts (the core 290 + future user submissions)
CREATE TABLE prompts (
  id              TEXT PRIMARY KEY,                  -- e.g. "1", "34B", "144D"
  age_group       TEXT NOT NULL,                     -- '3-5' | '6-8' | '9-12' | '13+'
  category_id     TEXT NOT NULL REFERENCES categories(id),
  text            TEXT NOT NULL,                     -- the "What if..." scenario
  full_question   TEXT NOT NULL DEFAULT 'What are all the things you can think of that you could do?',
  tier            TEXT NOT NULL CHECK (tier IN ('free','premium','professional')),
  source          TEXT NOT NULL DEFAULT 'official',  -- 'official' | 'community' | 'user'
  liminal_space   TEXT,                              -- nullable; foreign key to liminal_spaces.id
  parent_askable  INTEGER NOT NULL DEFAULT 0,        -- bool: kids-ask-parents mode supported
  is_active       INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

-- 2. Categories + subcategories (the 7 categories + 228 subcategories from CLAUDE.md)
CREATE TABLE categories (
  id              TEXT PRIMARY KEY,                  -- 'ethics', 'emotions', etc.
  name            TEXT NOT NULL,
  description     TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  icon            TEXT                               -- Feather icon name
);

CREATE TABLE tags (                                  -- subcategories
  id              TEXT PRIMARY KEY,                  -- 'sharing', 'peer-pressure', ...
  category_id     TEXT REFERENCES categories(id),    -- nullable (cross-cutting tags allowed)
  label           TEXT NOT NULL
);

CREATE TABLE prompt_tags (                           -- many-to-many
  prompt_id       TEXT REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id          TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- 3. Kickstarters / discussion tips
-- Two flavors: GLOBAL tips (apply to all prompts) and PROMPT-SPECIFIC tips
CREATE TABLE tips (
  id              TEXT PRIMARY KEY,
  prompt_id       TEXT REFERENCES prompts(id),       -- nullable = global tip
  kind            TEXT NOT NULL,                     -- 'kickstarter' | 'discussion' | 'follow_up' | 'safety_note'
  body            TEXT NOT NULL,
  audience        TEXT NOT NULL DEFAULT 'adult',     -- 'adult' | 'child' | 'either'
  display_order   INTEGER NOT NULL DEFAULT 0
);

-- 4. World-building cards (deliverable #3)
-- Follow-up scenarios that extend the prompt: "What if it was raining?" "What if a friend was watching?"
CREATE TABLE world_building (
  id              TEXT PRIMARY KEY,
  prompt_id       TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  card_text       TEXT NOT NULL,                     -- the twist
  display_order   INTEGER NOT NULL DEFAULT 0,
  difficulty      INTEGER NOT NULL DEFAULT 1         -- 1 (gentle) → 3 (challenging)
);

-- 5. Liminal/situational spaces (deliverable #6)
CREATE TABLE liminal_spaces (
  id              TEXT PRIMARY KEY,                  -- 'car-ride', 'bedtime', 'mealtime', ...
  name            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0
);

-- 6. User-side tables (used progressively across later deliverables)
CREATE TABLE favorites (
  prompt_id       TEXT PRIMARY KEY REFERENCES prompts(id) ON DELETE CASCADE,
  favorited_at    TEXT NOT NULL
);

CREATE TABLE reflections (                           -- deliverable #5
  id              TEXT PRIMARY KEY,
  prompt_id       TEXT NOT NULL REFERENCES prompts(id),
  note            TEXT,                              -- text reflection
  audio_uri       TEXT,                              -- optional voice note
  rating          INTEGER,                           -- 1-5 "how did it go"
  created_at      TEXT NOT NULL
);

CREATE TABLE personalization (                       -- deliverable #9
  key             TEXT PRIMARY KEY,                  -- 'child_name', 'location', 'interests'
  value           TEXT NOT NULL
);

CREATE TABLE module_progress (                       -- deliverable #10
  module_id       TEXT NOT NULL,
  prompt_id       TEXT NOT NULL,
  completed_at    TEXT,
  PRIMARY KEY (module_id, prompt_id)
);
```

**Tasks:**
1. Locate / re-export `Ethical_Choices_App_Full_Prompt_Library.xlsx` (it's referenced in CLAUDE.md but not in the repo)
2. Build `scripts/import-prompts.ts` that converts XLSX → `assets/seed/prompts.json`
3. Add `expo-sqlite` dependency, create `db/index.ts` with migration runner
4. Write migration `0001_init.sql` matching the schema above
5. Write seeders that populate all tables on first launch (idempotent)
6. Build typed repositories (one file per table) returning Promises
7. Replace hardcoded `prompts` objects in [HomeScreen](WireframeApp.tsx#L500) and [PromptScreen](WireframeApp.tsx#L853) with `usePrompts(ageGroup)` hook
8. Migrate the existing in-state favorites at [:844](WireframeApp.tsx#L844) to the `favorites` table

**Estimate:** 4–5 days
**Risk:** Without the actual XLSX, content for tips/world-building has to be drafted from scratch — could double the timeline if writing 290 × N tips is part of scope. (See Open Question #2.)

---

### Deliverable #2 — Prompt display with expandable conversation tip section

**Current state:** A static "Discussion Tips" panel already renders below the prompt at [WireframeApp.tsx:931-951](WireframeApp.tsx#L931-L951). Same 4 tips for every prompt.

**Target state:**
- Tips section becomes **collapsible** (collapsed by default — keeps focus on the prompt)
- Pulls **per-prompt tips** from the `tips` table; falls back to global tips if none
- Tips are typed: kickstarters ("ways to start the conversation"), discussion prompts, follow-up questions, safety notes
- Smooth animation (use `react-native-reanimated`, already installed)

**Tasks:**
1. Build `<ExpandableTipsPanel />` component in `components/` — uses `LayoutAnimation` or Reanimated `LinearTransition`
2. Add `useTipsForPrompt(promptId)` hook that joins prompt-specific + global tips
3. Replace the static tips JSX with the new component
4. Group tips by `kind` with sub-headers (Kickstarters / Discussion / Follow-up / If you're concerned)
5. Persist last-expanded state per prompt (small UX win)

**Estimate:** 1.5 days
**Depends on:** #1 done

---

### Deliverable #3 — World building follow-up cards

**Concept:** After the child gives an answer, the adult can swipe through "what if" twists that deepen the scenario — *"What if it was your sister's toy?"*, *"What if no one would ever know?"*, *"What if you were really tired?"*

**UI options (recommend A):**
- **A. Horizontal swipeable carousel** beneath the prompt card. Uses `FlatList` with `horizontal pagingEnabled`. Native-feeling and progressive — adult reveals one twist at a time.
- B. Expandable accordion (less engaging; doesn't communicate "twist coming")

**Tasks:**
1. Add `<WorldBuildingCarousel promptId={...} />` component
2. Each card: short twist text, difficulty dot indicator (gentle → spicy), "next twist" affordance
3. Hook: `useWorldBuilding(promptId)` returns ordered cards
4. Empty state for prompts with no twists yet (most of the 290 won't initially)
5. Author 3–5 world-building cards for the **top 30** prompts as initial seed (can grow later)

**Estimate:** 2 days dev + ~1 day content authoring for seed
**Depends on:** #1 done

---

### Deliverable #4 — Kids-ask-parents toggle/mode

**Concept:** Flips the conversation direction. Same "What if..." scenario, but the child reads it to the adult and the adult brainstorms aloud. Powerful for modeling thinking.

**Design questions to nail down:**
- Is this a **per-session toggle** (on the prompt screen) or a **mode selector** (set once)? *Recommend per-session toggle in the prompt header — it's a conversation choice.*
- Does it filter prompts? *Recommend yes — only show `parent_askable = 1` prompts in this mode.*
- Does the prompt text change? *Some prompts will need a "kid-voiced" variant. Add `text_kid_voice` column or a `prompt_variants` table — see Open Question #3.*

**Tasks:**
1. Add toggle pill to PromptScreen header (next to the audio button at [:913](WireframeApp.tsx#L913))
2. Visual treatment: child icon vs. adult icon, swap colors on toggle
3. Filter prompt query by `parent_askable` when toggle is on
4. Render kid-voiced variant text when available; fall back to original
5. Update Discussion Tips to swap audience-appropriate kickstarters (we already have `tips.audience` column)
6. Tag the existing 290 prompts: which are parent-askable? (Most are — but ~10–15% won't make sense flipped; this needs a content pass.)

**Estimate:** 2 days dev + 0.5 day content tagging
**Depends on:** #1 done. Best if #2 is done first so tip-swap is plumbed.

---

### Deliverable #5 — Post-conversation reflection flow (skip vs. reflect)

**Concept:** After tapping "Next Prompt," intercept with: *"How did that go?"* with two paths — Skip (current behavior) or Reflect (text + optional voice note + 1-tap rating).

**Tasks:**
1. Replace the [Next Prompt button](WireframeApp.tsx#L955-L965) onPress with a modal: "Skip" / "Reflect"
2. Build `<ReflectionScreen />` — text input, optional voice recorder (`expo-av`), 5-emoji rating ("hard" → "great")
3. Save to `reflections` table
4. Add reflections to the Profile screen — show recent ones
5. Add "Resume from where you left off" linkage: jump back into prompt + reflection together

**Considerations:**
- **Privacy:** reflections may contain a child's personal information. Keep them strictly device-local in Phase 2; only sync to backend if user opts in.
- **Voice notes:** `expo-av` is not currently installed; check Expo 54 compatibility before committing. If it's a problem, ship text-only first.

**Estimate:** 2.5 days
**Depends on:** #1 done

---

### Deliverable #6 — Situational/liminal space categories in navigation

**Concept:** Today, navigation is **age group only**. Add a parallel axis: *"Where are you?"* — Car ride, Bedtime, Mealtime, Doctor's office, Long line, Walking the dog, Before/after school. These are the moments parents actually need a prompt.

**UI proposal:**
- New row on the Home screen above the age-group grid: **"Right now we're..."** horizontal chip selector
- Selecting a chip filters the prompt pool by `liminal_space`
- Optional: skip the age-group selector for these — the chip is enough

**Tasks:**
1. Seed `liminal_spaces` table with ~8 starter situations (with icons)
2. Tag the 290 prompts with appropriate `liminal_space` values (many-to-one is fine; some prompts won't have one and that's OK)
3. Add `<LiminalSpaceChips />` component to HomeScreen above [the age group grid](WireframeApp.tsx#L536)
4. Update PromptScreen to show the situational badge if a space is selected
5. Add `useLiminalSpaces()` and updated `usePromptsByFilter(...)` hooks

**Estimate:** 2 days dev + 1 day content tagging
**Depends on:** #1 done

---

### Deliverable #7 — Mad Libs question builder (premium)

**Concept:** Premium-gated. Pick a template (*"What if [PERSON] was [DOING_THING] and [SOMETHING_HAPPENED]?"*), fill in slots, get a custom prompt.

**Design choices:**
- Templates live in their own table — let's add it: `mad_libs_templates(id, age_group, slots_json, template_text, tier)`
- Slots have a type: `person | place | object | feeling | activity | tone` — drives whether we show a text input, a chip picker (from prepopulated suggestions), or both
- Save outputs as new prompts with `source = 'user'` so they show in the user's Submissions tab

**Tasks:**
1. Schema addition for templates + slot suggestions
2. Author 8–12 starter templates per age group (~40 total)
3. Build `<MadLibsBuilder />` screen — multi-step form
4. Premium gate: show paywall card if user is not Premium (use a feature flag in the prototype)
5. Save flow: writes to `prompts` with `source = 'user'`, `tier = 'free'`, optional `submitted_for_review = 1`
6. Surface saved Mad Libs in Profile or a new "My Prompts" tab

**Estimate:** 4 days dev + 1 day content authoring
**Depends on:** #1 done. Should ship after the basic loop is solid (#2–#6).

---

### Deliverable #8 — FAQ / resource library + "I'm concerned" button

**Two distinct things bundled here:**

**8a. FAQ / resource library** — currently the FAQ link in Settings ([:1158](WireframeApp.tsx#L1158)) is a no-op. Build it.
- Static MDX-style content (or a `faq` table if we want CMS-like editability — recommend table-based)
- Categories: Getting Started / Conversation Tips / Premium & Pro / Privacy / Troubleshooting
- Plus: a curated **resource library** — articles, books, videos for parents/educators

**8b. "I'm concerned" button** — this is the safety-critical piece. When an adult hears something worrying during a conversation (abuse disclosure, suicidal ideation, eating disorder cues), they need an immediate, calm, non-judgmental escalation path.

**Critical design principles:**
- **Never feels alarming.** Soft entry, not red panic.
- **Tier-aware content.** A parent gets different resources than a licensed therapist.
- **Region-aware.** US hotlines aren't useful in the UK. Detect locale + let user override.
- **No data ever leaves the device** unless the user explicitly chooses to share.

**Tasks:**
1. Add `faq_entries` table (question, answer_md, category, tier, display_order)
2. Add `resources` table (kind, title, description, url, region, topic_tags, tier)
3. Build `<FAQScreen />` and `<ResourceLibraryScreen />` reachable from Settings + from the prompt screen footer
4. Build `<ImConcernedFlow />` — multi-step gentle interview:
   - "What's coming up for you right now?" (signal selector: behavior change, disclosure, mood, safety, just-checking)
   - Show curated resources for that signal + region
   - Always include: emergency hotlines, "talk to a professional" pathway, "this is normal — here's why" reassurance content where appropriate
5. Add the button **discreetly** to PromptScreen — small icon, accessible label, never with alarmist styling
6. Author starter FAQ content (~30 entries) and resource list (~20 vetted resources)
7. Have a clinician review the "I'm concerned" content before launch (see Open Question #5)

**Estimate:** 3 days dev + 2 days content + clinician review buffer
**Depends on:** #1 done. Ideally has user accounts (Phase 3) for tier-aware content.

---

### Deliverable #9 — Personalization engine (name, location, interests)

**Concept:** Use the child's name, hometown, and interests to lightly personalize prompts. *"What if [Maya] saw a kid in [Boulder] being teased about [soccer]?"*

**Tasks:**
1. New onboarding step (or Profile screen section): collect optional name, location, 1–5 interests
2. Store in `personalization` table
3. Token system in prompt text: `{name}`, `{location}`, `{interest}` — render-time substitution
4. Tag a subset of prompts as "personalizable" — only those use tokens; unmodified prompts are fine
5. Add a graceful fallback when a token is set to nothing ("a friend" instead of "{name}")
6. Multi-child support: profile picker on Home screen — see Open Question #4

**Estimate:** 2.5 days dev + content pass to add tokens to ~50 prompts
**Depends on:** #1 done

---

### Deliverable #10 — Educational modules / course structure framework

**Concept:** Curated multi-prompt journeys with a theme. *"5-day Empathy Series for ages 6-8"* — one prompt per day with intro, reflection prompt, and a "what we learned" wrap-up.

**Schema additions:**

```sql
CREATE TABLE modules (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  age_group       TEXT,                              -- nullable = all ages
  category_id     TEXT REFERENCES categories(id),
  duration_days   INTEGER NOT NULL DEFAULT 5,
  tier            TEXT NOT NULL DEFAULT 'free',
  cover_color     TEXT,                              -- hex from the 5-color palette
  display_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE module_steps (
  module_id       TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  step_number     INTEGER NOT NULL,
  prompt_id       TEXT NOT NULL REFERENCES prompts(id),
  intro_text      TEXT,
  outro_text      TEXT,
  PRIMARY KEY (module_id, step_number)
);
```

**Tasks:**
1. Schema additions above
2. New tab or top-level Home section: **"Conversation Series"**
3. Build `<ModuleListScreen />` and `<ModuleDetailScreen />`
4. Use `module_progress` table (already in #1 schema) to track completion
5. Author 4 starter modules (one per age group) of 5 prompts each = 20 prompts curated
6. Optionally: completion certificate / shareable card — defer unless asked

**Estimate:** 3 days dev + 1 day curation
**Depends on:** #1, #5 (reflection ties into module wrap-ups)

---

## 4. Total Estimate & Critical Path

| Phase | Deliverables | Est. Working Days |
|---|---|---|
| 0. Foundations | refactor + DB layer + content import | 3–4 |
| 1. Core loop | #1, #2, #3, #6 | 9–11 |
| 2. Conversation modes | #4, #5, #9 | 7–8 |
| 3. Premium & support | #7, #8, #10 | 13–15 |
| **Total** | | **~32–38 working days** (≈7–8 weeks of focused build) |

Critical path is **#1 → everything**. Nothing else can ship cleanly without it. The single highest-leverage move is making sure we have the actual prompt library content imported on Day 1 of Phase 1.

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| The 290-prompt XLSX is missing from the repo | Locate it before starting #1, or budget 3+ extra days to author placeholder content |
| Single 2,082-line file makes feature work brittle | Phase 0 refactor is mandatory, not optional |
| "I'm concerned" content needs clinical review | Engage a licensed clinician early — don't ship #8b without it |
| Mad Libs + community submissions = moderation burden | Default new submissions to `pending_review`; build moderator screen if/when volume warrants |
| Personalization stores child name on device | Document privacy posture clearly in #9; never sync without explicit consent |
| Voice reflections increase storage + privacy surface | Ship text-only first; add audio behind a setting in a follow-up |

---

## 7. Resolved Decisions (2026-04-29)

These answers update the plan above. Where they conflict with earlier sections, **this section wins**.

| # | Question | Resolution |
|---|---|---|
| 1 | Where is the prompt XLSX? | Use **clearly-marked placeholder prompts** until the content team delivers real data. Every prompt row gets `is_placeholder = 1`; dev builds render a "[PLACEHOLDER]" badge. Real-content import is a single re-run of the seeder. |
| 2 | Tips & world-building content | Same as #1: **placeholder content** with `is_placeholder = 1` and visible badge. I'll author 3–5 per top-30 prompt as a starter. |
| 3 | Multi-child support | **Build "Child Contexts" from Day 1, lightweight, not premium-gated.** See §7.1 below for the full design. |
| 4 | Clinician advisor for "I'm concerned" | **Build the full capability now**, gate ship-readiness on advisor sign-off. Screen carries a visible "PRE-RELEASE: Pending clinical review" banner until cleared. Realistic-but-placeholder safety content; resource list and routing all functional for demo/investor use. |
| 5 | Refactor blessing | **Granted.** Phase 0 starts with: (a) a clean git commit, (b) a `pre-refactor` git tag, (c) a physical `WireframeApp.tsx.pre-refactor.bak` copy. |
| 6 | Backend timing | Unchanged: Supabase deferred to Phase 3. |
| 7 | Premium IAP | Unchanged: local feature flags for prototype; RevenueCat later. |
| 8 | Refactor scope | One-shot split per #5 above. |
| 9 | Liminal spaces list | Still open. Will use my starter list (car ride, bedtime, mealtime, waiting room, doctor, long line, walking, before/after school) unless overridden. |
| 10 | Modules tier gating | Still open. Default plan: 1 free starter module per age group, rest premium. |

### 7.1 Multi-Context Design (resolution detail for #3)

The right unit of personalization is a **Conversation Partner** (internal name: "Context"). The adult is the account holder; each context is one child, group, or session label they have conversations with.

**Schema change to deliverable #1:**

```sql
CREATE TABLE contexts (
  id              TEXT PRIMARY KEY,
  label           TEXT NOT NULL,                     -- 'Maya', 'Group A', 'Tuesday 3pm'
  age_group_default TEXT,                            -- '3-5' | '6-8' | '9-12' | '13+' (nullable)
  is_anonymous    INTEGER NOT NULL DEFAULT 0,        -- Professional tier privacy flag
  color_token     TEXT,                              -- one of the 5 palette colors
  created_at      TEXT NOT NULL,
  archived_at     TEXT
);

-- Tables that become per-context (add context_id FK):
--   personalization   PRIMARY KEY (context_id, key)
--   favorites         PRIMARY KEY (context_id, prompt_id)
--   reflections       add context_id NOT NULL
--   module_progress   PRIMARY KEY (context_id, module_id, prompt_id)
```

**Rules:**
1. First launch auto-creates a `"Quick Start"` context — zero friction
2. Active context lives in app state (Context API) + AsyncStorage (`activeContextId`)
3. Context switcher pill at the top of Home (color dot + label)
4. `is_anonymous = 1` hides personalization tokens automatically and forces non-name labels
5. Context can be archived but never hard-deleted (preserves reflection history)
6. NOT premium-gated — parents with multiple kids need this on Free tier

**Cost:** +1.5 days in Phase 0. Avoids ~1 week of retrofit pain across deliverables #5, #9, #10.

---

## 6. Open Questions (please answer to make the plan tighter)

1. **Where is `Ethical_Choices_App_Full_Prompt_Library.xlsx`?** It's referenced in CLAUDE.md but not in the repo. Without it, deliverable #1 either gets blocked or has to fall back to placeholder content. (Same for `What_If_Professional_Tier_Discovery.docx`.)

2. **Tips and world-building content — do you have these written, or do they need to be authored as part of this work?** If they need to be authored, that's a meaningful content-design effort that could double the Phase 1 timeline. Are you open to me drafting starter content for review, or do you have a content collaborator?

3. **Kids-ask-parents mode (#4): does this require a separate "kid-voiced" variant of each prompt, or is the existing prompt text always re-usable verbatim?** I've assumed an optional variant column. If you want all 290 prompts to have a kid-voiced version, that's another content pass.

4. **Multi-child support — in scope for the prototype, or single-user only for now?** Affects personalization (#9), reflections (#5), and module progress (#10). My plan currently assumes single-user; multi-child is straightforward to add but it's an architectural decision I'd rather make once.

5. **"I'm concerned" flow (#8b): do you have a clinician advisor lined up to review the safety content?** I'd strongly recommend not shipping this without one. If not, I can suggest the kind of review needed and help draft the brief.

6. **Backend timing.** I've assumed local-only (SQLite) through Phase 2 and Supabase added in Phase 3. If you want community features earlier (the [Community screen](WireframeApp.tsx#L608) is currently mock data), Supabase has to come earlier — which is a 3–5 day extra investment.

7. **Premium tier mechanics.** I've assumed local feature flags for the prototype. When do you want real IAP wired up? RevenueCat integration is a 3–4 day add and is the cleanest path on iOS+Android.

8. **Refactor blessing.** I'm recommending splitting the 2,082-line WireframeApp.tsx as Phase 0. This will produce a large, mechanical PR before any feature work. Are you OK with that, or would you prefer I do the refactor *opportunistically* (split out only the screens I touch, file by file)?

9. **Liminal spaces (#6) — which situations matter most to you?** My starter list (car ride, bedtime, mealtime, waiting room, doctor, long line, walking, before/after school) is a guess. Two minutes of your input here saves a content rework later.

10. **Educational modules (#10) — is this primarily a Premium/Professional feature, or does the Free tier get a starter module too?** Affects gating + paywall placement. My plan currently assumes one Free starter per age group + Premium-only for the rest.

---

*This plan is a starting frame, not a contract. Tell me what to change and I'll revise.*
