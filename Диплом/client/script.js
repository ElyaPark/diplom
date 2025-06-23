
let currentLesson = 0;
let selectedLesson = 0;
let currentTask = 0;
let totalTasks = 0;
let lessonProgress = {};
let xp = 0;
const totalLessons = 10;


const lessonTitle = document.getElementById('lesson-title');
const lessonDescription = document.getElementById('lesson-description');
const lessonDuration = document.getElementById('lesson-duration');
const lessonButtonsContainer = document.getElementById('lesson-buttons');
const initialPanel = document.getElementById('initial-panel');
const lessonPanel = document.getElementById('lesson-panel');
const progressBar = document.getElementById('progressBar');
const nextLessonBtn = document.getElementById('nextLessonBtn');


const lessons = [
    {
        title: "УРОК 1. Хангыль — корейский алфавит",
        description: "Знакомство с корейским алфавитом — первый шаг в изучении языка.",
        duration: "Продолжительность: 30 минут",
        badges: ["Алфавит", "Основы"],
        theory: `
  <div class="theory-content animate__animated animate__fadeIn">
    <h3><i class="fas fa-lightbulb"></i> Объяснение:</h3>
    <p>
      Корейский алфавит <strong>Хангыль (한글)</strong> был создан в 1443 году по инициативе
      <strong>короля Седжона Великого (세종대왕)</strong> и официально обнародован в 1446 году.
      Он был разработан, чтобы дать простому народу возможность читать и писать на своём языке,
      не используя сложные китайские иероглифы.
    </p>
    <p>
      Хангыль состоит из <strong>14 основных согласных</strong> и <strong>10 основных гласных</strong>, которые логично
      сочетаются в слоги. Каждая буква отражает <em>положение органов речи</em> при произнесении звука,
      делая систему интуитивной и научно обоснованной.
    </p>

    <div class="alphabet-section">
      <h4>Основные гласные:</h4>
      <div class="vowels-grid">
        <div class="vowel-card" data-sound="a">ㅏ [а]</div>
        <div class="vowel-card" data-sound="ya">ㅑ [я]</div>
        <div class="vowel-card" data-sound="eo">ㅓ [о]</div>
        <div class="vowel-card" data-sound="yeo">ㅕ [ё]</div>
        <div class="vowel-card" data-sound="o">ㅗ [о]</div>
        <div class="vowel-card" data-sound="yo">ㅛ [ё]</div>
      </div>
    </div>

    <div class="fun-fact">
      <p>🧠 <strong>Факт:</strong> Хангыль — один из немногих алфавитов в мире, у которого известны авторы и дата создания.</p>
      <p>📚 <strong>Совет:</strong> Запоминай пары гласных: ㅏ–ㅑ, ㅓ–ㅕ, ㅗ–ㅛ — они строятся по схожему принципу.</p>
      <p>💡 <strong>Интересно:</strong> Хангыль можно выучить всего за пару часов благодаря своей логике и симметрии.</p>
    </div>
  </div>
`,

        practice: [
            {
                type: "writing",
                title: "Напиши букву",
                content: "Попробуй написать букву ㅏ (а) в поле ниже:",
                answer: "ㅏ"
            },
            {
                type: "matching",
                title: "Сопоставь букву и звук",
                content: ["ㅏ", "ㅑ", "ㅓ", "ㅕ"],
                answers: ["а", "я", "о", "ё"]
            }
           
        ],
        interactive: `
            <div class="interactive-game">
                <h3>Игра: Собери слово</h3>
                <p>Попробуй собрать слово '안녕' (привет) из предложенных букв:</p>
                <div class="letters-container" id="lettersContainer">
                    <div class="letter" draggable="true">ㅇ</div>
                    <div class="letter" draggable="true">ㅏ</div>
                    <div class="letter" draggable="true">ㄴ</div>
                    <div class="letter" draggable="true">ㅕ</div>
                </div>
                <div class="word-container" id="wordContainer"></div>
                <button class="check-btn" id="checkWordBtn">Проверить</button>
            </div>
        `
    },
    {
        title: "Урок 2: Слоговая структура и чтение",
        description: "Из букв формируются слоги. Учимся читать корейские слова!",
        duration: "Продолжительность: 45 минут",
        difficulty: "Новичок",
        badges: ["Чтение", "Слоги"],
        theory: `
            <h3>Объяснение:</h3>
            <p>Корейские слоги всегда строятся по принципу согласная + гласная или согласная + гласная + согласная.</p>
            <div class="syllable-examples">
                <div class="example">가 [ка]</div>
                <div class="example">나 [на]</div>
                <div class="example">먹 [мок]</div>
            </div>
        `,
        practice: [
            "Чтение простых слогов",
            "Составление слогов из букв",
            "Чтение простых слов"
        ]
    }

];


document.addEventListener('DOMContentLoaded', function() {
    renderLessonButtons();
    updateProgressBar();
    
   
  
    if (nextLessonBtn) {
        nextLessonBtn.addEventListener('click', function() {
            if (selectedLesson < totalLessons) {
                loadLesson(selectedLesson + 1);
            } else {
                alert("Поздравляем! Вы завершили все уроки!");
            }
        });
    }
});


function renderLessonButtons() {
  lessonButtonsContainer.innerHTML = '';

  lessons.forEach((_, index) => {
      const li = document.createElement('li');
      li.classList.add('button');
      li.dataset.lesson = index + 1;

     
      const numberSpan = document.createElement('span');
      numberSpan.textContent = index + 1;
      li.appendChild(numberSpan);

      
      const lockIcon = document.createElement('span');
      lockIcon.classList.add('lock-icon');
      lockIcon.innerHTML = '🔒';

      if (index > currentLesson) {
          lockIcon.style.display = 'inline';
      } else {
          lockIcon.style.display = 'none';
      }

      li.appendChild(lockIcon);
      lessonButtonsContainer.appendChild(li);

      li.addEventListener('click', () => {
          const lessonNum = index + 1;
          loadLesson(lessonNum);
      });
  });
}



function loadLesson(lessonNum) {
    if (lessonNum > currentLesson + 1) {
        showMotivationMessage(`Чтобы перейти к уроку ${lessonNum}, сначала пройди урок ${currentLesson + 1}. Ты сможешь!`);
        return;
    }

    document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.button[data-lesson="${lessonNum}"]`).classList.add('active');

    const lesson = lessons[lessonNum - 1];
    lessonTitle.textContent = lesson.title;
    lessonDescription.textContent = lesson.description;
    lessonDuration.textContent = lesson.duration;

    const badgesContainer = document.getElementById('lesson-badges');
    badgesContainer.innerHTML = '';
    if (lesson.badges) {
        lesson.badges.forEach(badge => {
            const badgeElement = document.createElement('span');
            badgeElement.classList.add('badge');
            badgeElement.textContent = badge;
            badgesContainer.appendChild(badgeElement);
        });
    }

    selectedLesson = lessonNum;
    initialPanel.style.display = 'none';
    lessonPanel.style.display = 'block';
    
    document.getElementById('lesson-content-block').style.display = 'block';
    document.getElementById('start-button-block').style.display = 'block';
    
    document.getElementById('lesson-details').style.display = 'none';
    document.getElementById('interactive-block').style.display = 'none';
    document.getElementById('lesson-complete').style.display = 'none';
    nextLessonBtn.style.display = "none";
}


function startLesson() {
    const lesson = lessons[selectedLesson - 1];
    
    document.getElementById('lesson-content-block').style.display = 'none';
    document.getElementById('start-button-block').style.display = 'none';
    document.getElementById('lesson-buttons-panel').style.display = 'none';

    currentTask = 0;
    totalTasks = lesson.practice.length;
    
    const theoryBlock = document.getElementById('theory-block');
    theoryBlock.innerHTML = lesson.theory;
    
    const practiceBlock = document.getElementById('practice-block');
    practiceBlock.innerHTML = '';
    
    document.getElementById('lesson-details').style.display = 'block';
    
    showNextTask();
}


function showNextTask() {
  const lesson = lessons[selectedLesson - 1];
  const practiceBlock = document.getElementById('practice-block');
  const taskNavigation = document.getElementById('taskNavigation');
  
 
  practiceBlock.innerHTML = '';
  

  if (currentTask >= totalTasks) {
      completeLesson();
      return;
  }
  
 
  const task = lesson.practice[currentTask];
  

  const taskElement = document.createElement('div');
  taskElement.classList.add('task-item', 'animate__animated', 'animate__fadeIn');
  taskElement.id = `task-${currentTask}`;

  const taskHeader = document.createElement('h3');
  taskHeader.textContent = `Задание ${currentTask + 1} из ${totalTasks}`;
  taskElement.appendChild(taskHeader);

  if (typeof task === 'object') {
      
      const titleElement = document.createElement('h4');
      titleElement.textContent = task.title;
      taskElement.appendChild(titleElement);
      
     
      if (task.content) {
          const contentElement = document.createElement('p');
          contentElement.innerHTML = task.content;
          taskElement.appendChild(contentElement);
      }
     
      if (task.type === 'writing') {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = `answer-${currentTask}`;
          input.className = 'answer-input';
          taskElement.appendChild(input);
          
          const feedback = document.createElement('div');
          feedback.id = `feedback-${currentTask}`;
          feedback.className = 'feedback';
          taskElement.appendChild(feedback);
      }
      
      else if (task.type === 'matching') {
          const matchingGame = document.createElement('div');
          matchingGame.className = 'matching-game';
          
          const table = document.createElement('table');
          const headerRow = document.createElement('tr');
          headerRow.innerHTML = '<th>Буква</th><th>Звук</th>';
          table.appendChild(headerRow);
          
          
          task.content.forEach((letter, index) => {
              const row = document.createElement('tr');
              
              const letterCell = document.createElement('td');
              letterCell.textContent = letter;
              row.appendChild(letterCell);
              
              const soundCell = document.createElement('td');
              const select = document.createElement('select');
              select.id = `match-${currentTask}-${index}`;
              select.className = 'sound-select';
              
              
              const emptyOption = document.createElement('option');
              emptyOption.value = '';
              emptyOption.textContent = 'Выбери звук';
              select.appendChild(emptyOption);
              
              
              task.answers.forEach(sound => {
                  const option = document.createElement('option');
                  option.value = sound;
                  option.textContent = sound;
                  select.appendChild(option);
              });
              
              soundCell.appendChild(select);
              row.appendChild(soundCell);
              table.appendChild(row);
          });
          
          matchingGame.appendChild(table);
          
          
          const feedback = document.createElement('div');
          feedback.id = `feedback-${currentTask}`;
          feedback.className = 'feedback';
          matchingGame.appendChild(feedback);
          
          taskElement.appendChild(matchingGame);
      }
      
      else if (task.type === 'audio') {
          const audioElement = document.createElement('audio');
          audioElement.controls = true;
          audioElement.src = task.audioUrl || '';
          taskElement.appendChild(audioElement);
          
          const optionsContainer = document.createElement('div');
          optionsContainer.className = 'audio-options';
          
          task.answers.forEach((answer, index) => {
              const button = document.createElement('button');
              button.textContent = answer;
              button.onclick = () => {
                  const isCorrect = index === task.correct;
                  const feedback = document.getElementById(`feedback-${currentTask}`) || 
                                  document.createElement('div');
                  feedback.className = 'feedback';
                  feedback.innerHTML = isCorrect 
                      ? '<span class="correct">✅ Верно!</span>' 
                      : '<span class="incorrect">❌ Неверно, попробуй еще</span>';
                  taskElement.appendChild(feedback);
                  
                  if (isCorrect) {
                      taskNavigation.style.display = 'block';
                      document.getElementById('nextTaskBtn').onclick = taskCompleted;
                  }
              };
              optionsContainer.appendChild(button);
          });
          
          taskElement.appendChild(optionsContainer);
          
          const feedback = document.createElement('div');
          feedback.id = `feedback-${currentTask}`;
          feedback.className = 'feedback';
          taskElement.appendChild(feedback);
      }
  } 
  else {
      
      const taskText = document.createElement('p');
      taskText.innerHTML = `<span class="task-icon">📝</span> ${task}`;
      taskElement.appendChild(taskText);
  }
  
  
  if (typeof task !== 'object' || task.type !== 'audio') {
      const checkButton = document.createElement('button');
      checkButton.className = 'check-btn';
      checkButton.textContent = 'Проверить';
      checkButton.onclick = () => validateTask(currentTask);
      taskElement.appendChild(checkButton);
  }
  
  
  practiceBlock.appendChild(taskElement);
  
  
  taskNavigation.style.display = 'none';
  
  
  if (typeof task === 'object' && task.type === 'drag') {
      initDragAndDrop();
  }
}

function checkAnswer(userInput, correctAnswer) {
    if (typeof userInput !== 'string') userInput = String(userInput || '');
    if (typeof correctAnswer !== 'string') correctAnswer = String(correctAnswer || '');
    
    return userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}


function validateTask(taskIndex) {
    const lesson = lessons[selectedLesson - 1];
    if (!lesson?.practice?.[taskIndex]) {
        console.error("Задание не найдено");
        return false;
    }

    const task = lesson.practice[taskIndex];
    const feedback = document.getElementById(`feedback-${taskIndex}`);
    const taskNavigation = document.getElementById('taskNavigation');

    if (!feedback || !taskNavigation) {
        console.error("Элементы интерфейса не найдены");
        return false;
    }

    let isCorrect = false;
    
    try {
        switch (task.type) {
            case 'writing':
                const answerInput = document.getElementById(`answer-${taskIndex}`);
                isCorrect = checkAnswer(answerInput?.value, task.answer);
                break;

            case 'matching':
                isCorrect = validateMatchingTask(taskIndex);
                break;

            case 'audio':
                isCorrect = true;
                break;

            default:
                console.error("Неизвестный тип задания:", task.type);
                isCorrect = false;
        }

        if (isCorrect) {
            feedback.innerHTML = '<span class="correct">✅ Правильно! Молодец!</span>';
            taskNavigation.style.display = 'block';
            document.getElementById('nextTaskBtn').onclick = taskCompleted;
        } else {
            feedback.innerHTML = '<span class="incorrect">❌ Попробуй еще раз. Ты сможешь!</span>';
        }
    } catch (error) {
        console.error("Ошибка при проверке задания:", error);
        feedback.innerHTML = '<span class="error">⚠️ Произошла ошибка. Попробуй еще раз.</span>';
    }
}


function validateMatchingTask(taskIndex) {
  const lesson = lessons[selectedLesson - 1];
  const task = lesson.practice[taskIndex];
  
  if (!task?.content || !task?.answers || task.content.length !== task.answers.length) {
      console.error("Некорректные данные для задания на соответствие");
      return false;
  }

  let allCorrect = true;
  const feedback = document.getElementById(`feedback-${taskIndex}`);

  for (let i = 0; i < task.content.length; i++) {
      const select = document.getElementById(`match-${taskIndex}-${i}`);
      if (!select) continue;

      const isCorrect = checkAnswer(select.value, task.answers[i]);
      select.classList.toggle('incorrect', !isCorrect);
      select.classList.toggle('correct', isCorrect);
      allCorrect = allCorrect && isCorrect;
  }

  if (feedback) {
      feedback.innerHTML = allCorrect 
          ? '<span class="correct">✅ Все правильно!</span>' 
          : '<span class="incorrect">❌ Есть ошибки, проверь еще раз</span>';
  }

  return allCorrect;
}


function taskCompleted() {
    currentTask++;
    showNextTask();
}


function completeLesson() {
  
  currentLesson = Math.max(currentLesson, selectedLesson);
  updateProgressBar();
  
  
  document.getElementById('lesson-details').style.display = 'none';
  document.getElementById('interactive-block').style.display = 'none';
  document.getElementById('lesson-complete').style.display = 'block';
  

  xp += 50;
  updateXpDisplay();
  
 
  startConfetti();
  
  
  if (selectedLesson === currentLesson && selectedLesson < totalLessons) {
      const nextLessonBtn = document.querySelector(`.button[data-lesson="${selectedLesson + 1}"]`);
      if (nextLessonBtn) {
          nextLessonBtn.querySelector('.lock-icon')?.remove();
      }
  }
  
  
  const nextTaskBtn = document.getElementById('nextTaskBtn');
  if (nextTaskBtn) {
      nextTaskBtn.onclick = function() {
          
          document.getElementById('lesson-complete').style.display = 'none';
          document.getElementById('initial-panel').style.display = 'block';
          document.getElementById('lesson-panel').style.display = 'none';
          
          
          document.getElementById('lesson-content-block').style.display = 'block';
          document.getElementById('start-button-block').style.display = 'block';
          document.getElementById('lesson-buttons-panel').style.display = 'flex';
          
          
          renderLessonButtons();
      };
  }
}


function taskCompleted() {
  currentTask++;
  
 
  if (currentTask >= totalTasks) {
      completeLesson();
  } else {
     
      showNextTask();
  }
}


function updateProgressBar() {
    const progress = (currentLesson / totalLessons) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}

function updateXpDisplay() {
    const xpDisplay = document.querySelector('.xp-earned p');
    if (xpDisplay) {
        xpDisplay.textContent = `+50 XP (Всего: ${xp} XP)`;
    }
}

function showMotivationMessage(message) {
    const motivation = document.createElement('div');
    motivation.classList.add('motivation-message', 'animate__animated', 'animate__bounceIn');
    motivation.innerHTML = `<p>${message}</p><button class="close-motivation">✕</button>`;
    document.body.appendChild(motivation);
    
    motivation.querySelector('.close-motivation').addEventListener('click', () => {
        motivation.remove();
    });
    
    setTimeout(() => {
        motivation.remove();
    }, 5000);
}

function initDragAndDrop() {
    const letters = document.querySelectorAll('.letter');
    const wordContainer = document.getElementById('wordContainer');
    
    letters.forEach(letter => {
        letter.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.textContent);
        });
    });
    
    wordContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    wordContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const newLetter = document.createElement('div');
        newLetter.classList.add('letter');
        newLetter.textContent = data;
        newLetter.draggable = true;
        this.appendChild(newLetter);
    });
    
    document.getElementById('checkWordBtn').addEventListener('click', function() {
        const word = Array.from(wordContainer.children).map(el => el.textContent).join('');
        if (word === '안녕') {
            showMotivationMessage("Правильно! 안녕 означает 'привет' на корейском!");
            completeLesson();
        } else {
            showMotivationMessage("Попробуй ещё раз! Подсказка: это слово означает 'привет'");
        }
    });
}

function renderMatchingGame(task) {
  const container = document.createElement('div');
  container.className = 'matching-game';
  
  let html = `
      <table>
          <tr>
              <th>Буква</th>
              <th>Звук</th>
          </tr>`;
  
  task.content.forEach((letter, index) => {
      html += `
          <tr>
              <td>${letter}</td>
              <td>
                  <select id="match-${currentTask}-${index}" class="sound-select">
                      <option value="">Выбери звук</option>
                      ${task.answers.map(sound => `<option value="${sound}">${sound}</option>`).join('')}
                  </select>
              </td>
          </tr>`;
  });
  
  html += `</table>
      <div class="feedback" id="feedback-${currentTask}"></div>`;
  
  container.innerHTML = html;
  return container.outerHTML;
}

function startConfetti() {
    const confetti = document.querySelector('.confetti');
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.appendChild(particle);
    }
    
    setTimeout(() => {
        confetti.innerHTML = '';
    }, 5000);
}

  


const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');

if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
} else {
    console.error("Кнопка меню или выпадающее меню не найдены!");
}





document.addEventListener("DOMContentLoaded", function () {
  const bookTextContainer = document.getElementById('bookTextContainer');
  const bookContent = document.getElementById('bookContent');
  const bookHeaderContainer = document.getElementById('bookHeaderContainer');
  const bookImage = document.getElementById('bookImage');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const backToMenuButton = document.getElementById('backToMenuButton');
  const bookmarkButton = document.getElementById('bookmarkPage');

  let selectedBook = null;
  let currentPage = 0;
  let originalText = "";
  const translationCache = {};
  const defaultPageLength = 300;
  const fullscreenPageLength = 850;

  function splitTextIntoPages(text, pageLength) {
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n\n');
      const pages = [];

      for (let i = 0; i < cleanText.length; i += pageLength) {
          pages.push(cleanText.slice(i, i + pageLength));
      }

      return pages;
  }

  async function translateWord(word, targetLang = 'ru') {
      const lowerWord = word.toLowerCase();
      if (translationCache[lowerWord]) return translationCache[lowerWord];
      try {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=ko|${targetLang}`;
          const response = await fetch(url);
          const data = await response.json();
          const translated = data.responseData.translatedText || "Перевод не найден";
          translationCache[lowerWord] = translated;
          return translated;
      } catch {
          return "Ошибка перевода";
      }
  }

  function showTooltip(element, text) {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = text;
      document.body.appendChild(tooltip);
      const rect = element.getBoundingClientRect();
      tooltip.style.left = rect.left + window.scrollX + "px";
      tooltip.style.top = rect.top + window.scrollY - 35 + "px";
      setTimeout(() => tooltip.remove(), 2500);
  }

  function createParagraphWithClickableWords(text) {
      const p = document.createElement('p');
      const words = text.split(/(\s+)/);
      words.forEach(word => {
          if (/\s+/.test(word)) {
              p.appendChild(document.createTextNode(word));
          } else {
              const span = document.createElement('span');
              span.classList.add('word');
              span.textContent = word;
              const lowerWord = word.toLowerCase();
              if (translationCache[lowerWord]) {
                  setTimeout(() => showTooltip(span, translationCache[lowerWord]), 300);
              }
              span.addEventListener('click', async () => {
                  const translation = await translateWord(word);
                  showTooltip(span, translation);
              });
              p.appendChild(span);
          }
      });
      return p;
  }

  function showPages() {
    bookContent.innerHTML = "";

    const page1 = selectedBook.pages[currentPage] || '';
    const page2 = selectedBook.pages[currentPage + 1] || '';

    const leftPage = document.createElement('div');
    const rightPage = document.createElement('div');

    leftPage.classList.add('book-page');
    rightPage.classList.add('book-page');

    page1.split(/\n\s*\n/).forEach(paragraph => {
        const p = createParagraphWithClickableWords(paragraph.trim());
        leftPage.appendChild(p);
    });

    page2.split(/\n\s*\n/).forEach(paragraph => {
        const p = createParagraphWithClickableWords(paragraph.trim());
        rightPage.appendChild(p);
    });

    const leftPageNumber = document.createElement('div');
    leftPageNumber.classList.add('page-number');
    leftPageNumber.textContent = `Страница ${currentPage + 1} из ${selectedBook.pages.length}`;
    leftPage.appendChild(leftPageNumber);

    const rightPageNumber = document.createElement('div');
    rightPageNumber.classList.add('page-number');
    rightPageNumber.textContent = `Страница ${currentPage + 2} из ${selectedBook.pages.length}`;
    rightPage.appendChild(rightPageNumber);

    bookContent.appendChild(leftPage);
    bookContent.appendChild(rightPage);

    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage + 2 >= selectedBook.pages.length;
  }

  function saveProgress() {
    if (!selectedBook || !selectedBook.id) return;
    fetch('/api/book-progress', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: selectedBook.id, pageNumber: currentPage })
    }).catch(err => console.error('Ошибка сохранения прогресса:', err));
  }

  bookmarkButton?.addEventListener('click', () => {
    saveProgress();
    alert(`Закладка сохранена: страница ${currentPage + 1}`);
  });

  function showBookUI() {
    bookHeaderContainer.querySelector('h2').textContent = selectedBook.title;
    bookImage.src = selectedBook.image;
    document.querySelector('.books-list').style.display = 'none';
    bookTextContainer.style.display = 'block';
  }

  fetch('/api/books')
      .then(res => res.json())
      .then(books => {
          const container = document.querySelector('.books-list');
          container.innerHTML = '';
          books.forEach(book => {
              const btn = document.createElement('button');
              btn.className = 'book-card';
              btn.setAttribute('data-book-id', book.id);
              btn.innerHTML = `<img src="${book.image}" alt="book" /><p>${book.title}</p>`;
              btn.addEventListener('click', () => openBook(book));
              container.appendChild(btn);
          });
      });

  function openBook(bookMeta) {
    fetch(bookMeta.file)
      .then(res => res.text())
      .then(text => {
        originalText = text;
        selectedBook = {
          id: bookMeta.id,
          title: bookMeta.title,
          image: bookMeta.image,
          pages: splitTextIntoPages(text, defaultPageLength)
        };

        return fetch(`/api/book-progress/${bookMeta.id}`, { credentials: 'include' });
      })
      .then(res => res.json())
      .then(data => {
        currentPage = data.currentPage || 0;
        showBookUI();
        showPages();
      })
      .catch(() => {
        currentPage = 0;
        showBookUI();
        showPages();
      })
      .catch(err => console.error("Ошибка загрузки книги или прогресса:", err));
  }

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage -= 2;
        showPages();
        saveProgress();
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage + 2 < selectedBook.pages.length) {
        currentPage += 2;
        showPages();
        saveProgress();
    }
  });

  backToMenuButton.addEventListener('click', () => {
    saveProgress();
    bookTextContainer.style.display = 'none';
    document.querySelector('.books-list').style.display = 'flex';
  });

  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        bookTextContainer.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!selectedBook || !originalText) return;

    if (document.fullscreenElement) {
        selectedBook.pages = splitTextIntoPages(originalText, fullscreenPageLength);
    } else {
        selectedBook.pages = splitTextIntoPages(originalText, defaultPageLength);
    }
    currentPage = 0;
    showPages();
  });
});







document.addEventListener("DOMContentLoaded", function () {
  let dramas = {};

  fetch('/api/dramas')
    .then(res => res.json())
    .then(data => {
      dramas = {};
      data.forEach(drama => {
        dramas[drama.id] = drama;
      });
  
      const dramasList = document.querySelector('.dramas-list');
const dramaDetails = document.getElementById('dramaDetails');
const backToListButton = document.getElementById('backToList');

fetch('/api/dramas')
  .then(res => res.json())
  .then(data => {
    dramasList.innerHTML = '';

    data.forEach(drama => {
      const card = document.createElement('div');
      card.className = 'dramas-card';
      card.setAttribute('data-drama', drama.id);
      card.innerHTML = `
        <img src="${drama.image}" alt="${drama.title}" />
        <p>${drama.title}</p>
      `;
      card.addEventListener('click', () => openDrama(drama));
      dramasList.appendChild(card);
    });
  });

function openDrama(drama) {
  dramasList.classList.add('hidden');
  dramaDetails.style.display = 'block';

  document.getElementById('dramaTitle').textContent = drama.title;
  document.getElementById('dramaDescription').textContent = drama.description;
  document.getElementById('dramaImageSrc').src = drama.image;

  fetch(`/api/dramas/${drama.id}/episodes`)
    .then(res => res.json())
    .then(episodes => {
      const container = document.getElementById('dramaEpisodes');
      container.innerHTML = '';
      episodes.forEach(ep => {
        const btn = document.createElement('button');
        btn.textContent = ep.title;
        btn.onclick = () => playEpisode(ep.video_url);
        container.appendChild(btn);
      });
    });
}

      dramaCards.forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-drama');
          const drama = dramas[id];
          if (!drama) return;
  
          document.querySelector('.dramas-list').classList.add('hidden');
          document.getElementById('dramaDetails').style.display = 'block';
          document.getElementById('dramaTitle').textContent = drama.title;
          document.getElementById('dramaDescription').textContent = drama.description;
          document.getElementById('dramaImageSrc').src = drama.image;
  
          fetch(`/api/dramas/${id}/episodes`)
            .then(res => res.json())
            .then(episodes => {
              const container = document.getElementById('dramaEpisodes');
              container.innerHTML = '';
              episodes.forEach(ep => {
                const btn = document.createElement('button');
                btn.textContent = ep.title;
                btn.onclick = () => {
                  const player = document.getElementById('videoPlayer');
                  const source = document.getElementById('videoSource');
                  source.src = ep.video_url;
                  document.getElementById('episodeVideo').load();
                  player.style.display = 'block';
                };
                container.appendChild(btn);
              });
            });
        });
      });
    });
  

    const dramaCards = document.querySelectorAll('.dramas-card');
    const dramaDetails = document.getElementById('dramaDetails');
    const backToListButton = document.getElementById('backToList');
    const dramasList = document.querySelector('.dramas-list');
   
    dramaCards.forEach(button => {
        button.addEventListener('click', function () {
            const dramaId = this.getAttribute('data-drama');
            const drama = dramas[dramaId];

            
            dramasList.classList.add('hidden');
           
            dramaDetails.style.display = 'block';

  
            document.getElementById('dramaTitle').textContent = drama.title;
            document.getElementById('dramaDescription').textContent = drama.description;

            
            const dramaImage = document.getElementById('dramaImageSrc');
            dramaImage.src = drama.image;

    
            const episodesContainer = document.getElementById('dramaEpisodes');
            episodesContainer.innerHTML = ''; 
            drama.episodes.forEach((episode, index) => {
                const episodeButton = document.createElement('button');
                episodeButton.textContent = episode.title;
                episodeButton.onclick = () => playEpisode(episode.videoUrl);
                episodesContainer.appendChild(episodeButton);
            });
        });
    });

   
    function playEpisode(videoUrl) {
        const videoPlayer = document.getElementById('videoPlayer');
        const videoSource = document.getElementById('videoSource');
        videoSource.src = videoUrl;
        document.getElementById('episodeVideo').load(); 
        videoPlayer.style.display = 'block'; 
    }

    
    function backToList() {
        dramasList.classList.remove('hidden'); 
        
        dramaDetails.style.display = 'none';  
        document.getElementById('videoPlayer').style.display = 'none'; 
    }

    
    backToListButton.addEventListener('click', backToList);

const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const contentId = this.getAttribute('data-content');
            // Скрываем детали дорамы, если она открыта
            dramaDetails.style.display = 'none';
            dramasList.classList.remove('hidden'); // Показываем список дорам

            // В зависимости от нажатой кнопки скрываем или показываем контент
            // Пример для переключения секций контента (например, "Тексты", "Кроссворды")
            const contentSections = document.querySelectorAll('.content-section');
            contentSections.forEach(section => {
                if (section.id === contentId) {
                    section.style.display = 'block'; // Показываем нужный контент
                } else {
                    section.style.display = 'none'; // Скрываем остальные
                }
            });
        });
    });
});




function loadCrosswordTopics() {
  fetch('/api/crosswords/topics')
    .then(res => res.json())
    .then(topics => {
      const list = document.querySelector('.crosswords-list');
      list.innerHTML = '';
      topics.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'crosswords-card';
        btn.textContent = topic.title;
        btn.addEventListener('click', () => openTopic(topic.id, topic.title));
        list.appendChild(btn);
      });
    });
}

function openTopic(topicId, topicTitle) {
  fetch(`/api/crosswords/${topicId}`)
    .then(res => res.json())
    .then(crosswords => {
      document.querySelector('.crosswords-list').style.display = 'none';
      
      document.querySelector('.crossword-main').classList.remove('hidden');
      const contentContainer = document.getElementById('contentContainer');
if (contentContainer) contentContainer.style.display = 'none';

      document.getElementById('backToTopicsBtn').classList.remove('hidden');

      document.getElementById('selectedTopicTitle').textContent = topicTitle;

      const buttonsContainer = document.getElementById('crosswordButtons');
      buttonsContainer.innerHTML = '';

      crosswords.forEach(c => {
        const btn = document.createElement('button');
        btn.textContent = c.index_number;
        btn.classList.add('crossword-number-btn');
        btn.addEventListener('click', () => {
          document.querySelectorAll('.crossword-number-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadCrossword(topicId, c.index_number);
          document.getElementById('crosswordPanel').style.display = 'flex';
        });
        buttonsContainer.appendChild(btn);
      });
    });
}

function loadCrossword(topicId, index) {
  fetch(`/api/crosswords/${topicId}/${index}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('crosswordGrid').innerHTML = data.grid;

      const cluesList = document.getElementById('allClues');
      cluesList.innerHTML = '';
      data.clues.forEach(clue => {
        const item = document.createElement('li');
        item.classList.add('hint-word');
        item.dataset.answer = clue.answer;
        item.textContent = `${clue.number}. ${clue.clue}`;
        cluesList.appendChild(item);
      });

      enableCrosswordClicking();
    });
}

function enableCrosswordClicking() {
  const cells = document.querySelectorAll('#crosswordGrid td');
  let selectedCells = [];

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (cell.classList.contains('confirmed')) return;

      cell.classList.toggle('selected');
      const char = cell.dataset.char;

      if (cell.classList.contains('selected')) {
        selectedCells.push({ cell, char });
      } else {
        selectedCells = selectedCells.filter(item => item.cell !== cell);
      }

      checkSelectedWord(selectedCells);
    });
  });
}

function checkSelectedWord(selectedCells) {
  const word = selectedCells.map(item => item.char).join('');

  document.querySelectorAll('.hint-word').forEach(hint => {
    const answer = hint.dataset.answer.trim();
    if (word === answer && !hint.classList.contains('found')) {
      hint.classList.add('found');
      selectedCells.forEach(item => {
        item.cell.classList.remove('selected');
        item.cell.classList.add('confirmed');
      });
    }
  });
}

const backToTopicsBtn = document.getElementById('backToTopicsBtn');
if (backToTopicsBtn) {
  backToTopicsBtn.addEventListener('click', () => {
    document.querySelector('.crosswords-list').style.display = 'flex';
    const contentContainer = document.getElementById('contentContainer');
if (contentContainer) contentContainer.style.display = 'block';
    document.querySelector('.crossword-main').classList.add('hidden');
    backToTopicsBtn.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', loadCrosswordTopics);



const tasks = {
  "Базовые фразы": {
      1: [
          {
              type: "input-words",
              words: [
                  { ru: "Дом", kr: "집" },
                  { ru: "Книга", kr: "책" },
                  { ru: "Еда", kr: "음식" }
              ]
          },
          {
              type: "match-words",
              pairs: [
                  { kr: "물", ru: "Вода" },
                  { kr: "밥", ru: "Рис" },
                  { kr: "소금", ru: "Соль" }
              ]
          }
      ],
      2: [
          {
              type: "input-words",
              words: [
                  { ru: "Привет", kr: "안녕" },
                  { ru: "Спасибо", kr: "감사합니다" }
              ]
          }
      ],
      3: [
        {
          type: "choose-translation",
          question: "Что означает слово '학교'?",
          options: ["Больница", "Школа", "Магазин", "Работа"],
          correct: "Школа"
        },
        {
          type: "fill-in",
          sentence: "나는 ___을(를) 마셨어요.",
          correct: "물"
        },
        {
          type: "guess-by-description",
          description: "아침에 먹는 음식이에요.",
          correct: "아침밥"
        },
        {
          type: "assemble-syllables",
          syllables: ["학", "교"],
          correct: "학교"
        },
        {
          type: "quiz",
          question: "Что из этого — не еда?",
          options: ["김치", "바나나", "컴퓨터", "떡볶이"],
          correct: "컴퓨터"
        }
      ]
  }
};


const slovaCards = document.querySelectorAll('.slova-card');
const taskPanel = document.getElementById('taskPanel');
const taskContent = document.getElementById('taskContent');
const backButton = document.getElementById('backButton');
const contentContainer = document.getElementById('contentContainer');

const taskButtonsContainer = document.querySelector('.task-buttons');

let currentTheme = '';


slovaCards.forEach(card => {
  card.addEventListener('click', () => {
      currentTheme = card.textContent.trim();
      if (!tasks[currentTheme]) return;

      contentContainer.style.display = "none";
      taskPanel.style.display = "flex";
   

      renderThemeHeader(currentTheme);
      renderTaskTabs(currentTheme);
      taskContent.innerHTML = "<p>Выберите номер блока слева, чтобы начать</p>";
  });
});


backButton.addEventListener('click', () => {
  taskPanel.style.display = "none";
  contentContainer.style.display = "block";
  
});


function renderThemeHeader(theme) {
  const existingHeader = document.getElementById('themeHeader');
  if (existingHeader) existingHeader.remove();

  const header = document.createElement('div');
  header.id = 'themeHeader';
  header.innerHTML = `<h3>${theme}</h3>`;
  header.style.marginBottom = "10px";
  header.style.padding = "0 10px";
  header.style.fontSize = "18px";
  header.style.color = "#333";
  header.style.textAlign = "left";
  taskButtonsContainer.parentElement.insertBefore(header, taskButtonsContainer);
}


function renderTaskTabs(theme) {
  taskButtonsContainer.innerHTML = '';
  const themeTasks = tasks[theme];

  Object.keys(themeTasks).forEach(num => {
      const btn = document.createElement('button');
      btn.classList.add('task-tab');
      btn.dataset.task = num;
      btn.textContent = num;
      btn.addEventListener('click', () => {
        
        document.querySelectorAll('.task-tab').forEach(tab => {
            tab.classList.remove('active');
        });
    
       
        btn.classList.add('active');
    
        
        loadTasks(theme, num);
    });
    
      taskButtonsContainer.appendChild(btn);
  });
}

function renderInstruction(text) {
  const instruction = document.createElement("h4");
  instruction.textContent = text;
  instruction.style.marginBottom = "15px";
  instruction.style.color = "#333";
  instruction.style.fontWeight = "bold";
  return instruction;
}



function loadTasks(theme, num) {
  const taskBlocks = tasks[theme][num];
  if (!taskBlocks) {
      taskContent.innerHTML = "<p>Нет заданий</p>";
      return;
  }

  let currentIndex = 0;
  showTaskBlock(taskBlocks[currentIndex]);

  function showTaskBlock(block) {
    
    function next() {
      currentIndex++;
      if (currentIndex < taskBlocks.length) {
        showTaskBlock(taskBlocks[currentIndex]);
      } else {
        taskContent.innerHTML = "<p>✅ Все задания завершены!</p>";
      }
    }
  

    switch (block.type) {
      case "input-words":
        renderInputTask(block.words, next);
        break;
  
      case "match-words":
        renderMatchTask(block.pairs, next);
        break;
  
      case "choose-translation":
        renderChoose(block, next);
        break;
  
      case "fill-in":
        renderFillIn(block, next);
        break;
  
      case "guess-by-description":
        renderGuess(block, next);
        break;
  
      case "assemble-syllables":
        renderAssemble(block, next);
        break;
  
      case "quiz":
        renderQuiz(block, next);
        break;
  
      default:
        taskContent.innerHTML = "<p>❗ Неизвестный тип задания</p>";
        break;
    }
  }
  
}




function renderChoose(task, onComplete) {
  wrapper.classList.add("task-choose");
  taskContent.appendChild(renderInstruction("✅ Выбери правильный перевод"));

  taskContent.innerHTML = `<p>${task.question}</p>`;
  task.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.style.display = "block";
    btn.style.margin = "5px 0";
    btn.onclick = () => {
      btn.style.color = opt === task.correct ? "green" : "red";
      if (opt === task.correct) {
        setTimeout(onComplete, 500);
      }
    };
    taskContent.appendChild(btn);
  });
}


function renderFillIn(task, onComplete) {
  taskContent.innerHTML = "";
  wrapper.classList.add("task-fillIn");
  taskContent.appendChild(renderInstruction("🧠 Вставь слово по смыслу"));

  const wrapper = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = task.sentence.replace("___", "_____");
  wrapper.appendChild(p);

  const input = document.createElement("input");
  input.type = "text";
  input.style.marginRight = "10px";

  const btn = document.createElement("button");
  btn.textContent = "Проверить";

  btn.onclick = () => {
    if (input.value.trim() === task.correct) {
      input.style.color = "green";
      setTimeout(onComplete, 500);
    } else {
      input.style.color = "red";
    }
  };

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  taskContent.appendChild(wrapper);
}


function renderGuess(task, onComplete) {
  wrapper.classList.add("task-guess");
  taskContent.appendChild(renderInstruction("🔍 Угадай слово по описанию"));

  taskContent.innerHTML = `<p>${task.description}</p>`;
  const input = document.createElement("input");
  input.type = "text";
  input.style.marginRight = "10px";

  const btn = document.createElement("button");
  btn.textContent = "Проверить";

  btn.onclick = () => {
    if (input.value.trim() === task.correct) {
      input.style.color = "green";
      setTimeout(onComplete, 500);
    } else {
      input.style.color = "red";
    }
  };

  taskContent.appendChild(input);
  taskContent.appendChild(btn);
}


function renderAssemble(task, onComplete) {
  wrapper.classList.add("task-assemble");
  taskContent.appendChild(renderInstruction("🧩 Собери слово из слогов"));

  taskContent.innerHTML = `<p>Собери слово:</p>`;
  const shuffled = [...task.syllables].sort(() => Math.random() - 0.5);

  let result = "";
  const resultBox = document.createElement("p");
  resultBox.textContent = "👉 " + result;

  shuffled.forEach(syl => {
    const btn = document.createElement("button");
    btn.textContent = syl;
    btn.style.margin = "5px";
    btn.onclick = () => {
      result += syl;
      resultBox.textContent = "👉 " + result;
      btn.disabled = true;

      if (result === task.correct) {
        resultBox.style.color = "green";
        setTimeout(onComplete, 500);
      } else if (result.length >= task.correct.length && result !== task.correct) {
        resultBox.style.color = "red";
      }
    };
    taskContent.appendChild(btn);
  });

  taskContent.appendChild(resultBox);
}


function renderQuiz(task, onComplete) {
  wrapper.classList.add("task-quiz");
  taskContent.appendChild(renderInstruction("🤓 Мини-викторина"));

  taskContent.innerHTML = `<p>${task.question}</p>`;
  task.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.style.display = "block";
    btn.style.margin = "5px 0";
    btn.onclick = () => {
      btn.style.color = opt === task.correct ? "green" : "red";
      if (opt === task.correct) {
        setTimeout(onComplete, 500);
      }
    };
    taskContent.appendChild(btn);
  });
}



function renderInputTask(words, onComplete) {
  taskContent.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-input");
  wrapper.appendChild(renderInstruction("✏️ Напиши перевод на корейском"));

  let completed = 0;

  words.forEach(({ ru, kr }) => {
    const row = document.createElement("div");
    row.style.marginBottom = "10px";

    const label = document.createElement("span");
    label.textContent = ru + ": ";
    label.style.marginRight = "10px";

    const input = document.createElement("input");
    input.type = "text";
    input.style.padding = "5px";
    input.dataset.answer = kr;

    input.addEventListener("change", () => {
      const userInput = input.value.trim();
      if (userInput === kr) {
        input.style.color = "green";
        input.disabled = true;
        completed++;
        checkAllComplete();
      } else {
        input.style.color = "red";
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    wrapper.appendChild(row);
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Далее";
  nextBtn.style.display = "none";
  nextBtn.classList.add("next-btn"); 
  nextBtn.onclick = onComplete;

  wrapper.appendChild(nextBtn);
  taskContent.appendChild(wrapper);

  function checkAllComplete() {
    if (completed === words.length) {
      nextBtn.style.display = "inline-block";
    }
  }
}



function renderMatchTask(pairs, onComplete) {
  taskContent.innerHTML = "";
  

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-match");
  
  taskContent.appendChild(renderInstruction("🔗 Соедини слово с переводом"));
  
  

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "column";
  container.style.gap = "30px";
  container.style.position = "relative";

  const canvas = document.createElement("canvas");
  
  wrapper.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const left = document.createElement("div");
  left.classList.add("match-column");
  const right = document.createElement("div");
  right.classList.add("match-column");

  const state = {
    left: null,
    currentLine: null
  };

  const matched = new Set();

  const shuffledRu = [...pairs.map(p => p.ru)].sort(() => Math.random() - 0.5);

  let buttonMap = [];

  function drawFixedLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let pair of matched) {
      drawLine(pair.left, pair.right, pair.color);
    }
  }

  function drawLine(fromEl, toEl, color = "#007bff") {
    const rect1 = fromEl.getBoundingClientRect();
    const rect2 = toEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
    const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
    const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
    const y2 = rect2.top + rect2.height / 2 - canvasRect.top;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  
  document.addEventListener("mousemove", (e) => {
    if (state.left && !state.right) {
      drawFixedLines();
      const rect1 = state.left.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
      const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
      const x2 = e.clientX - canvasRect.left;
      const y2 = e.clientY - canvasRect.top;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  
  pairs.forEach(({ kr }) => {
    const btn = document.createElement("button");
    btn.textContent = kr;
    btn.classList.add("match-button");
    btn.dataset.kr = kr;
    btn.onclick = () => {
      if (state.left) return; 
      state.left = btn;
      btn.classList.add("selected");
    };
    left.appendChild(btn);
    buttonMap.push(btn);
  });

  shuffledRu.forEach(ru => {
    const btn = document.createElement("button");
    btn.textContent = ru;
    btn.classList.add("match-button");
    btn.dataset.ru = ru;
    btn.onclick = () => {
      if (!state.left) return;
      const leftBtn = state.left;
      const rightBtn = btn;
      state.left.classList.remove("selected");

      const kr = leftBtn.textContent;
      const found = pairs.find(p => p.kr === kr && p.ru === ru);

      if (found) {
        leftBtn.classList.add("correct");
        rightBtn.classList.add("correct");
        leftBtn.disabled = true;
        rightBtn.disabled = true;
        matched.add({ left: leftBtn, right: rightBtn, color: "green" });
      } else {
        leftBtn.classList.add("incorrect");
        rightBtn.classList.add("incorrect");
        matched.add({ left: leftBtn, right: rightBtn, color: "red" });
        setTimeout(() => {
          leftBtn.classList.remove("incorrect");
          rightBtn.classList.remove("incorrect");
          matched.delete({ left: leftBtn, right: rightBtn, color: "red" });
          drawFixedLines();
        }, 1000);
      }

      state.left = null;
      drawFixedLines();


if ([...left.children].every(b => b.disabled)) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Далее";
        nextBtn.classList.add("next-btn");
        nextBtn.style.marginTop = "20px";
        nextBtn.onclick = onComplete;
        wrapper.appendChild(nextBtn);
      }
    };
    right.appendChild(btn);
    buttonMap.push(btn);
  });

  container.appendChild(left);
  container.appendChild(right);
  wrapper.appendChild(container);
  taskContent.appendChild(wrapper);
}

  


filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
      const type = btn.dataset.content;
      if (type !== "slova") {
          taskPanel.style.display = "none";
          contentContainer.style.display = "block";
    
      }
  });
});


document.addEventListener("DOMContentLoaded", () => {
    const loginPanel = document.getElementById("login-panel");
    const registerPanel = document.getElementById("register-panel");
    const showRegisterButton = document.getElementById("show-register");
    const showLoginButton = document.getElementById("show-login");

    if (loginPanel && registerPanel && showRegisterButton && showLoginButton) {
        showRegisterButton.addEventListener("click", () => {
            loginPanel.classList.add("hidden");
            registerPanel.classList.remove("hidden");
        });

        showLoginButton.addEventListener("click", () => {
            registerPanel.classList.add("hidden");
            loginPanel.classList.remove("hidden");
        });
    } else {
        console.error("Кнопки переключения не найдены!");
    }
});






if (document.getElementById('friends-container')) {
  fetch('partials/friends.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('friends-container').innerHTML = html;

      
      document.querySelectorAll('.friend').forEach(friend => {
        friend.addEventListener('click', async () => {
          const id = friend.getAttribute('data-id');
          const name = friend.querySelector('.contact-name')?.textContent || `Друг ${id}`;
      
          selectedFriend = { id, username: name };
          document.getElementById("chat-friend-name").textContent = name;
      
          const input = document.getElementById("chat-input");
          const button = document.getElementById("send-button");
          input.disabled = false;
          button.disabled = false;
      
          const messagesContainer = document.getElementById("chat-messages");
          messagesContainer.innerHTML = "";
      
          try {
            const res = await fetch(`/api/messages/${id}`, { credentials: "include" });
            const messages = await res.json();
            messages.forEach(msg => {
              const msgDiv = document.createElement("div");
              msgDiv.className = msg.sender_id === window._myId ? "my-message" : "friend-message";
              msgDiv.textContent = msg.content;
              messagesContainer.appendChild(msgDiv);
            });
      
           
      
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          } catch (err) {
            console.error("Ошибка загрузки сообщений:", err);
          }
        });
      });
      
    });
}


const messageRoutes = require("./routes/messages");
app.use(messageRoutes);
