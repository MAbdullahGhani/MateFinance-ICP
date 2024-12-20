import { Helmet } from 'react-helmet-async';
import { AmplifyRegisterView } from 'src/sections/auth/amplify';
// ----------------------------------------------------------------------
export default function RegisterPage() {
    return (<>
      <Helmet>
        <title> Amplify: Register</title>
      </Helmet>

      <AmplifyRegisterView />
    </>);
}
