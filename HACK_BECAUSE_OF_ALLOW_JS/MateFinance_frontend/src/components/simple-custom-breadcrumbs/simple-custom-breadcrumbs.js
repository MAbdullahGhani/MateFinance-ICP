import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LinkItem from './link-item';
import { Container } from '@mui/material';
// ----------------------------------------------------------------------
export default function SimpleCustomBreadcrumbs({ links, action, heading, moreLink, activeLast, sx, ...other }) {
    const lastLink = links[links.length - 1].name;
    return (<Box sx={{
            ...sx,
            padding: '40px 0px', // Adjust the padding values as needed
        }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (<Typography variant="h3" gutterBottom>
              {heading}
            </Typography>)}

          {/* BREADCRUMBS */}
          {!!links.length && (<Breadcrumbs separator={<Separator />} {...other}>
              {links.map((link) => (<LinkItem key={link.name || ''} link={link} activeLast={activeLast} disabled={link.name === lastLink}/>))}
            </Breadcrumbs>)}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (<Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (<Link key={href} href={href} variant="body2" target="_blank" rel="noopener" sx={{ display: 'table' }}>
              {href}
            </Link>))}
        </Box>)}
    </Box>);
}
SimpleCustomBreadcrumbs.propTypes = {
    sx: PropTypes.object,
    action: PropTypes.node,
    links: PropTypes.array,
    heading: PropTypes.string,
    moreLink: PropTypes.array,
    activeLast: PropTypes.bool,
};
// ----------------------------------------------------------------------
function Separator() {
    return (<Box component="span" sx={{
        // borderRadius: '50%',
        // bgcolor: 'text.disabled',
        }}>
      /
    </Box>);
}
