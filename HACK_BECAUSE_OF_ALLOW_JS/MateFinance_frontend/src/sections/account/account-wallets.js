import { useForm, Controller } from 'react-hook-form';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import Label from 'src/components/label';
import { useEffect, useRef, useState } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { TableNoData } from 'src/components/table';
import { useAccount, useDisconnect } from 'wagmi';
import { useWalletInfo, useWeb3Modal } from '@web3modal/wagmi/react';
import { useBoolean } from 'src/hooks/use-boolean';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
// ----------------------------------------------------------------------
const NOTIFICATIONS = [
    {
        subheader: 'Activity',
        caption: 'Donec mi odio, faucibus at, scelerisque quis',
        items: [
            {
                id: 'activity_comments',
                label: 'Email me when someone comments onmy article',
            },
            {
                id: 'activity_answers',
                label: 'Email me when someone answers on my form',
            },
            { id: 'activityFollows', label: 'Email me hen someone follows me' },
        ],
    },
    {
        subheader: 'Application',
        caption: 'Donec mi odio, faucibus at, scelerisque quis',
        items: [
            { id: 'application_news', label: 'News and announcements' },
            { id: 'application_product', label: 'Weekly product updates' },
            { id: 'application_blog', label: 'Weekly blog digest' },
        ],
    },
];
// ----------------------------------------------------------------------
export default function AccountWallets() {
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuthContext();
    const { disconnect } = useDisconnect();
    const { address, isConnecting, isDisconnected } = useAccount();
    const { walletInfo } = useWalletInfo();
    const { open, selectedNetworkId } = useWeb3ModalState();
    const [lender, setLenderDetails] = useState(null);
    const [wallet, setWallet] = useState(null);
    const methods = useForm({
        defaultValues: {
            selected: ['activity_comments', 'application_product'],
        },
    });
    const { watch, control, formState: { isSubmitting }, } = methods;
    const values = watch();
    const addWallet = useBoolean();
    useEffect(() => {
        getLenderDetails();
    }, []);
    useEffect(() => {
        console.log(address, isConnecting, isDisconnected);
        console.log(walletInfo?.name, walletInfo?.icon);
        console.log(open, selectedNetworkId);
        if (open) {
            addWallet.onFalse();
        }
        if (!open && walletInfo) {
            addWallet.onTrue();
            setWallet({ ...walletInfo, address });
        }
    }, [address, isConnecting, isDisconnected, walletInfo, open]);
    const getLenderDetails = async () => {
        try {
            disconnect();
            const response = await axiosInstance.get(`${endpoints.app.getLenderById}?id=${user?.id}`);
            let lender = response?.lender[0];
            setLenderDetails(lender);
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    };
    const handleSubmit = async () => {
        try {
            debugger;
            const response = await axiosInstance.post(`${endpoints.app.addWallet}${user?.id}`, {
                walletName: wallet?.name,
                walletIcon: wallet?.icon,
                walletAddress: wallet?.address,
            });
            handleCloseModal();
            getLenderDetails();
            enqueueSnackbar(response);
        }
        catch (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    };
    const handleShowModal = (val) => {
        addWallet.onTrue();
        disconnect();
    };
    const handleCloseModal = () => {
        addWallet.onFalse();
        disconnect();
    };
    return (<>
      <Stack direction="row" justifyContent="flex-end" mb={1}>
        <Button variant="contained" color="primary" sx={{ borderRadius: '32px' }} onClick={handleShowModal}>
          Add Wallet
        </Button>
      </Stack>
      <Card>
        <Stack sx={{
            px: 3,
        }}>
          <br />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table size={'medium'} sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Wallet Name</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Wallet Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lender?.wallet?.map((item, index) => (<TableRow>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={item?.walletName} src={item?.walletIcon} sx={{ mr: 2 }}/>

                      <ListItemText primary={item.walletName} 
        // secondary={email}
        primaryTypographyProps={{ typography: 'body2' }} secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
            }}/>
                    </TableCell>
                    {/* <TableCell>{item?.walletName}</TableCell> */}
                    <TableCell>{item?.walletAddress}</TableCell>
                    <TableCell>
                      <Label color="primary">{item?.walletStatus.toUpperCase()}</Label>
                    </TableCell>
                  </TableRow>))}
                {lender?.wallet?.length === 0 && <TableNoData notFound={true}/>}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Card>
      {/* ADD NEW WALLET */}
      <Dialog fullWidth maxWidth="xs" open={addWallet.value} onClose={handleCloseModal}>
        <DialogTitle sx={{ pb: 2 }}>Add New Wallet</DialogTitle>

        <DialogContent sx={{ typography: 'body2' }}>
          <w3m-button size="sm"/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }} onClick={handleSubmit} disabled={!wallet?.name}>
            Submit
          </Button>
          <Button variant="contained" color="secondary" sx={{ borderRadius: '20px' }} onClick={handleCloseModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>);
}
