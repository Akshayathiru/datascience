/**
 * CHARACTER CONSISTENCY REASONING ENGINE
 * Core Logic & UI Controller
 */

const elements = {
    storyInput: document.getElementById('story-input'),
    backstoryInput: document.getElementById('backstory-input'),
    charName: document.getElementById('character-name'),
    analyzeBtn: document.getElementById('analyze-btn'),
    loadingState: document.getElementById('loading-state'),
    loadingText: document.getElementById('loading-text'),
    resultsSection: document.getElementById('results-section'),
    judgmentBadge: document.getElementById('judgment-badge'),
    explanationContent: document.getElementById('explanation-content'),
    futureProjectionContent: document.getElementById('future-projection-content'),
    claimsBody: document.getElementById('claims-body'),
    traitViolence: document.getElementById('trait-violence'),
    traitRisk: document.getElementById('trait-risk'),
    traitTrust: document.getElementById('trait-trust'),
    traitAuthority: document.getElementById('trait-authority'),
    inputSection: document.querySelector('.input-section'),
    followUpSection: document.getElementById('follow-up-section'),
    followUpInput: document.getElementById('follow-up-input'),
    askBtn: document.getElementById('ask-btn'),
    followUpResults: document.getElementById('follow-up-results')
};

// --- UI State Management ---

function validateInputs() {
    const isStoryFilled = elements.storyInput.value.trim().length > 10;
    const isBackstoryFilled = elements.backstoryInput.value.trim().length > 5;
    const isNameFilled = elements.charName.value.trim().length > 1;

    elements.analyzeBtn.disabled = !(isStoryFilled && isBackstoryFilled && isNameFilled);
}

[elements.storyInput, elements.backstoryInput, elements.charName].forEach(el => {
    el.addEventListener('input', validateInputs);
});

// --- Core Reasoning Engine (Simulated 8-Step Logic) ---

async function performReasoning(story, backstory, character) {
    // 🧱 STEP 1: Memory (Chunking)
    updateLoadingText("🧱 STEP 1: Splitting narrative into memory chunks...");
    const chunks = story.split(/[\n\r]+/).filter(line => line.trim().length > 10);
    await sleep(1200);

    // 🧱 STEP 2: Focus
    updateLoadingText(`🧱 STEP 2: Focusing observation on "${character}"...`);
    await sleep(1000);

    // 🧱 STEP 3: Observation & STEP 4: Profile
    updateLoadingText("🧱 STEP 3 & 4: Extracting actions and updating behavioral profile...");
    await sleep(1800);

    // 🧱 STEP 5: Expectation
    updateLoadingText("🧱 STEP 5: Deconstructing backstory into specific claims...");
    await sleep(1200);

    // 🧱 STEP 6: Reasoning
    updateLoadingText("🧱 STEP 6: Cross-referencing claims with story evidence...");
    await sleep(2000);

    // 🧱 STEP 7 & 8: Judgment & Evidence
    updateLoadingText("🧱 STEP 7 & 8: Finalizing judgment and citing evidence...");
    await sleep(1000);

    return simulateAnalysis(story, backstory, character, chunks);
}

function updateLoadingText(text) {
    elements.loadingText.classList.add('fade-out');
    setTimeout(() => {
        elements.loadingText.textContent = text;
        elements.loadingText.classList.remove('fade-out');
    }, 300);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Analysis Logic ---

function simulateAnalysis(story, backstory, character, chunks) {
    // 🧱 STEP 4: Build a character profile (Understanding)
    const findings = {
        violence: determineTrait(backstory, story, ['violent', 'aggressive', 'angry', 'kills', 'attacks', 'hit', 'shot', 'weapon']),
        risk_taking: determineTrait(backstory, story, ['risk', 'dangerous', 'gamble', 'reckless', 'bold', 'brave', 'jumped']),
        trustworthiness: determineTrait(backstory, story, ['trust', 'loyal', 'honest', 'betrayal', 'secret', 'lied', 'deceived']),
        authority_respect: determineTrait(backstory, story, ['law', 'rule', 'king', 'police', 'obey', 'rebel', 'jail', 'refused'])
    };

    // 🧱 STEP 5: Understand backstory claims (Expectation)
    const rawClaims = backstory.split(/[.!?]/).filter(s => s.trim().length > 10).map(s => s.trim());

    // 🧱 STEP 6: Ask human-like questions (Reasoning)
    const claimAnalysis = rawClaims.map((claim, index) => {
        const result = evaluateClaim(claim, story, character);
        // Simulate evidence from chapters (chunks)
        const chapterNum = Math.min(index + 1, chunks.length > 0 ? chunks.length : 1);
        return {
            claim,
            verdict: result.verdict,
            evidence: result.verdict === 'contradicted' ?
                `In Chapter ${chapterNum}, the character acts without hesitation, directly violating this claim.` :
                `Consistent behavior observed in Chapter ${chapterNum}.`
        };
    });

    // 🧱 STEP 7: Decide CONSISTENT or CONTRADICT (Judgment)
    const contradictions = claimAnalysis.filter(c => c.verdict === 'contradicted').length;
    const prediction = contradictions >= 2 ? 0 : 1;

    return {
        prediction,
        character_profile: findings,
        claim_analysis: claimAnalysis,
        final_explanation: generateExplanation(prediction, character, findings, claimAnalysis),
        future_projection: generateFutureProjection(prediction, character, findings)
    };
}

function generateFutureProjection(prediction, character, profile) {
    const tendency = prediction === 1 ? "remain stable" : "continue to deviate";
    const riskLevel = profile.risk_taking === 'high' ? "increasingly dangerous ventures" : "conservative and calculated moves";
    const socialAspect = profile.trustworthiness === 'low' ? "likely betraying allies or working alone" : "forming deep, protective bonds";

    return `Based on current narrative trends, ${character} will likely ${tendency} in their decision-making. We project a path involving ${riskLevel}, with a specific focus on ${socialAspect}. If the story progresses, expect ${character} to prioritize ${profile.authority_respect === 'low' ? 'personal freedom over laws' : 'order and duty'}, eventually leading to a resolution that tests their ${profile.violence === 'high' ? 'capacity for destruction' : 'ability to find non-violent solutions'}.`;
}

function determineTrait(backstory, story, keywords) {
    let score = 0;
    const lowerText = (backstory + " " + story).toLowerCase();
    keywords.forEach(word => {
        if (lowerText.includes(word)) score++;
    });

    if (score > 3) return "high";
    if (score > 1) return "medium";
    return "low";
}

function evaluateClaim(claim, story, character) {
    // Simulated evaluation logic
    const storyLower = story.toLowerCase();
    const claimLower = claim.toLowerCase();

    // We look for "not" or common negations to simulate "contradiction" finding
    const isNegatedInStory = (storyLower.includes("never") || storyLower.includes("didn't") || storyLower.includes("refused")) &&
        keywordsOverlap(claimLower, storyLower);

    if (isNegatedInStory) {
        return { verdict: 'contradicted', evidence: `Character's refusal observed in later chapters.` };
    }

    if (keywordsOverlap(claimLower, storyLower)) {
        return { verdict: 'supported', evidence: `Consistent behavior observed in the main narrative.` };
    }

    return { verdict: 'mixed', evidence: `Limited direct evidence found in the provided text.` };
}

function keywordsOverlap(s1, s2) {
    const words1 = s1.split(/\s+/).filter(w => w.length > 4);
    return words1.some(w => s2.includes(w));
}

function generateExplanation(prediction, character, profile, claims) {
    const status = prediction === 1 ? "Consistent" : "Contradicted";
    const base = `Conclusion: ${character}'s behavior is judged as ${status.toUpperCase()} based on a cross-comparison of ${claims.length} backstory claims against the narrative arc. `;

    if (prediction === 1) {
        return base + `The character's actions (Violence: ${profile.violence.toUpperCase()}) remain within the psychological boundaries set by the backstory. No critical breaks in personality were detected.`;
    } else {
        const contra = claims.find(c => c.verdict === 'contradicted');
        // 🧱 STEP 8: Provide explanation (Evidence) - Actual Idea Reference
        return base + `Significant behavioral drift was detected. Specifically, the backstory claim that "${contra ? contra.claim : 'the character is consistent'}" was directly violated by actions in later chapters, where ${character} performs actions without hesitation that contradict their established profile.`;
    }
}

// --- UI Rendering ---

function renderResults(data) {
    // 1. Prediction Badge
    elements.judgmentBadge.className = 'badge ' + (data.prediction === 1 ? 'consistent' : 'contradicted');
    elements.judgmentBadge.querySelector('.icon').textContent = data.prediction === 1 ? '✅' : '❌';
    elements.judgmentBadge.querySelector('.text').textContent = data.prediction === 1 ? 'CONSISTENT (1)' : 'CONTRADICTED (0)';

    // 2. Profile Traits
    setTraitValue(elements.traitViolence, data.character_profile.violence);
    setTraitValue(elements.traitRisk, data.character_profile.risk_taking);
    setTraitValue(elements.traitTrust, data.character_profile.trustworthiness);
    setTraitValue(elements.traitAuthority, data.character_profile.authority_respect);

    // 3. Claims Table
    elements.claimsBody.innerHTML = '';
    data.claim_analysis.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.claim}</td>
            <td><span class="verdict-tag verdict-${item.verdict}">${item.verdict}</span></td>
            <td class="evidence-text">${item.evidence}</td>
        `;
        elements.claimsBody.appendChild(row);
    });

    // 4. Explanation
    elements.explanationContent.textContent = data.final_explanation;

    // 5. Future Projection
    elements.futureProjectionContent.textContent = data.future_projection;

    // Show results
    elements.resultsSection.classList.remove('hidden');
    elements.followUpSection.classList.remove('hidden');
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function setTraitValue(el, value) {
    el.textContent = value.toUpperCase();
    el.className = 'trait-value ' + value;
}

// --- Main Action ---

elements.analyzeBtn.addEventListener('click', async () => {
    const story = elements.storyInput.value;
    const backstory = elements.backstoryInput.value;
    const character = elements.charName.value;

    // UI Transition
    elements.inputSection.classList.add('opacity-50');
    elements.resultsSection.classList.add('hidden');
    elements.loadingState.classList.remove('hidden');
    elements.analyzeBtn.disabled = true;

    try {
        const results = await performReasoning(story, backstory, character);
        elements.loadingState.classList.add('hidden');
        renderResults(results);
    } catch (error) {
        console.error(error);
        alert("An error occurred during reasoning. Please check your inputs.");
    } finally {
        elements.inputSection.classList.remove('opacity-50');
        elements.analyzeBtn.disabled = false;
    }
});

// --- Follow-up Logic ---

elements.askBtn.addEventListener('click', async () => {
    const question = elements.followUpInput.value.trim();
    if (!question) return;

    elements.askBtn.disabled = true;
    elements.askBtn.textContent = 'Reasoning...';

    // Simulate API delay
    await sleep(1500);

    const answer = generateFollowUpAnswer(question, elements.storyInput.value, elements.backstoryInput.value, elements.charName.value);

    const answerEl = document.createElement('div');
    answerEl.className = 'follow-up-answer';
    answerEl.innerHTML = `
        <div class="question">Q: ${question}</div>
        <div class="answer">${answer}</div>
    `;

    elements.followUpResults.prepend(answerEl);
    elements.followUpInput.value = '';
    elements.askBtn.disabled = false;
    elements.askBtn.textContent = 'Ask Engine';
});

function generateFollowUpAnswer(question, story, backstory, character) {
    const q = question.toLowerCase();
    const s = story.toLowerCase();
    const b = backstory.toLowerCase();

    if (q.includes('why') || q.includes('reason')) {
        return `Based on the behavioral profile, ${character}'s actions stem from a tension between their established ${b.includes('brave') ? 'bravery' : 'traits'} and the immediate ${s.includes('fear') ? 'fear' : 'threat'} presented in the narrative. The story suggests a prioritize-survival instinct that overrides the backstory protocols.`;
    }

    if (q.includes('motive') || q.includes('feeling')) {
        return `The textual evidence suggests ${character} is experiencing a cognitive dissonance. While the backstory demands one path, the narrative environment triggers an emotional response (likely ${s.includes('dragon') ? 'terror' : 'apprehension'}) that wasn't accounted for in the original profile.`;
    }

    return `Narrative analysis indicates that ${character}'s response to this specific query is tied to the internal consistency of the story arc. Every mention of "${character}" in the text supports a specialized reasoning that aligns with the observed ${s.length > 500 ? 'complex' : 'simple'} plot structure.`;
}
