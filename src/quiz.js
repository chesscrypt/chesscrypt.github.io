class Quiz {
    #quizData;
    #domElements;
    #detailedResults;
    #answeredQuestions;
    #questionsAsked;
    #questionsUntilActivity;
    #sounds;

    #categoryUsage;
    #lockedCategory;
    #categoryIndices;

    constructor(quizData, domElements) {
        this.#quizData = quizData;
        this.#domElements = domElements;

        const soundAssetsPath = "src/assets/sounds"
        this.#sounds = {
            correct: new Sound(`${soundAssetsPath}/correct.mp3`),
            incorrect: new Sound(`${soundAssetsPath}/wrong.mp3`),
            activity: new Sound(`${soundAssetsPath}/activity.mp3`)
        }

        this.#init();
    }

    #init() {
        this.#answeredQuestions = 0;
        this.#categoryUsage = {};
        this.#quizData.categories.forEach(cat => {
            this.#categoryUsage[cat.name] = 0;
        });
        this.#lockedCategory = null;
        this.#categoryIndices = {};
        this.#questionsAsked = {};
        this.#questionsUntilActivity = this.#quizData.config.questionsBeforeActivity;
        this.#detailedResults = [];

        this.#quizData.categories.forEach((cat, i) => {
            this.#categoryIndices[cat.name] = i;
        });

        const total = this.#quizData.config.maxQuestionsPerGame;
        this.#domElements.totalQuestionsElem.textContent = total;        

        this.#renderCategories();
        this.#updateProgress();

        this.#domElements.nextBtn.addEventListener('click', () => {
            if (this.#allQuestionsAsked()) {
                const results = this.#calculateResults();
                this.#showResults(results);
            } else {
                this.#backToCategories();
            }
        });

        this.#domElements.activityDoneBtn.addEventListener('click', () => this.#backToCategories());

        this.#domElements.categoryView.style.display = 'block';
        this.#domElements.resultsView.style.display = 'none';
    }

    #allQuestionsAsked() {
        return this.#answeredQuestions >= this.#quizData.config.maxQuestionsPerGame;
    }

    #categoryLimitReached(catKey) {
        return this.#categoryUsage[catKey] >= this.#quizData.config.questionsPerCategory;
    }

    #renderCategories() {
        this.#domElements.categoriesContainer.innerHTML = '';

        this.#quizData.categories.forEach((category, index) => {
            const catName = category.name;

            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.textContent = catName;

            const usedCount = this.#categoryUsage[catName];
            let allAsked = true;
            for (let i = 0; i < category.questions.length; i++) {
                const questionKey = `${index}-${i}`;
                if (!this.#questionsAsked[questionKey]) {
                    allAsked = false;
                    break;
                }
            }

            if (usedCount >= this.#quizData.config.questionsPerCategory || allAsked || (this.#lockedCategory && this.#lockedCategory === catName)) {
                categoryElement.classList.add('disabled');
            } else {
                categoryElement.addEventListener('click', () => this.#selectCategory(index));
            }

            this.#domElements.categoriesContainer.appendChild(categoryElement);
        });
    }


    #selectCategory(categoryIndex) {
        const catName = this.#quizData.categories[categoryIndex].name;
        const catKey = catName;
    
        this.#categoryUsage[catKey]++;
    
        if (!this.#lockedCategory && this.#categoryUsage[catKey] >= this.#quizData.config.questionsPerCategory) {
            this.#lockedCategory = catKey;
        }
    
        const category = this.#quizData.categories[categoryIndex];
        const availableQuestions = [];
    
        for (let i = 0; i < category.questions.length; i++) {
            const questionKey = `${categoryIndex}-${i}`;
            if (!this.#questionsAsked[questionKey]) {
                availableQuestions.push(i);
            }
        }
    
        if (availableQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const questionIndex = availableQuestions[randomIndex];
            const questionKey = `${categoryIndex}-${questionIndex}`;
            this.#questionsAsked[questionKey] = true;
    
            this.#showQuestion(category, category.questions[questionIndex]);
        } else {
            this.#backToCategories();
        }
    
        const allFull = Object.values(this.#categoryUsage)
            .every(count => count >= this.#quizData.config.questionsPerCategory);
    
        if (allFull) {
            this.#lockedCategory = null;
    
            this.#quizData.categories.forEach(cat => {
                this.#categoryUsage[cat.name] = 0;
            });
        }
    }
    


    #showQuestion(category, question) {
        this.#domElements.categoryView.style.display = 'none';
        this.#domElements.questionView.style.display = 'block';
        this.#domElements.activityView.style.display = 'none';

        this.#domElements.categoryTitle.textContent = category.name;
        this.#domElements.questionText.textContent = question.question;

        this.#domElements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.#checkAnswer(question, index, question.correctAnswer));
            this.#domElements.optionsContainer.appendChild(optionElement);
        });

        this.#domElements.feedbackElem.textContent = '';
        this.#domElements.nextBtn.classList.add('hidden');
    }

    #checkAnswer(question, selectedIndex, correctIndex) {
        const isCorrect = selectedIndex === correctIndex;
        const options = document.querySelectorAll('.option');

        options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        options[correctIndex].classList.add('correct');

        if (isCorrect) {
            this.#domElements.feedbackElem.textContent = 'Richtig!';
            this.#sounds.correct.play();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            this.#domElements.feedbackElem.textContent = 'Falsch!';
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 500);
            this.#sounds.incorrect.play();
        }

        options.forEach(opt => opt.style.pointerEvents = 'none');
        this.#domElements.nextBtn.classList.remove('hidden');

        this.#answeredQuestions++;
        this.#questionsUntilActivity--;
        this.#detailedResults.push({
            question: question,
            selectedOptionIndex: selectedIndex,
            correctOptionIndex: correctIndex,
        });

        this.#updateProgress();
    }

    #backToCategories() {
        this.#domElements.categoryView.style.display = 'block';
        this.#domElements.questionView.style.display = 'none';
        this.#domElements.activityView.style.display = 'none';
        this.#sounds.activity.stop();

        this.#renderCategories();

        if (this.#questionsUntilActivity <= 0) {
            setTimeout(() => this.#showActivityQuestion(), 100);
            this.#questionsUntilActivity = this.#quizData.config.questionsBeforeActivity;
        }
    }

    #showActivityQuestion() {
        this.#domElements.categoryView.style.display = 'none';
        this.#domElements.questionView.style.display = 'none';
        this.#domElements.activityView.style.display = 'block';

        const randomIndex = Math.floor(Math.random() * this.#quizData.activityQuestions.length);
        const activity = this.#quizData.activityQuestions[randomIndex];

        this.#domElements.activityText.textContent = activity.question;
        this.#sounds.activity.playInLoop();

        document.body.classList.add('flash');
        setTimeout(() => document.body.classList.remove('flash'), 1000);
    }

    #updateProgress() {
        this.#domElements.answeredCountElem.textContent = this.#answeredQuestions;
    
        const total = this.#quizData.config.maxQuestionsPerGame;
        const percentage = (this.#answeredQuestions / total) * 100;
    
        this.#domElements.progressBar.style.width = `${percentage}%`;
    }
    

    #calculateResults() {
        let correctAnswers = 0;
        const detailedResults = this.#detailedResults.map(result => {
            const isCorrect = result.selectedOptionIndex === result.correctOptionIndex;
            if (isCorrect) correctAnswers++;
            return {
                question: result.question.question,
                userAnswer: result.question.options[result.selectedOptionIndex],
                correctAnswer: result.question.options[result.correctOptionIndex],
                isCorrect: isCorrect
            };
        });

        const percentage = Math.round((correctAnswers / this.#quizData.config.maxQuestionsPerGame) * 100);
        return {
            correctAnswers,
            totalQuestions: this.#quizData.config.questionsPerCategory * 2,
            percentage,
            detailedResults,
        }
    }

    #showResults(results) {
        this.#domElements.categoryView.style.display = 'none';
        this.#domElements.questionView.style.display = 'none';
        this.#domElements.activityView.style.display = 'none';
        this.#domElements.resultsView.style.display = 'block';

        this.#domElements.retryBtn.addEventListener('click', () => this.#init());

        this.#domElements.resultsSummaryElements.correctCount.textContent = results.correctAnswers;
        this.#domElements.resultsSummaryElements.totalQuestions.textContent = results.totalQuestions;
        this.#domElements.resultsSummaryElements.percentage.textContent = results.percentage + "%";
        this.#domElements.resultsSummaryElements.detailedResuls.innerHTML = '';

        results.detailedResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.className = result.isCorrect ? 'correct-answer' : 'wrong-answer';
            listItem.innerHTML = `
              <p><strong>Frage:</strong> ${result.question}</p>
              <p><strong>Deine Antwort:</strong> ${result.userAnswer}</p>
              <p><strong>Richtige Antwort:</strong> ${result.correctAnswer}</p>
            `;
            this.#domElements.resultsSummaryElements.detailedResuls.appendChild(listItem);
        });
    }
}
