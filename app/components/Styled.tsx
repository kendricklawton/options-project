import { IconButton, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(({ }) => ({
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
            border: 'none',
        },
        '&.Mui-focused fieldset': {
            border: 'none',
        },
        '&.Mui-active fieldset': {
            border: 'none',
        },
    },
}));

export const StyledIconButton = styled(IconButton)({
    // border: '1px solid grey',
    border: 'none',
    color: 'grey'
});