"use client";

import { useState } from "react";

type Option = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; question: string; explanation: string | null; questionType: string; options: Option[] };

export default function QuizPlayer({ questions }: { questions: Question[] }) {
  const [selected, setSelected] = useState<Map<number, Set<number>>>(() => new Map());
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  const isMultiple = (q: Question) => q.questionType === "multiple";

  const toggle = (qi: number, optId: number, multi: boolean) => {
    if (checked.has(qi) || finished) return;
    setSelected((prev) => {
      const next = new Map(prev);
      const cur = new Set(next.get(qi) ?? []);
      if (multi) {
        cur.has(optId) ? cur.delete(optId) : cur.add(optId);
      } else {
        cur.clear();
        cur.add(optId);
      }
      next.set(qi, cur);
      return next;
    });
  };

  const confirm = (qi: number) => {
    if (!(selected.get(qi)?.size)) return;
    setChecked((prev) => new Set([...prev, qi]));
  };

  const finish = () => setFinished(true);

  const reset = () => {
    setSelected(new Map());
    setChecked(new Set());
    setFinished(false);
  };

  const isCorrectAnswer = (q: Question, qi: number) => {
    const sel = selected.get(qi) ?? new Set();
    const correct = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id));
    return sel.size === correct.size && [...sel].every((id) => correct.has(id));
  };

  const score = questions.reduce((acc, q, qi) => {
    if (!checked.has(qi)) return acc;
    return acc + (isCorrectAnswer(q, qi) ? 1 : 0);
  }, 0);

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const progressPct = Math.round((checked.size / questions.length) * 100);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      {!finished && questions.length > 1 && (
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {checked.size}/{questions.length}
          </span>
        </div>
      )}

      {/* Score banner */}
      {finished && (
        <div className={`rounded-2xl p-6 text-center border ${pct >= 70 ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"}`}>
          <p className="text-5xl font-bold mb-2 tabular-nums">
            {score}<span className="text-2xl text-muted-foreground font-normal">/{questions.length}</span>
          </p>
          <p className={`text-xl font-semibold mb-1 ${pct >= 70 ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {pct}% chính xác
          </p>
          <p className="text-sm text-muted-foreground">
            {pct === 100 ? "Hoàn hảo! 🎉" : pct >= 80 ? "Rất tốt! 👏" : pct >= 60 ? "Khá tốt, cố lên nhé!" : "Hãy xem lại kiến thức!"}
          </p>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, qi) => {
        const isConfirmed = checked.has(qi);
        const sel = selected.get(qi) ?? new Set();
        const multi = isMultiple(q);
        const isRight = isConfirmed && isCorrectAnswer(q, qi);

        return (
          <div
            key={q.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isConfirmed
                ? isRight
                  ? "border-green-300 dark:border-green-800"
                  : "border-red-300 dark:border-red-800"
                : "border-border"
            }`}
          >
            {/* Question header */}
            <div className={`px-6 pt-5 pb-4 ${
              isConfirmed
                ? isRight
                  ? "bg-green-50/50 dark:bg-green-950/20"
                  : "bg-red-50/50 dark:bg-red-950/20"
                : "bg-card"
            }`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isConfirmed
                    ? isRight
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isConfirmed ? (isRight ? "✓" : "✗") : qi + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground leading-relaxed">{q.question}</p>
                  {multi && (
                    <span className="inline-flex mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Chọn nhiều đáp án
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="px-6 pb-5 bg-card space-y-2 pt-3">
              {q.options.map((opt) => {
                const isSel = sel.has(opt.id);
                let cls = "bg-background border-border hover:bg-muted/50 hover:border-foreground/20 cursor-pointer";
                if (isConfirmed) {
                  if (opt.isCorrect) cls = "bg-green-50 border-green-400 dark:bg-green-950/30 dark:border-green-600";
                  else if (isSel) cls = "bg-red-50 border-red-400 dark:bg-red-950/30 dark:border-red-600";
                  else cls = "bg-background border-border opacity-60";
                } else if (isSel) {
                  cls = "bg-primary/5 border-primary cursor-pointer";
                }

                const indicatorCls = isConfirmed
                  ? opt.isCorrect
                    ? "border-green-500 bg-green-500 text-white"
                    : isSel
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-muted-foreground/30 bg-background"
                  : isSel
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background";

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggle(qi, opt.id, multi)}
                    disabled={isConfirmed || finished}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-150 disabled:cursor-default ${cls}`}
                  >
                    <span className={`w-5 h-5 flex-shrink-0 ${multi ? "rounded" : "rounded-full"} border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${indicatorCls}`}>
                      {isConfirmed
                        ? opt.isCorrect ? "✓" : isSel ? "✗" : ""
                        : isSel ? "✓" : ""}
                    </span>
                    <span className="text-foreground">{opt.text}</span>
                  </button>
                );
              })}

              {/* Explanation */}
              {isConfirmed && q.explanation && (
                <div className="flex gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300">
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <span><span className="font-semibold">Giải thích: </span>{q.explanation}</span>
                </div>
              )}

              {/* Check answer button */}
              {!isConfirmed && (
                <button
                  type="button"
                  onClick={() => confirm(qi)}
                  disabled={!sel.size}
                  className="mt-1 px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Kiểm tra đáp án
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Finish */}
      {!finished && checked.size > 0 && checked.size === questions.length && (
        <button
          type="button"
          onClick={finish}
          className="w-full py-4 bg-brand text-brand-fg rounded-2xl text-base font-semibold hover:opacity-90 transition-opacity"
        >
          Xem kết quả →
        </button>
      )}

      {/* Reset */}
      {finished && (
        <button
          type="button"
          onClick={reset}
          className="w-full py-3 border border-border rounded-2xl text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          Làm lại
        </button>
      )}
    </div>
  );
}

