import type { Metadata } from 'next'
import { MapPin, BookOpen, Zap, GraduationCap, CalendarDays } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { getNowPage } from '@/lib/api/queries'
import { siteConfig } from '@/config/site'
import type { NowPage } from '@/types/blog'

export const metadata: Metadata = {
  title: 'Now',
  description: `Dạo này ${siteConfig.author.name} đang làm gì?`,
}

// ── Mock data (dev only) ─────────────────────────────────────────────────────
const MOCK: NowPage = {
  location: 'Tokyo, Japan 🇯🇵',
  status:
    'Đang tập trung vào việc xây dựng sản phẩm cá nhân và cải thiện tiếng Nhật hàng ngày. Cũng đang cố gắng ngủ sớm hơn — chưa thành công lắm.',
  focus: [
    { icon: '🛠️', text: 'Xây dựng blog cá nhân với Next.js 15 + Laravel' },
    { icon: '🇯🇵', text: 'Luyện thi JLPT N3 — mục tiêu thi tháng 12' },
    { icon: '💪', text: 'Tập gym 3 buổi/tuần, đang theo chương trình PPL' },
  ],
  reading: [
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', type: 'book' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', type: 'book' },
    { title: 'Overreacted', author: 'Dan Abramov', type: 'blog', url: 'https://overreacted.io' },
    { title: 'ByteByteGo Newsletter', type: 'article' },
  ],
  learning: [
    { text: 'Laravel Filament v4 — xây dựng admin panel' },
    { text: 'Kubernetes cơ bản — đang học qua killer.sh' },
    { text: 'Tiếng Nhật N3 — ngữ pháp て-form và passive voice' },
  ],
  vocabulary: [
    { word: '頑張る', reading: 'がんばる', meaning: 'cố gắng, nỗ lực', type: 'verb', example: '毎日頑張っています。(Mỗi ngày tôi đều cố gắng.)' },
    { word: '懐かしい', reading: 'なつかしい', meaning: 'hoài niệm, nhớ nhung', type: 'adjective', example: '懐かしい音楽を聴いた。(Tôi đã nghe nhạc gợi nhớ kỷ niệm.)' },
    { word: '積ん読', reading: 'つんどく', meaning: 'mua sách nhưng không đọc (để chất đống)', type: 'noun' },
    { word: '木漏れ日', reading: 'こもれび', meaning: 'ánh nắng lọc qua kẽ lá cây', type: 'noun' },
    { word: '仕方がない', reading: 'しかたがない', meaning: 'không có cách nào khác, đành chịu', type: 'other', example: '雨が降ったので、仕方がない。' },
    { word: '曖昧', reading: 'あいまい', meaning: 'mơ hồ, không rõ ràng', type: 'adjective' },
  ],
  content_updated_at: new Date().toISOString(),
}

const IS_DEV = process.env.NODE_ENV === 'development'

const typeIcons: Record<string, string> = {
  book: '📖',
  article: '📰',
  blog: '✍️',
  video: '🎥',
  podcast: '🎙️',
}

const vocabTypeLabel: Record<string, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
  other: '他',
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-brand">{icon}</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export default async function NowPage() {
  const now = IS_DEV ? MOCK : await getNowPage()

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="border-b bg-card">
        <Container size="xl" className="py-8 sm:py-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Đang online</span>
              {now?.location && (
                <>
                  <span className="text-border">·</span>
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  <span>{now.location}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Dạo này</h1>
            <p className="text-muted-foreground">
              Trang này là snapshot cuộc sống hiện tại của tôi — đang làm gì, đang đọc gì, đang học gì.
            </p>
            {now?.content_updated_at && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Cập nhật:{' '}
                {new Date(now.content_updated_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* No data fallback */}
        {!now && (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            Chưa có nội dung. Cập nhật qua trang admin.
          </div>
        )}

        {now && (
          <>
            {/* Status */}
            {now.status && (
              <section>
                <p className="rounded-xl border-l-4 border-brand bg-muted/40 px-5 py-4 text-[15px] leading-relaxed text-foreground/80 italic">
                  {now.status}
                </p>
              </section>
            )}

            {/* Focus */}
            {now.focus.length > 0 && (
              <section>
                <SectionHeader icon={<Zap className="h-4 w-4" />} title="Đang focus vào" />
                <ul className="space-y-3">
                  {now.focus.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 text-lg leading-none">{item.icon ?? '▸'}</span>
                      <span className="text-[15px] leading-relaxed text-foreground/80">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reading */}
            {now.reading.length > 0 && (
              <section>
                <SectionHeader icon={<BookOpen className="h-4 w-4" />} title="Đang đọc / xem" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {now.reading.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-brand/30"
                    >
                      <span className="mt-0.5 text-xl leading-none">
                        {typeIcons[item.type ?? 'book'] ?? '📄'}
                      </span>
                      <div className="min-w-0">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-foreground hover:text-brand hover:underline"
                          >
                            {item.title}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{item.title}</p>
                        )}
                        {item.author && (
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learning */}
            {now.learning.length > 0 && (
              <section>
                <SectionHeader icon={<GraduationCap className="h-4 w-4" />} title="Đang học" />
                <ul className="space-y-2">
                  {now.learning.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Vocabulary */}
            {now.vocabulary.length > 0 && (
              <section>
                <SectionHeader
                  icon={<span className="text-base">🇯🇵</span>}
                  title={`Từ vựng hôm nay · ${now.vocabulary.length} từ`}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {now.vocabulary.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-card p-4 transition-colors hover:border-brand/30"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xl font-bold tracking-wide text-foreground">
                          {item.word}
                        </span>
                        {item.type && (
                          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {vocabTypeLabel[item.type] ?? item.type}
                          </span>
                        )}
                      </div>
                      {item.reading && (
                        <p className="mt-0.5 text-sm text-brand">{item.reading}</p>
                      )}
                      <p className="mt-1.5 text-sm font-medium text-foreground/80">{item.meaning}</p>
                      {item.example && (
                        <p className="mt-2 border-t pt-2 text-xs italic text-muted-foreground">
                          {item.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Container>
    </div>
  )
}
