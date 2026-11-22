import { simulateRequest } from './simulated-request';

export interface CrewMember {
  readonly name: string;
  readonly role: string;
  readonly station: string;
}

/** An invented starship roster searched by the async Combobox examples. */
const crewRoster: readonly CrewMember[] = [
  { name: 'Rhea Solano', role: 'Captain', station: 'Bridge' },
  { name: 'Juno Marchetti', role: 'Pilot', station: 'Flight deck' },
  { name: 'Teodor Lind', role: 'Chief engineer', station: 'Engineering' },
  { name: 'Imani Kerr', role: 'Medical officer', station: 'Med bay' },
  { name: 'Oskar Brandt', role: 'Navigator', station: 'Bridge' },
  { name: 'Pell Mercer', role: 'Cargo master', station: 'Hold' },
  { name: 'Sable Quinn', role: 'Comms officer', station: 'Bridge' },
  { name: 'Dax Holloway', role: 'Security chief', station: 'Armory' },
  { name: 'Mireille Faure', role: 'Science officer', station: 'Lab' },
  { name: 'Kit Arden', role: 'Mechanic', station: 'Engineering' },
  { name: 'Lio Tanaka', role: 'Botanist', station: 'Hydroponics' },
  { name: 'Vesna Kral', role: 'Quartermaster', station: 'Stores' },
  { name: 'Rafe Calloway', role: 'Gunner', station: 'Turret' },
  { name: 'Nadia Ferro', role: 'Cook', station: 'Galley' },
  { name: 'Bram Ostrowski', role: 'Deckhand', station: 'Hangar' },
  { name: 'Cass Whitlow', role: 'Cadet', station: 'Training deck' },
];

/** The most results one search returns, like a paged search endpoint. */
const pageSize = 10;

/**
 * Search the roster by name after a simulated round trip. Larger result sets
 * take longer, so a broad query started first can finish after a narrower one.
 */
export async function searchCrew(query: string, signal?: AbortSignal): Promise<CrewMember[]> {
  const needle = query.trim().toLowerCase();
  const matches = crewRoster
    .filter(
      /** Keep members whose name contains the query. */
      (member) => member.name.toLowerCase().includes(needle),
    )
    .slice(0, pageSize);
  await simulateRequest(200 + matches.length * 40, signal);
  return matches;
}
