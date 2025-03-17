import {Button, IconButton, styled, TextField } from "@mui/material";

export const StyledButton = styled(Button)({
    backgroundColor: 'grey',
    height: '2rem',
    color: 'white',
    width: 'fit-content',
    // justifyContent: 'space-between',
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
