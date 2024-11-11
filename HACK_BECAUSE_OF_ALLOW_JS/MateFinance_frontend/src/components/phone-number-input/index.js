import React from 'react';
import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
import TextField from '@mui/material/TextField';
import 'react-phone-input-2/lib/style.css';
// import 'react-phone-input-2/lib/material.css';
// import './index.scss';
const Index = (props) => {
    const { Controller, control, errors, myStyles, phoneInputSize, 
    // getCountryCode,
    defaultCountry, country, flagDropDown, disabled, } = props;
    // const [defaultCountry, setDefaultCountry] = useState('');
    // useEffect(() => {
    //   if (getCountryCode) {
    //     let countryCode = getCountryCode(); // Call the function to get the country code
    //     countryCode = countryCode.toLowerCase();
    //     setDefaultCountry(countryCode);
    //   }
    // }, [getCountryCode]);
    // const validatePhoneNumber = async (value) => {
    //   const phoneNumber = `${defaultCountry}${value}`; // Combine default country dial code and phone number
    //   const isValid = await PhoneInput.isValidPhoneNumber(phoneNumber);
    //   return isValid || 'Invalid phone number';
    // };
    function isUpperCase(input) {
        if (input === String(input).toUpperCase()) {
            return String(input.toLowerCase());
        }
        return input;
    }
    return (<>
      <Controller name="phoneNumber" control={control} rules={{ required: true }} render={({ field: { ref, ...field } }) => (<PhoneInput {...field} country={isUpperCase(country)} countryCodeEditable={false} disableDropdown={flagDropDown} disabled={disabled} inputProps={{
                // name: 'phoneNumber',
                ref,
                required: true,
                autoFocus: true,
                className: `form-control input-phone-number phone-input ${phoneInputSize}`,
                style: { fontSize: myStyles, width: '100%', borderRadius: '32px' },
                component: TextField,
            }}/>)}/>
      {errors.phoneNumber && (<span style={{ color: 'red', fontSize: 12 }}>Phone number is not valid</span>)}
    </>);
};
export default Index;
