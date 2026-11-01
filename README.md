# Statecraft

A Global Politics revision game: 413 flashcards across seven topics (Foundations, USA, Russia, China, the European Union, and the causes of and response to the invasion of Ukraine).

Play it: https://48850.github.io/Statecraft-/

## Modes
- **Learn**: flip cards and rate your confidence from 1 (not at all) to 5 (perfectly). Low ratings bring cards back sooner; a 5 retires the card.
- **Quiz Blitz**: 10 multiple-choice questions against the clock.
- **Match Rush**: pair questions with answers as fast as you can.
- **Boss Battle**: each topic has an illustrated boss. Answer to strike; typed answers are special attacks.
- **Type It**: write answers in your own words. Every answer gets marked with what you got right, what to improve and what was missing.
- **True or False**: 60 seconds of quick calls.

Progress saves in your browser. No sign-up, no tracking.

Made by Elliot Thevathasan.

## AI marking
Typed answers are marked by `api/judge.js`, a serverless function. Deploy the repo on Vercel and set the `ANTHROPIC_API_KEY` environment variable there. The key is never stored in this repo or sent to the browser. Without it, answers fall back to keyword marking.
