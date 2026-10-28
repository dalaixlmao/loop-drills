# Loop Drills

Google-style interview practice. Every problem is told as a situation, the way an interviewer would say it, with no constraints and no sample input or output. You write your answer in a plain, Google-Docs-like page. Constraints, possible follow-ups, one hint and the matching LeetCode problem stay hidden until you open them.

Live site: https://dalaixlmao.github.io/loop-drills/

## How it is put together

- Static site: `index.html`, `styles.css`, `app.js`. No build step. GitHub Pages serves this repo.
- `data/bank.json` holds the question bank: 19 patterns in 3 priority tiers, 3 Medium and 2 Hard each.
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
