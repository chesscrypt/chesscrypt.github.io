const exampleQuizData = {
    "config": {
        "questionsPerCategory": 1,
        "questionsBeforeActivity": 1,
        "maxQuestionsPerGame": 4
    },
    "categories": [
        {
            "name": "Geschichte",
            "questions": [
                {
                    "type": "multiple-choice",
                    "question": "In welchem Jahr endete der Zweite Weltkrieg in Europa?",
                    "options": ["1944", "1945", "1946", "1947"],
                    "correctAnswer": 1
                },
                {
                    "type": "true-false",
                    "question": "Die Berliner Mauer fiel im Jahr 1989.",
                    "options": ["Wahr", "Falsch"],
                    "correctAnswer": 0
                },
                {
                    "type": "multiple-choice",
                    "question": "Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?",
                    "options": [
                        "Willy Brandt",
                        "Helmut Schmidt",
                        "Konrad Adenauer",
                        "Helmut Kohl"
                    ],
                    "correctAnswer": 2
                },
                {
                    "type": "multiple-choice",
                    "question": "Welches Ereignis löste den Ersten Weltkrieg aus?",
                    "options": [
                        "Die Ermordung von Franz Ferdinand",
                        "Die Invasion Polens",
                        "Der Überfall auf Pearl Harbor",
                        "Die Oktoberrevolution"
                    ],
                    "correctAnswer": 0
                }
            ]
        },
        {
            "name": "Wissenschaft",
            "questions": [
                {
                    "type": "multiple-choice",
                    "question": "Was ist die chemische Formel für Wasser?",
                    "options": ["CO2", "H2O", "NaCl", "O2"],
                    "correctAnswer": 1
                },
                {
                    "type": "true-false",
                    "question": "Schallwellen können sich im Vakuum ausbreiten.",
                    "options": ["Wahr", "Falsch"],
                    "correctAnswer": 1
                },
                {
                    "type": "multiple-choice",
                    "question": "Welches Element hat die Ordnungszahl 1 im Periodensystem?",
                    "options": ["Helium", "Sauerstoff", "Wasserstoff", "Stickstoff"],
                    "correctAnswer": 2
                },
                {
                    "type": "multiple-choice",
                    "question": "Welche Planeten in unserem Sonnensystem hat Ringe?",
                    "options": [
                        "Mars und Jupiter",
                        "Jupiter und Saturn",
                        "Saturn und Uranus",
                        "Uranus und Neptun"
                    ],
                    "correctAnswer": 2
                }
            ]
        }
    ],
    "activityQuestions": [
        {
            "question": "Alle Teilnehmer müssen aufstehen und 10 Hampelmänner machen! Los geht's!"
        },
        {
            "question": "Jeder Teilnehmer muss rückwärts zählen von 20 bis 0!"
        },
        {
            "question": "Alle singen gemeinsam den Refrain ihres Lieblingsliedes!"
        },
        {
            "question": "Wer kann am längsten auf einem Bein stehen? Alle mitmachen!"
        },
        {
            "question": "Jeder muss reihum einen Zungenbrecher aufsagen!"
        }
    ]
};