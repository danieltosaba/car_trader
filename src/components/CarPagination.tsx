import Pagination, { PaginationRenderItemParams } from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { forwardRef } from "react";
import { getAsString } from "../getAsString";

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();

  return (
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
  );
}

export interface MaterialUILinkProps {
  query: ParsedUrlQuery;
  item: PaginationRenderItemParams;
}
const MaterialUILink = forwardRef<HTMLAnchorElement, MaterialUILinkProps>(
  ({ query, item, ...props }, ref) => (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a ref={ref} {...props}></a>
    </Link>
  )
);
