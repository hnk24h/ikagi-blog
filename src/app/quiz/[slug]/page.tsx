import { apiFetch } from "@/lib/api/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import QuizPlayer from "@/components/quiz/quiz-player";

type Option = { id: number; text: string; isCorrect: boolean; order: number };
type Question = { id: number; question: string; explanation: string | null; tip: string | null; questionType: string; order: number; options: Option[] };
type Quiz = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  createdAt: string;
  author: { name: string; slug: string; avatar: string | null } | null;
  questions: Question[];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await apiFetch<Quiz>(`/quizzes/${slug}`, { next: { revalidate: 3600 } });
  if (!quiz) return {};
  return { title: quiz.title, description: quiz.description ?? undefined };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await apiFetch<Quiz>(`/quizzes/${slug}`, { next: { revalidate: 3600 } });

  if (!quiz) notFound();

  return (
    <Container className="py-12 max-w-2xl!">
      {/* Back */}
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Tất cả quiz
      </Link>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand mb-3">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
          </svg>
          Quiz
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 leading-tight">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-muted-foreground leading-relaxed mb-4">{quiz.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {quiz.author && (
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                {quiz.author.name.charAt(0).toUpperCase()}
              </span>
              {quiz.author.name}
            </span>
          )}
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
            </svg>
            {quiz.questions.length} câu hỏi
          </span>
        </div>
      </div>

      <QuizPlayer questions={quiz.questions} />
    </Container>
  );
}
