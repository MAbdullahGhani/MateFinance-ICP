import { Helmet } from 'react-helmet-async';
import { LenderRequestList } from 'src/sections/lender/view';
// ----------------------------------------------------------------------
export default function LenderReqListPage() {
    return (<>
      <Helmet>
        <title>Invoice Mate: Lender Request List</title>
      </Helmet>

      <LenderRequestList />
    </>);
}
