import { Suspense } from 'react';
import { LibraryPage } from '../../views/LibraryPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Đang tải kho đề thi...</div>}>
      <LibraryPage />
    </Suspense>
  );
}
