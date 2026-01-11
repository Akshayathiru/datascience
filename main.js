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
    claimsBody: document.getElementById('claims-body'),
    traitViolence: document.getElementById('trait-violence'),
    traitRisk: document.getElementById('trait-risk'),
    traitTrust: document.getElementById('trait-trust'),
    traitAuthority: document.getElementById('trait-authority'),
    inputSection: document.querySelector('.input-section')
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

// --- Core Reasoning Engine (Simulated) ---

async function performReasoning(story, backstory, character) {
    // 1. Initial Processing
    updateLoadingText("Extracting narrative timeline and character events...");
    await sleep(1500);

    // 2. Behavioral Mapping
    updateLoadingText(`Mapping behavioral patterns for ${character}...`);
    await sleep(2000);

    // 3. Claim Extraction
    updateLoadingText("Isolating claims from backstory profile...");
    await sleep(1500);

    // 4. Evidence Comparison
    updateLoadingText("Cross-referencing claims with story evidence...");
    await sleep(2000);

    // 5. Final Synthesis
    updateLoadingText("Generating final consistency judgment...");
    await sleep(1000);

    return simulateAnalysis(story, backstory, character);
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

function simulateAnalysis(story, backstory, character) {
    // In a real app, this would be an API call to a reasoning model.
    // Here we simulate the reasoning logic described in the requirements.

    const findings = {
        violence: determineTrait(backstory, story, ['violent', 'aggressive', 'angry', 'kills', 'attacks']),
        risk_taking: determineTrait(backstory, story, ['risk', 'dangerous', 'gamble', 'reckless', 'bold']),
        trustworthiness: determineTrait(backstory, story, ['trust', 'loyal', 'honest', 'betrayal', 'secret']),
        authority_respect: determineTrait(backstory, story, ['law', 'rule', 'king', 'police', 'obey', 'rebel'])
    };

    // Extract claims (for demo, we split backstory by sentences)
    const rawClaims = backstory.split(/[.!?]/).filter(s => s.trim().length > 10).map(s => s.trim());

    // Evaluate claims
    const claimAnalysis = rawClaims.map(claim => {
        const result = evaluateClaim(claim, story, character);
        return {
            claim,
            verdict: result.verdict,
            evidence: result.evidence
        };
    });

    // Final Prediction Rule: If 2+ strong contradictions -> 0, else 1
    const contradictions = claimAnalysis.filter(c => c.verdict === 'contradicted').length;
    const prediction = contradictions >= 2 ? 0 : 1;

    return {
        prediction,
        character_profile: findings,
        claim_analysis: claimAnalysis,
        final_explanation: generateExplanation(prediction, character, findings, claimAnalysis)
    };
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
    const base = `After deep narrative analysis, ${character}'s behavior in the story is judged as ${status.toUpperCase()} with their established backstory. `;

    if (prediction === 1) {
        return base + `The character maintains their core traits of being ${profile.trustworthiness} in trustworthiness and displaying ${profile.risk_taking} levels of risk-taking throughout the events. Most importantly, major claims from the backstory were echoed in their decisions during the story climax.`;
    } else {
        const reasons = claims.filter(c => c.verdict === 'contradicted').map(c => c.claim);
        return base + `Significant behavioral drift was detected. Specifically, the backstory claim that "${reasons[0] || 'the character is consistent'}" was directly violated by actions in the story. These contradictions reflect a fundamental break from the character's established psychological profile.`;
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

    // Show results
    elements.resultsSection.classList.remove('hidden');
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
