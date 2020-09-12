import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getAsString } from "../getAsString";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
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
  SelectProps,
  Button,
} from "@material-ui/core";
import router, { useRouter } from "next/router";
import useSWR from "swr";

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
  models: Model[];
}

export default function Home({ makes, models }: HomeProps) {
  const styles = useStyles();
  const { query } = useRouter();

  const initialValues = {
    make: getAsString(query.make) || "all",
    model: getAsString(query.model) || "all",
    minPrice: getAsString(query.minPrice) || "all",
    maxPrice: getAsString(query.maxPrice) || "all",
  };

  const prices = [500, 1000, 5000, 15000, 25000, 250000];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        router.push(
          {
            pathname: "/",
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true }
        );
      }}
    >
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
                      <MenuItem key={make.make} value={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ModelSelect name="model" make={values.make} models={models} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-minPrice-label">
                    Min Price
                  </InputLabel>
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
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="search-maxPrice-label">
                    Max Price
                  </InputLabel>
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
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);

  return { props: { makes, models } };
};

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}
export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });
  const { data } = useSWR<Model[]>(`/api/models?make=${make}`, {
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="search-model-label">Model</InputLabel>
      <Select
        name="model"
        labelId="search-model-label"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => (
          <MenuItem key={model.model} value={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
