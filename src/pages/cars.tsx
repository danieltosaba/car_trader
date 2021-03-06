import { Grid } from "@material-ui/core";
import deepEqual from "fast-deep-equal";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useState } from "react";
import useSWR from "swr";
import { CarCard } from "../components/CarCard";
import { CarPagination } from "../components/CarPagination";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "../getAsString";
import { CarModel } from "./api/Car";
import Search from "./index";

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
  const [serverQuery] = useState(query);
  const { data } = useSWR(`/api/cars?${stringify(query)}`, {
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
    dedupingInterval: 15000,
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3}>
        <Search makes={makes} models={models} singleColumn />
      </Grid>
      <Grid container spacing={2} item xs={12} sm={7} md={9}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
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
