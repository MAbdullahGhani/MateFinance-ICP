import { Avatar, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Label from 'src/components/label';
import { IM_HOST_API } from 'src/config-global';
import { useLocales } from 'src/locales';
import axiosInstance from 'src/utils/axios';
// import { lang } from 'src/locales/multiLang';
import { fCurrency, fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
export default function RequestOverview({ invoiceData }) {
    const [conversionAmt, setConversionAmt] = useState(null);
    const Currency = (amount, currency, convert) => {
        if (convert) {
            return `${currency} ${fCurrency(amount)} `;
        }
        return `${currency} ${fNumber(amount)}`;
    };
    useEffect(() => {
        if (invoiceData?.principal && invoiceData?.currency !== 'USD') {
            getExtConversionRate('USD', invoiceData?.currency, invoiceData?.principal);
        }
        else if (invoiceData?.principal) {
            setConversionAmt(invoiceData?.principal);
        }
    }, [invoiceData]);
    // GET Conversion Rate Without Login
    const getExtConversionRate = async (code, invCurr, totalAmt) => {
        const data = { into: code, currencyCode: invCurr };
        try {
            const response = await axiosInstance.post(`${IM_HOST_API}/invoices/convertCurrencyWithoutLogin`, data);
            setConversionAmt(Number(totalAmt) / response);
        }
        catch (error) {
            console.error('Error:', error);
            // handle the error
            enqueueSnackbar(error);
        }
    };
    const { t } = useLocales();
    const navigate = useNavigate();
    return (<Grid container>
      <Grid item xs={12}>
        <List sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <ListItem>
            <ListItemText 
    // onClick={() => navigate(`/admin/subscribers/invoices/${invoiceData?._id}`)}
    primary="Invoice Id" secondary={<Typography sx={{ cursor: 'pointer', color: 'purple' }}>
                  {invoiceData?.invoiceId || '-'}
                </Typography>}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={'Invoice Amount'} secondary={Currency(invoiceData?.invoiceAmt || 0, invoiceData?.currency || 'USD', false)}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={'Requested Loan Amount'} secondary={Currency(invoiceData?.principal || 0, invoiceData?.currency || '', false)}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={'Loan Amount'} 
    //
    secondary={Currency(conversionAmt || 0, 'USD', true)}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={'Status'} secondary={<Label color="primary">{invoiceData?.DealStatus?.toUpperCase() || '-'}</Label>}/>
          </ListItem>
        </List>
      </Grid>
    </Grid>);
}
