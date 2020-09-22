import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import React from "react";
import { CarModel } from "../pages/api/Car";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    carLink: {
      textDecoration: 'none'
    }
  })
);

export interface CarCardProps {
  car: CarModel;
}
export function CarCard({ car }: CarCardProps) {
  const classes = useStyles();

  return (
    <Link
      href="/car/[make]/[brand]/[id]"
      as={`car/${car.make}/${car.model}/${car.id}`}
    >
      <a className={classes.carLink}>
        <Card>
          <CardHeader
            title={`${car.make}  ${car.model}`}
            subheader={car.price}
          />
          <CardMedia
            className={classes.media}
            image={car.photoUrl}
            title={car.model}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {car.details}
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
