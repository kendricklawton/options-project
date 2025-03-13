import { IconButton, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(({ }) => ({
    '& .MuiOutlinedInput-root': {
        fontFamily: 'inherit',
        borderRadius: '0',
        height: '2rem',
        fontSize: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'lightgray',
            '& fieldset': {
                border: '1px solid gray',
            },
            '&:hover fieldset': {
                border: 'none',
                // borderColor: 'lightgray',
            },
            '&.Mui-focused fieldset': {
                border: 'none',
                // borderColor: 'lightgray',
            },
            '&.Mui-active fieldset': {
                border: 'none',
                // borderColor: 'lightgray',
            },
        },
    },
}));

export const StyledIconButton = styled(IconButton)({
    // border: '1px solid grey',
    border: 'none',
    color: 'grey'
});