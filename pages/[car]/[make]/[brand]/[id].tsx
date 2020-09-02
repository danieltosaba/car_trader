import { GetServerSideProps } from "next";
import { openDb } from "../../../../openDB";
import { CarModel } from "../../../../api/Car";
import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
    },
    img: {
      width: '100%',
    },
  }),
);

interface CarDetailsProps {
  car: CarModel | null | undefined;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const classes = useStyles();

  if (!car) {
    return <h1>Sorry, car not found!</h1>;
  }
  return  <div>
  <Paper className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={5}>
          <img className={classes.img} alt="car_photo" src={car.photoUrl} />
      </Grid>
      <Grid item xs={12} sm={6} md={7} container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="h5">
              {car.make + " " + car.model}
            </Typography>
            <Typography gutterBottom variant="h4">
              EUR {car.price}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {car.kilometers + " km"}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {car.fuelType}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {car.details}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Paper>
</div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDb();
  const car = await db.get<CarModel | undefined>(
    "SELECT * FROM Car where id=?",
    id
  );
  return {
    props: { car: car || null },
  };
};
