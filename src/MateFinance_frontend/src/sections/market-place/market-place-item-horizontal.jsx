import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL, statusColors } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function MarketPlaceItemHorizontal({ post, tab }) {
  const { user, authenticated } = useAuthContext();

  const theme = useTheme();

  const popover = usePopover();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const {
    borrower,
    closed,
    createdAt,
    financeRequest,
    lending,
    overview,
    repayment,
    riskMitigation,
    tokenized,
    status,
    Borrower,
  } = post;

  function calculateExpiryDate(creationDateStr, daysUntilExpiry) {
    if (creationDateStr && daysUntilExpiry) {
      // Parse the creation date string into a Date object
      const creationDate = new Date(creationDateStr);
      const daysNumber = parseInt(daysUntilExpiry.split(' ')[0]);
      // Add the specified number of days to the creation date
      const expiryDate = new Date(creationDate);
      expiryDate.setDate(expiryDate.getDate() + daysNumber);

      // Calculate the difference in days from today
      const today = new Date();
      const timeDiff = expiryDate - today;
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      // Output the expiry date and the difference in days
      // console.log("Expiry Date: " + expiryDate.toISOString());
      return diffDays;
    }
  }

  return (
    <>
      <Stack
        component={Card}
        direction="row"
        justifyContent="space-between"
        sx={{
          // ...bgGradient({
          //   direction: '135deg',
          //   startColor: alpha(theme.palette.primary.light, 0.2),
          //   endColor: alpha(theme.palette.primary.main, 0.2),
          // }),
          height: { md: 1 },
          borderRadius: 2,
          position: 'relative',
          // color: 'primary.darker',
          backgroundColor: 'common.white',
        }}
      >
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Label
              variant="soft"
              sx={{ background: statusColors(status?.toLowerCase()), color: 'white' }}
            >
              {/* row.workFlowStatus[row.workFlowStatus.status]?.reviewedBy */}
              {status?.toUpperCase()}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(post[status.toLowerCase()]?.statusDate)}
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Box
              display="grid"
              alignItems="center"
              justifyContent="space-between"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Link
                color="inherit"
                component={RouterLink}
                href={
                  !user
                    ? paths.auth.jwt.details(post?._id)
                    : `${paths.dashboard.marketPlace.details(post?._id)}${
                        tab === 'my Deals' ? `?tab=myDeals` : ''
                      }`
                }
              >
                <TextMaxLine variant="subtitle2">{Borrower?.businessName}</TextMaxLine>
              </Link>
              <Stack direction="column" alignItems="flex-end">
                <TextMaxLine variant="h6" align="center">
                  {overview?.apyRate}%
                </TextMaxLine>
                <TextMaxLine variant="caption">APY Rate</TextMaxLine>
              </Stack>
            </Box>
            <Divider />
            <Box
              display="grid"
              alignItems="center"
              justifyContent="space-between"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack direction="column" alignItems="flex-start">
                <TextMaxLine variant="subtitle2" align="center">
                  {overview?.chain === 'Haqq Network' ? 'axlUSDC' : 'USDC'} {overview?.loanAmount}
                </TextMaxLine>
                <TextMaxLine variant="caption">Loan Amount</TextMaxLine>
              </Stack>

              <Stack direction="column" alignItems="flex-end">
                <TextMaxLine variant="subtitle2" align="center">
                  {post?.kyiScore || '-'}
                </TextMaxLine>
                <TextMaxLine variant="caption">KYI Score</TextMaxLine>
              </Stack>
            </Box>
            {/* <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </TextMaxLine> */}
          </Stack>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Stack spacing={1}>
            <Box
              display="grid"
              alignItems="center"
              justifyContent="space-between"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack direction="column">
                <TextMaxLine variant="subtitle2">
                  {tab === 'lending' ? 'Repayment Due In' : 'Expires In'}
                </TextMaxLine>
                <TextMaxLine variant="caption">
                  {tab === 'lending' && (
                    <TextMaxLine variant="caption">
                      {calculateExpiryDate(post?.lending?.statusDate, overview?.loanTenure) +
                        ' ' +
                        'Days'}
                    </TextMaxLine>
                  )}
                  {status.toLowerCase() === 'repayment'
                    ? '-'
                    : tab !== 'lending' &&
                      calculateExpiryDate(createdAt, overview?.dealExpiresIn) + ' ' + 'Days'}
                </TextMaxLine>
              </Stack>

              <Stack direction="column" alignItems="flex-end">
                <TextMaxLine variant="subtitle2">{overview?.loanTenure}</TextMaxLine>
                <TextMaxLine variant="caption">Tenure</TextMaxLine>
              </Stack>
              {status === 'draft' && (
                <Stack direction="column" alignItems="flex-start">
                  <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                    <Iconify icon="eva:more-horizontal-fill" />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: borrower?.logo[0]?.attachmentPath ? 180 : 200,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                zIndex: 100,
                right: '35px',
                top: '15px',
              }}
            >
              <img
                style={{ border: '2px solid white', borderRadius: '10px' }}
                src={
                  post?.isFirozaAPI
                    ? '/assets/firoza.png'
                    : post?.overview?.chain === 'Arbitrum Network'
                      ? '/assets/arbitrum.png'
                      : '/assets/haqq.png'
                }
              />
            </Box>
            <Image
              alt={borrower?.name}
              src={
                borrower?.logo[0]?.attachmentPath
                  ? ATTACHMENT_URL + borrower?.logo[0]?.attachmentPath + ATTACHMENT_TOKEN
                  : '/logo/mate.finance_verti.png'
              }
              sx={{ height: 1, borderRadius: 1.5 }}
            />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(title));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(
              `${paths.dashboard.marketPlace.createMarketPlace}?edit=${true}&id=${post?._id}`
            );
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </CustomPopover>
    </>
  );
}

MarketPlaceItemHorizontal.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
};
