import Layout from '@components/layout';
import { Demo } from '@components/primitive/calendar';

export default function CalendarDemo() {
  return (
    <Layout
      headerText="Calendar"
      showBackButton
      scrollable
    >
      <Demo />
    </Layout>
  );
}
