# Statecraft

A revision game for three subjects, built from my school booklets and marked with the VCAA command terms:

- **Global Politics**: 317 cards across seven topics (Foundations, USA, Russia, China, the European Union, and the causes of and response to the invasion of Ukraine).
- **History (Cold War)**: 289 cards across eight topics (Origins in Europe and Asia, Rising Tensions, Cuba & Berlin, Vietnam escalation and withdrawal, Détente, End of the Cold War).
- **Geography**: 215 cards across eight topics (Coasts processes, Coasts landforms & management, Climate causes, Climate impacts & responses, Development & Inequality, Nigeria & Lagos, China's Development, Drought & Bushfire).

Plus 117 exam-style questions, each with a VCAA command term, a mark value and a marking guide.

Play it: https://48850.github.io/Statecraft-/

## Modes
- **Learn**: flip cards and rate your confidence from 1 (not at all) to 5 (perfectly). Low ratings bring cards back sooner; a 5 retires the card.
- **Quiz Blitz**: 10 multiple-choice questions against the clock.
- **Match Rush**: pair questions with answers as fast as you can.
- **Boss Battle**: each topic has an illustrated boss. Answer to strike; typed answers are special attacks.
- **Exam Questions**: exam-style questions (Define, Describe, Explain, Analyse, Compare, Evaluate, Discuss…) with mark values. The VCAA definition of each command term is one tap away. Answers are marked like a VCAA assessor would: if you don't do what the command term asks (for example describing when the question says explain), the mark is capped at half. You get a mark, what earned it, the one fix for the next mark, what's missing, and a full-mark answer, then can rewrite and resubmit.
- **Type It**: write answers in your own words. Every answer gets marked with what you got right, what to improve and what was missing.
- **True or False**: 60 seconds of quick calls.
- **Review session**: turns every answer you typed this session into homework cue cards. Each answer is tidied up in your own words, with errors fixed and missing points added, weakest first. Print them, copy them, or drill them in Type It.

Progress saves in your browser. No sign-up, no tracking.

Made by Elliot Thevathasan.

## VCAA command terms
`terms.js` holds the VCAA Glossary of command terms (https://vcaa.vic.edu.au/assessment/vce/glossary-command-terms) and is shared by the browser and the server. Flashcards get the command term their wording implies (a "Why…?" card is an Explain, a "X vs Y?" card is a Distinguish), and the marking checks for it.

## AI marking
Typed answers are marked by `api/judge.js`, exam questions by `api/exam.js`, and session reviews are refined by `api/review.js`, all serverless functions. Deploy on Render as a Web Service (build command `npm install`, start command `node server.js`) or on Vercel, and set the `ANTHROPIC_API_KEY` environment variable there. The key is never stored in this repo or sent to the browser. Without it, answers fall back to keyword marking plus a command-term check.

How the marking works: the judge breaks the model answer (or marking guide) into its key ideas and ticks each one as got, partial, missing or wrong. It also lists factual errors with corrections and checks the command term, then scores from that checklist. The server applies the caps itself (60/100, or half marks, when the command term isn't met). Feedback includes the checklist, the errors, extra credit, your answer upgraded to full marks, and an exam tip. Replies are forced into a fixed JSON schema, and failed calls are retried.

- Models: Sonnet 5.5 by default, falling back to Haiku. Set `JUDGE_MODELS` on Render (e.g. `claude-haiku-5-5`) to use a cheaper model.
- The GitHub Pages copy can use the Render judge: put the Render URL in `AI_SERVER` in `index.html`. The server accepts requests from `48850.github.io`; add other sites with `ALLOWED_ORIGINS`.
