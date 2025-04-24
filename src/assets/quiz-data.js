const exampleQuizData = {
    "config": {
        "questionsPerCategory": 4,
        "questionsBeforeActivity": 5
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
                    "options": ["Willy Brandt", "Helmut Schmidt", "Konrad Adenauer", "Helmut Kohl"],
                    "correctAnswer": 2
                },
                {
                    "type": "multiple-choice",
                    "question": "Welches Ereignis löste den Ersten Weltkrieg aus?",
                    "options": ["Die Ermordung von Franz Ferdinand", "Die Invasion Polens", "Der Überfall auf Pearl Harbor", "Die Oktoberrevolution"],
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
                    "options": ["Mars und Jupiter", "Jupiter und Saturn", "Saturn und Uranus", "Uranus und Neptun"],
                    "correctAnswer": 2
                }
            ]
        },
        {
            "name": "Sport",
            "questions": [
                {
                    "type": "multiple-choice",
                    "question": "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?",
                    "options": ["9", "10", "11", "12"],
                    "correctAnswer": 2
                },
                {
                    "type": "true-false",
                    "question": "Die olympischen Winterspiele finden alle vier Jahre statt.",
                    "options": ["Wahr", "Falsch"],
                    "correctAnswer": 0
                },
                {
                    "type": "multiple-choice",
                    "question": "In welcher Stadt fanden die Olympischen Sommerspiele 2021 statt?",
                    "options": ["Paris", "Tokio", "London", "Rio de Janeiro"],
                    "correctAnswer": 1
                },
                {
                    "type": "multiple-choice",
                    "question": "Welches Land hat die meisten FIFA Weltmeisterschaften gewonnen?",
                    "options": ["Deutschland", "Argentinien", "Italien", "Brasilien"],
                    "correctAnswer": 3
                }
            ]
        },
        {
            "name": "Filme & Serien",
            "questions": [
                {
                    "type": "multiple-choice",
                    "question": "Wer spielte die Hauptrolle in 'Forrest Gump'?",
                    "options": ["Tom Hanks", "Brad Pitt", "Leonardo DiCaprio", "Johnny Depp"],
                    "correctAnswer": 0
                },
                {
                    "type": "true-false",
                    "question": "'Breaking Bad' handelt von einem Chemielehrer, der Drogen herstellt.",
                    "options": ["Wahr", "Falsch"],
                    "correctAnswer": 0
                },
                {
                    "type": "multiple-choice",
                    "question": "Wie viele Filme gibt es in der ursprünglichen 'Star Wars'-Trilogie?",
                    "options": ["3", "6", "9", "12"],
                    "correctAnswer": 0
                },
                {
                    "type": "multiple-choice",
                    "question": "Welcher Film gewann 2020 den Oscar für den besten Film?",
                    "options": ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
                    "correctAnswer": 2
                }
            ]
        },
        {
            "name": "Geographie",
            "questions": [
                {
                    "type": "multiple-choice",
                    "question": "Was ist die Hauptstadt von Australien?",
                    "options": ["Sydney", "Melbourne", "Canberra", "Perth"],
                    "correctAnswer": 2
                },
                {
                    "type": "true-false",
                    "question": "Der Amazonas ist der längste Fluss der Welt.",
                    "options": ["Wahr", "Falsch"],
                    "correctAnswer": 1
                },
                {
                    "type": "multiple-choice",
                    "question": "Welches Land hat die größte Fläche?",
                    "options": ["China", "USA", "Kanada", "Russland"],
                    "correctAnswer": 3
                },
                {
                    "type": "multiple-choice",
                    "question": "An welches Land grenzt Deutschland nicht?",
                    "options": ["Frankreich", "Österreich", "Spanien", "Luxemburg"],
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