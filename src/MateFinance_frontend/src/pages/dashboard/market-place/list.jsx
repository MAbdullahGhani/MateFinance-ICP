import { Helmet } from 'react-helmet-async';

import MarketPlaceListView from 'src/sections/market-place/view/market-place-list-view';

// ----------------------------------------------------------------------

export default function MarketPlaceListPage() {
  return (
    <>
      <Helmet>
        <title> Invoice Mate: Market Place</title>
      </Helmet>

      <MarketPlaceListView />
    </>
  );
}
