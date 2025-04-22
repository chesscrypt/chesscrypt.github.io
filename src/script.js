let currentLanguage = 'de'; // Default language
const supportedLanguages = ['en', 'de'];
let translations = {};

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const languageSelect = document.getElementById('languageSelect')
    const fileInput = document.getElementById('fileInput');
    const loadButton = document.getElementById('loadButton');
    const errorContainer = document.getElementById('errorContainer');
    const quizContainer = document.getElementById('quizContainer');
    const jsonOutput = document.getElementById('jsonOutput');
    const toggleJsonButton = document.getElementById('toggleJsonButton');
    const jsonViewContainer = document.getElementById('jsonViewContainer');
    
    // Quiz Elements
    const quizTitle = document.getElementById('quizTitle');
    const quizDescription = document.getElementById('quizDescription');
    const totalCategories = document.getElementById('totalCategories');
    const totalQuestions = document.getElementById('totalQuestions');
    const maxPerCategory = document.getElementById('maxPerCategory');
    const categoryList = document.getElementById('categoryList');
    const selectedQuestionsList = document.getElementById('selectedQuestionsList');
    const selectedCount = document.getElementById('selectedCount');
    const resetSelectionsButton = document.getElementById('resetSelectionsButton');
    const startQuizButton = document.getElementById('startQuizButton');
    const selectionControls = document.getElementById('selectionControls');
    const quizPlayContainer = document.createElement('div');
    quizPlayContainer.id = 'quizPlayContainer';
    quizPlayContainer.className = 'quiz-play-container hidden';
    const quizResultsContainer = document.createElement('div');
    quizResultsContainer.id = 'quizResultsContainer';
    quizResultsContainer.className = 'quiz-results-container hidden';

    // Application State
    let quizData = null;
    let selectedQuestions = {};

    let currentQuizQuestions = [];
    let currentQuestionIndex = 0;
    let userScore = 0;
    let quizStartTime = null;
    let quizTimerId = null;
    let questionStartTime = null;
    let timerAnimationFrame = null;
    let questionResults = [];
    
    // Event Listeners
    loadButton.addEventListener('click', function(){document.getElementById('fileInput').click()});
    fileInput.addEventListener('change', loadQuizData)
    toggleJsonButton.addEventListener('click', toggleJsonView);
    resetSelectionsButton.addEventListener('click', resetSelections);
    startQuizButton.addEventListener('click', startQuiz);
    document.body.appendChild(quizPlayContainer);
    document.body.appendChild(quizResultsContainer);
    
    updateLanguageSelector();
    loadTranslations();
    updateUILanguage();

    function updateLanguageSelector() {
        // Add language options
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'de', name: 'Deutsch' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            option.selected = lang.code === currentLanguage;
            languageSelect.appendChild(option);
        });
        
        // Add event listener for language change
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
            loadTranslations().then(() => {
                // Update the UI with new language
                updateUILanguage();
            });
        });
    }
    
    async function loadTranslations() {
        try {
            // In a real app, you'd load these from separate files
            // For this example, we'll define them inline
            translations = {
                'en': {
                    // General UI
                    'appTitle': 'Quiztopia',
                    'appSubtitle': 'A Quiz for Kids!',
                    'loadButton': 'Load Quiz',
                    'showJsonButton': 'Show Raw JSON',
                    'hideJsonButton': 'Hide Raw JSON',
                    'jsonDataView': 'JSON Data View',
                    
                    // Selection screen
                    'selectedQuestionsTitle': 'Selected Questions',
                    'resetSelectionsButton': 'Reset Selections',
                    'startQuizButton': 'Start Quiz',
                    'maxPerCategory': 'Max {0} per category',
                    'selectedCount': '({0}/{1})',
                    'totalCategories': '{0} categories',
                    'totalQuestions': '{0} questions',
                    
                    // Error messages
                    'errorSelectFile': 'Please select a file first.',
                    'errorValidJson': 'Please select a valid JSON file.',
                    'errorReadingFile': 'Error reading file.',
                    'errorParsingJson': 'Failed to parse or validate quiz JSON: {0}',
                    'errorInvalidFormat': 'Invalid quiz format. Missing required properties.',
                    'errorEmptyCategories': 'Quiz must have at least one category.',
                    'errorInvalidCategory': 'Invalid category format in category "{0}".',
                    'errorEmptyQuestions': 'Category "{0}" has no questions.',
                    'errorMaxSelection': 'Maximum {0} questions can be selected from each category.',
                    'errorMinSelection': 'Please select at least one question to start the quiz.',
                    
                    // Quiz play UI
                    'questionNumber': 'Question {0}/{1}',
                    'scoreLabel': 'Score: {0}',
                    'timerLabel': 'Time: {0}s',
                    'nextQuestionButton': 'Next Question',
                    'correctAnswer': 'Correct! +{0} points',
                    'incorrectAnswer': 'Incorrect!',
                    'timeUp': 'Time\'s up!',
                    
                    // Results screen
                    'quizResults': 'Quiz Results',
                    'totalScoreLabel': 'Total Score',
                    'accuracyLabel': 'Accuracy',
                    'timeLabel': 'Time',
                    'timeFormat': '{0}m {1}s',
                    'questionResults': 'Question Results',
                    'correctResult': 'Correct (+{0} pts)',
                    'incorrectResult': 'Incorrect',
                    'returnToSelectionButton': 'Return to Quiz Selection',
                    'restartQuizButton': 'Restart Quiz'
                },
                'de': {
                    // General UI
                    'appTitle': 'Quiztopia',
                    'appSubtitle': 'Ein Quiz für Kinder!',
                    'loadButton': 'Quiz laden',
                    'showJsonButton': 'JSON-Daten anzeigen',
                    'hideJsonButton': 'JSON-Daten ausblenden',
                    'jsonDataView': 'JSON-Datenansicht',
                    
                    // Selection screen
                    'selectedQuestionsTitle': 'Ausgewählte Fragen',
                    'resetSelectionsButton': 'Auswahl zurücksetzen',
                    'startQuizButton': 'Quiz starten',
                    'maxPerCategory': 'Max. {0} pro Kategorie',
                    'selectedCount': '({0}/{1})',
                    'totalCategories': '{0} Kategorien',
                    'totalQuestions': '{0} Fragen',
                    
                    // Error messages
                    'errorSelectFile': 'Bitte wähle zuerst eine Datei aus.',
                    'errorValidJson': 'Bitte wähle eine gültige JSON-Datei aus.',
                    'errorReadingFile': 'Fehler beim Lesen der Datei.',
                    'errorParsingJson': 'Fehler beim Parsen oder Validieren der Quiz-JSON: {0}',
                    'errorInvalidFormat': 'Ungültiges Quiz-Format. Erforderliche Eigenschaften fehlen.',
                    'errorEmptyCategories': 'Quiz muss mindestens eine Kategorie haben.',
                    'errorInvalidCategory': 'Ungültiges Kategorieformat in Kategorie "{0}".',
                    'errorEmptyQuestions': 'Kategorie "{0}" hat keine Fragen.',
                    'errorMaxSelection': 'Maximal {0} Fragen können aus jeder Kategorie ausgewählt werden.',
                    'errorMinSelection': 'Bitte wähle mindestens eine Frage aus, um das Quiz zu starten.',
                    
                    // Quiz play UI
                    'questionNumber': 'Frage {0}/{1}',
                    'scoreLabel': 'Punkte: {0}',
                    'timerLabel': 'Zeit: {0}s',
                    'nextQuestionButton': 'Nächste Frage',
                    'correctAnswer': 'Richtig! +{0} Punkte',
                    'incorrectAnswer': 'Falsch!',
                    'timeUp': 'Zeit abgelaufen!',
                    
                    // Results screen
                    'quizResults': 'Quiz-Ergebnisse',
                    'totalScoreLabel': 'Gesamtpunktzahl',
                    'accuracyLabel': 'Genauigkeit',
                    'timeLabel': 'Zeit',
                    'timeFormat': '{0}m {1}s',
                    'questionResults': 'Fragenergebnisse',
                    'correctResult': 'Richtig (+{0} Pkt)',
                    'incorrectResult': 'Falsch',
                    'returnToSelectionButton': 'Zurück zur Auswahl',
                    'restartQuizButton': 'Quiz neu starten'
                }
            };
            
            return true;
        } catch (error) {
            console.error('Error loading translations:', error);
            return false;
        }
    }
    
    function updateUILanguage() {
        // Update static UI elements
        document.querySelector('header p').textContent = getText('appTitle');
        document.querySelector('header p[role="doc-subtitle"]').textContent = getText('appSubtitle');
        document.getElementById('loadButton').textContent = getText('loadButton');

        // Update dynamic elements if they exist
        if (!document.getElementById('jsonViewContainer').classList.contains('hidden')) {
            document.querySelector('#jsonViewContainer h3').textContent = getText('jsonDataView');
            const jsonButton = document.getElementById('toggleJsonButton');
            jsonButton.textContent = jsonButton.textContent.includes('Show') ? 
                getText('showJsonButton') : getText('hideJsonButton');
        }

        // Update quiz selection UI if visible
        if (!document.getElementById('quizContainer').classList.contains('hidden')) {
            document.querySelector('#selectedQuestions h3').textContent = 
                getText('selectedQuestionsTitle');  + ' ' + selectedCount.textContent;

            const resetButton = document.getElementById('resetSelectionsButton');
            if (resetButton) resetButton.textContent = getText('resetSelectionsButton');
            
            const startButton = document.getElementById('startQuizButton');
            if (startButton) startButton.textContent = getText('startQuizButton');
            
            // Update category selection counts
            if (quizData) {
                quizData.categories.forEach(category => {
                    updateCategorySelectionCount(category.id);
                });
            }
            
            // Update quiz metadata
            if (quizData) {
                const maxPerCategory = document.getElementById('maxPerCategory');
                if (maxPerCategory) {
                    const max = quizData.maxQuestionsPerCategory || 0;
                    maxPerCategory.textContent = getText('maxPerCategory', [max]);
                }
                
                const totalCategories = document.getElementById('totalCategories');
                if (totalCategories) {
                    totalCategories.textContent = getText('totalCategories', [quizData.categories.length]);
                }
                
                const totalQuestions = document.getElementById('totalQuestions');
                if (totalQuestions) {
                    let questionCount = 0;
                    quizData.categories.forEach(category => {
                        questionCount += category.questions.length;
                    });
                    totalQuestions.textContent = getText('totalQuestions', [questionCount]);
                }
            }
        }

        // Update quiz play UI if visible
        if (!document.getElementById('quizPlayContainer').classList.contains('hidden')) {
            updateQuizPlayLanguage();
        }
        
        // Update results UI if visible
        if (!document.getElementById('quizResultsContainer').classList.contains('hidden')) {
            updateResultsLanguage();
        }
    }
    
    function updateQuizPlayLanguage() {
        const currentQuestion = currentQuestionIndex + 1;
        const totalQuestions = currentQuizQuestions.length;
        
        // Update progress text
        document.querySelector('.progress-text').textContent = 
            getText('questionNumber', [currentQuestion, totalQuestions]);
        
        // Update score and timer labels
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = getText('scoreLabel', [userScore]);
        }
        
        const timerElement = document.getElementById('questionTimer');
        if (timerElement) {
            const timeRemaining = document.getElementById('timeRemaining').textContent;
            timerElement.textContent = getText('timerLabel', [timeRemaining]);
        }
        
        // Update next button text
        const nextButton = document.getElementById('nextQuestionButton');
        if (nextButton) {
            nextButton.textContent = getText('nextQuestionButton');
        }
        
        // Update feedback text if visible
        const feedbackElement = document.getElementById('answerFeedback');
        if (feedbackElement && !feedbackElement.classList.contains('hidden')) {
            const correctFeedback = feedbackElement.querySelector('.correct-feedback');
            if (correctFeedback) {
                const points = correctFeedback.querySelector('p').textContent.match(/\+(\d+)/)[1];
                correctFeedback.querySelector('p').textContent = getText('correctAnswer', [points]);
            }
            
            const wrongFeedback = feedbackElement.querySelector('.wrong-feedback');
            if (wrongFeedback) {
                if (wrongFeedback.querySelector('p').textContent.includes('Time')) {
                    wrongFeedback.querySelector('p').textContent = getText('timeUp');
                } else {
                    wrongFeedback.querySelector('p').textContent = getText('incorrectAnswer');
                }
            }
        }
    }
    
    function updateResultsLanguage() {
        // Update results header
        document.querySelector('.results-header h2').textContent = getText('quizResults');
        
        // Update summary labels
        const summaryLabels = document.querySelectorAll('.summary-label');
        summaryLabels[0].textContent = getText('totalScoreLabel');
        summaryLabels[1].textContent = getText('accuracyLabel');
        summaryLabels[2].textContent = getText('timeLabel');
        
        // Update time format
        const timeValue = document.querySelectorAll('.summary-value')[2];
        const timeMatch = timeValue.textContent.match(/(\d+)m\s+(\d+)s/);
        if (timeMatch) {
            const minutes = timeMatch[1];
            const seconds = timeMatch[2];
            timeValue.textContent = getText('timeFormat', [minutes, seconds]);
        }
        
        // Update results details
        document.querySelector('.results-details h3').textContent = getText('questionResults');
        
        // Update result items
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            const status = item.querySelector('.result-status');
            if (status.textContent.includes('Correct')) {
                const points = status.textContent.match(/\+(\d+)/)[1];
                status.innerHTML = `<span class="check-icon">✓</span> ${getText('correctResult', [points])}`;
            } else {
                status.innerHTML = `<span class="x-icon">✗</span> ${getText('incorrectResult')}`;
            }
        });
        
        // Update action buttons
        document.getElementById('returnToSelectionButton').textContent = getText('returnToSelectionButton');
        document.getElementById('restartQuizButton').textContent = getText('restartQuizButton');
    }
    
    // Helper function to get translated text with placeholders
    function getText(key, params = []) {
        let text = translations[currentLanguage][key] || key;
        
        // Replace placeholders {0}, {1}, etc. with provided parameters
        params.forEach((param, index) => {
            text = text.replace(`{${index}}`, param);
        });
        
        return text;
    }

    function loadQuizData() {
        if (!fileInput.files.length) {
            showError('errorSelectFile');
            return;
        }
        
        const file = fileInput.files[0];
        if (!file.type.match('application/json') && !file.name.endsWith('.json')) {
            showError('errorValidJson');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                quizData = JSON.parse(e.target.result);
                validateQuizData(quizData);
                resetSelections();
                renderQuizApp();
                hideError();
                quizContainer.classList.remove('hidden');
                jsonViewContainer.classList.remove('hidden');
                jsonOutput.textContent = JSON.stringify(quizData, null, 2);
                updateUILanguage();
            } catch (error) {
                showError('errorParsingJson', [error.message]);
                quizContainer.classList.add('hidden');
                jsonViewContainer.classList.add('hidden');
            }
        };
        
        reader.onerror = function() {
            showError('errorReadingFile');
            quizContainer.classList.add('hidden');
            jsonViewContainer.classList.add('hidden');
        };
        
        reader.readAsText(file);
    }
    
    function validateQuizData(data) {
        // Basic validation to ensure the JSON has the expected structure
        if (!data.quizTitle || !data.categories || !Array.isArray(data.categories)) {
            throw new Error(getText('errorInvalidFormat'));
        }
        
        // Check if at least one category exists
        if (data.categories.length === 0) {
            throw new Error(getText('errorEmptyCategories'));
        }
        
        // Make sure each category has questions
        for (const category of data.categories) {
            if (!category.id || !category.name || !category.questions || !Array.isArray(category.questions)) {
                throw new Error(getText('errorInvalidCategory', [category.name || 'unknown']));
            }
            
            if (category.questions.length === 0) {
                throw new Error(getText('errorEmptyQuestions', [category.name]));
            }
        }
    }
    
    function renderQuizApp() {
        // Render quiz header info
        quizTitle.textContent = quizData.quizTitle;
        quizDescription.textContent = quizData.quizDescription;
        
        // Count total questions
        let questionCount = 0;
        quizData.categories.forEach(category => {
            questionCount += category.questions.length;
        });

        // Show translated metadata
        totalCategories.textContent = getText('totalCategories', [quizData.categories.length]);
        totalQuestions.textContent = getText('totalQuestions', [questionCount]);

        // Show max questions per category
        const max = quizData.maxQuestionsPerCategory || 0;
        maxPerCategory.textContent = getText('maxPerCategory', [max]);
        
        // Render categories and questions
        renderCategories();
        updateSelectedQuestionsDisplay();
    }
    
    function renderCategories() {
        categoryList.innerHTML = '';
        
        quizData.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            
            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            
            const categoryInfo = document.createElement('div');
            categoryInfo.className = 'category-info';
            
            const categoryName = document.createElement('span');
            categoryName.className = 'category-name';
            categoryName.textContent = category.name;
            
            const categoryDescription = document.createElement('span');
            categoryDescription.className = 'category-description';
            categoryDescription.textContent = category.description;
            
            categoryInfo.appendChild(categoryName);
            categoryInfo.appendChild(categoryDescription);
            
            const selectionCount = document.createElement('span');
            selectionCount.className = 'selection-count';
            selectionCount.id = `count-${category.id}`;
            selectionCount.textContent = `0/${quizData.maxQuestionsPerCategory} selected`;
            
            categoryHeader.appendChild(categoryInfo);
            categoryHeader.appendChild(selectionCount);
            
            // Create questions list
            const questionsContainer = document.createElement('div');
            questionsContainer.className = 'category-questions';
            
            category.questions.forEach(question => {
                const questionItem = document.createElement('div');
                questionItem.className = 'question-item';
                
                const questionText = document.createElement('div');
                questionText.className = 'question-text';
                questionText.textContent = question.text;
                
                // Add difficulty badge
                const difficultyBadge = document.createElement('span');
                difficultyBadge.className = `difficulty ${question.difficulty}`;
                difficultyBadge.textContent = question.difficulty;
                questionText.appendChild(difficultyBadge);
                
                const questionCheckbox = document.createElement('div');
                questionCheckbox.className = 'question-checkbox';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `question-${question.id}`;
                checkbox.dataset.categoryId = category.id;
                checkbox.dataset.questionId = question.id;
                
                checkbox.addEventListener('change', function() {
                    handleQuestionSelection(this, category.id, question.id);
                });
                
                questionCheckbox.appendChild(checkbox);
                
                questionItem.appendChild(questionText);
                questionItem.appendChild(questionCheckbox);
                questionsContainer.appendChild(questionItem);
            });
            
            categoryCard.appendChild(categoryHeader);
            categoryCard.appendChild(questionsContainer);
            categoryList.appendChild(categoryCard);
        });
    }
    
    function handleQuestionSelection(checkbox, categoryId, questionId) {
        // Initialize category in selected questions if not exists
        if (!selectedQuestions[categoryId]) {
            selectedQuestions[categoryId] = [];
        }
        
        const maxSelectionsPerCategory = quizData.maxQuestionsPerCategory || 3;
        
        if (checkbox.checked) {
            // Check if max questions per category limit is reached
            if (selectedQuestions[categoryId].length >= maxSelectionsPerCategory) {
                checkbox.checked = false;
                showError('errorMaxSelection', [maxSelectionsPerCategory]);
                return;
            }
            
            // Find the question from the quiz data
            const category = quizData.categories.find(c => c.id === categoryId);
            const question = category.questions.find(q => q.id === questionId);
            
            // Store reference to the selected question
            selectedQuestions[categoryId].push({
                id: questionId,
                text: question.text,
                difficulty: question.difficulty,
                categoryName: category.name
            });
        } else {
            // Remove question from selected questions
            selectedQuestions[categoryId] = selectedQuestions[categoryId].filter(q => q.id !== questionId);
            
            // If no questions left in this category, delete the category key
            if (selectedQuestions[categoryId].length === 0) {
                delete selectedQuestions[categoryId];
            }
        }
        
        // Update selection count display
        updateCategorySelectionCount(categoryId);
        updateSelectedQuestionsDisplay();
    }
    
    function updateCategorySelectionCount(categoryId) {
        const countElement = document.getElementById(`count-${categoryId}`);
        // Add null check to prevent error
        if (countElement) {
            const selectedCount = selectedQuestions[categoryId] ? selectedQuestions[categoryId].length : 0;
            countElement.textContent = `${selectedCount}/${quizData.maxQuestionsPerCategory} ${currentLanguage === 'de' ? 'ausgewählt' : 'selected'}`;

            // Disable checkboxes if maximum is reached
            const categoryCheckboxes = document.querySelectorAll(`input[data-category-id="${categoryId}"]`);
            
            categoryCheckboxes.forEach(checkbox => {
                if (!checkbox.checked && selectedCount >= quizData.maxQuestionsPerCategory) {
                    checkbox.disabled = true;
                    checkbox.parentElement.classList.add('checkbox-disabled');
                } else {
                    checkbox.disabled = false;
                    checkbox.parentElement.classList.remove('checkbox-disabled');
                }
            });
        }
    }
    
    function updateSelectedQuestionsDisplay() {
        selectedQuestionsList.innerHTML = '';
        let totalSelected = 0;
        
        // Loop through all selected questions and create UI elements
        for (const categoryId in selectedQuestions) {
            selectedQuestions[categoryId].forEach(question => {
                totalSelected++;
                
                const questionItem = document.createElement('div');
                questionItem.className = 'selected-question-item';
                
                const categoryTag = document.createElement('div');
                categoryTag.className = 'category-tag';
                categoryTag.textContent = question.categoryName;
                
                const questionText = document.createElement('div');
                questionText.textContent = question.text;
                
                const difficultyBadge = document.createElement('span');
                difficultyBadge.className = `difficulty ${question.difficulty}`;
                difficultyBadge.textContent = question.difficulty;
                questionText.appendChild(difficultyBadge);
                
                const removeButton = document.createElement('button');
                removeButton.className = 'remove-question';
                removeButton.innerHTML = '&times;';
                removeButton.addEventListener('click', function() {
                    removeSelectedQuestion(categoryId, question.id);
                });
                
                questionItem.appendChild(categoryTag);
                questionItem.appendChild(questionText);
                questionItem.appendChild(removeButton);
                
                selectedQuestionsList.appendChild(questionItem);
            });
        }
        
        // Update the count display and controls visibility
        const totalPossible = quizData ? quizData.categories.length * quizData.maxQuestionsPerCategory : 0;
        selectedCount.textContent = getText('selectedCount', [totalSelected, totalPossible]);

        // Update heading
        const heading = document.querySelector('#selectedQuestions h3');
        heading.textContent = getText('selectedQuestionsTitle') + ' ' + selectedCount.textContent;
        
        if (totalSelected > 0) {
            selectionControls.classList.remove('hidden');
            // Update button text
            document.getElementById('startQuizButton').textContent = getText('startQuizButton');
            document.getElementById('resetSelectionsButton').textContent = getText('resetSelectionsButton');
        } else {
            selectionControls.classList.add('hidden');
        }
    }
    
    function removeSelectedQuestion(categoryId, questionId) {
        // Uncheck the corresponding checkbox
        const checkbox = document.getElementById(`question-${questionId}`);
        if (checkbox) {
            checkbox.checked = false;
        }
        
        // Remove from selected questions
        selectedQuestions[categoryId] = selectedQuestions[categoryId].filter(q => q.id !== questionId);
        
        // If category is empty, remove it
        if (selectedQuestions[categoryId].length === 0) {
            delete selectedQuestions[categoryId];
        }
        
        // Update UI
        updateCategorySelectionCount(categoryId);
        updateSelectedQuestionsDisplay();
        hideError();
    }
    
    function resetSelections() {
        // Clear selected questions
        selectedQuestions = {};
        
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
            if (checkbox.parentElement) {
                checkbox.parentElement.classList.remove('checkbox-disabled');
            }
        });
        
        // Update UI
        if (quizData) {
            quizData.categories.forEach(category => {
                updateCategorySelectionCount(category.id);
            });
        }
        
        updateSelectedQuestionsDisplay();
        hideError();
    }
    
    function startQuiz() {
        // Count selected questions
        let totalSelected = 0;
        for (const categoryId in selectedQuestions) {
            totalSelected += selectedQuestions[categoryId].length;
        }
        
        if (totalSelected === 0) {
            showError('errorMinSelection');
            return;
        }
        
        // Prepare quiz questions from selected questions
        prepareQuizQuestions();
        
        // Hide quiz selection UI and show quiz play UI
        quizContainer.classList.add('hidden');
        
        // Initialize and show quiz interface
        initializeQuizInterface();
    }

    function prepareQuizQuestions() {
        currentQuizQuestions = [];
        
        // Collect all selected questions with their full data
        for (const categoryId in selectedQuestions) {
            selectedQuestions[categoryId].forEach(selectedQuestion => {
                // Find the category and question in the original data
                const category = quizData.categories.find(c => c.id === categoryId);
                const fullQuestion = category.questions.find(q => q.id === selectedQuestion.id);
                
                // Add the full question data to our quiz questions
                currentQuizQuestions.push({
                    ...fullQuestion,
                    categoryId: categoryId,
                    categoryName: category.name
                });
            });
        }
        
        // Shuffle the questions for a more dynamic quiz experience
        shuffleArray(currentQuizQuestions);
        
        // Reset quiz state
        currentQuestionIndex = 0;
        userScore = 0;
        questionResults = [];
        quizStartTime = Date.now();
    }
    
    function initializeQuizInterface() {
        loadButton.classList.add('hidden');

        // Create quiz play UI structure
        quizPlayContainer.innerHTML = `
            <div class="quiz-header">
                <h2>${quizData.quizTitle}</h2>
                <div class="quiz-progress">
                    <div class="progress-text">${getText('questionNumber', [1, currentQuizQuestions.length])}</div>
                    <div class="progress-bar-container">
                        <div id="progressBar" class="progress-bar" style="width: ${(1/currentQuizQuestions.length*100)}%"></div>
                    </div>
                </div>
                <div class="quiz-stats">
                    <div class="score">${getText('scoreLabel', [0])}</div>
                    <div class="timer" id="questionTimer">${getText('timerLabel', [0])}</div>
                </div>
            </div>
            
            <div id="questionContainer" class="question-container">
                <!-- Question content will be inserted here -->
            </div>
            
            <div class="quiz-controls">
                <button id="nextQuestionButton" class="hidden">${getText('nextQuestionButton')}</button>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('nextQuestionButton').addEventListener('click', handleNextQuestion);
        
        // Show the quiz play container
        quizPlayContainer.classList.remove('hidden');
        
        // Show the first question
        showCurrentQuestion();
    }
    
    function showCurrentQuestion() {
        const currentQuestion = currentQuizQuestions[currentQuestionIndex];
        const questionContainer = document.getElementById('questionContainer');
        
        // Update progress indicators
        document.querySelector('.progress-text').textContent = 
        getText('questionNumber', [currentQuestionIndex + 1, currentQuizQuestions.length]);
        
        // Update score indicator
        document.querySelector('.score').textContent = getText('scoreLabel', [userScore]);

        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuizQuestions.length) * 100}%`;
        
        // Build the question HTML
        questionContainer.innerHTML = `
            <div class="question-info">
                <div class="category-badge">${currentQuestion.categoryName}</div>
                <div class="difficulty-badge ${currentQuestion.difficulty}">${currentQuestion.difficulty}</div>
                <div class="points-badge">${currentQuestion.points} ${currentLanguage === 'de' ? 'Pkt' : 'pts'}</div>
            </div>
            <div class="question-text">${currentQuestion.text}</div>
            <div class="options-container">
                ${currentQuestion.options.map(option => `
                    <div class="option" data-option-id="${option.id}">
                        <div class="option-letter">${option.id.toUpperCase()}</div>
                        <div class="option-text">${option.text}</div>
                    </div>
                `).join('')}
            </div>
            <div id="answerFeedback" class="answer-feedback hidden"></div>
        `;
        
        // Add event listeners to each option
        const options = questionContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => handleAnswerSelection(option));
        });
        
        // Reset the next button
        const nextButton = document.getElementById('nextQuestionButton');
        nextButton.classList.add('hidden');
        
        // Start the question timer
        startQuestionTimer(currentQuestion.timeLimit);
    }
    
    function handleAnswerSelection(selectedOption) {
        // Stop the timer
        stopQuestionTimer();
        
        const currentQuestion = currentQuizQuestions[currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        const optionId = selectedOption.dataset.optionId;
        const isCorrect = currentQuestion.options.find(option => option.id === optionId && option.correct === true) !== undefined;
        const answerTime = Math.floor((Date.now() - questionStartTime) / 1000);
        const timeLimit = currentQuestion.timeLimit;
        const timeFactor = Math.max(0, 1 - (answerTime / timeLimit));
        
        // Calculate points - full points if answered quickly, fewer points if slower
        let pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = Math.ceil(currentQuestion.points * timeFactor);
            userScore += pointsEarned;
            document.querySelector('.score').textContent = getText('scoreLabel', [userScore]);
        }
        
        // Save the result
        questionResults.push({
            questionId: currentQuestion.id,
            category: currentQuestion.categoryName,
            question: currentQuestion.text,
            isCorrect: isCorrect,
            timeToAnswer: answerTime,
            pointsEarned: pointsEarned
        });
        
        // Highlight correct and wrong answers
        options.forEach(option => {
            const optId = option.dataset.optionId;
            const isCorrectOption = currentQuestion.options.find(o => o.id === optId && o.correct === true) !== undefined;
            
            if (isCorrectOption) {
                option.classList.add('correct');
            } else if (option === selectedOption && !isCorrect) {
                option.classList.add('wrong');
            }
            
            // Disable all options
            option.classList.add('disabled');
        });
        
        // Show feedback
        const feedbackElement = document.getElementById('answerFeedback');
        if (isCorrect) {
            feedbackElement.innerHTML = `
                <div class="correct-feedback">
                    <span class="check-icon">✓</span>
                    <p>${getText('correctAnswer', [pointsEarned])}</p>
                </div>
                <p class="explanation">${currentQuestion.explanation}</p>
            `;
        } else {
            feedbackElement.innerHTML = `
                <div class="wrong-feedback">
                    <span class="x-icon">✗</span>
                    <p>${getText('incorrectAnswer')}</p>
                </div>
                <p class="explanation">${currentQuestion.explanation}</p>
            `;
        }
        feedbackElement.classList.remove('hidden');
        
        // Show the next button
        document.getElementById('nextQuestionButton').classList.remove('hidden');
    }
    
    function handleNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuizQuestions.length) {
            // Show the next question
            showCurrentQuestion();
        } else {
            // End the quiz and show results
            endQuiz();
        }
    }
    
    function startQuestionTimer(timeLimit) {
        const questionTimer = document.getElementById('questionTimer');
        
        // Reset and start the timer
        questionStartTime = Date.now();
        let timeRemaining = timeLimit;
        
        // Update timer immediately
        questionTimer.textContent = getText('timerLabel', [timeRemaining]);
        questionTimer.classList.remove('warning');
        
        // Cancel any existing timers
        if (quizTimerId) clearInterval(quizTimerId);
        if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);
        
        // Set up the countdown timer
        quizTimerId = setInterval(() => {
            timeRemaining--;
            questionTimer.textContent = getText('timerLabel', [timeRemaining]);;
            
            // Add warning class when time is running low (less than 30%)
            if (timeRemaining <= Math.floor(timeLimit * 0.3)) {
                questionTimer.classList.add('warning');
            }
            
            // Time's up
            if (timeRemaining <= 0) {
                stopQuestionTimer();
                handleTimeUp();
            }
        }, 1000);
    }
    
    function stopQuestionTimer() {
        if (quizTimerId) {
            clearInterval(quizTimerId);
            quizTimerId = null;
        }
        if (timerAnimationFrame) {
            cancelAnimationFrame(timerAnimationFrame);
            timerAnimationFrame = null;
        }
    }
    
    function handleTimeUp() {
        const options = document.querySelectorAll('.option');
        const currentQuestion = currentQuizQuestions[currentQuestionIndex];
        
        // Highlight the correct answer
        options.forEach(option => {
            const optId = option.dataset.optionId;
            const isCorrectOption = currentQuestion.options.find(o => o.id === optId && o.correct === true) !== undefined;
            
            if (isCorrectOption) {
                option.classList.add('correct');
            }
            
            // Disable all options
            option.classList.add('disabled');
        });
        
        // Save the result
        questionResults.push({
            questionId: currentQuestion.id,
            category: currentQuestion.categoryName,
            question: currentQuestion.text,
            isCorrect: false,
            timeToAnswer: currentQuestion.timeLimit,
            pointsEarned: 0
        });
        
        // Show feedback
        const feedbackElement = document.getElementById('answerFeedback');
        feedbackElement.innerHTML = `
            <div class="wrong-feedback">
                <span class="x-icon">✗</span>
                <p>${getText('timeUp')}</p>
            </div>
            <p class="explanation">${currentQuestion.explanation}</p>
        `;
        feedbackElement.classList.remove('hidden');
        
        // Show the next button
        document.getElementById('nextQuestionButton').classList.remove('hidden');
    }
    
    function endQuiz() {
        // Calculate total time
        const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        
        // Calculate stats
        const totalQuestions = currentQuizQuestions.length;
        const correctAnswers = questionResults.filter(result => result.isCorrect).length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Hide quiz play container
        quizPlayContainer.classList.add('hidden');
        
        // Build the results HTML
        quizResultsContainer.innerHTML = `
            <div class="results-header">
                <h2>${getText('quizResults')}</h2>
                <div class="quiz-summary">
                    <div class="summary-item">
                        <div class="summary-label">${getText('totalScoreLabel')}</div>
                        <div class="summary-value highlight">${userScore}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">${getText('accuracyLabel')}</div>
                        <div class="summary-value">${accuracy}%</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">${getText('timeLabel')}</div>
                        <div class="summary-value">${minutes}m ${seconds}s</div>
                    </div>
                </div>
            </div>
            
            <div class="results-details">
                <h3>${getText('questionResults')}</h3>
                <div class="results-list">
                    ${questionResults.map((result, index) => `
                        <div class="result-item ${result.isCorrect ? 'correct' : 'wrong'}">
                            <div class="result-header">
                                <div class="result-number">Q${index + 1}</div>
                                <div class="result-category">${result.category}</div>
                                <div class="result-status">
                                    ${result.isCorrect ? 
                                        `<span class="check-icon">✓</span> ${getText('correctResult', [result.pointsEarned])}` : 
                                        `<span class="x-icon">✗</span> ${getText('incorrectResult')}`}
                                </div>
                            </div>
                            <div class="result-question">${result.question}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="results-actions">
                <button id="returnToSelectionButton">${getText('returnToSelectionButton')}</button>
                <button id="restartQuizButton">${getText('restartQuizButton')}</button>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('returnToSelectionButton').addEventListener('click', returnToQuizSelection);
        document.getElementById('restartQuizButton').addEventListener('click', restartQuiz);
        
        // Show the results
        quizResultsContainer.classList.remove('hidden');
    }
    
    function returnToQuizSelection() {
        quizResultsContainer.classList.add('hidden');
        loadButton.classList.remove('hidden');
        quizContainer.classList.remove('hidden');
    }
    
    function restartQuiz() {
        quizResultsContainer.classList.add('hidden');
        
        // Reset quiz state
        currentQuestionIndex = 0;
        userScore = 0;
        questionResults = [];
        quizStartTime = Date.now();
        
        // Re-shuffle questions
        shuffleArray(currentQuizQuestions);
        
        // Initialize and show quiz interface
        initializeQuizInterface();
    }
    
    // Utility function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function toggleJsonView() {
        if (jsonOutput.classList.contains('hidden')) {
            jsonOutput.classList.remove('hidden');
            toggleJsonButton.textContent = getText('hideJsonButton');
        } else {
            jsonOutput.classList.add('hidden');
            toggleJsonButton.textContent = getText('showJsonButton');
        }
    }
    
    function showError(messageKey, params = []) {
        const translatedMessage = getText(messageKey, params);
        errorContainer.textContent = translatedMessage;
        errorContainer.classList.remove('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    }
    
    function hideError() {
        errorContainer.classList.add('hidden');
        errorContainer.textContent = '';
    }
});