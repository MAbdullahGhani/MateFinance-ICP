import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Checkbox } from '@mui/material';
// components
import PropTypes from 'prop-types'; // @mui
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useSelector } from 'react-redux';
import { lang } from 'src/locales/multiLang';
import { useLocales } from 'src/locales';
// ----------------------------------------------------------------------
export default function PaymentChannelCardItem({ card, isShow, handleDelete, handleEdit, selectedCardIndex, onSelectCard, sx, paymentChannelLogo, ...other }) {
    const { userFinance } = useSelector((state) => state.user);
    const popover = usePopover();
    const isSelected = selectedCardIndex ===
        (card.index ||
            userFinance?.bankAccounts?.accountNumber ||
            userFinance?.jazzzCash?.accountNumber ||
            userFinance?.easyPaisa?.accountNumber ||
            userFinance?.raast?.accountNumber ||
            userFinance?.payPal?.accountNumber ||
            userFinance?.payoneer?.accountNumber);
    const handleClick = () => {
        onSelectCard();
    };
    const { t } = useLocales();
    return (<>
      <Stack spacing={1} component={Paper} variant="outlined" sx={{
            p: 2.5,
            width: 1,
            position: 'relative',
            ...sx,
        }} {...other}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <div className="flex-row-center gap_10 w-100">
            <Stack direction="column" alignItems="center" spacing={1}>
              <img src={paymentChannelLogo} style={{ maxWidth: 50, maxHeight: 40 }} alt=" "/>
              <Typography variant="subtitle2">{card?.accountType}</Typography>
            </Stack>

            {/* {card.primary && <Label color="info">Default</Label>} */}
            <div className="flex-col-start gap_2">
              <Typography variant="subtitle1" sx={{ color: `text.secondary` }}>
                {card.cardName}
              </Typography>
              <Typography variant="body2" sx={{ color: `text.secondary` }}>
                {card.cardNumber}
              </Typography>
            </div>
          </div>

          <Stack direction="column" alignItems="center" spacing={1}>
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill"/>
            </IconButton>
            {isShow && <Checkbox checked={isSelected} onChange={handleClick}/>}
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem onClick={() => {
            handleEdit(card);
            popover.onClose();
        }}>
          <Iconify icon="solar:pen-bold"/>
          {t(`${lang.account}.edit`)}
        </MenuItem>

        <MenuItem onClick={() => {
            handleDelete(card);
            popover.onClose();
        }} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold"/>
          {t(`${lang.account}.delete`)}
        </MenuItem>
      </CustomPopover>
    </>);
}
PaymentChannelCardItem.propTypes = {
    card: PropTypes.object,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
    sx: PropTypes.object,
};
