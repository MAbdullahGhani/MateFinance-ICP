import { Helmet } from 'react-helmet-async';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { Button, Link } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------
export default function ValidRegisterPage() {
    const router = useRouter();
    const showUsSelected = useBoolean();
    return (<>
      <Helmet>
        <title> InvoiceMate: Register</title>
      </Helmet>
      <Stack spacing={1} sx={{ px: { xs: 2, md: 5 }, py: { xs: 2, md: 15 } }}>
        <Typography variant="h3">
          Are you a U.S. <br />
          citizen?
        </Typography>
        <LoadingButton fullWidth color="primary" size="large" variant="contained" onClick={() => showUsSelected.onTrue()} sx={{ borderRadius: '32px' }}>
          Yes
        </LoadingButton>

        <LoadingButton fullWidth color="primary" size="large" variant="contained" sx={{ borderRadius: '32px' }} onClick={() => router.push(paths.auth.jwt.register)}>
          No
        </LoadingButton>

        <Stack direction="row" justifyContent="center" spacing={0.5} mt={4}>
          <Typography variant="body2">Already have an account</Typography>

          <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
            Log in
          </Link>
        </Stack>
      </Stack>

      <ConfirmDialog open={showUsSelected.value} onClose={showUsSelected.onFalse} showCancel={true} title={<>Sorry! </>} content="Currently Unavailable in the U.S. - Stay Tuned for Future Expansion!" action={<Button variant="contained" color="primary" sx={{ borderRadius: '32px' }} onClick={() => {
                showUsSelected.onFalse();
            }}>
            OK
          </Button>}/>
    </>);
}
