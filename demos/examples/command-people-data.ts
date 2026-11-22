import type { CommandItem } from '../../src';
import { simulateRequest } from './simulated-request';

export interface Person extends CommandItem {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly title: string;
}

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
}

/** A page of search results and the number of matches across all pages. */
export interface SearchPage<T> {
  readonly results: T[];
  readonly total: number;
}

/** Invented people searched by the async Command examples. */
const people: readonly Person[] = [
  { id: 1, firstName: 'Priya', lastName: 'Raman', title: 'Product designer' },
  { id: 2, firstName: 'Tomas', lastName: 'Ferreira', title: 'Data analyst' },
  { id: 3, firstName: 'Elena', lastName: 'Marsh', title: 'Support lead' },
  { id: 4, firstName: 'Kofi', lastName: 'Mensah', title: 'Backend engineer' },
  { id: 5, firstName: 'Hana', lastName: 'Ishida', title: 'Research scientist' },
  { id: 6, firstName: 'Marcus', lastName: 'Lindqvist', title: 'Account manager' },
  { id: 7, firstName: 'Sofia', lastName: 'Albescu', title: 'Frontend engineer' },
  { id: 8, firstName: 'Daniel', lastName: 'Okoro', title: 'Security analyst' },
  { id: 9, firstName: 'Clara', lastName: 'Vance', title: 'Content strategist' },
  { id: 10, firstName: 'Ravi', lastName: 'Desai', title: 'Platform engineer' },
  { id: 11, firstName: 'Ingrid', lastName: 'Sato', title: 'QA engineer' },
  { id: 12, firstName: 'Lucas', lastName: 'Moreau', title: 'Sales director' },
  { id: 13, firstName: 'Amara', lastName: 'Byrne', title: 'Recruiter' },
  { id: 14, firstName: 'Felix', lastName: 'Novak', title: 'Mobile engineer' },
  { id: 15, firstName: 'Nora', lastName: 'Castillo', title: 'Finance partner' },
  { id: 16, firstName: 'Owen', lastName: 'Hartley', title: 'Office manager' },
  { id: 17, firstName: 'Leila', lastName: 'Haddad', title: 'UX writer' },
  { id: 18, firstName: 'Jonas', lastName: 'Berg', title: 'Site reliability engineer' },
  { id: 19, firstName: 'Maya', lastName: 'Collins', title: 'Engineering manager' },
  { id: 20, firstName: 'Arjun', lastName: 'Kapoor', title: 'Solutions architect' },
];

/** Invented products searched by the async Command pages example. */
const products: readonly Product[] = [
  { id: 1, title: 'Canvas notebook', price: 12 },
  { id: 2, title: 'Brass desk lamp', price: 64 },
  { id: 3, title: 'Linen tote bag', price: 28 },
  { id: 4, title: 'Ceramic pour-over set', price: 45 },
  { id: 5, title: 'Walnut pen tray', price: 19 },
  { id: 6, title: 'Wool throw blanket', price: 89 },
  { id: 7, title: 'Pocket field journal', price: 9 },
  { id: 8, title: 'Copper kettle', price: 72 },
  { id: 9, title: 'Felt laptop sleeve', price: 34 },
  { id: 10, title: 'Glass water carafe', price: 26 },
];

/** Simulated server latency for each search request. */
const latencyMs = 250;

/** Return one page of the records whose label contains the query. */
async function searchRecords<T>(
  records: readonly T[],
  label: (record: T) => string,
  options: { query: string; limit: number; skip?: number; signal?: AbortSignal },
): Promise<SearchPage<T>> {
  const needle = options.query.trim().toLowerCase();
  const matches = records.filter(
    /** Keep records whose visible label contains the query. */
    (record) => label(record).toLowerCase().includes(needle),
  );
  await simulateRequest(latencyMs, options.signal);
  const skip = options.skip ?? 0;
  return { results: matches.slice(skip, skip + options.limit), total: matches.length };
}

/** Search people by full name, one page at a time. */
export function searchPeople(options: {
  query: string;
  limit: number;
  skip?: number;
  signal?: AbortSignal;
}): Promise<SearchPage<Person>> {
  return searchRecords(
    people,
    /** Match against the person's full name. */
    (person) => `${person.firstName} ${person.lastName}`,
    options,
  );
}

/** Search products by title. */
export function searchProducts(options: {
  query: string;
  limit: number;
  signal?: AbortSignal;
}): Promise<SearchPage<Product>> {
  return searchRecords(
    products,
    /** Match against the product title. */
    (product) => product.title,
    options,
  );
}
