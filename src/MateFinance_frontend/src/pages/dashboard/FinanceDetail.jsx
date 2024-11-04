// react imports
import { Helmet } from 'react-helmet-async';

import FinanceDetailsView from 'src/sections/financing-profile/view/finance-details-view';

// sections

const FinanceDetails = () => {
  return (
    <>
      <Helmet>
        <title>Invoice Mate - Financing Details</title>
      </Helmet>
      <FinanceDetailsView />
    </>
  );
};

export default FinanceDetails;
