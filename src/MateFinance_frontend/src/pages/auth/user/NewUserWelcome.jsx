import { Helmet } from 'react-helmet-async';

// sections
import NewUserWelcomeView from 'src/sections/auth/user/view/new-user-welcome-view';

// ----------------------------------------------------------------------

export default function NewUserWelcome() {
  return (
    <>
      <Helmet>
        <title> User: Welcome</title>
      </Helmet>
      <NewUserWelcomeView />
    </>
  );
}
