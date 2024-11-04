import KeyboardDatePicker from '@mui/lab/DatePicker';

function DatePick(props) {
  const { selectedDate, handleDateChange } = props;

  return (
    <KeyboardDatePicker
      variant="inline"
      format="dd/MM/yyyy"
      autoOk
      id="date-picker"
      label="Repayment Date"
      value={selectedDate}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  );
}

export default DatePick;
