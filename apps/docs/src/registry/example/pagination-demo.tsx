import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "~/registry/ui/pagination.tsx";

export default function PaginationDemo() {
  return (
    <Pagination
      count={10}
      defaultPage={2}
      itemComponent={(props) => (
        <PaginationItem page={props.page}>{props.page}</PaginationItem>
      )}
      ellipsisComponent={() => <PaginationEllipsis />}
    >
      <PaginationPrevious />
      <PaginationItems />
      <PaginationNext />
    </Pagination>
  );
}
