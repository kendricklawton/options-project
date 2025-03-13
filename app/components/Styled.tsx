import { IconButton, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(({ }) => ({
    '& .MuiOutlinedInput-root': {
        fontFamily: 'inherit',
        borderRadius: '0',
        height: '2rem',
        fontSize: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: '1px solid gray',
            },
            '&:hover:before': {
                borderBottom: '2px solid gray',
            },
        },
        '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiInputBase-input': {
            color: 'lightgray',
        },
        '& label': {
            color: 'gray',
        },
        '& label.Mui-focused': {
            color: 'gray',
        },
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey', // Set background color for dark mode
            '& fieldset': {
                border: '1px solid gray',
            },
            '&:hover fieldset': {
                borderColor: 'lightgray',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'lightgray',
            },
            '&.Mui-active fieldset': {
                borderColor: 'lightgray',
            },
        },
    },
}));

export const StyledIconButton = styled(IconButton)({
    // border: '1px solid grey',
    border: 'none',
    color: 'grey'
});