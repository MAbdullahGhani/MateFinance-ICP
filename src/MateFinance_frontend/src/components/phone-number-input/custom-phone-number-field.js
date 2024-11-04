// ** React Imports
import React from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';
// import 'react-phone-number-input/style.css';

import './index.scss';
import { Box } from '@mui/material';

export const handleValidateMobile = (value) => {
  const stringValue = String(value); // Convert value to a string
  const isValid = isValidPhoneNumber(stringValue);
  // console.log({ isValid });
  return isValid;
};

const CustomPhoneNumberField = (props) => {
  const {
    value,
    name,
    customer,
    setCustomer,
    getCustomerInfo,
    errors,
    myStyles,
    disabled,
    phoneInputSize,
    onChange,
    validerror,
    defaultCountry = 'PK',
  } = props;
    console.log("🚀 ~ CustomPhoneNumberField ~ defaultCountry:", defaultCountry)

  // console.log(phoneInputSize);
  const handleChange = (value) => {
    if (props.onChange) {
      props.onChange(value);
    } else {
      // Default onChange logic
      if (value && value?.length == 13) {
        if (getCustomerInfo !== null) {
          getCustomerInfo(value, customer?.clientEmail);
        }
      }
      if (value?.length <= 20) {
        setCustomer({
          ...customer,
          clientMobileNumber: value || '',
        });
      }
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        m: 'auto',
      }}
    >
      <PhoneInput
        id="phone-number"
        className={`form-control input-phone-number phone-input ${phoneInputSize} `}
        international
        withCountryCallingCode
        defaultCountry={defaultCountry}
        name
        disabled={disabled}
        maxLength={17}
        minlength={7}
        plcaeholder="Mobile Number"
        style={{ fontSize: myStyles }}
        value={value}
        onChange={(value) => {
          handleChange(value);
        }}
      />
      {customer?.errors?.clientPhone === 'error' && (
        <span style={{ color: 'red', fontSize: 12 }}>Field is required</span>
      )}

      {errors?.PhoneNumber && <span style={{ color: 'red', fontSize: 12 }}>Invalid Phone</span>}
      {errors && <span style={{ color: 'red', fontSize: 12 }}>Invalid Phone</span>}

      {/* this is valiadtion error from react-hook-form. dont touch */}
      {validerror && validerror[name]?.message && (
        <span style={{ color: 'red', fontSize: 12, marginLeft: '40px' }}>Invalid Phone</span>
      )}
    </Box>
  );
};

export default CustomPhoneNumberField;
