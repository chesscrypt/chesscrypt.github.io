class Quiz {
    #quizData;
    #domElements;
    #questionsPerCategory;
    #questionsBeforeActivity;
    #categoriesUsed = {};
    #answeredQuestions = 0;
    #totalQuestions = 0;
    #questionsAsked = {};
    #questionsUntilActivity;

    #sounds;

    constructor(
        quizData,
        domElements,
        questionsPerCategory,
        questions_before_activity
    ) {
        this.#quizData = quizData;
        this.#questionsPerCategory = questionsPerCategory;
        this.#questionsBeforeActivity = questions_before_activity;
        this.#questionsUntilActivity = this.#questionsBeforeActivity
        this.#domElements = domElements;

        const soundAssetsPath = "src/assets/sounds"
        this.#sounds = {
            correct: new Audio(`${soundAssetsPath}/correct.mp3`),
            incorrect: new Audio(`${soundAssetsPath}/wrong.mp3`),
            activity: new Audio(`${soundAssetsPath}/activity.mp3`)
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

            if (usedCount >= this.#questionsPerCategory || allAsked) {
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
            // Wenn keine Fragen mehr verfügbar, zurück zu Kategorien
            this.#backToCategories();
        }
    }

    #showQuestion(category, question) {
        this.#domElements.categoryView.style.display = 'none';
        this.#domElements.questionView.style.display = 'block';
        this.#domElements.activityView.style.display = 'none';

        this.#domElements.categoryTitle.textContent = category.name;
        this.#domElements.questionText.textContent = question.question;

        // Antwortoptionen anzeigen
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
            this.#playAudio(this.#sounds.correct);
        } else {
            this.#domElements.feedbackElem.textContent = 'Falsch!';
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 500);
            this.#playAudio(this.#sounds.incorrect)
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
        this.#stopAudio(this.#sounds.activity)

        this.#renderCategories();

        if (this.#questionsUntilActivity <= 0) {
            setTimeout(() => this.#showActivityQuestion(), 100);
            this.#questionsUntilActivity = this.#questionsBeforeActivity;
        }
    }

    #showActivityQuestion() {
        this.#domElements.categoryView.style.display = 'none';
        this.#domElements.questionView.style.display = 'none';
        this.#domElements.activityView.style.display = 'block';

        const randomIndex = Math.floor(Math.random() * this.#quizData.activityQuestions.length);
        const activity = this.#quizData.activityQuestions[randomIndex];

        this.#domElements.activityText.textContent = activity.question;

        this.#playAudioInLoop(this.#sounds.activity);
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

    #playAudio(audio, inLoop = false) {
        audio.currentTime = 0;
        audio.play();
    }

    #playAudioInLoop(audio) {
        audio.loop = true;
        this.#playAudio(audio);
    }

    #stopAudio(audio) {
        audio.loop = false;
        audio.pause();
    }

}
