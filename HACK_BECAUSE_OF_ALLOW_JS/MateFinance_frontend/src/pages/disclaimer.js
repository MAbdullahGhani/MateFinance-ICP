import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSettingsContext } from 'src/components/settings';
import HeaderSimple from 'src/layouts/common/header-simple';
// ----------------------------------------------------------------------
export default function Disclaimer() {
    const settings = useSettingsContext();
    return (<>
      <Helmet>
        <title> InvoiceMate: Disclaimer</title>
      </Helmet>

      <HeaderSimple custom={true}/>

      <Container component="main">
        <Stack sx={{
            m: 'auto',
            minHeight: '100vh',
            py: 10,
            gap: 2,
        }}>
          <Typography>
            <b>Disclaimer</b> <br /> InvoiceMate gathers information from different sources. Make
            sure to read the disclaimer and prospectus, and only participate using regulated
            methods. Before using any third-party services, do your own research to make an informed
            decision.
          </Typography>
          <Typography>
            <b>No Investment Advice</b> <br />
            The information provided on this website does not constitute investment advice,
            financial advice, trading advice, or any other sort of advice and you should not treat
            any of the website's content as such. InvoiceMate does not recommend that any
            cryptocurrency should be bought, sold, or held by you. Do conduct your own due diligence
            and consult your financial advisor before making any investment decisions.
          </Typography>
          <Typography>
            <b>Accuracy of Information</b> <br />
            InvoiceMate will strive to ensure accuracy of information listed on this website
            although it will not hold any responsibility for any missing or wrong information.
            InvoiceMate provides all information as is. You understand that you are using any and
            all information available here at your own risk.
          </Typography>
          <Typography>
            <b>Non Endorsement</b> <br />
            The appearance of third party advertisements and hyperlinks on InvoiceMate does not
            constitute an endorsement, guarantee, warranty, or recommendation by InvoiceMate. Do
            conduct your own due diligence before deciding to use any third party services.
          </Typography>
          <Typography>
            <b>Affiliate Disclosure</b> <br />
            InvoiceMate may receive compensation for affiliate links. This compensation may be in
            the form of money or services and could exist without any action from a site visitor.
            Should you perform activities in relation to an affiliate link, it is understood that
            some form of compensation might be made to InvoiceMate. For example, if you click on an
            affiliate link, and sign up and trade on an exchange, InvoiceMate may receive
            compensation. Each affiliate link is clearly marked with an icon next to it.
          </Typography>
        </Stack>
      </Container>
    </>);
}
