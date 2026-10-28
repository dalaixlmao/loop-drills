# Loop Drills: notes for Claude

Static site, no build step. GitHub Pages serves the **`gh-pages`** branch, so every change goes to `main` and then the same commit to `gh-pages`:

```
git push origin main && git push origin main:gh-pages
```

## Adding questions

Questions live in `data/bank.json` under `questions`. Follow the schema in README.md, and:

- Write the story the way a Google interviewer would say it: a real situation, what the function gets and returns, tie-break rules if they matter. No constraints, input sizes, examples, sample I/O or LeetCode wording. Never hint at the technique through scale words ("a handful of", "a dozen").
- Keep the story exactly equivalent to the LeetCode problem so a solution passes when submitted.
- `constraints` are copied from the LeetCode statement (use ≤, ≥ and superscript powers like 10⁵).
- 2 or 3 `followups`, and one `hint` that nudges without giving the idea away.
- `pattern` must match an id in `patterns`. Each pattern currently has 3 Medium and 2 Hard. Ask before changing that balance.
- No em dashes anywhere (the owner's preference).
- Bump `?v=` on `app.js` / `styles.css` in `index.html` when those files change, so phones pick up the new version.

Questions the owner adds from the app are stored in the private repo `dalaixlmao/loop-drills-data` (`questions/custom.json`), along with solutions and progress. Don't move them into this public repo unless asked.
