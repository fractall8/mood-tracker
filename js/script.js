console.log("script.js підключено");

// Записи настрою за тиждень: дата у форматі ISO та оцінка від 1 до 5
const moodEntries = [
  { date: "2026-09-09", mood: 4 },
  { date: "2026-09-10", mood: 3 },
  { date: "2026-09-11", mood: 5 },
  { date: "2026-09-12", mood: 1 },
  { date: "2026-09-13", mood: 2 },
  { date: "2026-09-14", mood: 3 },
  { date: "2026-09-15", mood: 5 },
];

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
