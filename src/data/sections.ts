// Central registry of the site's five sections. Every place that needs a
// section's display name, description, or ordering reads from here, so
// adding a sixth section later is a one-place edit plus a new folder of
// posts — not a hunt through hand-built nav markup.

export type SectionSlug = 'faith' | 'stewardship' | 'family' | 'culture' | 'vocation';

export interface SectionMeta {
  slug: SectionSlug;
  name: string;
  /** Short standfirst shown at the top of the section's landing page. */
  description: string;
  /** One-line note shown in the nav's title attribute and RSS description. */
  short: string;
}

export const sections: SectionMeta[] = [
  {
    slug: 'faith',
    name: 'Faith',
    short: 'Doctrine, prayer, liturgical life, and the interior life.',
    description:
      "On doctrine, prayer, and the liturgical year — the parts of the faith that don't change, and what it takes to actually live inside them day to day.",
  },
  {
    slug: 'stewardship',
    name: 'Stewardship',
    short: 'Investing, work, inheritance, and property in light of Catholic social teaching.',
    description:
      'On money, property, and inheritance, read through Catholic social teaching and the distributist tradition. This section is commentary and formation, never personalized financial or legal advice — for decisions that touch your own household, talk to a licensed advisor, accountant, or attorney who knows your circumstances.',
  },
  {
    slug: 'family',
    name: 'Family',
    short: 'Marriage, children, home life, and formation.',
    description:
      'On marriage, raising children, and the slow work of making a home — the ordinary formation that happens at the table and in the car, not just at the altar.',
  },
  {
    slug: 'culture',
    name: 'Culture',
    short: 'The news, film, books, and public life, read through a faith and philosophical lens.',
    description:
      "On the news of the week, and on film, books, and public life — trying to see what's actually in front of us, through a lens ground by faith and by Aristotle and Aquinas rather than by whichever side is shouting loudest.",
  },
  {
    slug: 'vocation',
    name: 'Vocation',
    short: 'Work, trades, land, calling, distributism, and the dignity of labor.',
    description:
      'On work, trades, land, and calling — subsidiarity and distributism not as a policy platform but as a way of asking what a piece of work is actually for, and who it ought to serve.',
  },
];

export function getSection(slug: string): SectionMeta | undefined {
  return sections.find((s) => s.slug === slug);
}
