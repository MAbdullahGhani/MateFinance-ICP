import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber, formatCurrency } from 'src/utils/format-number';

import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { ATTACHMENT_TOKEN, ATTACHMENT_URL } from 'src/config-global';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

export default function PostItem({ post, index }) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { title, createdAt, borrower, _id } = post;

  const latestPost = false;

  // if (mdUp && latestPost) {
  //   return (
  //     <Card>
  //       <Avatar
  //         alt={borrower?.name}
  //         src={ATTACHMENT_URL + borrower?.logo[0]?.attachmentPath + ATTACHMENT_TOKEN}
  //         sx={{
  //           top: 24,
  //           left: 24,
  //           zIndex: 9,
  //           position: 'absolute',
  //         }}
  //       />

  //       <PostContent
  //         title={borrower?.name}
  //         createdAt={createdAt}
  //         totalViews={totalViews}
  //         totalShares={totalShares}
  //         totalComments={totalComments}
  //         index={index}
  //       />

  //       <Image
  //         alt={title}
  //         src={'/assets/background/card_background.jpg'}
  //         overlay={alpha(theme.palette.grey[900], 0.48)}
  //         sx={{
  //           width: 1,
  //           height: 360,
  //         }}
  //       />
  //     </Card>
  //   );
  // }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
          }}
        />

        <Avatar
          alt={borrower?.name}
          src={ATTACHMENT_URL + borrower?.logo[0]?.attachmentPath + ATTACHMENT_TOKEN}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
          }}
        />

        <Image alt={title} src={'/assets/background/card_background.jpg'} ratio="4/3" />
      </Box>

      <PostContent title={borrower?.name} createdAt={createdAt} id={_id} post={post} />
    </Card>
  );
}

PostItem.propTypes = {
  index: PropTypes.number,
  post: PropTypes.object,
};

// ----------------------------------------------------------------------

export function PostContent({ title, createdAt, id, post }) {
  const mdUp = useResponsive('up', 'md');

  const linkTo = paths.auth.jwt.marketPlaceDetails + `/${id}`;

  const latestPostLarge = false;

  const latestPostSmall = false;

  return (
    <CardContent
      sx={{
        pt: 6,
        width: 1,
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 1,
          color: 'text.disabled',
        }}
      >
        {fDate(createdAt)}
      </Typography>
      <Box
        display="grid"
        alignItems="center"
        justifyContent="space-between"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Link color="inherit" component={RouterLink} href={linkTo}>
          <TextMaxLine variant={mdUp && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
            {title}
          </TextMaxLine>
        </Link>
        <Stack direction="column" alignItems="flex-end">
          <TextMaxLine variant="h6" align="center">
            {post?.overview?.apyRate}
          </TextMaxLine>
          <TextMaxLine variant="caption">AYP Rate</TextMaxLine>
        </Stack>
      </Box>
      <Box
        display="grid"
        alignItems="center"
        justifyContent="space-between"
        mt={1}
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Stack direction="column" alignItems="flex-start">
          <TextMaxLine variant="subtitle2" align="center">
            {formatCurrency(post?.overview?.loanAmount)}
          </TextMaxLine>
          <TextMaxLine variant="caption">Loan Amount</TextMaxLine>
        </Stack>

        <Stack direction="column" alignItems="flex-end">
          <TextMaxLine variant="subtitle2" align="center">
            {post?.overview?.rwa}
          </TextMaxLine>
          <TextMaxLine variant="caption">RWA</TextMaxLine>
        </Stack>
      </Box>

      <Box
        display="grid"
        alignItems="center"
        justifyContent="space-between"
        mt={1}
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Stack direction="column">
          <TextMaxLine variant="subtitle2">Expires In</TextMaxLine>
          <TextMaxLine variant="caption">{post?.overview?.dealExpiresIn}</TextMaxLine>
        </Stack>

        <Stack direction="column" alignItems="flex-end">
          <TextMaxLine variant="subtitle2">{post?.overview?.loanTenure}</TextMaxLine>
          <TextMaxLine variant="caption">Tenure</TextMaxLine>
        </Stack>
      </Box>
    </CardContent>
  );
}

PostContent.propTypes = {
  createdAt: PropTypes.string,
  index: PropTypes.number,
  title: PropTypes.string,
  totalComments: PropTypes.number,
  totalShares: PropTypes.number,
  totalViews: PropTypes.number,
};
