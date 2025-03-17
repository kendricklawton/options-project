import { Button, IconButton, styled, TextField } from "@mui/material";

export const StyledButton = styled(Button)({
    backgroundColor: 'grey',
    fontFamily: 'inherit',
    height: '2rem',
    color: 'white',
    width: 'fit-content',
    borderRadius: '0',
    whiteSpace: 'nowrap',
    '& .MuiButton-label': {
        color: 'white',
    },
});

export const StyledButtonTwo = styled(Button)({
    width: '100%',
    color: 'inherit',
});

export const StyledIconButton = styled(IconButton)({
    border: 'none',
    color: 'grey'
});

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        fontFamily: 'inherit',
        borderRadius: '0',
        height: '2rem',
        fontSize: 'inherit',
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