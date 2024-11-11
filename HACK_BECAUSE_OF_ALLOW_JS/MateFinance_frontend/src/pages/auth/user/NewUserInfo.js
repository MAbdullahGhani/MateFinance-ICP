import { Helmet } from 'react-helmet-async';
// sections
import NewUserInfoView from 'src/sections/auth/user/view/new-user-info-view';
// ----------------------------------------------------------------------
export default function NewUserInfo() {
    return (<>
      <Helmet>
        <title> User: Register</title>
      </Helmet>
      <NewUserInfoView />
    </>);
}
