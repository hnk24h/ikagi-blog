import Link from 'next/link'
import { getQuizzes } from '@/lib/api/queries'
import { Container } from '@/components/layout/container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz',
  description: 'Test your knowledge with multiple-choice quizzes.',
}

export default async function QuizListPage() {
  const quizzes = await getQuizzes()

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
          </svg>
          Interactive Quizzes
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Quiz</h1>
        <p className="text-muted-foreground max-w-lg">
          Test your knowledge with interactive multiple-choice quizzes. Get instant feedback after each answer.
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
          </div>
          <p className="font-medium text-foreground mb-1">No quizzes yet</p>
          <p className="text-sm text-muted-foreground">Check back soon for new content.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-brand to-brand-dark" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Badge row */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                      </svg>
                      {quiz._count.questions} câu hỏi
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-brand transition-colors mb-2">
                    {quiz.title}
                  </h2>

                  {/* Description */}
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                      {quiz.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    {quiz.author && (
                      <span className="text-xs text-muted-foreground">{quiz.author.name}</span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:gap-2.5 transition-all">
                      Bắt đầu
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Container>
  )
}
