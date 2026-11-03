import { Suspense } from 'react';
import SearchResults from './SearchResults';

export const metadata = {
  title: 'Tìm kiếm · Cổ thưThư viện nguyên điển',
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
