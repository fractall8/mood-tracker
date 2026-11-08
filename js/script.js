// Адреса мок-API: коментарі JSONPlaceholder трактуємо як записи настрою
// (name — заголовок запису, body — текст нотатки, email — автор)
const API_URL = "https://jsonplaceholder.typicode.com/comments?postId=1";

console.log("script.js підключено");

// Записи настрою за тиждень: дата у форматі ISO, оцінка від 1 до 5 і текстова нотатка
const moodEntries = [
  { date: "2026-09-09", mood: 4, note: "Продуктивний день, встиг усе заплановане." },
  { date: "2026-09-10", mood: 3, note: "Нічого особливого не сталося." },
  { date: "2026-09-11", mood: 5, note: "Зустрівся з друзями, чудовий вечір." },
  { date: "2026-09-12", mood: 1, note: "Погано спав і посварився через дрібницю." },
  { date: "2026-09-13", mood: 2, note: "Багато завдань і мало сну." },
  { date: "2026-09-14", mood: 3, note: "Спокійний день без особливих подій." },
  { date: "2026-09-15", mood: 5, note: "Крутий день." },
];

// Контейнер, у який скрипт додаватиме картки записів
const listContainer = document.querySelector("#mood-history");

// Прибираємо статичні картки-приклади з розмітки — далі список формує JS
let staticCard = listContainer.querySelector(".card");

while (staticCard !== null) {
  staticCard.remove();
  staticCard = listContainer.querySelector(".card");
}

console.log("Статичні картки видалено. Залишилось у контейнері:", listContainer.children.length);

// Рахує циклом суму оцінок, виводить підсумок у консоль і повертає середній настрій
const getAverageMood = (entries) => {
  let sum = 0;

  for (let i = 0; i < entries.length; i++) {
    sum += entries[i].mood;
  }

  const average = sum / entries.length;

  console.log("Кількість записів:", entries.length);
  console.log("Сума оцінок:", sum);
  console.log("Середній настрій:", average.toFixed(2));

  return average;
};

const averageMood = getAverageMood(moodEntries);

// Класифікує середній настрій: від 3 і вище — гарний тиждень, нижче — важкий
const classifyWeek = (average) => {
  if (average >= 3) {
    return "гарний тиждень";
  } else {
    return "важкий тиждень";
  }
};

const weekSummary = classifyWeek(averageMood);

console.log("Оцінка періоду:", weekSummary);

// Довідник: числова оцінка настрою -> її текстова назва
const moodLabels = {
  1: "жахливий",
  2: "поганий",
  3: "нейтральний",
  4: "добрий",
  5: "чудовий",
};

// Повертає текстову назву рівня настрою за числовою оцінкою
const moodToLabel = (mood) => moodLabels[mood] ?? "невідомий";

console.log("Настрій 5 —", moodToLabel(5));
console.log("Останній запис:", moodToLabel(moodEntries[moodEntries.length - 1].mood));
console.log("Середній настрій словами:", moodToLabel(Math.round(averageMood)));

// Довідник: текстова назва настрою -> клас оформлення картки
const labelToClass = {
  жахливий: "mood-awful",
  поганий: "mood-bad",
  нейтральний: "mood-neutral",
  добрий: "mood-good",
  чудовий: "mood-great",
};

// Рендер історії: на кожен запис масиву створює картку article з h3 (дата)
// і p (нотатка), ставить атрибут data-mood та клас за рівнем настрою,
// після чого додає картку в контейнер #mood-history
// Контейнер можна передати другим аргументом (за замовчуванням — #mood-history)
const renderEntries = (entries, container = listContainer) => {
  // Очищаємо контейнер, щоб повторний виклик не дублював уже намальовані картки
  container.replaceChildren();

  for (const entry of entries) {
    const label = moodToLabel(entry.mood);

    // Сама картка: атрибут із числовою оцінкою та класи оформлення
    const card = document.createElement("article");
    card.dataset.mood = entry.mood;
    card.classList.add("card");

    if (label in labelToClass) {
      card.classList.add(labelToClass[label]);
    } else {
      card.classList.add("mood-neutral");
    }

    // Вкладені елементи картки заповнюємо даними поточного запису
    const title = document.createElement("h3");
    title.textContent = entry.date;

    const note = document.createElement("p");
    note.textContent = entry.note;

    // Спершу збираємо картку в пам'яті, потім вставляємо її на сторінку
    card.append(title);

    // Автор є лише в записах, отриманих з API
    if (entry.author) {
      const author = document.createElement("p");
      author.classList.add("card__mood");
      author.textContent = entry.author;
      card.append(author);
    }

    card.append(note);
    container.append(card);
  }

  console.log("Додано карток у контейнер:", container.children.length);
};

renderEntries(moodEntries);

// Підсумок: оновлює textContent уже наявних у розмітці елементів
// #entries-count і #avg-mood — нових вузлів тут не створюємо
const renderSummary = (entries, average) => {
  const countElement = document.querySelector("#entries-count");
  const avgElement = document.querySelector("#avg-mood");

  countElement.textContent = `Усього записів: ${entries.length}`;
  avgElement.textContent = `Середній настрій: ${average.toFixed(2)} — ${moodToLabel(
    Math.round(average)
  )} (${classifyWeek(average)})`;
};

renderSummary(moodEntries, averageMood);

const form = document.querySelector("#mood-form");

// Обробник submit: скасовує перезавантаження сторінки, зчитує поля форми,
// додає новий запис у moodEntries, перемальовує список і підсумок,
// після чого очищає форму та скидає лічильник символів
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = form.querySelector("#mood-date").value;
  const mood = Number(form.querySelector("#mood-level").value);
  const note = form.querySelector("#mood-note").value.trim();

  const newEntry = { date, mood, note };

  moodEntries.push(newEntry);

  console.log("Додано запис:", newEntry);
  console.log("Усього записів у масиві:", moodEntries.length);

  renderEntries(moodEntries);
  renderSummary(moodEntries, getAverageMood(moodEntries));

  form.reset();
  updateNoteCounter();
});

const moodInput = form.querySelector("#mood-level");

// Обробник input на полі настрою: власна перевірка понад min/max —
// значення поза 1–5 позначаємо через setCustomValidity, щоб браузер
// не дав надіслати форму й показав наше повідомлення
moodInput.addEventListener("input", () => {
  const value = moodInput.value;
  const mood = Number(value);

  // Порожнє поле лишаємо стандартній перевірці required
  if (value !== "" && (mood < 1 || mood > 5)) {
    moodInput.setCustomValidity("Оцінка настрою має бути від 1 до 5.");
  } else {
    moodInput.setCustomValidity("");
  }
});

const noteInput = form.querySelector("#mood-note");
const noteCounter = document.querySelector("#note-counter");

// Оновлює лічильник: скільки символів ще можна ввести до maxlength
const updateNoteCounter = () => {
  const remaining = noteInput.maxLength - noteInput.value.length;
  noteCounter.textContent = `Залишилось символів: ${remaining}`;
};

// Обробник input на полі коментаря: оновлює лічильник на кожне натискання
noteInput.addEventListener("input", updateNoteCounter);

// Елементи блоку «Записи з сервера»: список карток, рядок успіху, індикатор
// завантаження, повідомлення про помилку та кнопка повторного запиту
const apiContainer = document.querySelector("#api-entries");
const apiStatus = document.querySelector("#api-status");
const apiLoader = document.querySelector("#api-loader");
const apiError = document.querySelector("#api-error");
const apiRefresh = document.querySelector("#api-refresh");

// Повний цикл запиту: fetch → перевірка статусу → розбір JSON → виведення карток.
// Якщо мережа недоступна чи сервер відповів помилкою, показуємо повідомлення
async function loadData() {
  // Вмикаємо ознаку завантаження ще до запиту
  apiLoader.hidden = false;
  apiRefresh.disabled = true;
  apiContainer.setAttribute("aria-busy", "true");
  apiStatus.textContent = "";
  apiError.hidden = true;

  try {
    // Чекаємо відповідь сервера; мережевий збій тут кидає виняток і веде в catch
    const response = await fetch(API_URL);

    // fetch не вважає 404/500 помилкою, тож статус перевіряємо самі
    if (!response.ok) {
      throw new Error(
        `Сервер повернув помилку ${response.status} ${response.statusText} для ${API_URL}`
      );
    }

    // Розбираємо тіло відповіді з JSON у масив об'єктів
    const data = await response.json();

    // Перевірка структури: очікуємо масив об'єктів із полями name, body, email
    console.log("Отримано з API:", data);

    // Зіставляємо поля API з формою записів moodEntries: name — заголовок картки
    // (на місці дати), body — нотатка, email — автор; оцінки настрою API не має,
    // тож ставимо нейтральну 3
    const apiEntries = data.map((item) => ({
      date: item.name,
      mood: 3,
      note: item.body,
      author: item.email,
    }));

    // Малюємо картки тією самою функцією, що й власну історію, але в окремий контейнер
    renderEntries(apiEntries, apiContainer);

    apiStatus.textContent = `Завантажено записів: ${data.length}`;
  } catch (error) {
    // Користувачу — зрозуміле повідомлення без технічних деталей
    apiError.textContent = "Записи тимчасово недоступні. Натисніть «Оновити», щоб спробувати ще раз.";
    apiError.hidden = false;

    // Розробнику — повний текст винятку й адреса запиту
    console.error(`Не вдалося завантажити записи з ${API_URL}:`, error);
  } finally {
    // Вимикаємо ознаку завантаження незалежно від того, вдався запит чи ні
    apiLoader.hidden = true;
    apiRefresh.disabled = false;
    apiContainer.removeAttribute("aria-busy");
  }
}

// Перше завантаження записів одразу після відкриття сторінки
loadData();

// Обробник click на кнопці «Оновити»: повторює запит без перезавантаження сторінки,
// щоб після мережевого збою користувач міг спробувати ще раз
apiRefresh.addEventListener("click", loadData);
