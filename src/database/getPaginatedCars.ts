import { ParsedUrlQuery } from "querystring";
import { openDb } from "../openDB";
import { CarModel } from "../pages/api/Car";
import { getAsString } from "../getAsString";

const mainQuery = `
FROM CAR
WHERE (@make is NULL OR @make = make)
AND (@model is NULL OR @model = model)
AND (@minPrice is NULL OR @minPrice <= price)
AND (@maxPrice is NULL OR @maxPrice >= price)
`;

export async function getPaginatedCars(query: ParsedUrlQuery) {
  const db = await openDb();

  const page = getNumVal(query.page) || 1;
  const rowsPerPage = getNumVal(query.rowsPerPage) || 4;
  const offset = (page - 1) * 4;

  const dbParams = {
    "@make": getStrVal(query.make),
    "@model": getStrVal(query.model),
    "@minPrice": getNumVal(query.minPrice),
    "@maxPrice": getNumVal(query.maxPrice),
  };
  const totalRowsPromise = db.get<{ count: number }>(
    `
        SELECT COUNT(*) as count ${mainQuery}
  `,
    { ...dbParams }
  );
  const carsPromise = db.all<CarModel>(
    `
        SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset  
    `,
    {
      ...dbParams,
      "@rowsPerPage": rowsPerPage,
      "@offset": offset,
    }
  );
  const [totalRows, cars] = await Promise.all([totalRowsPromise, carsPromise]);
  return { cars, totalPages: Math.ceil(totalRows.count / 4) };
}

function getNumVal(value: string | string[]) {
  const str = getStrVal(value);
  const num = parseInt(str);
  return isNaN(num) ? null : num;
}
function getStrVal(value: string | string[]) {
  const str = getAsString(value);
  return !str || str.toLowerCase() === "all" ? null : str;
}
