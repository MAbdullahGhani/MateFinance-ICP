import { Helmet } from 'react-helmet-async';

import PickerView from 'src/sections/_examples/mui/picker-view';

// ----------------------------------------------------------------------

export default function PickerPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Picker</title>
      </Helmet>

      <PickerView />
    </>
  );
}
