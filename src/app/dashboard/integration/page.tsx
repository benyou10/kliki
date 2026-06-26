import { Suspense } from 'react';
import IntegrationClient from './IntegrationClient';

export const dynamic = 'force-dynamic';

export default function IntegrationPage() {
  return (
    <Suspense fallback={(
      <main className="dashboard-main">
        <section className="panel-surface dashboard-empty-state">
          <p>Loading integration...</p>
        </section>
      </main>
    )}>
      <IntegrationClient />
    </Suspense>
  );
}
