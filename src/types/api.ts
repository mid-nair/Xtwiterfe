/** Cursor-paginated envelope returned by list endpoints. */
export interface CursorPage<T> {
  data: T[];
  next_cursor: string | null;
}
