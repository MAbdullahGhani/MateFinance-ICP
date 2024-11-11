import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------
const icon = (name) => (<SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }}/>
// OR
// <Iconify icon="fluent:mail-24-filled" />
// https://icon-sets.iconify.design/solar/
// https://www.streamlinehq.com/icons
);
const ICONS = {
    job: icon('ic_job'),
    blog: icon('ic_blog'),
    chat: icon('ic_chat'),
    mail: icon('ic_mail'),
    user: icon('ic_user'),
    file: icon('ic_file'),
    lock: icon('ic_lock'),
    tour: icon('ic_tour'),
    order: icon('ic_order'),
    label: icon('ic_label'),
    blank: icon('ic_blank'),
    kanban: icon('ic_kanban'),
    folder: icon('ic_folder'),
    banking: icon('ic_banking'),
    booking: icon('ic_booking'),
    invoice: icon('ic_invoice'),
    product: icon('ic_product'),
    calendar: icon('ic_calendar'),
    disabled: icon('ic_disabled'),
    external: icon('ic_external'),
    menuItem: icon('ic_menu_item'),
    ecommerce: icon('ic_ecommerce'),
    analytics: icon('ic_analytics'),
    dashboard: icon('ic_dashboard'),
    marketPlace: <Iconify icon="mdi:marketplace"/>,
    borrower: <Iconify icon="icon-park-outline:financing"/>,
};
// ----------------------------------------------------------------------
export function useNavData() {
    const { t } = useTranslate();
    const { user, authenticated } = useAuthContext();
    // ADMIN NAVIGATION
    const adminNavigation = useMemo(() => [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
            subheader: 'Admin',
            items: [
            // {
            //   title: t('dashboard'),
            //   path: paths.dashboard.root,
            //   icon: ICONS.dashboard,
            // },
            // {
            //   title: t('ecommerce'),
            //   path: paths.dashboard.general.ecommerce,
            //   icon: ICONS.ecommerce,
            // },
            // {
            //   title: t('analytics'),
            //   path: paths.dashboard.general.analytics,
            //   icon: ICONS.analytics,
            // },
            // {
            //   title: t('banking'),
            //   path: paths.dashboard.general.banking,
            //   icon: ICONS.banking,
            // },
            // {
            //   title: t('booking'),
            //   path: paths.dashboard.general.booking,
            //   icon: ICONS.booking,
            // },
            // {
            //   title: t('file'),
            //   path: paths.dashboard.general.file,
            //   icon: ICONS.file,
            // },
            ],
        },
        // MANAGEMENT
        // ----------------------------------------------------------------------
        {
            // subheader: t('management'),
            items: [
                // LENDER
                {
                    title: t('Lenders'),
                    path: paths.dashboard.lender.root,
                    icon: ICONS.user,
                    children: [
                        { title: t('list'), path: paths.dashboard.lender.lenderList },
                        { title: t('lending Request'), path: paths.dashboard.lender.lenderReqList },
                        // { title: t('details'), path: paths.dashboard.lender.viewLender },
                    ],
                },
                // BORROWER
                {
                    title: t('Tokenization request'),
                    path: paths.dashboard.borrower.root,
                    icon: ICONS.borrower,
                    children: [
                        { title: t('list'), path: paths.dashboard.borrower.borrowerList },
                        // { title: t('lending Request'), path: paths.dashboard.borrower.borrowerReqList },
                        // { title: t('details'), path: paths.dashboard.lender.viewLender },
                    ],
                },
                // MARKET PLACE
                {
                    title: t('Marketplace'),
                    path: paths.dashboard.marketPlace.root,
                    icon: ICONS.marketPlace,
                    children: [
                        { title: t('Deals'), path: paths.dashboard.marketPlace.marketPlaceList },
                        // { title: t('Create Deals'), path: paths.dashboard.marketPlace.createMarketPlace },
                        // { title: t('details'), path: paths.dashboard.lender.viewLender },
                    ],
                },
            ],
        },
    ], [t]);
    // LENDER NAVIGATION
    const lenderNavigation = useMemo(() => [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
            subheader: 'Lender',
            items: [
                // MARKET PLACE
                {
                    title: t('Marketplace'),
                    path: paths.dashboard.marketPlace.root,
                    icon: ICONS.marketPlace,
                    children: [
                        { title: t('Deals'), path: paths.dashboard.marketPlace.marketPlaceList },
                        // { title: t('Create Deals'), path: paths.dashboard.marketPlace.createMarketPlace },
                        // { title: t('details'), path: paths.dashboard.lender.viewLender },
                    ],
                },
                {
                    title: t('Profile'),
                    path: paths.dashboard.user.root,
                    icon: ICONS.user,
                    children: [
                        // { title: t('profile'), path: paths.dashboard.user.root },
                        // { title: t('cards'), path: paths.dashboard.user.cards },
                        // { title: t('list'), path: paths.dashboard.user.list },
                        // { title: t('create'), path: paths.dashboard.user.new },
                        // { title: t('edit'), path: paths.dashboard.user.demo.edit },
                        { title: t('account'), path: paths.dashboard.user.account },
                    ],
                },
            ],
        },
    ], [t]);
    return user?.role === 2 ? lenderNavigation : adminNavigation;
}
