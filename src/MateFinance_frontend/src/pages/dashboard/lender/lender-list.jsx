import { Helmet } from 'react-helmet-async';

import { LenderListView } from 'src/sections/lender/view';

// ----------------------------------------------------------------------

export default function LenderListPage() {
  return (
    <>
      <Helmet>
        <title>Invoice Mate: Lender List</title>
      </Helmet>

      <LenderListView />
    </>
  );
}
