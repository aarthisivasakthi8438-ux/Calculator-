 // --- Global Switch Mode Logic ---
    const calendarBox = document.getElementById("calendarBox");
    const calculatorBox = document.getElementById("calculatorBox");
    const globalSwitchBtn = document.getElementById("globalSwitchBtn");

    globalSwitchBtn.addEventListener("click", () => {
      if (calendarBox.classList.contains("active")) {
        // Switch to Calculator
        calendarBox.classList.remove("active");
        calendarBox.classList.add("minified");
        calculatorBox.classList.remove("minified");
        calculatorBox.classList.add("active");
        globalSwitchBtn.textContent = "Switch to Calendar";
      } else {
        // Switch to Calendar
        calculatorBox.classList.remove("active");
        calculatorBox.classList.add("minified");
        calendarBox.classList.remove("minified");
        calendarBox.classList.add("active");
        globalSwitchBtn.textContent = "Switch to Calculator";
      }
    });

    document.addEventListener('keydown',(event) =>{
        const key = event.key;
        // Handle numbers and operators//
        if(/^[0-9]$/.test(key) || ['+','-','*','/','.','%'].includes(key)) {
            appendValue(key);
        }
    

    //Handle actions
   if(key === 'Enter' || key === '=') {
       event.preventDefault(); //Stop default from actions if any
       calculateResult();
    } else if(key ==='Backspace') {
          deleteLastChar();
    } else if(key === 'Escape') {
        clearCalculator();
    }
});

    // --- Calculator Functions ---
    const calcScreen = document.getElementById("calcScreen");
    let calcInput = "";

    function appendCalc(val) {
      if (calcInput === "0" && val !== ".") {
        calcInput = val;
      } else {
        calcInput += val;
      }
      calcScreen.textContent = calcInput;
    }

    function clearCalc() {
      calcInput = "";
      calcScreen.textContent = "0";
    }

    function deleteCalc() {
      calcInput = calcInput.toString().slice(0, -1);
      calcScreen.textContent = calcInput === "" ? "0" : calcInput;
    }

    function calculateResult() {
      try {
        calcInput = eval(calcInput).toString();
        calcScreen.textContent = calcInput;
      } catch (error) {
        calcScreen.textContent = "Error";
        calcInput = "";
      }
    }

    // --- Calendar JavaScript ---
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    const monthYear = document.getElementById("monthYear");
    const daysContainer = document.getElementById("days");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const todayBtn = document.getElementById("todayBtn");
    const selectedDate = document.getElementById("selectedDate");
    const searchInput = document.getElementById("calendarSearch");

    const todayForPlaceholder = new Date();
    const pDay = String(todayForPlaceholder.getDate()).padStart(2, '0');
    const pMonth = String(todayForPlaceholder.getMonth() + 1).padStart(2, '0');
    const pYear = todayForPlaceholder.getFullYear();
    if (searchInput) {
        searchInput.placeholder = `e.g., ${pDay}/${pMonth}/${pYear}`;
    }

    let currentDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (monthYear) {
            monthYear.textContent = `${monthNames[month]} ${year}`;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        if (daysContainer) {
            daysContainer.innerHTML = "";

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement("div");
                empty.classList.add("day", "empty");
                daysContainer.appendChild(empty);
            }

            for (let day = 1; day <= lastDate; day++) {
                const dayElement = document.createElement("div");
                dayElement.classList.add("day");
                dayElement.textContent = day;

                const today = new Date();

                if (
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                ) {
                    dayElement.classList.add("today");
                }

                dayElement.addEventListener("click", () => {
                    document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
                    dayElement.classList.add("selected");
                    const date = new Date(year, month, day);

                    if (selectedDate) {
                        selectedDate.textContent = date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        });
                    }
                });

                daysContainer.appendChild(dayElement);
            }
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener("click", () => {
            currentDate = new Date();
            renderCalendar();
            if (selectedDate) {
                selectedDate.textContent = "Today";
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchValue = searchInput.value.trim();
            const dateParts = searchValue.split(/[\/\-]/);

            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1;
                const year = parseInt(dateParts[2], 10);

                if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 999 && month >= 0 && month <= 11) {
                    currentDate = new Date(year, month, 1);
                    renderCalendar();

                    document.querySelectorAll(".day:not(.empty)").forEach(dayCell => {
                        if (parseInt(dayCell.textContent, 10) === day) {
                            dayCell.classList.add("selected");
                            const targetDate = new Date(year, month, day);
                            if (selectedDate) {
                                selectedDate.textContent = targetDate.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                });
                            }
                        } else {
                            dayCell.classList.remove("selected");
                        }
                    });
                }
            }
        });
    }

    renderCalendar();
  