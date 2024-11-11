import orderBy from 'lodash/orderBy';
import { useState, useCallback, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useDebounce } from 'src/hooks/use-debounce';
import { POST_SORT_OPTIONS } from 'src/_mock';
import { useGetPosts, useSearchPosts } from 'src/api/blog';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import MarketPlaceSort from '../market-place-sort';
import MarketPlaceSearch from '../market-place-search';
import MarketPlaceListHorizontal from '../market-place-list-horizontal';
import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import LoadingScreenCustom from 'src/components/loading-screen/loading-screen-custom';
import { InputAdornment, TextField } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { TableNoData } from 'src/components/table';
import EmptyContent from 'src/components/empty-content';
import { width } from '@mui/system';
// ----------------------------------------------------------------------
const defaultFilters = {
    publish: 'All',
    search: '',
    sortBy: 'latest',
};
// ----------------------------------------------------------------------
export default function MarketPlaceListView() {
    const { user, authenticated } = useAuthContext();
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('latest');
    const [filters, setFilters] = useState(defaultFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery);
    // const { posts, postsLoading } = useGetPosts();
    const [deals, setDeals] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);
    const dealStatus = [
        { value: 'All', label: 'All' },
        { value: 'draft', label: 'Draft' },
        // { value: 'financeRequest', label: 'Finance Request' },
        { value: 'tokenized', label: 'Live' },
        { value: 'lending', label: 'Lent' },
        { value: 'closed', label: 'Closed' },
        { value: 'repayment', label: 'Repaid' },
        { value: 'expired', label: 'Expired' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rejected', label: 'Rejected' },
    ];
    const dealStatusLender = [
        { value: 'All', label: 'All' },
        // { value: 'financeRequest', label: 'Finance Request' },
        { value: 'tokenized', label: 'Live' },
        { value: 'lending', label: 'Lent' },
        { value: 'closed', label: 'Closed' },
        { value: 'repayment', label: 'Repaid' },
        { value: 'my Deals', label: 'My Deals' },
    ];
    const dataFiltered = applyFilter({
        inputData: deals,
        filters,
        sortBy,
    });
    useEffect(() => {
        handleDealList();
    }, [filters]);
    const handleSortBy = useCallback((newValue) => {
        handleFilters('sortBy', newValue);
    }, []);
    const handleFilters = useCallback((name, value) => {
        setFilters((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);
    const handleFilterPublish = useCallback((event, newValue) => {
        handleFilters('publish', newValue);
    }, [handleFilters]);
    const handleDealList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${endpoints.app.getAllDeals}?sortingOrder=${filters.sortBy}&search=${filters.search}&status=${filters.publish === 'my Deals' ? 'All' : filters.publish}${filters.publish === 'my Deals' ? '&deal=my Deals' : ''}`);
            setDeals(response);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            enqueueSnackbar(error, {
                variant: 'error',
            });
        }
    };
    return (<>
      {loading && <LoadingScreenCustom />}
      <CustomBreadcrumbs heading="Marketplace" links={[
            {
                name: 'Dashboard',
                href: paths.dashboard.root,
            },
            {
                name: 'List',
            },
        ]} sx={{
            mb: { xs: 3, md: 5 },
            width: '100%',
        }}/>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <TextField name="search" fullWidth value={filters.name} onChange={(event) => handleFilters(event.target.name, event.target.value)} placeholder="Search borrower..." sx={{
            mt: -8,
            boxShadow: (theme) => theme.customShadows.z4,
        }} InputProps={{
            startAdornment: (<InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }}/>
              </InputAdornment>),
        }}/>
        <Stack spacing={2} justifyContent="right" alignItems={{ xs: 'flex-end', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }} sx={{
            mb: { xs: 3, md: 5 },
        }}>
          {/* <MarketPlaceSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title) => paths.dashboard.post.details(title)}
        /> */}

          <MarketPlaceSort sort={filters.sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS}/>
        </Stack>
        <Tabs value={filters.publish} onChange={handleFilterPublish} sx={{
            mb: { xs: 3, md: 5 },
        }}>
          {user?.role === 1
            ? dealStatus.map((tab) => (<Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} sx={{ textTransform: 'capitalize' }}/>))
            : dealStatusLender.map((tab) => (<Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} sx={{ textTransform: 'capitalize' }}/>))}
        </Tabs>
        {dataFiltered?.length === 0 ? (<Stack>
            <EmptyContent filled title="No Data" sx={{
                py: 10,
            }}/>
          </Stack>) : (<MarketPlaceListHorizontal posts={dataFiltered} loading={postsLoading} tab={filters.publish}/>)}
      </Container>
    </>);
}
// ----------------------------------------------------------------------
const applyFilter = ({ inputData, filters, sortBy }) => {
    // const { publish } = filters;
    // if (sortBy === 'latest') {
    //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
    // }
    // if (sortBy === 'oldest') {
    //   inputData = orderBy(inputData, ['createdAt'], ['asc']);
    // }
    // if (sortBy === 'popular') {
    //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
    // }
    // if (publish !== 'all') {
    //   inputData = inputData.filter((post) => post.publish === publish);
    // }
    return inputData;
};
