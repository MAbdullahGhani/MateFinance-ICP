import { Box, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useLocales } from 'src/locales';
import { lang } from 'src/locales/multiLang';
import axios, { endpoints } from 'src/utils/axios';
import LogsTable from './table/Logs/logs-table';
export default function FinanceLogs({ invId }) {
    const [logs, setLogs] = useState([]);
    const fetchLogs = useCallback(async () => {
        try {
            const response = await axios.post(endpoints.finance.logs, { _id: invId });
            setLogs(response);
        }
        catch (error) {
            enqueueSnackbar(error.toString(), { variant: 'error' });
        }
    }, []);
    useEffect(() => {
        fetchLogs();
    }, []);
    const { t } = useLocales();
    return (<div>
      {/* <div style={{ pl: '-100px' }}>
          <Typography variant="h4" color="primary">
            {t(`${lang.finReq}.history`)}
          </Typography>
        </div> */}
      <Box fullWidth sx={{
            // width:'100%',
            ml: '-36px',
            mr: '-36px',
            mb: '-30px',
            // width: 1,
        }}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <LogsTable logs={logs}/>
      </Box>
    </div>);
}
