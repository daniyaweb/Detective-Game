// Section 1: variables and game data
let collectedClues = [];
const totalClues = 5;
let detectiveScore = 0;
let hintsUsed = 0;
const maxHints = 3;
const hintList = [
    "Hint 1: Check the Security Camera Footage and compare the time to what each suspect told you.",
    "Hint 2: The Office Access Log and the camera footage both mention the same time. That is not a coincidence.",
    "Hint 3: The Torn Reminder Note and the Missing Spare Key both point to someone with access to a spare key."
];

let gameIsActive = true;
let selectedSuspect = null;
const correctSuspectId = "suspect-1";
const correctSuspectName = "Sara Khan";

// Section 2: run everything once the page has loaded

document.addEventListener("DOMContentLoaded", function () {

    setupInspectButtons();

    const hintButton = document.getElementById("hint-button");
    hintButton.addEventListener("click", function () {
        showNextHint();
    });

    setupSuspectSelection();

    const arrestButton = document.getElementById("arrest-suspect-button");
    arrestButton.addEventListener("click", function () {
        handleArrest();
    });

    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.addEventListener("click", function () {
        resetGame();
    });

});

// Section 3: smooth scrolling

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function disableAllButtons() {

    const inspectButtons = document.querySelectorAll(".inspect-btn");
    inspectButtons.forEach(function (button) {
        button.disabled = true;
    });

    const suspectRadios = document.querySelectorAll(".accusation-radio");
    suspectRadios.forEach(function (radio) {
        radio.disabled = true;
    });

    const hintButton = document.getElementById("hint-button");
    hintButton.disabled = true;

    const arrestButton = document.getElementById("arrest-suspect-button");
    arrestButton.disabled = true;
}

// Section 5: crime scene investigation (inspect btn)

function setupInspectButtons() {

    const inspectButtons = document.querySelectorAll(".inspect-btn");

    inspectButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (gameIsActive === true) {

                const clueId = button.getAttribute("data-target");
                inspectClue(clueId);
            }
        });
    });
}

function inspectClue(clueId) {

    const clueCard = document.getElementById(clueId);

    const clueTitle = clueCard.querySelector(".clue-title").textContent;
    const clueImageSrc = clueCard.querySelector(".clue-image").src;
    const fullDescription = clueCard.querySelector(".clue-full-description").textContent;

    showOnEvidenceBoard(clueTitle, clueImageSrc, fullDescription);

    if (collectedClues.indexOf(clueId) === -1) {

        collectedClues.push(clueId);

        const clueButton = document.querySelector('.inspect-btn[data-target="' + clueId + '"]');
        clueButton.textContent = "Collected";
        clueButton.disabled = true;
        clueButton.classList.add("collected");

        addToCollectedEvidenceList(clueTitle);

        detectiveScore = detectiveScore + 10;
        updateScoreDisplay();

        updateClueCounter();

        alert("Evidence added to case file: " + clueTitle);

        checkAllCluesFound();
    }

    scrollToSection("evidence-board-section");
}

function showOnEvidenceBoard(title, imageSrc, description) {

    const evidenceTitle = document.getElementById("evidence-title");
    const evidenceDescription = document.getElementById("evidence-description");
    const evidenceImage = document.getElementById("evidence-image");

    evidenceTitle.textContent = title;
    evidenceDescription.textContent = description;
    evidenceImage.src = imageSrc;
    evidenceImage.alt = title;
}

function addToCollectedEvidenceList(clueTitle) {

    const evidenceList = document.getElementById("collected-evidence-list");

    const newItem = document.createElement("li");
    newItem.textContent = clueTitle;
    evidenceList.appendChild(newItem);
}

function updateClueCounter() {

    const cluesFoundCount = document.getElementById("clues-found-count");
    cluesFoundCount.textContent = collectedClues.length + " / " + totalClues;

    const caseFileEvidenceCount = document.getElementById("case-file-evidence-count");
    caseFileEvidenceCount.textContent = collectedClues.length + " of " + totalClues + " items catalogued";
}

function checkAllCluesFound() {

    if (collectedClues.length === totalClues) {

        const caseStatus = document.getElementById("case-status");
        caseStatus.textContent = "Ready for Accusation";

        alert("All evidence collected. The investigation is complete. Time to interview the suspects.");

        scrollToSection("suspect-interviews-section");
    }
}

function updateScoreDisplay() {

    const scoreDisplay = document.getElementById("detective-score");
    scoreDisplay.textContent = detectiveScore;
}

// Section 6: hint system

function showNextHint() {

    if (hintsUsed >= maxHints) {
        return;
    }

    const nextHint = hintList[hintsUsed];

    const hintDisplay = document.getElementById("hint-display");
    hintDisplay.textContent = nextHint;

    hintsUsed = hintsUsed + 1;

    detectiveScore = Math.max(0, detectiveScore - 5);
    updateScoreDisplay();

    if (hintsUsed >= maxHints) {
        const hintButton = document.getElementById("hint-button");
        hintButton.disabled = true;
    }
}

// Section 7: suspect selection

function setupSuspectSelection() {

    const suspectRadios = document.querySelectorAll(".accusation-radio");

    suspectRadios.forEach(function (radio) {

        radio.addEventListener("click", function () {

            selectedSuspect = radio.value;

            document.querySelectorAll(".suspect-card").forEach(function (card) {
                card.classList.remove("selected-suspect");
            });

            const selectedCard = document.getElementById(selectedSuspect);
            selectedCard.classList.add("selected-suspect");

            showSelectedSuspect(selectedSuspect);

            scrollToSection("final-accusation-section");
        });
    });
}

function showSelectedSuspect(suspectId) {

    const suspectCard = document.getElementById(suspectId);
    const suspectName = suspectCard.querySelector(".suspect-name").textContent;

    const selectedSuspectInfo = document.getElementById("selected-suspect-info");
    selectedSuspectInfo.textContent = "Selected Suspect: " + suspectName;
}

// Section 8: arrest btn and results

function handleArrest() {

    if (gameIsActive === false) {
        return;
    }

    if (collectedClues.length < totalClues) {
        alert("You need to collect all 5 clues before making an arrest.");
        return;
    }

    if (selectedSuspect === null) {
        alert("Please choose a suspect before making an arrest.");
        return;
    }
    gameIsActive = false;
    disableAllButtons();

    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.classList.remove("hidden");

    if (selectedSuspect === correctSuspectId) {
        showCaseSolved();
    } else {
        showWrongAccusation();
    }

    showFinalScore();
    showCaseExplanation();
    showInvestigationSummary();

    scrollToSection("result-section");
}

function resetGame() {
    location.reload();
}

function showCaseSolved() {

    const caseStatus = document.getElementById("case-status");
    caseStatus.textContent = "Case Solved";

    const caseSolvedMessage = document.getElementById("case-solved-message");
    caseSolvedMessage.classList.remove("hidden");

    const culpritName = document.getElementById("actual-culprit-name");
    culpritName.textContent = "The culprit was " + correctSuspectName + ".";
    culpritName.classList.remove("hidden");
}

function showWrongAccusation() {

    const caseStatus = document.getElementById("case-status");
    caseStatus.textContent = "Case Closed - Wrong Suspect Accused";

    const wrongMessage = document.getElementById("wrong-accusation-message");
    wrongMessage.classList.remove("hidden");

    const culpritName = document.getElementById("actual-culprit-name");
    culpritName.textContent = "The real culprit was " + correctSuspectName + ".";
    culpritName.classList.remove("hidden");
}

function showFinalScore() {

    const finalScoreBox = document.getElementById("final-detective-score");
    const finalScoreValue = document.getElementById("final-score-value");

    finalScoreValue.textContent = detectiveScore;
    finalScoreBox.classList.remove("hidden");
}

function showCaseExplanation() {

    const caseExplanation = document.getElementById("case-explanation");

    caseExplanation.textContent = "Sara Khan said she left before 6 PM and never came back. " +
        "But the Security Camera Footage and the Office Access Log both show someone re-entering " +
        "the building at around 9:40 PM using a keycard. The Torn Reminder Note and the Missing " +
        "Spare Key both point to the same person, since the spare key is normally only used by " +
        "teaching staff. Her statement does not match the evidence, which is what gave her away.";

    caseExplanation.classList.remove("hidden");
}

function showInvestigationSummary() {

    const summaryPanel = document.getElementById("investigation-summary-panel");

    const keyEvidence = document.getElementById("summary-key-evidence");
    keyEvidence.textContent = "Security Camera Footage, Office Access Log, Torn Reminder Note, and the Missing Spare Key.";

    const contradiction = document.getElementById("summary-contradiction");
    contradiction.textContent = "Sara Khan claimed she never came back after 6 PM, but the access log and camera footage both place someone back in the building at 9:40 PM.";

    const outcome = document.getElementById("summary-outcome");

    if (selectedSuspect === correctSuspectId) {
        outcome.textContent = "Correct suspect accused. Case closed successfully.";
    } else if (selectedSuspect === null) {
        outcome.textContent = "No suspect was accused before time ran out.";
    } else {
        outcome.textContent = "Incorrect suspect accused. The real culprit was " + correctSuspectName + ".";
    }

    summaryPanel.classList.remove("hidden");
}

