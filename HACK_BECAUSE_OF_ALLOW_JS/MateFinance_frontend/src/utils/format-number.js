import moment from 'moment';
import numeral from 'numeral';
import { useLocales as getLocales } from 'src/locales';
// ----------------------------------------------------------------------
/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
function getLocaleCode() {
    const { currentLang: { numberFormat: { code, currency }, }, } = getLocales();
    return {
        code: code ?? 'en-US',
        currency: currency ?? 'USD',
    };
}
// ----------------------------------------------------------------------
export function fNumber(inputValue) {
    const { code } = getLocaleCode();
    if (!inputValue)
        return '';
    const number = Number(inputValue);
    const fm = new Intl.NumberFormat(code, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
    return fm;
}
// ----------------------------------------------------------------------
export function fCurrency(inputValue) {
    const { code, currency } = getLocaleCode();
    if (!inputValue)
        return '';
    const number = Number(inputValue);
    const fm = new Intl.NumberFormat(code, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
    return fm;
}
export function formatCurrency(inputValue) {
    const { code } = getLocaleCode();
    const currency = 'USD';
    if (!inputValue)
        return '';
    const number = Number(inputValue);
    const fm = new Intl.NumberFormat(code, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
    return fm;
}
// ----------------------------------------------------------------------
export function fPercent(inputValue) {
    const { code } = getLocaleCode();
    if (!inputValue)
        return '';
    const number = Number(inputValue) / 100;
    const fm = new Intl.NumberFormat(code, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(number);
    return fm;
}
// ----------------------------------------------------------------------
export function fShortenNumber(inputValue) {
    const { code } = getLocaleCode();
    if (!inputValue)
        return '';
    const number = Number(inputValue);
    const fm = new Intl.NumberFormat(code, {
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(number);
    return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}
// ----------------------------------------------------------------------
export function fData(inputValue) {
    if (!inputValue)
        return '';
    if (inputValue === 0)
        return '0 Bytes';
    const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    const decimal = 2;
    const baseValue = 1024;
    const number = Number(inputValue);
    const index = Math.floor(Math.log(number) / Math.log(baseValue));
    const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;
    return fm;
}
export function fthousandNumber(number) {
    return numeral(number).format('0,000');
}
function dueDateComparison(date) {
    const timeStamp = new Date().getTime();
    const formattedDueDate = moment(date).add(12, 'h').toDate();
    return timeStamp > formattedDueDate;
}
export function checkInvoiceStatus(invoice) {
    if (invoice?.paid === false &&
        invoice?.rejected === false &&
        invoice?.voided === false &&
        invoice?.draft === false) {
        if (dueDateComparison(invoice?.dueDate)) {
            return 'Overdue ';
        }
        return 'Awaiting Payment';
    }
    if (invoice?.paid === true) {
        return 'Paid';
    }
    if (invoice?.rejected === true) {
        return 'Rejected';
    }
    if (invoice?.voided === true) {
        return 'Voided';
    }
    if (invoice?.approved === true) {
        return 'Approved';
    }
    if (invoice?.draft === true) {
        return 'Draft';
    }
}
export const getPaymentTypeString = (type) => {
    if (type === 'bankTransfer' ||
        type === 'Bank transfer' ||
        type === 'Bank' ||
        type === 'BankTransfer') {
        return 'Bank Transfer';
    }
    if (type === 'payoneer') {
        return 'Payoneer';
    }
    if (type === 'payPal') {
        return 'PayPal';
    }
    if (type === 'jazzCash') {
        return 'JazzCash';
    }
    if (type === 'Jazz Cash') {
        return 'JazzCash';
    }
    if (type === 'easyPaisa') {
        return 'EasyPaisa';
    }
    return type;
};
export function uuid() {
    const randomUUID = uuidv4();
    return randomUUID;
}
export function removeCommaAndRound(stringNumber) {
    const numberWithoutComma = stringNumber.replace(',', '');
    const roundedNumber = Math.round(Number(numberWithoutComma));
    return roundedNumber;
}
