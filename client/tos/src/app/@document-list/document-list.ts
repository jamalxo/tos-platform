export interface Sort<T> {
  property: keyof T;
  order: 'asc' | 'desc';
}
