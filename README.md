# N5 Flowchart Sorter

A practice website for National 5 Software Design and Development. Each task shows a flowchart and the matching pseudocode (SQA Reference Language) in a shuffled order. Students put the lines back into the correct order.

## Using it

Open `index.html` in a browser. No server, build step or install is needed.

To publish it as a website with GitHub Pages: in the repository go to **Settings → Pages**, set **Source** to *Deploy from a branch*, pick the branch and the `/ (root)` folder, then **Save**. After a minute or two the site is live at `https://csteachian.github.io/n5-program-design/`.

Students can:

- drag lines by the grip (works with mouse and touch), use the ▲ ▼ buttons, or select a line and press Alt + ↑ / ↓
- **Check my order**: correct lines are ticked, misplaced ones crossed
- **Hint**: moves the first misplaced line into place
- **Show indentation**: turns on indentation as an extra clue (it is always shown once a task is solved)
- **Show answer** (click twice): reveals the solution

Completed tasks are remembered in the browser's local storage.

## Tasks included

| # | Task | Focus |
|---|------|-------|
| 1 | Rectangle calculator | Sequence |
| 2 | Pass or fail | Selection |
| 3 | Times table | Fixed loop |
| 4 | Cinema tickets | Logical operators |
| 5 | Award a grade | Nested selection |
| 6 | Running total | Standard algorithm |
| 7 | Validate an age | Standard algorithm (input validation) |
| 8 | Password length | Predefined functions (`LENGTH`) |
| 9 | Average temperature | Arrays, `ROUND` |
| 10 | Star rating | Conditional loop (`REPEAT … UNTIL`) |
| 11 | Count the passes | Arrays (`FOR EACH`) |
| 12 | Guess the number | Conditional loop, `RANDOM` |

## Adding a task

Tasks live in `js/exercises.js`. Copy an existing entry and edit it:

- `flow` describes the flowchart using the helpers at the top of the file: `io()`, `proc()`, `IF(cond, then, else)`, `WHILE(cond, body)`, `FOR(text, body)` and `REPEAT(body, cond)`. The chart is laid out and drawn automatically.
- `code` lists the pseudocode lines in the correct order. Indent with two spaces per level. Lines with identical text are treated as interchangeable.

## Files

- `index.html`: page structure
- `css/styles.css`: styles (light and dark themes)
- `js/flowchart.js`: draws flowcharts as SVG
- `js/exercises.js`: task data
- `js/app.js`: shuffling, drag and drop, checking and hints
