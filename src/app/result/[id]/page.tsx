import { ResultPage } from '../../../views/ResultPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultPage attemptId={id} />;
}
