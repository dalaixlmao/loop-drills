# Loop Drills

Google-style interview practice. Every problem is told as a situation, the way an interviewer would say it, with no constraints and no sample input or output. You write your answer in a plain, Google-Docs-like page. Constraints, possible follow-ups, one hint and the matching LeetCode problem stay hidden until you open them.

Live site: https://dalaixlmao.github.io/loop-drills/

## How it is put together

- Static site: `index.html`, `styles.css`, `app.js`. No build step. GitHub Pages serves the `gh-pages` branch, so push changes to `main` and then `git push origin main:gh-pages` (or switch Settings > Pages to deploy from `main`).
- `data/bank.json` holds the question bank: 19 patterns in 3 priority tiers, 3 Medium and 2 Hard each.
- `data/star.json` holds the Star page (`#/star`): problems that are a known trick in disguise. See "The Star list" below.
- Your solutions, progress and the questions you add are **not** stored here. They go to a private repo (`loop-drills-data` by default) through the GitHub API, using a fine-grained token that stays in your browser. Without a token, everything is kept in the browser only.

## Adding questions to the bank

Append an object to `questions` in `data/bank.json`:

```json
{
  "id": "lc1234",
  "pattern": "heap",
  "difficulty": "Medium",
  "title": "Short name for the situation",
  "story": ["First paragraph of the situation.", "Second paragraph. End with what to write."],
  "constraints": ["1 ≤ n ≤ 10⁵"],
  "followups": ["A follow-up an interviewer might ask."],
  "hint": "One nudge that does not give the whole idea away.",
  "leetcode": { "number": 1234, "title": "LeetCode title", "url": "https://leetcode.com/problems/slug/" },
  "source": "bank"
}
```

Rules for the story: wrap the problem in a real situation, say what the function receives and returns, and leave out constraints, sizes, examples and LeetCode wording. `pattern` must be one of the ids in `patterns`. Keep `id` unique.

Questions you add from the app (the Add button) live in `questions/custom.json` in the data repo instead, so they never touch this public repo.

## The Star list

`data/star.json` has `groups`, each with `rows`. A row is one line of the trick table:

```json
{ "says": "Min adjacent swaps to sort", "really": "Inversion count (BIT / merge sort)", "ids": ["lc315", "lc493"] }
```

`says` is shown on the Star page; `really` stays hidden until tapped, and is also a "What it really is" panel in the question room. `ids` can point at questions in `star.json` `questions` (same schema as the bank, with `"source": "star"` and `pattern` set to the group id) or at questions already in `bank.json`. A shared id means one question with one status and one doc, reachable from both pages. A row may have `ids: []` and a `note` when no LeetCode problem fits. Star questions follow the same story rules as the bank; the 3 Medium + 2 Hard balance does not apply to them.
