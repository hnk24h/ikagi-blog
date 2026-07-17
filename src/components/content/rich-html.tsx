type RichHtmlProps = {
  html: string;
  className?: string;
};

const ENCODED_HTML_TAG_PATTERN =
  /&lt;\/?(?:p|div|span|br|strong|em|u|sup|sub|ul|ol|li|blockquote|figure|figcaption|img|a|table|thead|tbody|tr|td|th|math)\b/i;

function normalizeHtml(html: string) {
  if (!html || !ENCODED_HTML_TAG_PATTERN.test(html)) return html;

  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export default function RichHtml({ html, className }: RichHtmlProps) {
  return (
    <div
      className={`question-rich ${className ?? ""}`.trim()}
      dangerouslySetInnerHTML={{ __html: normalizeHtml(html) }}
    />
  );
}