import { Suspense } from 'react'; // Import Suspense
import Match from '../../../../components/match/match';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Wrap your component with Suspense */}
      <Match />
    </Suspense>
  );
}
