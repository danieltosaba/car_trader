import { openDb } from "../openDB";

export interface Make {
  make: string;
  count: number;
}

export async function getMakes() {
  const db = await openDb();
  const makes = db.all<Make[]>(`
        SELECT make, count(*) as count
        FROM CAR
        GROUP BY make
    `);

  return makes;
}
