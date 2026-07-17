"use client";

import { useState } from "react";
import RichHtml from "@/components/content/rich-html";

type Option = { id: number; text: string; matchText: string | null; isCorrect: boolean; order: number };
type Question = { id: number; question: string; explanation: string | null; tip: string | null; questionType: string; options: Option[] };

function shuffleArray<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export default function QuizPlayer({ questions }: { questions: Question[] }) {
  const [selected, setSelected] = useState<Map<number, number[]>>(() => new Map());
  const [dragAssignments, setDragAssignments] = useState<Map<number, Array<number | null>>>(() => {
    const initial = new Map<number, Array<number | null>>();

    questions.forEach((question, index) => {
      if (question.questionType === "drag_drop") {
        initial.set(index, Array.from({ length: question.options.length }, () => null));
      }
    });

    return initial;
  });
  const [dragPool, setDragPool] = useState<Map<number, number[]>>(() => {
    const initial = new Map<number, number[]>();

    questions.forEach((question, index) => {
      if (question.questionType === "drag_drop") {
        initial.set(index, shuffleArray(question.options.map((option) => option.id)));
      }
    });

    return initial;
  });
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [dragState, setDragState] = useState<{ qi: number; optionId: number; sourceIndex: number | null } | null>(null);

  const isMultiple = (q: Question) => q.questionType === "multiple";
  const isDragDrop = (q: Question) => q.questionType === "drag_drop";

  const toggle = (qi: number, optId: number, multi: boolean) => {
    if (checked.has(qi) || finished) return;

    setSelected((prev) => {
      const next = new Map(prev);
      const cur = [...(next.get(qi) ?? [])];

      if (multi) {
        const existingIndex = cur.indexOf(optId);
        if (existingIndex >= 0) cur.splice(existingIndex, 1);
        else cur.push(optId);
      } else {
        cur.splice(0, cur.length, optId);
      }

      next.set(qi, cur);
      return next;
    });
  };

  const assignDragOption = (qi: number, optionId: number, targetIndex: number, sourceIndex: number | null) => {
    if (checked.has(qi) || finished) return;

    setDragAssignments((prev) => {
      const next = new Map(prev);
      const assignments = [...(next.get(qi) ?? [])];
      const previousTargetValue = assignments[targetIndex] ?? null;

      if (sourceIndex !== null) {
        assignments[sourceIndex] = null;
      }

      const existingIndex = assignments.findIndex((value) => value === optionId);
      if (existingIndex >= 0) {
        assignments[existingIndex] = null;
      }

      assignments[targetIndex] = optionId;
      next.set(qi, assignments);

      setDragPool((poolPrev) => {
        const poolNext = new Map(poolPrev);
        const currentPool = [...(poolNext.get(qi) ?? [])].filter((id) => id !== optionId);

        if (previousTargetValue !== null && previousTargetValue !== optionId) {
          currentPool.push(previousTargetValue);
        }

        poolNext.set(qi, currentPool);
        return poolNext;
      });

      return next;
    });
  };

  const unassignDragOption = (qi: number, slotIndex: number) => {
    if (checked.has(qi) || finished) return;

    setDragAssignments((prev) => {
      const next = new Map(prev);
      const assignments = [...(next.get(qi) ?? [])];
      const optionId = assignments[slotIndex];

      if (optionId === null || optionId === undefined) return prev;

      assignments[slotIndex] = null;
      next.set(qi, assignments);

      setDragPool((poolPrev) => {
        const poolNext = new Map(poolPrev);
        const currentPool = [...(poolNext.get(qi) ?? []), optionId];
        poolNext.set(qi, currentPool);
        return poolNext;
      });

      return next;
    });
  };

  const confirm = (qi: number) => {
    const question = questions[qi];
    if (!question) return;

    if (isDragDrop(question)) {
      const assignments = dragAssignments.get(qi) ?? [];
      if (assignments.some((value) => value === null) || assignments.length !== question.options.length) return;
    } else if (!(selected.get(qi)?.length)) {
      return;
    }

    setChecked((prev) => new Set([...prev, qi]));
  };

  const finish = () => setFinished(true);

  const reset = () => {
    const initialPool = new Map<number, number[]>();
    const initialAssignments = new Map<number, Array<number | null>>();

    questions.forEach((question, index) => {
      if (question.questionType === "drag_drop") {
        initialPool.set(index, shuffleArray(question.options.map((option) => option.id)));
        initialAssignments.set(index, Array.from({ length: question.options.length }, () => null));
      }
    });

    setSelected(new Map());
    setDragPool(initialPool);
    setDragAssignments(initialAssignments);
    setChecked(new Set());
    setFinished(false);
    setDragState(null);
  };

  const isCorrectAnswer = (q: Question, qi: number) => {
    if (isDragDrop(q)) {
      const assignments = dragAssignments.get(qi) ?? [];
      const correct = [...q.options].sort((left, right) => left.order - right.order);

      return assignments.length === correct.length && correct.every((option, index) => assignments[index] === option.id);
    }

    const sel = selected.get(qi) ?? [];
    const correct = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id));
    return sel.length === correct.size && sel.every((id) => correct.has(id));
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
        const sel = selected.get(qi) ?? [];
        const multi = isMultiple(q);
        const dragDrop = isDragDrop(q);
        const isRight = isConfirmed && isCorrectAnswer(q, qi);
        const leftOptions = dragDrop ? [...q.options].sort((left, right) => left.order - right.order) : [];
        const assignments = dragAssignments.get(qi) ?? [];
        const pool = dragPool.get(qi) ?? [];
        const canConfirm = dragDrop ? assignments.length === leftOptions.length && assignments.every((value) => value !== null) : sel.length > 0;

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
                  <RichHtml html={q.question} className="font-semibold text-foreground leading-relaxed" />
                  {multi && (
                    <span className="inline-flex mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Chọn nhiều đáp án
                    </span>
                  )}
                  {dragDrop && (
                    <span className="inline-flex mt-2 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium dark:bg-sky-950/30 dark:text-sky-300">
                      Ghép nội dung giữa 2 cột
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="px-6 pb-5 bg-card space-y-2 pt-3">
              {dragDrop ? (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
                  <div className="space-y-3">
                    {leftOptions.map((leftOption, index) => {
                      const assignedId = assignments[index] ?? null;
                      const assignedOption = assignedId === null
                        ? null
                        : q.options.find((option) => option.id === assignedId) ?? null;
                      const slotCorrect = isConfirmed && assignedId === leftOption.id;
                      const slotWrong = isConfirmed && assignedId !== leftOption.id;

                      return (
                        <div key={leftOption.id} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
                          <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Cột 1</p>
                            <RichHtml html={leftOption.text} className="text-foreground leading-relaxed" />
                          </div>
                          <div
                            onDragOver={(event) => {
                              if (!isConfirmed && !finished) event.preventDefault();
                            }}
                            onDrop={() => {
                              if (!dragState || dragState.qi !== qi) return;
                              assignDragOption(qi, dragState.optionId, index, dragState.sourceIndex);
                              setDragState(null);
                            }}
                            className={`rounded-xl border-2 border-dashed px-4 py-3 min-h-[96px] transition-colors ${
                              slotCorrect
                                ? "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950/20"
                                : slotWrong
                                ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                                : assignedOption
                                ? "border-sky-300 bg-sky-50/70 dark:border-sky-700 dark:bg-sky-950/20"
                                : "border-border bg-muted/20"
                            }`}
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Cột 2</p>
                            {assignedOption ? (
                              <div
                                draggable={!isConfirmed && !finished}
                                onDragStart={() => setDragState({ qi, optionId: assignedOption.id, sourceIndex: index })}
                                onDragEnd={() => setDragState(null)}
                                className={`rounded-lg border px-3 py-2 text-sm ${
                                  isConfirmed
                                    ? slotCorrect
                                      ? "border-green-400 bg-green-100/80 dark:border-green-700 dark:bg-green-900/30"
                                      : "border-red-400 bg-red-100/80 dark:border-red-700 dark:bg-red-900/30"
                                    : "border-sky-300 bg-white dark:border-sky-700 dark:bg-slate-950"
                                } ${isConfirmed || finished ? "cursor-default" : "cursor-move"}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <RichHtml
                                    html={assignedOption.matchText ?? assignedOption.text}
                                    className="min-w-0 flex-1 text-foreground leading-relaxed"
                                  />
                                  {!isConfirmed && !finished && (
                                    <button
                                      type="button"
                                      onClick={() => unassignDragOption(qi, index)}
                                      className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                      Bo ra
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Kéo item phù hợp vào đây</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    onDragOver={(event) => {
                      if (!isConfirmed && !finished) event.preventDefault();
                    }}
                    onDrop={() => {
                      if (!dragState || dragState.qi !== qi || dragState.sourceIndex === null) return;
                      unassignDragOption(qi, dragState.sourceIndex);
                      setDragState(null);
                    }}
                    className="rounded-xl border border-border bg-muted/20 p-4 h-fit"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Kho item cột 2</p>
                    <div className="space-y-2">
                      {pool.map((optionId) => {
                        const option = q.options.find((item) => item.id === optionId);
                        if (!option) return null;

                        return (
                          <div
                            key={option.id}
                            draggable={!isConfirmed && !finished}
                            onDragStart={() => setDragState({ qi, optionId: option.id, sourceIndex: null })}
                            onDragEnd={() => setDragState(null)}
                            className={`rounded-lg border border-border bg-background px-3 py-2 text-sm ${
                              isConfirmed || finished ? "cursor-default" : "cursor-grab"
                            }`}
                          >
                            <RichHtml
                              html={option.matchText ?? option.text}
                              className="text-foreground leading-relaxed"
                            />
                          </div>
                        );
                      })}
                      {!pool.length && (
                        <p className="text-sm text-muted-foreground">Tat ca item da duoc gan vao cot 2.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : q.options.map((opt) => {
                const isSel = sel.includes(opt.id);
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
                    <RichHtml html={opt.text} className="flex-1 text-foreground leading-relaxed" />
                  </button>
                );
              })}

              {isConfirmed && dragDrop && !isRight && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
                  <p className="font-semibold">Cac cap dung</p>
                  <ol className="mt-2 space-y-1">
                    {leftOptions.map((opt, index) => (
                      <li key={opt.id} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div>
                          <span className="font-medium mr-1">{index + 1}.</span>
                          <RichHtml html={opt.text} className="inline text-foreground leading-relaxed" />
                        </div>
                        <RichHtml html={opt.matchText ?? ""} className="text-foreground leading-relaxed" />
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Explanation */}
              {isConfirmed && q.explanation && (
                <div className="flex gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300">
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold">Giải thích:</span>
                    <RichHtml html={q.explanation} className="mt-1 text-sm leading-relaxed" />
                  </div>
                </div>
              )}

              {/* Tip */}
              {isConfirmed && q.tip && q.tip.trim() && (
                <div className="flex gap-2 mt-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300">
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                    <path d="M9 21h6M10 17v-1M14 17v-1"/>
                  </svg>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold">Mẹo:</span>
                    <RichHtml html={q.tip} className="mt-1 text-sm leading-relaxed" />
                  </div>
                </div>
              )}

              {/* Check answer button */}
              {!isConfirmed && (
                <button
                  type="button"
                  onClick={() => confirm(qi)}
                  disabled={!canConfirm}
                  className="mt-1 px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {dragDrop ? "Kiểm tra thứ tự" : "Kiểm tra đáp án"}
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

