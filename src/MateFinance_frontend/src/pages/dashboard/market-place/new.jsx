import { Helmet } from 'react-helmet-async';

import MarketPlaceCreateView from 'src/sections/market-place/view/market-place-create-view';
// ----------------------------------------------------------------------

export default function NewDealsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Invoice Mate: Create a new deal</title>
      </Helmet>

      <MarketPlaceCreateView />
    </>
  );
}
