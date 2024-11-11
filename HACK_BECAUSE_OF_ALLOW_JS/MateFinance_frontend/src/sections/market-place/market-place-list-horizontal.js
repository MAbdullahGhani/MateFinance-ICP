import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { MarketPlaceItemSkeleton } from './market-place-skeleton';
import MarketPlaceItemHorizontal from './market-place-item-horizontal';
// ----------------------------------------------------------------------
export default function MarketPlaceListHorizontal({ posts, loading, tab }) {
    const renderSkeleton = (<>
      {[...Array(16)].map((_, index) => (<MarketPlaceItemSkeleton key={index} variant="horizontal"/>))}
    </>);
    const renderList = (<>
      {posts.map((post) => (<MarketPlaceItemHorizontal key={post.id} post={post} tab={tab}/>))}
    </>);
    return (<>
      <Box gap={3} display="grid" gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
        }}>
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length > 15 && (<Pagination count={15} sx={{
                mt: 8,
                [`& .${paginationClasses.ul}`]: {
                    justifyContent: 'center',
                },
            }}/>)}
    </>);
}
MarketPlaceListHorizontal.propTypes = {
    loading: PropTypes.bool,
    posts: PropTypes.array,
};
