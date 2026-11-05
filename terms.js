// VCAA command terms, shared by the browser (window.VCAA) and the server (require('./terms.js')).
// Definitions follow the VCAA Glossary of command terms: https://vcaa.vic.edu.au/assessment/vce/glossary-command-terms
(function (root) {
  const TERMS = {
    'Account for': { def: 'State reasons for; report on.', need: 'Give the reasons behind it, not just what happened.' },
    'Analyse': { def: 'Identify components/elements and the significance of the relationship between them; draw out and relate implications; determine logic and reasonableness of information.', need: 'Break it into parts, show how the parts relate to each other, and draw out what that means. A list of separate points is not analysis.' },
    'Apply': { def: 'Use; employ in a particular situation or context.', need: 'Use the concept on the specific case in the question.' },
    'Assess': { def: 'Make a judgment about, or measure, determine or estimate, the value, quality, outcomes, results, size, significance, nature or extent of something.', need: 'Reach a clear judgement about value, extent or significance, and back it with evidence.' },
    'Clarify': { def: 'Make a statement or situation more comprehensible.', need: 'Make it clearer, with an example if it helps.' },
    'Compare': { def: 'Recognise similarities and differences and the significance of these similarities and differences.', need: 'Give similarities AND differences, link the two sides point by point (whereas, similarly), and say why the differences matter.' },
    'Contrast': { def: 'Show how things are different or opposite.', need: 'Differences only, side by side.' },
    'Define': { def: 'Give the precise meaning and identify essential qualities of a word, phrase, concept or physical quantity.', need: 'A precise meaning plus its essential qualities. Short and exact; no essay.' },
    'Demonstrate': { def: 'Show ideas, how something can be done or that something is true by using examples or practical applications.', need: 'Prove it with examples.' },
    'Describe': { def: 'Provide characteristics, features and qualities of a given concept, opinion, situation, event, process, effect, argument, narrative, text, experiment, artwork, performance piece or other artefact in an accurate way.', need: 'Accurate features and characteristics with detail. No need to explain why.' },
    'Discuss': { def: 'Present a clear, considered and balanced argument or prose that identifies issues and shows the strengths and weaknesses of, or points for and against, one or more arguments, concepts, factors, hypotheses, narratives and/or opinions.', need: 'Points for AND against (or strengths and weaknesses), balanced, ending in a considered position.' },
    'Distinguish': { def: 'Make clear the differences between two or more arguments, concepts, opinions, narratives, artefacts, data points, trends and/or items.', need: 'Make the differences explicit; similarities are not needed.' },
    'Evaluate': { def: 'Ascertain the value or amount of; make a judgment using the information supplied, criteria and/or own knowledge and understanding to consider a logical argument and/or supporting evidence for and against different points, arguments, concepts, processes, opinions or other information.', need: 'Weigh evidence for AND against, then make a clear overall judgement. No judgement = not an evaluation.' },
    'Examine': { def: 'Consider an argument, concept, debate, data point, trend or artefact in a way that identifies assumptions, possibilities and interrelationships.', need: 'Probe assumptions and connections, not just the surface.' },
    'Explain': { def: 'Give a detailed account of why and/or how with reference to causes, effects, continuity, change, reasons or mechanisms; make the relationships between things evident.', need: 'Say WHY or HOW: causes, effects and mechanisms, with the links spelled out (because, which led to, as a result). Facts without links are description.' },
    'Identify': { def: 'Recognise and name and/or select an event, feature, ingredient, element, speaker and/or part from a list or extended narrative or argument, or within a diagram, structure, artwork or experiment.', need: 'Name it. Brief and accurate; no explanation needed.' },
    'Infer': { def: 'Derive conclusions from available information or evidence, or through reasoning, rather than through explicit statements.', need: 'Draw a conclusion that is not stated outright, and show what it rests on.' },
    'Interpret': { def: 'Draw meaning from an argument, point of view, description or diagram, text, image or artwork and determine significance within context.', need: 'Say what it means and why it matters in context.' },
    'Justify': { def: 'Show, prove or defend, with reasoning and evidence, an argument, decision and/or point of view using given data and/or other information.', need: 'Take a position and defend it with reasons and evidence.' },
    'List': { def: 'Provide a series of related words, names, numbers or items that are arranged one after the other.', need: 'Just the items.' },
    'Name': { def: 'Provide a word or term used to identify an object, person, thing, place etc.', need: 'Just the name.' },
    'Outline': { def: 'Provide an overview or the main features of an argument, point of view, text, narrative, diagram or image.', need: 'The main features only, briefly. Breadth over depth.' },
    'Predict': { def: 'Give an expected result of an upcoming action or event; suggest what may happen based on available information.', need: 'Say what will likely happen and why.' },
    'Propose': { def: 'Suggest or put forward a point of view, idea, argument, diagram, plan and/or suggestion based on given data or stimulus material for consideration or action.', need: 'Put forward an idea grounded in the information given.' },
    'Recommend': { def: 'Put forward and/or approve (someone or something) as being suitable for a particular purpose or role.', need: 'Choose and say why it suits the purpose.' },
    'Recount': { def: 'Retell a series of events or steps in a process, usually in order.', need: 'Events in order.' },
    'State': { def: 'Give a specific name or value or other brief answer without explanation or calculation.', need: 'A brief answer only.' },
    'Suggest': { def: 'Put forward for consideration a solution, hypothesis, idea or other possible answer.', need: 'Offer a plausible answer.' },
    'Summarise': { def: 'Retell concisely the relevant and major details of one or more arguments, text, narratives, methodologies, processes, outcomes and/or sequences of events.', need: 'The major details, concisely.' },
    'Synthesise': { def: 'Combine various elements to make a whole or an overall point.', need: 'Bring the pieces together into one overall point.' }
  };
  // 'To what extent' questions are marked as Evaluate.
  const ALIAS = { 'To what extent': 'Evaluate' };

  // Words that show an answer is doing what the term asks (used by the offline marker only).
  const CAUSE = /\b(because|therefore|thus|hence|as a result|resulted in|result(ed)? in|led to|leads? to|lead to|caused|causes|cause|due to|consequently|this meant|which meant|meaning that|so that|in turn|this (made|allowed|forced|gave|created))\b/i;
  const BOTH = /\b(whereas|similarly|both|unlike|in contrast|likewise|while|by comparison|on the other hand|however)\b/i;
  const DIFF = /\b(whereas|unlike|in contrast|differ|differs|different|however|while|but)\b/i;
  const TURN = /\b(however|on the other hand|although|whereas|but|despite|nevertheless|yet|conversely)\b/i;
  const JUDGE = /\b(overall|ultimately|on balance|in conclusion|to a (large|great|significant|considerable|limited|small|lesser|moderate) extent|largely|most significant|more significant|least|i (would )?(argue|agree|disagree)|therefore)\b/i;
  const CHECKS = {
    'Explain': { test: t => CAUSE.test(t), miss: 'No cause-and-effect links: you described what happened but did not explain why or how.' },
    'Account for': { test: t => CAUSE.test(t), miss: 'No reasons given: say why, not just what.' },
    'Analyse': { test: t => CAUSE.test(t) || /\b(relationship|implication|significan|combined|connect|link|relat)/i.test(t), miss: 'Separate points with no relationships drawn between them: analysis must connect the parts and draw out implications.' },
    'Compare': { test: t => BOTH.test(t), miss: 'No point-by-point comparison: you need similarities and differences linked across both sides.' },
    'Contrast': { test: t => DIFF.test(t), miss: 'Differences are not made explicit.' },
    'Distinguish': { test: t => DIFF.test(t), miss: 'Differences are not made explicit.' },
    'Discuss': { test: t => TURN.test(t), miss: 'One-sided: a discussion needs points for and against.' },
    'Evaluate': { test: t => TURN.test(t) && JUDGE.test(t), miss: 'No weighing and/or no clear judgement: an evaluation must consider both sides and reach a verdict.' },
    'Assess': { test: t => JUDGE.test(t), miss: 'No clear judgement about extent or significance.' },
    'Justify': { test: t => CAUSE.test(t), miss: 'Position stated but not defended with reasons and evidence.' },
    'Examine': { test: t => CAUSE.test(t) || /\b(assum|possib|relationship|interrelat)/i.test(t), miss: 'Stays on the surface: identify assumptions and interrelationships.' }
  };

  const canon = t => ALIAS[t] || t;
  const info = t => TERMS[canon(t)] || null;
  function meets(term, text) {
    const c = CHECKS[canon(term)];
    return c ? { met: c.test(String(text || '')), miss: c.miss } : { met: true, miss: '' };
  }

  // Infer the command term a flashcard question implies from its phrasing.
  function termFor(q) {
    const s = String(q || '').trim();
    if (/^(compare|vs\b)|\bvs\.?\b|\bversus\b|difference between|similarities/i.test(s)) return 'Distinguish';
    if (/^why\b|^how (did|does|do|was|were|has|have|can|could|might|is|are|did)\b|\bcauses? of\b|\breasons? (for|why)\b|\bimpacts? of\b|\bconsequences? of\b|\beffects? of\b|\bsignificance of\b|\bwhy\b/i.test(s)) return 'Explain';
    if (/^(who|when|where|which|name|list)\b|^(how many|how much)\b|\bdates?\b.*\?$/i.test(s)) return 'Identify';
    if (/^(what (is|are|was|were)|describe)\b|\bfeatures\b|\bstructure\b|\brole\b/i.test(s)) return 'Describe';
    if (/^[^?]{1,70}\?$/.test(s) && !/^(what|how|why|who|when|where|which|did|does|is|are|can)\b/i.test(s)) return 'Define';
    return 'Describe';
  }

  const api = { TERMS, ALIAS, canon, info, meets, termFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.VCAA = api;
})(typeof self !== 'undefined' ? self : this);
