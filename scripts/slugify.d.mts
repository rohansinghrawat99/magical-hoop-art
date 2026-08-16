/**
 * Types for the shared slug rule, so `src/**` (and its tests) can import the
 * same implementation the image pipeline uses instead of duplicating it.
 */
export declare function slugify(value: string): string;
export declare function baseName(fileName: string): string;
