// Define the effects and their base probabilities (now as decimals)
const effects = {
    "Increase Element Damage Dealt": 0.10,
    "Increase Hit Rate": 0.12,
    "Increase Max Ammunition Capacity": 0.12,
    "Increase ATK": 0.10,
    "Increase Charge Damage": 0.12,
    "Increase Charge Speed": 0.12,
    "Increase Critical Rate": 0.12,
    "Increase Critical Damage": 0.10,
    "Increase DEF": 0.10
};

// Slot probabilities (now as decimals)
const slotProbabilities = [1.0, 0.5, 0.3];

const tierData = {
    "Increase Element Damage Dealt": {
        1: { percentage: 9.54, probability: 0.12 },
        2: { percentage: 10.94, probability: 0.12 },
        3: { percentage: 12.34, probability: 0.12 },
        4: { percentage: 13.75, probability: 0.12 },
        5: { percentage: 15.15, probability: 0.12 },
        6: { percentage: 16.55, probability: 0.07 },
        7: { percentage: 17.95, probability: 0.07 },
        8: { percentage: 19.35, probability: 0.07 },
        9: { percentage: 20.75, probability: 0.07 },
        10: { percentage: 22.15, probability: 0.07 },
        11: { percentage: 23.56, probability: 0.01 },
        12: { percentage: 24.96, probability: 0.01 },
        13: { percentage: 26.36, probability: 0.01 },
        14: { percentage: 27.76, probability: 0.01 },
        15: { percentage: 29.16, probability: 0.01 }
    },
    "Increase Hit Rate": {
        1: { percentage: 4.77, probability: 0.12 },
        2: { percentage: 5.47, probability: 0.12 },
        3: { percentage: 6.18, probability: 0.12 },
        4: { percentage: 6.88, probability: 0.12 },
        5: { percentage: 7.59, probability: 0.12 },
        6: { percentage: 8.29, probability: 0.07 },
        7: { percentage: 9.00, probability: 0.07 },
        8: { percentage: 9.70, probability: 0.07 },
        9: { percentage: 10.40, probability: 0.07 },
        10: { percentage: 11.11, probability: 0.07 },
        11: { percentage: 11.81, probability: 0.01 },
        12: { percentage: 12.52, probability: 0.01 },
        13: { percentage: 13.22, probability: 0.01 },
        14: { percentage: 13.93, probability: 0.01 },
        15: { percentage: 14.63, probability: 0.01 }
    },
    // Continue with other effects...
};

// Variable to store the current results
let currentResults = ["", "", ""];

// Function to calculate remaining effects and their probabilities for a specific slot
function calculateRemainingEffects(availableEffects, slotProb) {
    const totalProb = Object.values(availableEffects).reduce((a, b) => a + b, 0);  // Sum of all effect probabilities
    return Object.keys(availableEffects).map(effect => {
        const probability = ((availableEffects[effect] / totalProb) * slotProb * 100).toFixed(2);  // Adjusted for the slot probability
        return { effect, probability };
    });
}

// Function to update the display of remaining effects for a slot
function displayRemainingEffects(availableEffects, slotId, slotProb) {
    const effectsList = document.getElementById(slotId);
    effectsList.innerHTML = ""; // Clear previous list

    const remainingEffects = calculateRemainingEffects(availableEffects, slotProb);
    remainingEffects.forEach(({ effect, probability }) => {
        const effectLine = document.createElement('div');
        effectLine.className = "effect-line";
        effectLine.innerHTML = `<span>${effect}</span><span>${probability}%</span>`;
        effectsList.appendChild(effectLine);
    });
}

// Function to simulate rolling for one slot with adjusted probabilities
function rollSlot(availableEffects) {
    const totalProb = Object.values(availableEffects).reduce((a, b) => a + b, 0);  // Sum of probabilities
    const roll = Math.random() * totalProb;
    let cumulative = 0;
    for (const [effect, prob] of Object.entries(availableEffects)) {
        cumulative += prob;
        if (roll <= cumulative) {
            return effect;
        }
    }
}

// Function to simulate the rolling for all slots
function runSimulation() {
    let availableEffects = {...effects};

    // Remove locked effects from the pool
    for (let i = 0; i < currentResults.length; i++) {
        const lockCheckbox = document.getElementById(`lockSlot${i + 1}`);
        if (lockCheckbox && lockCheckbox.checked && currentResults[i]) {
            delete availableEffects[currentResults[i]];  // Remove locked effects
        }
    }

    for (let i = 0; i < slotProbabilities.length; i++) {
        const lockCheckbox = document.getElementById(`lockSlot${i + 1}`);

        if (lockCheckbox && lockCheckbox.checked) {
            // Skip rolling if the slot is locked
            document.getElementById(`result-slot${i + 1}`).textContent = `Slot ${i + 1}: ${currentResults[i]}`;
        } else {
            // Proceed with rolling if the slot is not locked
            if (Math.random() <= slotProbabilities[i]) {
                const effect = rollSlot(availableEffects);
                currentResults[i] = effect; // Store the result
                delete availableEffects[effect];  // Remove effect from available effects
            } else {
                currentResults[i] = "";  // Clear the result if no effect is rolled
            }
            document.getElementById(`result-slot${i + 1}`).textContent = `Slot ${i + 1}: ${currentResults[i] || "No Effect"}`;
        }

        // Update the remaining effects list for each slot
        displayRemainingEffects(availableEffects, `effects-slot${i + 1}`, slotProbabilities[i]);
    }
}

// Event listener for the roll button
document.getElementById('rollButton').addEventListener('click', runSimulation);

// Initialize the remaining effects display for each slot
