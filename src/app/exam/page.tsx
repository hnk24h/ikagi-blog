import Link from 'next/link'
import { getExams } from '@/lib/api/queries'
import { Container } from '@/components/layout/container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thi trắc nghiệm',
  description: 'Luyện thi trắc nghiệm có tính giờ.',
}

export default async function ExamListPage() {
  const exams = await getExams()

  return (
    <Container className="py-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Thi trắc nghiệm có tính giờ
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Đề thi</h1>
        <p className="text-muted-foreground max-w-lg">
          Luyện thi trắc nghiệm với đồng hồ đếm ngược, điều hướng từng câu như thi thật.
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
            </svg>
          </div>
          <p className="font-medium text-foreground mb-1">Chưa có đề thi nào</p>
          <p className="text-sm text-muted-foreground">Quay lại sau nhé!</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">{exams.length} đề thi</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="h-1 bg-gradient-to-r from-primary to-blue-400" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {exam.duration} phút
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {exam._count.questions} câu
                    </span>
                  </div>

                  <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-2">
                    {exam.title}
                  </h2>

                  {exam.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                      {exam.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    {exam.author && (
                      <span className="text-xs text-muted-foreground">{exam.author.name}</span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Vào thi
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
