let total = 0;

        function addToDicePool(dice) {
            const diceInputField = document.getElementById('diceInput');
            let currentValue = diceInputField.value;
            const dicePattern = /(\d*)d(\d+)/g;
            let match;
            let updated = false;

            // Check if the dice type already exists in the input
            while ((match = dicePattern.exec(currentValue)) !== null) {
                if (match[2] === dice.substring(1)) {
                    const count = match[1] === '' ? 1 : parseInt(match[1], 10);
                    const newCount = count + 1;
                    currentValue = currentValue.replace(match[0], newCount + 'd' + match[2]);
                    updated = true;
                    break;
                }
            }

            // If the dice type does not exist, append it
            if (!updated) {
                currentValue = currentValue ? `${currentValue} + ${dice}` : dice;
            }

            diceInputField.value = currentValue;
        }

        function addToIntegerField(value) {
            const integerInputField = document.getElementById('integerInput');
            const currentValue = integerInputField.value;
            integerInputField.value = currentValue ? parseInt(currentValue, 10) + value : value;
        }

        function rollDice() {
            const diceInput = document.getElementById('diceInput').value;
            const integerInput = document.getElementById('integerInput').value;
            
            const diceResultDetails = calculateDiceRoll(diceInput);
            const integerResult = integerInput ? parseInt(integerInput, 10) : 0;
            const result = diceResultDetails.total + integerResult;
            total += result;
            
            // Play audio and update the result after audio ends
            playAudio('https://cdn.glitch.global/66d90176-fac0-414e-8da3-4af1c99a0ff6/Dice%20Roll%20Sound%20Effect%20~%20Rolling%20dice%20sound.mp3?v=1723054443041', () => {
                document.getElementById('result').textContent = `Result: ${diceInput} + ${integerInput || 0} = ${result}`;
            });
        }

        function clearDice() {
            total = 0;
            document.getElementById('diceInput').value = '';
            document.getElementById('integerInput').value = '';
        }

        function calculateDiceRoll(diceInput) {
            const dicePattern = /(\d*)d(\d+)/g;
            let match;
            let result = 0;
            let details = [];

            // Split the input by '+' to handle each part separately
            const parts = diceInput.split('+');
            parts.forEach(part => {
                part = part.trim(); // Remove any extra whitespace
                let diceMatched = false;
                
                // Reset the regex pattern's lastIndex for each new part
                dicePattern.lastIndex = 0;
                while ((match = dicePattern.exec(part)) !== null) {
                    diceMatched = true;
                    const count = match[1] === '' ? 1 : parseInt(match[1], 10);
                    const sides = parseInt(match[2], 10);
                    for (let i = 0; i < count; i++) {
                        const roll = Math.floor(Math.random() * sides) + 1;
                        result += roll;
                        details.push(`${roll}`);
                    }
                }
                if (!diceMatched && !isNaN(parseInt(part, 10))) {
                    // If the part is a simple number, add it to the result
                    result += parseInt(part, 10);
                }
            });

            console.log(`Calculated dice result: ${result}`);
            return { total: result, details: details.join(', ') };
        }

        function playAudio(url, callback) {
            const audio = new Audio(url);
            audio.play();
            audio.onended = callback;
        }