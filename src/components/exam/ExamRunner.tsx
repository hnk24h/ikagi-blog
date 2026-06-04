"use client";

import { useState, useEffect, useCallback } from "react";

type Option = { id: number; text: string; isCorrect: boolean };
type Question = {
  id: number;
  question: string;
  explanation: string | null;
  questionType: string;
  options: Option[];
};

type ExamRunnerProps = {
  questions: Question[];
  duration: number; // minutes
  shuffleQuestions: boolean;
};

type AnswerMap = Map<number, Set<number>>; // questionId → selected optionIds

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamRunner({ questions: rawQuestions, duration, shuffleQuestions }: ExamRunnerProps) {
  const [phase, setPhase] = useState<"intro" | "exam" | "result">("intro");
  const [questions] = useState<Question[]>(() =>
    shuffleQuestions ? shuffleArray(rawQuestions) : rawQuestions
  );
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(new Map());
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [flagged, setFlagged] = useState<Set<number>>(new Set()); // flagged question indices

  const isMultiple = (q: Question) => q.questionType === "multiple";

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) { setPhase("result"); return; }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const toggle = (q: Question, optId: number) => {
    const multi = isMultiple(q);
    setAnswers((prev) => {
      const next = new Map(prev);
      const cur = new Set(next.get(q.id) ?? []);
      if (multi) {
        cur.has(optId) ? cur.delete(optId) : cur.add(optId);
      } else {
        cur.clear();
        cur.add(optId);
      }
      next.set(q.id, cur);
      return next;
    });
  };

  const toggleFlag = (idx: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const submit = useCallback(() => setPhase("result"), []);

  // Scoring
  const getScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const sel = answers.get(q.id) ?? new Set();
      const rightIds = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id));
      if (sel.size === rightIds.size && [...sel].every((id) => rightIds.has(id))) correct++;
    });
    return correct;
  };

  const answeredCount = answers.size;
  const pct = (answeredCount / questions.length) * 100;
  const timerDanger = timeLeft <= 60;
  const timerWarn = timeLeft <= 300 && !timerDanger;

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Sẵn sàng chưa?</h2>
        <div className="space-y-1.5 text-sm text-muted-foreground mb-6">
          <p>⏱ Thời gian: <strong className="text-foreground">{duration} phút</strong></p>
          <p>📝 Số câu: <strong className="text-foreground">{questions.length} câu hỏi</strong></p>
          <p>🔀 Xáo trộn: <strong className="text-foreground">{shuffleQuestions ? "Có" : "Không"}</strong></p>
          <p className="pt-1 text-xs">Đồng hồ bắt đầu ngay khi bấm "Bắt đầu thi".</p>
        </div>
        <button
          type="button"
          onClick={() => setPhase("exam")}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Bắt đầu thi →
        </button>
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (phase === "result") {
    const score = getScore();
    const scorePct = Math.round((score / questions.length) * 100);
    const timeUsed = duration * 60 - timeLeft;

    return (
      <div className="space-y-6">
        {/* Score banner */}
        <div className={`rounded-2xl p-8 text-center border ${scorePct >= 70 ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"}`}>
          <p className="text-6xl font-bold tabular-nums mb-2">
            {score}<span className="text-3xl text-muted-foreground font-normal">/{questions.length}</span>
          </p>
          <p className={`text-2xl font-semibold mb-1 ${scorePct >= 70 ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {scorePct}% chính xác
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            {scorePct === 100 ? "Hoàn hảo! 🎉" : scorePct >= 80 ? "Rất tốt! 👏" : scorePct >= 60 ? "Khá tốt, cố lên!" : "Cần ôn luyện thêm!"}
          </p>
          <div className="flex justify-center gap-8 mt-4 text-sm text-muted-foreground">
            <span>✅ Đúng: <strong>{score}</strong></span>
            <span>❌ Sai: <strong>{questions.length - score}</strong></span>
            <span>⏱ Thời gian: <strong>{formatTime(timeUsed)}</strong></span>
          </div>
        </div>

        {/* Answer review */}
        <h3 className="font-semibold text-foreground">Xem lại đáp án</h3>
        {questions.map((q, qi) => {
          const sel = answers.get(q.id) ?? new Set();
          const rightIds = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id));
          const isRight = sel.size === rightIds.size && [...sel].every((id) => rightIds.has(id));
          return (
            <div key={q.id} className={`rounded-2xl border overflow-hidden ${isRight ? "border-green-300 dark:border-green-800" : "border-red-300 dark:border-red-800"}`}>
              <div className={`px-5 pt-4 pb-3 flex items-start gap-3 ${isRight ? "bg-green-50/50 dark:bg-green-950/20" : "bg-red-50/50 dark:bg-red-950/20"}`}>
                <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isRight ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                  {isRight ? "✓" : "✗"}
                </span>
                <div>
                  <span className="text-xs text-muted-foreground mr-2">Câu {qi + 1}</span>
                  <span className="font-semibold text-foreground text-sm leading-snug">{q.question}</span>
                </div>
              </div>
              <div className="px-5 pb-4 bg-card space-y-1.5 pt-3">
                {q.options.map((opt) => {
                  const wasSel = sel.has(opt.id);
                  let cls = "bg-background border-border opacity-60";
                  if (opt.isCorrect) cls = "bg-green-50 border-green-400 dark:bg-green-950/30 dark:border-green-600";
                  else if (wasSel) cls = "bg-red-50 border-red-400 dark:bg-red-950/30 dark:border-red-600";
                  return (
                    <div key={opt.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${cls}`}>
                      <span className={`w-4 h-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${opt.isCorrect ? "border-green-500 bg-green-500 text-white" : wasSel ? "border-red-500 bg-red-500 text-white" : "border-muted-foreground/30"}`}>
                        {opt.isCorrect ? "✓" : wasSel ? "✗" : ""}
                      </span>
                      <span className="text-foreground">{opt.text}</span>
                    </div>
                  );
                })}
                {q.explanation && (
                  <div className="flex gap-2 mt-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300">
                    <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span><strong>Giải thích: </strong>{q.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => { setPhase("intro"); setAnswers(new Map()); setTimeLeft(duration * 60); setFlagged(new Set()); setCurrent(0); }}
          className="w-full py-3 border border-border rounded-2xl text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          Làm lại
        </button>
      </div>
    );
  }

  // ── Exam screen ───────────────────────────────────────────────────────────
  const q = questions[current];
  const sel = answers.get(q.id) ?? new Set();
  const multi = isMultiple(q);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      {/* Main question area */}
      <div className="flex-1 min-w-0">
        {/* Timer + progress bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className={`font-mono font-bold text-base ${timerDanger ? "text-red-500 animate-pulse" : timerWarn ? "text-amber-500" : "text-foreground"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{answeredCount}/{questions.length} đã trả lời</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Câu {current + 1}/{questions.length}
                </span>
                <p className="font-semibold text-foreground leading-relaxed">{q.question}</p>
                {multi && (
                  <span className="inline-flex mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Chọn nhiều đáp án
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleFlag(current)}
                title={flagged.has(current) ? "Bỏ đánh dấu" : "Đánh dấu cần xem lại"}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${flagged.has(current) ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-muted-foreground hover:bg-muted"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={flagged.has(current) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-2.5">
            {q.options.map((opt) => {
              const isSel = sel.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(q, opt.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-100 ${
                    isSel
                      ? "bg-primary/5 border-primary"
                      : "bg-background border-border hover:bg-muted/50 hover:border-foreground/20"
                  }`}
                >
                  <span className={`w-5 h-5 flex-shrink-0 ${multi ? "rounded" : "rounded-full"} border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isSel ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 bg-background"
                  }`}>
                    {isSel && "✓"}
                  </span>
                  <span className="text-foreground">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="px-6 pb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            >
              ← Trước
            </button>
            {current < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrent((c) => c + 1)}
                className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Nộp bài
              </button>
            )}
            <div className="flex-1" />
            {answeredCount === questions.length && current < questions.length - 1 && (
              <button
                type="button"
                onClick={submit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Nộp bài
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar: question navigator */}
      <div className="lg:w-52 flex-shrink-0">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Điều hướng</p>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((question, idx) => {
              const hasAnswer = (answers.get(question.id)?.size ?? 0) > 0;
              const isCurrent = idx === current;
              const isFlagged = flagged.has(idx);
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  title={`Câu ${idx + 1}${isFlagged ? " (đánh dấu)" : ""}`}
                  className={`relative w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                      : hasAnswer
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-primary/15 border border-primary/30 flex-shrink-0" />
              Đã trả lời ({answeredCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-muted flex-shrink-0" />
              Chưa trả lời ({questions.length - answeredCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-muted flex-shrink-0 flex items-center justify-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
              </span>
              Đánh dấu ({flagged.size})
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={submit}
            className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}
