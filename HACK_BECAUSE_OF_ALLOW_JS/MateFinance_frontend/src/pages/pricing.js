import { Helmet } from 'react-helmet-async';
import PricingView from 'src/sections/pricing/view';
// ----------------------------------------------------------------------
export default function PricingPage() {
    return (<>
      <Helmet>
        <title> Pricing</title>
      </Helmet>

      <PricingView />
    </>);
}
