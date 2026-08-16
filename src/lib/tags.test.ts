import { describe, expect, it } from 'vitest';

import { ARTWORKS } from '@/constants/artworks';
import { ALL_TAGS, getArtwork, getTags, searchArtworks } from '@/data/catalogue';

function titlesFor(query: string): string[] {
  return searchArtworks(query).map((a) => a.title);
}

function idsFor(query: string): string[] {
  return searchArtworks(query).map((a) => a.id);
}

describe('derived tags', () => {
  it('tags every artwork without anyone writing tags by hand', () => {
    for (const artwork of ARTWORKS) {
      expect(getTags(artwork).length, artwork.id).toBeGreaterThan(2);
    }
  });

  it('drops filler words that carry no search signal', () => {
    const tags = getTags(getArtwork('decor', 'knot-stitched-swastik')!);
    for (const noise of ['with', 'and', 'the', 'some', 'hoop', 'theme']) {
      expect(tags).not.toContain(noise);
    }
  });

  it('lifts meaningful words straight from the title', () => {
    const tags = getTags(getArtwork('thoughts', 'rainbow-and-cloud-theme')!);
    expect(tags).toContain('rainbow');
    expect(tags).toContain('cloud');
  });

  it('adds the collection as a tag', () => {
    expect(getTags(getArtwork('calendar', 'calendar-with-star-heart')!)).toContain('calendar');
  });

  it('exposes a sorted, deduplicated vocabulary', () => {
    expect(ALL_TAGS.length).toBeGreaterThan(20);
    expect([...ALL_TAGS]).toEqual([...ALL_TAGS].sort());
    expect(new Set(ALL_TAGS).size).toBe(ALL_TAGS.length);
  });
});

describe('concept mapping', () => {
  it('finds the Mandap piece when searching "wedding"', () => {
    expect(titlesFor('wedding')).toContain('Mandap Theme with Cartoon Couple');
  });

  it('groups the devotional pieces under "devotional"', () => {
    const ids = idsFor('devotional');
    expect(ids).toContain('knot-stitched-swastik');
    expect(ids).toContain('mahadev');
    expect(ids).toContain('radha-krishna');
    expect(ids).toContain('customised-makka-madina-theme');
  });

  it('separates hindu and islamic pieces', () => {
    expect(idsFor('hindu')).toContain('mahadev');
    expect(idsFor('hindu')).not.toContain('customised-makka-madina-theme');
    expect(idsFor('islamic')).toEqual(['customised-makka-madina-theme']);
  });

  it('finds both handkerchiefs by size as well as by name', () => {
    const ids = idsFor('handkerchief');
    expect(ids).toContain('customised-thoughts-on-handkerchief');
    expect(ids).toContain('customised-initial-on-handkerchief');
  });

  it('maps "photo" across the Photo Frames collection', () => {
    const ids = idsFor('photo');
    expect(ids).toContain('memory-hoop');
    expect(ids).toContain('hanging-photos-with-name-and-some-words');
  });

  it('maps "personalised" onto the customised pieces', () => {
    expect(idsFor('personalised')).toContain('customised-makka-madina-theme');
  });
});

describe('searchArtworks', () => {
  it('returns nothing for an empty query', () => {
    expect(searchArtworks('')).toEqual([]);
    expect(searchArtworks('   ')).toEqual([]);
  });

  it('returns nothing for a term that matches no piece', () => {
    expect(searchArtworks('helicopter')).toEqual([]);
  });

  it('is case and punctuation insensitive', () => {
    expect(idsFor('MAHADEV')).toEqual(idsFor('mahadev'));
    expect(idsFor("mother's day")).toEqual(idsFor('mothers day'));
  });

  it('narrows rather than widens with extra terms', () => {
    const birthday = searchArtworks('birthday');
    const birthdayDoll = searchArtworks('birthday doll');

    expect(birthdayDoll.length).toBeLessThan(birthday.length);
    expect(birthdayDoll.length).toBeGreaterThan(0);
    for (const artwork of birthdayDoll) {
      expect(birthday).toContain(artwork);
    }
  });

  it('ranks a title hit above a tag-only hit', () => {
    const results = searchArtworks('calendar');
    // Pieces with "Calendar" in the title come before Calendar Wishes pieces
    // that merely belong to the collection.
    expect(results[0]?.title.toLowerCase()).toContain('calendar');
  });

  it('matches on a prefix so partial typing still works', () => {
    expect(idsFor('anniv')).toContain('anniversary-hoop-with-bold-names-and-florals');
  });

  it('finds a piece by a word from its collection name', () => {
    expect(idsFor('engagement').length).toBeGreaterThan(0);
  });
});

describe('future artworks', () => {
  /**
   * The whole point of deriving rather than storing: a piece added to
   * `artworks.ts` tomorrow is searchable with no extra step. This proves the
   * derivation path rather than a baked-in list.
   */
  it('tags a brand-new artwork with no manual work', () => {
    const invented = {
      id: 'peacock-feather-monogram',
      categoryId: 'names',
      title: 'Peacock Feather Monogram with pearls',
      options: [{ label: '10 inch ring', price: 199 }],
    } as const;

    const tags = getTags(invented);
    expect(tags).toContain('peacock');
    expect(tags).toContain('feather');
    expect(tags).toContain('monogram');
    expect(tags).toContain('name'); // concept: monogram implies name
    expect(tags).toContain('pearls');
  });

  it('honours manual extra keywords when a title cannot imply them', () => {
    const withExtras = {
      id: 'test',
      categoryId: 'decor',
      title: 'Mahadev',
      options: [{ label: '10 inch ring', price: 300 }],
      tags: ['shiva', 'trishul'],
    } as const;

    expect(getTags(withExtras)).toContain('shiva');
    expect(getTags(withExtras)).toContain('trishul');
  });
});
