import Link from 'next/link'
import { getTips } from '@/lib/api/queries'
import { Container } from '@/components/layout/container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mẹo thi',
  description: 'Tổng hợp các mẹo, kỹ thuật và kiến thức trọng tâm cho từng câu hỏi.',
}

export default async function TipsPage() {
  const groups = await getTips()
  const totalTips = groups.reduce((acc, g) => acc + g.tips.length, 0)

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
            <path d="M9 21h6"/>
          </svg>
          Mẹo &amp; Kỹ thuật
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Mẹo thi</h1>
        <p className="text-muted-foreground max-w-lg">
          Tổng hợp {totalTips} mẹo từ {groups.length} bộ quiz — kỹ thuật ghi nhớ, cách tiếp cận câu hỏi, và kiến thức trọng tâm.
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
            </svg>
          </div>
          <p className="font-medium text-foreground mb-1">Chưa có mẹo nào</p>
          <p className="text-sm text-muted-foreground">Mẹo sẽ xuất hiện khi quiz có trường "Mẹo" được điền.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.quiz.id}>
              {/* Quiz section header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{group.quiz.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{group.tips.length} mẹo</p>
                </div>
                <Link
                  href={`/quiz/${group.quiz.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Vào quiz
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              <div className="space-y-4">
                {group.tips.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    {/* Question context */}
                    <div className="px-5 pt-4 pb-3 border-b border-border/60 bg-muted/30">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground/70">Câu hỏi: </span>
                        {item.question}
                      </p>
                      {/* Correct answer hint */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.options
                          .filter((o) => o.isCorrect)
                          .map((o) => (
                            <span
                              key={o.id}
                              className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-950/40 dark:text-green-400"
                            >
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              {o.text}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Tip content */}
                    <div className="px-5 py-4">
                      <div className="flex gap-2.5">
                        <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                            <path d="M9 21h6"/>
                          </svg>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line flex-1">
                          {item.tip}
                        </p>
                      </div>

                      {/* Explanation (if any) */}
                      {item.explanation && item.explanation.trim() && (
                        <div className="mt-3 pl-9 text-sm text-muted-foreground leading-relaxed">
                          <span className="font-medium text-foreground/60">Giải thích: </span>
                          <span className="whitespace-pre-line">{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  )
}
