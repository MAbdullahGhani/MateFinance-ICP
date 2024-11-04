import orderBy from 'lodash/orderBy';
import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';

import { POST_SORT_OPTIONS } from 'src/_mock';
import { useGetPosts, useSearchPosts } from 'src/api/blog';

import { useSettingsContext } from 'src/components/settings';

import PostList from '../post-list';
import PostSort from '../post-sort';
import PostSearch from '../post-search';
import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import axios from 'axios';
import axiosInstance, { endpoints } from 'src/utils/axios';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PostDashboardStateCard } from '../post-dashboard-state-card';
import BackersComponent from '../post-backer-component';
import CompanyFeaturesCards from '../post-company-features';
import MarketPlaceListHorizontal from 'src/sections/market-place/market-place-list-horizontal';

// ----------------------------------------------------------------------

export default function PostListHomeView() {
  const settings = useSettingsContext();

  const [status, setStatus] = useState('All');

  const [sortBy, setSortBy] = useState('latest');

  const [searchQuery, setSearchQuery] = useState('');

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const dealStatus = [
    { value: 'All', label: 'All' },
    { value: 'tokenized', label: 'Live' },
    { value: 'lending', label: 'Lent' },
    { value: 'closed', label: 'Closed' },
    { value: 'repayment', label: 'Repaid' },
  ];

  const dataFiltered = applyFilter({
    inputData: posts,
    sortBy,
  });

  useEffect(() => {
    handleDealList();
  }, [sortBy, searchQuery, status]);

  const handleDealList = async () => {
    try {
      setPostsLoading(true);
      const response = await axiosInstance.get(
        `${endpoints.app.getAllDealsExt}?sortingOrder=${sortBy}&search=${searchQuery}&status=${status}`
      );
      setPosts(response);
      setPostsLoading(false);
    } catch (error) {
      setPostsLoading(false);
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
  };

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomComponent />
        {/* <Stack
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <TextField
            name="search"
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search borrower..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
        </Stack> */}
        <Tabs
          value={status}
          onChange={(event, newValue) => setStatus(newValue)}
          sx={{
            mb: { xs: 3, md: 5 },
            mt: { xs: 3, md: 5 },
          }}
        >
          {dealStatus.map((tab) => (
            <Tab
              key={tab?.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>
        <MarketPlaceListHorizontal posts={dataFiltered} loading={postsLoading} />

        {/* Backers */}
        <BackersComponent />
        <CompanyFeaturesCards />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, sortBy }) => {
  // if (sortBy === 'latest') {
  //   return orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   return orderBy(inputData, ['createdAt'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   return orderBy(inputData, ['totalViews'], ['desc']);
  // }

  return inputData;
};

const CustomComponent = () => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: -25,
      }}
    >
      <Grid item xs={12} md={3}>
        <PostDashboardStateCard title="Invoice Tokenized" number="$263+ M " />
      </Grid>
      <Grid item xs={12} md={3}>
        <PostDashboardStateCard title="Invoices Financed" number="$47.8+ M" />
      </Grid>
      <Grid item xs={12} md={3}>
        <PostDashboardStateCard title="Bad Debts" number="$0" />
      </Grid>
    </Grid>
  );
};
