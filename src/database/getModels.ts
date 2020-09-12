import { openDb } from "../openDB";

export interface Model {
    model: string;
    count: number;
}

export async function getModels(make) {
    const db = await openDb();
    const models = db.all<Model[]>(`
        SELECT model, count(*) as count
        FROM CAR
        WHERE make = @make
        GROUP BY model
    `, {'@make': make});

    return models;
}