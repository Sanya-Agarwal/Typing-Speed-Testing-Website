const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper .input-field"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    tryAgainBtn = document.querySelector("button");

let timer = 0,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;

function randomParagraph() {
    //getting random number and it will always be less than the paragraphs length.
    let randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    //getting random item from the paragraph array, splitting all characters of it, 
    //then adding each character inside span and then adding thi span inside the p tag.
    paragraphs[randIndex].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    //focusing input field on keydown or click event.
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {    //now user can only type if time is > 0 and typed < total char
        if (!isTyping) { //once timer is start, it won't restart again on every key clicked.
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        //If user hasnt enter any char or enter backspace -> code
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                //dec mistake iff charIndex spans contain incorrect class
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--; //dec mistake if user erase it
                }
                characters[charIndex].classList.remove("correct", "incorrect");
                //removing corr & incorr class fo erased character and decrement charindex
            }
        } else {
            if (characters[charIndex].innerText == typedChar) {
                // console.log("correct");
                //If user typed character and shown character matched then add the 
                //correct class else incr mistakes & add the incorrect class.
                characters[charIndex].classList.add("correct");
            }
            else {
                // console.log("incorrect");
                mistakes++;
                characters[charIndex].classList.add("incorrect")
                //increment charIndex after either user typed correct or incorrect character
            }
            charIndex++;
        }
        //showing blinking underline on the active character
        //first removing active class from all span and then adding to current span tag only
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");


        //to get wpm, first, subtract total mistaes from total typed charachters then dividing it by 5(assume 1 word= 5char) and again dividing this by subtracting timeLeft from MaxTime and lastly multiplying with 60.
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; //if wpm value is 0, empty or infinite then setting it to 0.
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes; //cpm will not count mistaes.

    } else {
        clearInterval(timer);
        inpField.value = ""
    }
}

function initTimer() {
    //if timeleft is greater than 0 then dec the timeleft else clear the timer.
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval("timer");
    }
}

function resetGame() {
    //calling paragraph function and resetting each variables and elements value to default.
    randomParagraph();
    clearInterval(timer);
    inpField.value = ""
    timeLeft = maxTime, charIndex = mistakes = isTyping = 0;
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = 0;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

randomParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);