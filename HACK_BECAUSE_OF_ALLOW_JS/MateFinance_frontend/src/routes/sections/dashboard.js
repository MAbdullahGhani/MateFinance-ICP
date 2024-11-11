import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import AppWelcome from 'src/sections/overview/app/app-welcome';
import { SeoIllustration } from 'src/assets/illustrations';
// ----------------------------------------------------------------------
// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
// LENDER
const LenderListPage = lazy(() => import('src/pages/dashboard/lender/lender-list'));
const LenderReqListPage = lazy(() => import('src/pages/dashboard/lender/lending-resquest'));
const LenderDetailsPage = lazy(() => import('src/pages/dashboard/lender/lender-details'));
// BORROWER
const BorrowerListPage = lazy(() => import('src/pages/dashboard/borrower/borrower-list'));
const BorrowerDetailsPage = lazy(() => import('src/pages/dashboard/borrower/borrower-details'));
// MARKET PLACE
const MarketPlaceListPage = lazy(() => import('src/pages/dashboard/market-place/list'));
const MarketPlaceCreatePage = lazy(() => import('src/pages/dashboard/market-place/new'));
const MarketPlaceDetailsPage = lazy(() => import('src/sections/market-place/market-place-details/index'));
const LendNowDetailsPage = lazy(() => import('src/sections/market-place/view/lender-lend-deal'));
//FINANCING DETAILS
const FinanceDetails = lazy(() => import('src/pages/dashboard/FinanceDetail'));
// ----------------------------------------------------------------------
export const dashboardRoutes = [
    {
        path: 'dashboard',
        element: (<AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>),
        children: [
            {
                element: (<AppWelcome title={`Welcome back 👋`} description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything." img={<SeoIllustration />} showHelmet={true}/>),
                index: true,
            },
            { path: 'ecommerce', element: <OverviewEcommercePage /> },
            { path: 'analytics', element: <OverviewAnalyticsPage /> },
            { path: 'banking', element: <OverviewBankingPage /> },
            { path: 'booking', element: <OverviewBookingPage /> },
            { path: 'file', element: <OverviewFilePage /> },
            {
                key: 'none',
                path: 'welcome',
                element: (<AppWelcome title={`Welcome back 👋`} description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything." img={<SeoIllustration />} showHelmet={true}/>),
            },
            // LENDER
            {
                path: 'lender',
                children: [
                    { element: <LenderListPage />, index: true },
                    { path: 'lenders', element: <LenderListPage /> },
                    { path: 'lendingRequests', element: <LenderReqListPage /> },
                    { path: ':id', element: <LenderDetailsPage /> },
                ],
            },
            // BORROWER
            {
                path: 'borrower',
                children: [
                    { element: <BorrowerListPage />, index: true },
                    { path: 'borrowers', element: <BorrowerListPage /> },
                    { path: ':id', element: <BorrowerDetailsPage /> },
                ],
            },
            // MARKET PLACE
            {
                path: 'marketplace',
                children: [
                    { element: <MarketPlaceListPage />, index: true },
                    { path: 'list', element: <MarketPlaceListPage /> },
                    { path: 'create', element: <MarketPlaceCreatePage /> },
                    { path: ':id', element: <MarketPlaceDetailsPage /> },
                    { path: 'lendNow', element: <LendNowDetailsPage /> },
                ],
            },
            {
                path: 'user',
                children: [
                    { element: <UserProfilePage />, index: true },
                    { path: 'profile', element: <UserProfilePage /> },
                    { path: 'cards', element: <UserCardsPage /> },
                    { path: 'list', element: <UserListPage /> },
                    { path: 'new', element: <UserCreatePage /> },
                    { path: ':id/edit', element: <UserEditPage /> },
                    { path: 'account', element: <UserAccountPage /> },
                ],
            },
            {
                path: 'product',
                children: [
                    { element: <ProductListPage />, index: true },
                    { path: 'list', element: <ProductListPage /> },
                    { path: ':id', element: <ProductDetailsPage /> },
                    { path: 'new', element: <ProductCreatePage /> },
                    { path: ':id/edit', element: <ProductEditPage /> },
                ],
            },
            {
                path: 'order',
                children: [
                    { element: <OrderListPage />, index: true },
                    { path: 'list', element: <OrderListPage /> },
                    { path: ':id', element: <OrderDetailsPage /> },
                ],
            },
            {
                path: 'invoice',
                children: [
                    { element: <InvoiceListPage />, index: true },
                    { path: 'list', element: <InvoiceListPage /> },
                    { path: ':id', element: <InvoiceDetailsPage /> },
                    { path: ':id/edit', element: <InvoiceEditPage /> },
                    { path: 'new', element: <InvoiceCreatePage /> },
                ],
            },
            {
                path: 'post',
                children: [
                    { element: <BlogPostsPage />, index: true },
                    { path: 'list', element: <BlogPostsPage /> },
                    { path: ':title', element: <BlogPostPage /> },
                    { path: ':title/edit', element: <BlogEditPostPage /> },
                    { path: 'new', element: <BlogNewPostPage /> },
                ],
            },
            {
                path: 'job',
                children: [
                    { element: <JobListPage />, index: true },
                    { path: 'list', element: <JobListPage /> },
                    { path: ':id', element: <JobDetailsPage /> },
                    { path: 'new', element: <JobCreatePage /> },
                    { path: ':id/edit', element: <JobEditPage /> },
                ],
            },
            {
                path: 'tour',
                children: [
                    { element: <TourListPage />, index: true },
                    { path: 'list', element: <TourListPage /> },
                    { path: ':id', element: <TourDetailsPage /> },
                    { path: 'new', element: <TourCreatePage /> },
                    { path: ':id/edit', element: <TourEditPage /> },
                ],
            },
            { path: 'finance-details/:id', element: <FinanceDetails /> },
            { path: 'file-manager', element: <FileManagerPage /> },
            { path: 'mail', element: <MailPage /> },
            { path: 'chat', element: <ChatPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'kanban', element: <KanbanPage /> },
            { path: 'permission', element: <PermissionDeniedPage /> },
            { path: 'blank', element: <BlankPage /> },
        ],
    },
];
