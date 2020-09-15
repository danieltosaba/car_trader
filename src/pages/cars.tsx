import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";

import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import Pagination, {
  PaginationRenderItemParams,
} from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

import Search from "./index";
import { getAsString } from "../getAsString";
import { CarModel } from "./api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { useRouter } from "next/router";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}
export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3}>
        <Search makes={makes} models={models} singleColumn />
      </Grid>
      <Grid item xs={12} sm={7} md={9}>
        <Pagination
          page={parseInt(getAsString(query.page || "1"))}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={MaterialUILink}
              query={query}
              item={item}
              {...item}
            />
          )}
        />
        <pre>{JSON.stringify({ cars, totalPages }, null, 4)}</pre>
      </Grid>
    </Grid>
  );
}

export interface MaterialUILinkProps {
  query: ParsedUrlQuery;
  item: PaginationRenderItemParams;
}
export function MaterialUILink({ query, item, ...props }: MaterialUILinkProps) {
  return (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
    >
      <a {...props}></a>
    </Link>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
