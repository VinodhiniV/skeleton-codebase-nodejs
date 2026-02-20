# GoFit Node.js — Project Overview

## What is this?

GoFit is a command-line workout tracker. A user types their Customer ID, picks a workout type, enters details like date, duration, and optionally distance (for distance-based workouts), and the app saves it locally. They can come back later and look up their full workout history by Customer ID.

This document explains the problems we found in the original codebase, what we changed, and new features that were added.

---

## Table of Contents

1. [Problems Found in the Original Code](#problems-found-in-the-original-code)
2. [New Feature — Time-Based Workouts](#new-feature-added--time-based-workouts)
3. [Clean-Up Pass](#clean-up-pass)
4. [Requirement 2 — Workout Scoring](#requirement-2--workout-scoring)

---

## Problems Found in the Original Code

### 1. The same rules were written out multiple times

**In plain terms:** Imagine writing the rule "dates must look like 2024-01-15" in five different places across a document. If you ever needed to change that rule, you'd have to find and update every single copy — and hope you didn't miss one.

**In the code:** The original code had validation rules (checking that a date is valid, a number is positive, a field isn't blank) written out in full, inline, wherever they were needed. The same logic was duplicated across multiple prompts.

**What we changed:** Each rule was extracted into its own named function in a new file — `validators.js`. Now there is one place to look at, one place to change.

---

### 2. The same questions were copy-pasted everywhere

**In plain terms:** Think of a form where the "Enter your name" field was defined separately for every page that used it, instead of being a shared template. If you wanted to change the label, you'd have to update each page individually.

**In the code:** Prompt questions (like "Enter Customer ID" or "Enter date") were defined as full objects every time they were used — once in the record flow, once in the list flow, sometimes inline in the menu.

**What we changed:** All prompts are now defined once in a `QUESTIONS` map inside `workoutHandler.js`. Every part of the app that needs a prompt just references it by name.

---

### 3. The file-reading logic was duplicated in the data layer

**In plain terms:** The code that opens the saved workouts file and reads its contents was written out twice — once for saving a workout and once for fetching workouts. Two copies of the same instructions means two places that can go wrong.

**In the code:** Both `save()` and `fetch()` in `repository.js` had their own version of "open the file, handle the case where it doesn't exist yet, parse the contents."

**What we changed:** That shared logic was pulled into two private helper methods (`#readAll` and `#writeAll`) inside the same file. `save()` and `fetch()` now call these helpers instead of repeating the steps themselves.

---

### 4. The menu was calling itself in a loop (a hidden memory risk)

**In plain terms:** Imagine a receptionist who, after handling each visitor, called a new receptionist to take over — instead of simply waiting for the next visitor themselves. Over a long day, you'd have hundreds of receptionists stacked up doing nothing.

**In the code:** After each menu interaction, `mainMenu()` called itself recursively. Every call added a new frame to the call stack. Over a long session, this would accumulate silently.

**What we changed:** Replaced the recursive call with a straightforward `while (true)` loop. The menu keeps running in place with no stack build-up.

---

### 5. Adding a new menu option required editing the control flow

**In plain terms:** If you had a list of tasks handled by a long chain of "if this, do that… else if this other thing, do that other thing…", adding a new task meant cutting into the middle of that chain. Easy to get wrong, easy to break something adjacent.

**In the code:** The menu used an `if / else if` chain to decide which action to run. Adding a new option meant inserting another branch into that chain.

**What we changed:** Replaced the chain with a lookup map called `MENU_ACTIONS`. Each option maps directly to its function. Adding a new menu item now means adding one line to the map — nothing else in the logic needs to change.

---

### 6. Every workout carried data it didn't need

**In plain terms:** If you had a form for both car trips and walks, but every form had a field for "fuel used" — even the walking ones — that's confusing and wasteful. A walk never has a fuel reading.

**In the code:** Every workout object had a `distance` field and an `averageSpeed` calculation, even for workout types where distance makes no sense (like a yoga session).

**What we changed:** The `Workout` class was split into a small hierarchy in `workout.js`:

| Class | Used for | Carries |
|---|---|---|
| `Workout` | All workouts | Customer ID, type, date, time, duration |
| `DistanceWorkout` | Walking, cycling, running | Everything above + distance + average speed |
| `TimeBasedWorkout` | Yoga, strength-training | Everything in `Workout`, nothing more |

A yoga session now never has a `distance` field. An average speed is never calculated for it.

---

## New Feature Added — Time-Based Workouts

**The original app only supported distance workouts** (walking, cycling, running). Every prompt asked for distance, and every saved workout stored a distance value. There was no concept of a workout that was measured only by time.

**The new requirement** was to add yoga and strength-training — workouts where you don't track how far you went, only how long you worked out.

### What changed

**`constants.js`** (new file) — A single place that defines which workout types are distance-based and which are time-based. Both the data layer and the UI import from here, so the list never gets out of sync.

**`workout.js`** — The flat class was replaced with the three-class hierarchy described above. A factory method (`fromJSON`) on the base class automatically picks the right subclass when loading saved data, so old records load correctly too.

**`workoutHandler.js`** — When recording a workout, the app now checks whether the chosen type is distance-based before asking for distance. Yoga and strength-training skip that prompt entirely and go straight to saving.

---

## Clean-Up Pass

Beyond the six main issues, a second pass was made to tighten up smaller things:

| What was wrong | What was fixed |
|---|---|
| The strings `'distance'` and `'time'` were written as raw text in multiple files | Replaced with a `WORKOUT_CATEGORY` constant — change it once, it updates everywhere |
| The date format `'yyyy-MM-dd'` appeared in validators, error messages, and prompts separately | Extracted to a `DATE_FORMAT` constant; the display version is derived from it automatically |
| `parseInt` was called without specifying base 10 | Added explicit radix — removes any ambiguity about how the number is parsed |
| The "Press Enter" prompt was defined inline instead of in the shared `QUESTIONS` map | Moved into `QUESTIONS` to be consistent with all other prompts |
| The Exit option was handled by a special `if` check before the menu dispatch, making it inconsistent | `exitApp` is now a regular entry in `MENU_ACTIONS` like every other option |
| `capitalize` logic was written inline in the display code | Extracted to a small named utility in `workoutHandler.js` |
| The workout type lists were plain arrays any module could accidentally modify | Wrapped in `Object.freeze()` — they are now read-only at runtime |

---

## Requirement 2 — Workout Scoring

### What the customer wanted

Customers asked to see a **score** attached to each workout when they view their history. The score reflects the effort involved — a harder workout type or longer session produces a higher number, giving a clearer sense of progress over time.

### How the score is calculated

**Time-based workouts** (yoga, strength-training):
```
score = type factor × duration (minutes)
```

**Distance-based workouts** (walking, cycling, running):
```
score = type factor × (distance ÷ duration)
```
`distance ÷ duration` is average speed, which was already computed by `DistanceWorkout`. The score formula reuses it directly.

**Type factors:**

| Workout | Factor | Why higher = more effort |
|---|---|---|
| Walking | 2 | Lowest intensity distance workout |
| Yoga | 2 | Lower intensity time workout |
| Cycling | 4 | Moderate intensity |
| Strength-training | 3 | Moderate-high intensity |
| Running | 6 | Highest intensity |

### What changed in the code

**`constants.js`** — A `TYPE_FACTORS` map was added, frozen like the other constants. All five workout types have their factor defined in one place. If a factor ever needs adjusting, this is the only file that changes.

**`workout.js`** — A `score` getter was added to each subclass. Each class knows its own formula:
- `DistanceWorkout.score` → `TYPE_FACTORS[type] × averageSpeed`
- `TimeBasedWorkout.score` → `TYPE_FACTORS[type] × duration`

The score is a computed property — it is never stored, always derived from data already on the object.

**`workoutHandler.js`** — `printWorkout` now prints the score as the last line of each workout entry. No input changes were needed — the score is calculated automatically.
