import { SITE, SOCIAL_LINKS } from '@/constants/site';
import { useEnquiry } from '@/features/enquiry/use-enquiry';

export function DesktopFooter() {
  const { openEnquiry } = useEnquiry();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-[30px] border-t border-line px-10 py-14">
      <div>
        <div className="font-script text-[30px] text-accent">{SITE.signature}</div>
        <p className="mt-2 mb-0 text-[13px] text-ink-faint">{SITE.tagline}</p>
      </div>

      <nav aria-label="Footer" className="flex gap-[30px] text-[12px] tracking-[.16em] uppercase">
        <button
          type="button"
          onClick={() => {
            openEnquiry();
          }}
          className="cursor-pointer text-ink transition-colors hover:text-accent"
        >
          Enquire
        </button>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
