import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, Twitter, Mail, MapPin, ExternalLink } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { PrintButton } from '@/components/common/print-button'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About — CV',
  description: `${siteConfig.author.name} — Software Engineer in Tokyo, Japan.`,
}

// ─── CV Data ──────────────────────────────────────────────────────────────────

const experience = [
  {
    role: 'Software Engineer',
    company: 'Tokyo, Japan',
    period: '2022 — Present',
    bullets: [
      'Xây dựng và vận hành hệ thống backend quy mô lớn trên AWS (EC2, RDS, S3, Lambda).',
      'Thiết kế REST API và microservices với Laravel / PHP, TypeScript.',
      'Tích hợp CI/CD pipeline, Docker, tối ưu hóa deployment workflow.',
      'Làm việc trong môi trường Agile, hợp tác với team đa quốc gia.',
    ],
    current: true,
  },
  {
    role: 'Software Engineer',
    company: 'Vietnam',
    period: '2018 — 2022',
    bullets: [
      'Phát triển web application full-stack với Laravel, Vue.js, MySQL.',
      'Tham gia thiết kế database, API design và code review.',
      'Mentor cho junior developers, dẫn dắt các sprint planning.',
      'Triển khai hạ tầng cơ bản trên VPS / shared hosting.',
    ],
  },
  {
    role: 'Junior Developer',
    company: 'Vietnam',
    period: '2015 — 2018',
    bullets: [
      'Bắt đầu với PHP, HTML/CSS, JavaScript — tự học là chủ yếu.',
      'Làm freelance và các dự án nhỏ, xây dựng nền tảng kỹ thuật.',
    ],
  },
]

const skills: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['TypeScript', 'PHP', 'JavaScript', 'SQL', 'Bash'] },
  { label: 'Frameworks', items: ['Next.js', 'React', 'Laravel', 'Node.js'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Nginx', 'GitHub Actions'] },
  { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'Redis'] },
  { label: 'Tools', items: ['Git', 'Linux', 'VS Code', 'Figma'] },
]

const languages = [
  { lang: 'Tiếng Việt', level: 'Native' },
  { lang: 'Tiếng Anh', level: 'Professional' },
  { lang: 'Tiếng Nhật', level: 'Business (N2)' },
]

const interests = [
  'Cloud Architecture',
  'AI / LLM Applications',
  'Developer Tooling',
  'Technical Writing',
  'Open Source',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── CV Header ── */}
      <div className="border-b bg-card">
        <Container size="xl" className="py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Identity */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-2xl font-black text-brand-fg shadow-md">
                {siteConfig.author.name.split(' ').pop()?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{siteConfig.author.name}</h1>
                <p className="text-base text-muted-foreground">Software Engineer</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-brand" />
                    {siteConfig.author.location}
                  </span>
                  <span className="text-border">·</span>
                  <span>from {siteConfig.author.origin}</span>
                </div>
              </div>
            </div>

            {/* Contact + Print */}
            <div className="flex flex-col gap-2 text-sm print:hidden sm:items-end">
              <a
                href={`https://github.com/${siteConfig.author.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" /> github.com/{siteConfig.author.github}
              </a>
              <a
                href={`https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-3.5 w-3.5" /> {siteConfig.author.twitter}
              </a>
              <a
                href="mailto:contact@ikagi.site"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" /> contact@ikagi.site
              </a>
              <PrintButton />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Body ── */}
      <Container size="xl" className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:gap-14">

          {/* ── Left: Main content ── */}
          <div className="space-y-10 min-w-0">

            {/* Profile */}
            <section>
              <SectionTitle>Profile</SectionTitle>
              <p className="text-[15px] leading-relaxed text-foreground/80">
                Software engineer với hơn 8 năm kinh nghiệm, hiện đang làm việc tại Tokyo, Nhật Bản.
                Có nền tảng vững về backend development, cloud infrastructure và API design. Quen làm
                việc trong môi trường quốc tế, có khả năng giao tiếp bằng tiếng Anh và tiếng Nhật.
                Đang tập trung phát triển kỹ năng về AI applications và cloud-native architecture.
              </p>
            </section>

            {/* Experience */}
            <section>
              <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
              <div className="space-y-8">
                {experience.map((job) => (
                  <div key={job.period} className="relative pl-4">
                    {/* Left accent bar */}
                    <div
                      className={`absolute left-0 top-1 h-full w-0.5 rounded-full ${
                        job.current ? 'bg-brand' : 'bg-border'
                      }`}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-semibold text-foreground">{job.role}</span>
                        <span className="ml-2 text-sm text-muted-foreground">· {job.company}</span>
                      </div>
                      <span
                        className={`text-xs font-medium tabular-nums ${
                          job.current ? 'text-brand' : 'text-muted-foreground'
                        }`}
                      >
                        {job.period}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5">
                      {job.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm leading-relaxed text-foreground/75"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Blog */}
            <section>
              <SectionTitle>Blog & Writing</SectionTitle>
              <div className="flex items-start justify-between gap-4 rounded-xl border bg-muted/30 p-4">
                <div>
                  <p className="font-semibold">{siteConfig.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Blog cá nhân về IT, AWS, AI và cuộc sống của một developer Việt Nam tại Nhật Bản.
                    Viết bằng tiếng Việt, tập trung vào trải nghiệm thực tế, không phải tutorial lý thuyết.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="flex shrink-0 items-center gap-1 text-sm text-brand hover:underline"
                >
                  Xem blog <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-8">

            {/* Skills */}
            <section>
              <SectionTitle>Kỹ năng</SectionTitle>
              <div className="space-y-4">
                {skills.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <SectionTitle>Ngôn ngữ</SectionTitle>
              <ul className="space-y-2">
                {languages.map((l) => (
                  <li key={l.lang} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{l.lang}</span>
                    <span className="text-muted-foreground">{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Interests */}
            <section>
              <SectionTitle>Quan tâm</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full border border-brand/25 bg-brand/8 px-2.5 py-0.5 text-xs text-brand"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </Container>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteConfig.author.name,
            jobTitle: 'Software Engineer',
            url: siteConfig.url,
            sameAs: [
              `https://twitter.com/${siteConfig.author.twitter.replace('@', '')}`,
              `https://github.com/${siteConfig.author.github}`,
            ],
          }),
        }}
      />
    </div>
  )
}
