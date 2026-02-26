"use client";

const QUESTIONS = [
  "오늘 가장 이루고 싶은 소원은 무엇인가요?",
  "10년 후의 나에게 한마디 한다면?",
  "가장 감사한 순간은 언제였나요?",
  "올해 꼭 해보고 싶은 새로운 도전은?",
  "지금 가장 응원하고 싶은 사람은 누구인가요?",
  "나를 가장 행복하게 하는 작은 것은?",
  "이번 주 나에게 주고 싶은 선물은?",
];

function getTodayQuestion() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUESTIONS[dayOfYear % QUESTIONS.length];
}

export default function DailyQuestion() {
  return (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-400">
        오늘의 질문
      </p>
      <p className="text-lg font-medium text-purple-700">{getTodayQuestion()}</p>
    </div>
  );
}
