import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
} from "~/registry/ui/pagination.tsx";

export default function PaginationSimple() {
  return (
    <Pagination
      count={5}
      defaultPage={2}
      itemComponent={(props) => (
        <PaginationItem page={props.page}>{props.page}</PaginationItem>
      )}
      ellipsisComponent={() => <PaginationEllipsis />}
    >
      <PaginationItems />
    </Pagination>
  );
}
