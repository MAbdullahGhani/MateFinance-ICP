import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';

import PostItem from './post-item';
import { PostItemSkeleton } from './post-skeleton';

// ----------------------------------------------------------------------

export default function PostList({ posts, loading, disabledIndex }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <PostItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post, index) => (
        <Grid key={post.id} xs={12} sm={6} md={3}>
          <PostItem post={post} index={!disabledIndex ? index : undefined} />
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <Grid container spacing={3}>
        {loading ? renderSkeleton : renderList}
      </Grid>
    </>
  );
}

PostList.propTypes = {
  disabledIndex: PropTypes.bool,
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
