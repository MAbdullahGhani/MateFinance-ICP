import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { LenderDetailsView } from 'src/sections/lender/view';
// ----------------------------------------------------------------------
export default function BorrowerDetailsPage() {
    const params = useParams();
    const { id } = params;
    return (<>
      <Helmet>
        <title> Invoice Mate: Borrower Details</title>
      </Helmet>

      <LenderDetailsView id={`${id}`}/>
    </>);
}
