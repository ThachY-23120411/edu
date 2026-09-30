import { ExamPage } from '../../../views/ExamPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamPage examId={id} />;
}
