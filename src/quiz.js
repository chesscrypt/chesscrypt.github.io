class Quiz {
    #quizData;
    #domElements;
    #categoriesUsed = {};
    #answeredQuestions = 0;
    #totalQuestions = 0;
    #questionsAsked = {};
    #questionsUntilActivity;
    #sounds;

    constructor(quizData, domElements) {
        this.#quizData = quizData;
        this.#questionsUntilActivity = this.#quizData.config.questionsBeforeActivity;
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
        this.#quizData.categories.forEach(category => {
            this.#totalQuestions += category.questions.length;
        });

        this.#domElements.totalQuestionsElem.textContent = this.#totalQuestions;

        this.#renderCategories();

        this.#domElements.nextBtn.addEventListener('click', () => this.#backToCategories());
        this.#domElements.activityDoneBtn.addEventListener('click', () => this.#backToCategories());
    }

    #renderCategories() {
        this.#domElements.categoriesContainer.innerHTML = '';

        this.#quizData.categories.forEach((category, index) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.textContent = category.name;

            const usedCount = this.#categoriesUsed[index] || 0;

            // Disable category if max questions asked or no more questions for this category
            let allAsked = true;
            for (let i = 0; i < category.questions.length; i++) {
                const questionKey = `${index}-${i}`;
                if (!this.#questionsAsked[questionKey]) {
                    allAsked = false;
                    break;
                }
            }

            if (usedCount >= this.#quizData.config.questionsPerCategory || allAsked) {
                categoryElement.classList.add('disabled');
            } else {
                categoryElement.addEventListener('click', () => this.#selectCategory(index));
            }

            this.#domElements.categoriesContainer.appendChild(categoryElement);
        });
    }

    #selectCategory(categoryIndex) {
        if (!this.#categoriesUsed[categoryIndex]) {
            this.#categoriesUsed[categoryIndex] = 0;
        }
        this.#categoriesUsed[categoryIndex]++;

        // Choose, random not already played question
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
            optionElement.addEventListener('click', () => this.#checkAnswer(index, question.correctAnswer));
            this.#domElements.optionsContainer.appendChild(optionElement);
        });

        this.#domElements.feedbackElem.textContent = '';
        this.#domElements.nextBtn.classList.add('hidden');
    }

    #checkAnswer(selectedIndex, correctIndex) {
        const options = document.querySelectorAll('.option');

        options[selectedIndex].classList.add(selectedIndex === correctIndex ? 'correct' : 'incorrect');
        options[correctIndex].classList.add('correct');

        if (selectedIndex === correctIndex) {
            this.#domElements.feedbackElem.textContent = 'Richtig!';
            this.#sounds.correct.play();
        } else {
            this.#domElements.feedbackElem.textContent = 'Falsch!';
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 500);
            this.#sounds.incorrect.play()
        }

        // disable all answer options
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // show next button
        this.#domElements.nextBtn.classList.remove('hidden');

        this.#answeredQuestions++;
        this.#questionsUntilActivity--;

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
        setTimeout(() => {
            document.body.classList.remove('flash');
        }, 1000);
    }

    #updateProgress() {
        this.#domElements.answeredCountElem.textContent = this.#answeredQuestions;
        const progressPercentage = (this.#answeredQuestions / this.#totalQuestions) * 100;
        this.#domElements.progressBar.style.width = `${progressPercentage}%`;
    }

}
