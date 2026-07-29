# Signup / Onboarding Flow Design

**Date:** 2026-07-28
**Status:** Approved (pending spec review)
**Origin:** Implements Recommendation #2 from the Platform Clarity Sprint audit (`findings.md`) — "Decide the account-gating / monetization trigger strategy." Chosen strategy: **gate after value**, not an upfront signup wall.

---

## 1. Why

There is currently no Account/User object in the app (`findings.md`, OOUX section) — everything is scoped to a local, unauthenticated "context." The tiered model (Free/Premium/Professional, per `CLAUDE.md`) can't function without one. This spec defines when signup is triggered and what the signup flow itself looks like.

## 2. Gate triggers

Two independent triggers, both routing into the same signup flow (Section 3). Declining either returns the user to anonymous browsing, except once Trigger A's daily count is exhausted.

**Trigger A — Daily prompt limit**
- Anonymous users get 3 free prompts per day.
- The Prompt screen shows a 3-segment progress bar with a lock icon, so the limit is visible before it's hit — not a surprise wall.
- Once all 3 segments are used, the next prompt attempt routes to signup instead of loading content.
- Signed-in users see no segments/lock at all (unlimited).

**Trigger B — Favorite while signed out**
- Favoriting requires an account outright — there is no local/anonymous favorite state.
- Tapping the star while signed out routes straight to signup (no silent local save, no migration).
- The specific prompt they tapped is remembered through the flow and auto-saved as a favorite immediately after signup completes — this is completing the one action they started, not a data migration.

**Out of scope for this spec:** the mandatory post-prompt "How did that go?" reflection modal (`findings.md` Recommendation #4) is being removed, not gated — replaced by a kebab (⋮) menu on the Prompt screen offering Report / Feedback / other actions. It's non-blocking and doesn't persist a per-user object, so it needs no account-gating consideration here.

**Stays anonymous-friendly:** "current prompt position" / progress tracking continues to work locally without an account, within the daily limit.

## 3. Screen flow

Three screens, one fixed bottom CTA per screen, progress dots at top (style pattern per `findings.md` Recommendation #11). Back button available except on screen 1. Closing/backing out before the final Done state discards progress and returns to anonymous browsing.

**Screen 1 — Auth method**
- Three buttons: "Sign in with Apple," "Sign in with Google," "Continue with Email."
- Apple/Google complete OAuth and skip directly to Screen 3.

**Screen 2 — Email verification (email path only)**
- Enter email → 6-digit OTP code sent → enter code to verify.
- Chosen over magic links: no deep-link/redirect handling needed in Expo, and a single code-entry screen is simpler and more reliable across email clients.

**Screen 3 — Profile (combined, single screen)**
- Top: Photo — "Add a photo" / choose an emoji-style avatar / "Skip for now." Optional, no validation. Defaults to an initials/emoji avatar if skipped.
- Username — single text field, live availability check, inline error if taken.
- Birthdate — native date picker, adult's own birthdate (not the child's), for age verification. Inline error if under the app's minimum account-holder age; blocks the Finish button until corrected.
- Single "Finish" button submits the whole screen.

**Done**
- Confirmation, then returns to whatever triggered signup: resumes the prompt they were on, or completes the pending favorite save.

## 4. Data model

- New `Account` object: auth identity (Apple/Google/email), username, birthdate, avatar. Tier (Free/Premium/Professional) attaches here going forward.
- Favorites become account-scoped only — no anonymous favorite state exists to migrate.
- Progress (last-viewed prompt) remains locally tracked and anonymous-friendly; not tied to `Account`.

## 5. Validation & edge cases

- Username: live uniqueness check against existing accounts; inline error, blocks Finish, if taken.
- Birthdate: inline error, blocks Finish, if the entered date implies the account holder is under the minimum age.
- Photo: fully optional, no validation, no blocking.
- OTP: standard resend/expire handling (not further specified here — implementation detail, not a design decision).
