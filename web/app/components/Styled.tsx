import { Button, IconButton, styled, TextField } from "@mui/material";

// const defaultFontFamily = 'var(--font-geist-sans)';
const defaultFontFamily = 'var(--font-geist-mono)';
const defaultHeight = '2rem';
const defaultBoxShadow = '0px 2px 4px rgba(0.1, 0.1, 0.1, 0.1)';

export const StyledButton = styled(Button)({
    backgroundColor: 'inherit',
    borderRadius: '0rem',
    boxShadow: defaultBoxShadow,
    color: 'inherit',
    fontFamily: defaultFontFamily,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    height: defaultHeight,
    whiteSpace: 'nowrap'
});


export const StyledIconButton = styled(IconButton)({
    border: 'none',
    color: 'grey'
});

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        fontFamily: defaultFontFamily,
        fontSize: 'inherit',
        fontWeight: 'inherit',
        borderRadius: '0rem',
        height: defaultHeight,
        backgroundColor: 'lightgray',
        '& fieldset': {
            border: 'none',
        },
        '&:hover fieldset': {
            border: 'none', // No border on hover
        },
        '&.Mui-focused fieldset': {
            border: 'none', // No border when focused
        },
        '&.Mui-active fieldset': {
            border: 'none', // No border when active
        },
        '&:hover': {
            backgroundColor: 'darkgray', // Change background on hover
            '& input': {
                color: '#333', // Change input text color on hover
            },
        },
    },
    // '& input::-webkit-inner-spin-button': {
    //     WebkitAppearance: 'none', // Hide the inner spin button (works for number inputs)
    //     margin: 0,
    // },
    '& input[type="number"]': {
        MozAppearance: 'textfield', // For Firefox, hides spin button
    },
    '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
        backgroundColor: 'green', // Default background color of the increment/decrement buttons
    },
    '& input[type="number"]:hover::-webkit-outer-spin-button, & input[type="number"]:hover::-webkit-inner-spin-button': {
        backgroundColor: 'green', // Change background color of the increment/decrement buttons on hover
    },
});