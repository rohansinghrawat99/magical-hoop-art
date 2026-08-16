import { Container, Eyebrow, StepItem } from '@/components/ui';
import { SECTION_IDS } from '@/constants/navigation';
import { PROCESS_STEPS } from '@/constants/process';
import { PROCESS_SECTION } from '@/constants/site';

export function DesktopProcessSection() {
  return (
    <section id={SECTION_IDS.process.desktop} className="bg-soft px-10 py-[82px]">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-11">
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
