import { SITE, SOCIAL_LINKS } from '@/constants/site';
import { useEnquiry } from '@/features/enquiry/use-enquiry';

export function MobileFooter() {
  const { openEnquiry } = useEnquiry();

  return (
    <footer className="border-t border-line px-5 pt-[34px] pb-[30px] text-center">
      <div className="font-script text-[26px] text-accent">{SITE.signature}</div>
      <p className="mt-2 mb-0 text-[12.5px] leading-[1.6] text-ink-faint">
        {SITE.taglineShort}
        <br />
        Prices in {SITE.currency}
      </p>

      <nav
        aria-label="Footer"
        className="mt-5 flex justify-center gap-[26px] text-[11px] tracking-[.16em] uppercase"
      >
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
        <button
          type="button"
          onClick={() => {
            openEnquiry();
          }}
          className="cursor-pointer text-ink transition-colors hover:text-accent"
        >
          Enquire
        </button>
      </nav>
    </footer>
  );
}
