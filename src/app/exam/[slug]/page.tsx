import { getExamBySlug } from "@/lib/api/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import ExamRunner from "@/components/exam/ExamRunner";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getExamBySlug(slug);
  if (!exam) return {};
  return { title: exam.title, description: exam.description ?? undefined };
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await getExamBySlug(slug);

  if (!exam) notFound();

  return (
    <Container className="py-12">
      {/* Back */}
      <Link
        href="/exam"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Tất cả đề thi
      </Link>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Đề thi trắc nghiệm
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 leading-tight">{exam.title}</h1>
        {exam.description && (
          <p className="text-muted-foreground leading-relaxed mb-4">{exam.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {exam.author && (
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                {exam.author.name.charAt(0).toUpperCase()}
              </span>
              {exam.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {exam.duration} phút
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
            </svg>
            {exam.questions.length} câu hỏi
          </span>
        </div>
      </div>

      <ExamRunner
        questions={exam.questions}
        duration={exam.duration}
        shuffleQuestions={exam.shuffleQuestions}
      />
    </Container>
  );
}
