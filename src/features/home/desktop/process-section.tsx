import { Container, Eyebrow, StepItem } from '@/components/ui';
import { SECTION_IDS } from '@/constants/navigation';
import { PROCESS_STEPS } from '@/constants/process';
import { PROCESS_SECTION } from '@/constants/site';

export function DesktopProcessSection() {
  return (
    <section id={SECTION_IDS.process.desktop} className="bg-soft px-10 py-[82px]">
      {/* 200px, not the design's 220px: the design had four steps and there are
          now five, and at 220px the fifth wrapped onto a row of its own. 200px
          is the widest minimum that still fits five across the 1180px column.
          Still `auto-fit`, so narrower desktops drop to four and then three. */}
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-11">
        <div className="col-span-full max-w-[52ch]">
          <Eyebrow className="mb-[14px]">{PROCESS_SECTION.eyebrow}</Eyebrow>
          <h2 className="m-0 font-display text-section-sm leading-[1.1] font-light">
            {PROCESS_SECTION.heading}
          </h2>
        </div>

        <ol className="contents">
          {PROCESS_STEPS.map((step) => (
            <StepItem key={step.n} step={step} />
          ))}
        </ol>
      </Container>
    </section>
  );
}
