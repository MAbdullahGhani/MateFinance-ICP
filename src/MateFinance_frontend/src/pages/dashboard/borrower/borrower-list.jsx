import { Helmet } from 'react-helmet-async';
import { BorrowerListView } from 'src/sections/borrower/view';

// ----------------------------------------------------------------------

export default function BorrowerListPage() {
  return (
    <>
      <Helmet>
        <title>Invoice Mate: Borrower List</title>
      </Helmet>

      <BorrowerListView />
    </>
  );
}
