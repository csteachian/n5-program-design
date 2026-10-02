/*
 * Exercises.
 *
 * Each exercise pairs a flowchart (see flowchart.js for node types) with the
 * matching pseudocode in SQA Reference Language. Pseudocode lines are written
 * in the correct order; indent with two spaces per level. Lines with the same
 * text are treated as interchangeable when answers are checked.
 *
 * To add an exercise, copy one of the objects below and give it a unique id.
 */
(function () {
  'use strict';

  const start = { t: 'start', text: 'Start' };
  const end = { t: 'end', text: 'End' };
  const io = text => ({ t: 'io', text });
  const proc = text => ({ t: 'process', text });
  const IF = (cond, then, els) => ({ t: 'if', cond, then, else: els || [] });
  const WHILE = (cond, body) => ({ t: 'while', cond, body });
  const FOR = (text, body) => ({ t: 'for', text, body });
  const REPEAT = (body, cond) => ({ t: 'repeat', body, cond });

  window.EXERCISES = [
    {
      id: 'rectangle',
      title: 'Rectangle calculator',
      topic: 'Sequence',
      level: 1,
      brief: 'A program asks for the length and width of a rectangle, then calculates and displays its area and perimeter.',
      flow: [
        start,
        io('Get length'),
        io('Get width'),
        proc('area = length × width'),
        proc('perimeter = 2 × (length + width)'),
        io('Display area'),
        io('Display perimeter'),
        end
      ],
      code: [
        'RECEIVE length FROM (REAL) KEYBOARD',
        'RECEIVE width FROM (REAL) KEYBOARD',
        'SET area TO length * width',
        'SET perimeter TO 2 * (length + width)',
        'SEND "Area: " & area TO DISPLAY',
        'SEND "Perimeter: " & perimeter TO DISPLAY'
      ]
    },
    {
      id: 'pass-fail',
      title: 'Pass or fail',
      topic: 'Selection',
      level: 1,
      brief: 'A test is marked out of 100. The pass mark is 50. The program displays "Pass" or "Fail".',
      flow: [
        start,
        io('Get mark'),
        IF('mark ≥ 50?', [io('Display "Pass"')], [io('Display "Fail"')]),
        end
      ],
      code: [
        'RECEIVE mark FROM (INTEGER) KEYBOARD',
        'IF mark >= 50 THEN',
        '  SEND "Pass" TO DISPLAY',
        'ELSE',
        '  SEND "Fail" TO DISPLAY',
        'END IF'
      ]
    },
    {
      id: 'times-table',
      title: 'Times table',
      topic: 'Fixed loop',
      level: 1,
      brief: 'The user enters a number. The program displays the times table for that number, from 1 to 12.',
      flow: [
        start,
        io('Get number'),
        FOR('counter from 1 to 12', [
          proc('answer = number × counter'),
          io('Display counter, number and answer')
        ]),
        end
      ],
      code: [
        'RECEIVE number FROM (INTEGER) KEYBOARD',
        'FOR counter FROM 1 TO 12 DO',
        '  SET answer TO number * counter',
        '  SEND counter & " x " & number & " = " & answer TO DISPLAY',
        'END FOR'
      ]
    },
    {
      id: 'cinema',
      title: 'Cinema tickets',
      topic: 'Logical operators',
      level: 2,
      brief: 'Children under 16 and adults aged 65 or over pay £6.50. Everyone else pays £9.00. The program displays the ticket price.',
      flow: [
        start,
        io('Get age'),
        IF('age < 16 OR age ≥ 65?', [proc('price = 6.50')], [proc('price = 9.00')]),
        io('Display price'),
        end
      ],
      code: [
        'RECEIVE age FROM (INTEGER) KEYBOARD',
        'IF age < 16 OR age >= 65 THEN',
        '  SET price TO 6.50',
        'ELSE',
        '  SET price TO 9.00',
        'END IF',
        'SEND "Your ticket costs £" & price TO DISPLAY'
      ]
    },
    {
      id: 'grades',
      title: 'Award a grade',
      topic: 'Nested selection',
      level: 2,
      brief: 'A mark of 70 or more is an A, 60 or more is a B and 50 or more is a C. Any lower mark is "No award". The program displays the grade.',
      flow: [
        start,
        io('Get mark'),
        IF('mark ≥ 70?', [proc('grade = "A"')], [
          IF('mark ≥ 60?', [proc('grade = "B"')], [
            IF('mark ≥ 50?', [proc('grade = "C"')], [proc('grade = "No award"')])
          ])
        ]),
        io('Display grade'),
        end
      ],
      code: [
        'RECEIVE mark FROM (INTEGER) KEYBOARD',
        'IF mark >= 70 THEN',
        '  SET grade TO "A"',
        'ELSE IF mark >= 60 THEN',
        '  SET grade TO "B"',
        'ELSE IF mark >= 50 THEN',
        '  SET grade TO "C"',
        'ELSE',
        '  SET grade TO "No award"',
        'END IF',
        'SEND "Grade: " & grade TO DISPLAY'
      ]
    },
    {
      id: 'running-total',
      title: 'Running total',
      topic: 'Standard algorithm',
      level: 2,
      brief: 'A judge enters five scores. The program keeps a running total inside a loop, then displays the total and the average score.',
      flow: [
        start,
        proc('total = 0'),
        FOR('counter from 1 to 5', [
          io('Get score'),
          proc('total = total + score')
        ]),
        proc('average = total ÷ 5'),
        io('Display total'),
        io('Display average'),
        end
      ],
      code: [
        'SET total TO 0',
        'FOR counter FROM 1 TO 5 DO',
        '  RECEIVE score FROM (INTEGER) KEYBOARD',
        '  SET total TO total + score',
        'END FOR',
        'SET average TO total / 5',
        'SEND "Total: " & total TO DISPLAY',
        'SEND "Average: " & average TO DISPLAY'
      ]
    },
    {
      id: 'validate-age',
      title: 'Validate an age',
      topic: 'Standard algorithm',
      level: 2,
      brief: 'Input validation: the user must enter an age from 0 to 120. The program keeps asking until a valid age is entered.',
      flow: [
        start,
        io('Get age'),
        WHILE('age < 0 OR age > 120?', [
          io('Display error message'),
          io('Get age')
        ]),
        io('Display "Age accepted"'),
        end
      ],
      code: [
        'RECEIVE age FROM (INTEGER) KEYBOARD',
        'WHILE age < 0 OR age > 120 DO',
        '  SEND "Age must be from 0 to 120" TO DISPLAY',
        '  RECEIVE age FROM (INTEGER) KEYBOARD',
        'END WHILE',
        'SEND "Age accepted" TO DISPLAY'
      ]
    },
    {
      id: 'password',
      title: 'Password length',
      topic: 'Predefined functions',
      level: 2,
      brief: 'A new password must have at least 8 characters. The program uses LENGTH to check the password and asks again until it is long enough.',
      flow: [
        start,
        io('Get password'),
        WHILE('length of password < 8?', [
          io('Display "Too short"'),
          io('Get password')
        ]),
        io('Display "Password set"'),
        end
      ],
      code: [
        'RECEIVE password FROM (STRING) KEYBOARD',
        'WHILE LENGTH(password) < 8 DO',
        '  SEND "Password must have at least 8 characters" TO DISPLAY',
        '  RECEIVE password FROM (STRING) KEYBOARD',
        'END WHILE',
        'SEND "Password set" TO DISPLAY'
      ]
    },
    {
      id: 'temperatures',
      title: 'Average temperature',
      topic: 'Arrays',
      level: 2,
      brief: 'An array holds the midday temperature for each day of one week. The program traverses the array to find the total, then displays the average rounded to a whole number.',
      flow: [
        start,
        proc('temps = [12.5, 14.0, 13.2, 9.8, 11.1, 15.6, 16.0]'),
        proc('total = 0'),
        FOR('index from 0 to 6', [
          proc('total = total + temps[index]')
        ]),
        proc('average = round(total ÷ 7)'),
        io('Display average'),
        end
      ],
      code: [
        'DECLARE temps INITIALLY [12.5, 14.0, 13.2, 9.8, 11.1, 15.6, 16.0]',
        'SET total TO 0',
        'FOR index FROM 0 TO 6 DO',
        '  SET total TO total + temps[index]',
        'END FOR',
        'SET average TO ROUND(total / 7)',
        'SEND "Average temperature: " & average TO DISPLAY'
      ]
    },
    {
      id: 'star-rating',
      title: 'Star rating',
      topic: 'Conditional loop',
      level: 3,
      brief: 'Customers rate a shop from 1 to 5 stars. A REPEAT loop asks for a rating and shows an error each time it is out of range. When the rating is valid, the program thanks the customer.',
      flow: [
        start,
        REPEAT([
          io('Get rating'),
          IF('rating < 1 OR rating > 5?', [io('Display error message')], [])
        ], 'rating ≥ 1 AND rating ≤ 5?'),
        io('Display thank you message'),
        end
      ],
      code: [
        'REPEAT',
        '  RECEIVE rating FROM (INTEGER) KEYBOARD',
        '  IF rating < 1 OR rating > 5 THEN',
        '    SEND "Rating must be from 1 to 5" TO DISPLAY',
        '  END IF',
        'UNTIL rating >= 1 AND rating <= 5',
        'SEND "Thank you for your " & rating & " star rating" TO DISPLAY'
      ]
    },
    {
      id: 'count-passes',
      title: 'Count the passes',
      topic: 'Arrays',
      level: 3,
      brief: 'An array holds eight test marks. The program goes through each mark and counts how many are 50 or more, then displays the count.',
      flow: [
        start,
        proc('marks = [45, 72, 38, 91, 50, 66, 29, 84]'),
        proc('passes = 0'),
        FOR('each mark in marks', [
          IF('mark ≥ 50?', [proc('passes = passes + 1')], [])
        ]),
        io('Display passes'),
        end
      ],
      code: [
        'DECLARE marks INITIALLY [45, 72, 38, 91, 50, 66, 29, 84]',
        'SET passes TO 0',
        'FOR EACH mark FROM marks DO',
        '  IF mark >= 50 THEN',
        '    SET passes TO passes + 1',
        '  END IF',
        'END FOR',
        'SEND passes & " students passed" TO DISPLAY'
      ]
    },
    {
      id: 'guessing-game',
      title: 'Guess the number',
      topic: 'Conditional loop',
      level: 3,
      brief: 'The computer picks a random number from 1 to 100. The player keeps guessing and is told "Too high" or "Too low" until they get it. The program then displays how many guesses were needed.',
      flow: [
        start,
        proc('target = random number from 1 to 100'),
        proc('guesses = 0'),
        REPEAT([
          io('Get guess'),
          proc('guesses = guesses + 1'),
          IF('guess > target?', [io('Display "Too high"')], [
            IF('guess < target?', [io('Display "Too low"')], [])
          ])
        ], 'guess = target?'),
        io('Display guesses'),
        end
      ],
      code: [
        'SET target TO RANDOM(1, 100)',
        'SET guesses TO 0',
        'REPEAT',
        '  RECEIVE guess FROM (INTEGER) KEYBOARD',
        '  SET guesses TO guesses + 1',
        '  IF guess > target THEN',
        '    SEND "Too high" TO DISPLAY',
        '  ELSE IF guess < target THEN',
        '    SEND "Too low" TO DISPLAY',
        '  END IF',
        'UNTIL guess = target',
        'SEND "Correct in " & guesses & " guesses" TO DISPLAY'
      ]
    }
  ];
})();
