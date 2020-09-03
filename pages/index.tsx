import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { Formik, Form, Field } from "formik";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  makeStyles,
  createStyles,
  Theme,
  MenuItem,
} from "@material-ui/core";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: "auto",
      maxWidth: 500,
      padding: theme.spacing(3),
    },
  })
);

interface HomeProps {
  makes: Make[];
}

export default function Home({ makes }: HomeProps) {
  const styles = useStyles();
  const { query } = useRouter();

  const initialValues = {
    make: query.make || 'all',
    model: query.model || 'all',
    minPrice: query.minPrice || 'all',
    maxPrice: query.maxPrice || 'all',
  };

  const prices = [500, 1000, 5000, 15000, 25000, 250000];

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={styles.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-make-label">Make</InputLabel>
                  <Field
                    as={Select}
                    name="make"
                    labelId="search-make-label"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-model-label">Make</InputLabel>
                  <Field
                    as={Select}
                    name="model"
                    labelId="search-model-label"
                    label="Model"
                  >
                    <MenuItem value="all">
                      <em>All Models</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-minPrice-label">Make</InputLabel>
                  <Field
                    as={Select}
                    name="minPrice"
                    labelId="search-minPrice-label"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min Price</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-maxPrice-label">Make</InputLabel>
                  <Field
                    as={Select}
                    name="maxPrice"
                    labelId="search-maxPrice-label"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max Price</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const makes = await getMakes();

  return { props: { makes } };
};
