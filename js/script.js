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
const renderEntries = (entries) => {
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
    card.append(title, note);
    listContainer.append(card);
  }

  console.log("Додано карток у контейнер:", listContainer.children.length);
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
