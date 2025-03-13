import { IconButton, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        fontFamily: 'inherit',
        borderRadius: '0',
        height: '2rem',
        fontSize: 'inherit',
        '& fieldset': {
            // borderColor: 'grey'
        }
    }
});

// border: '1px solid grey',
// outline: '1px solid #64b5f6',
// border: '1px solid #64b5f6',
// outline: '1px solid #64b5f6',

/* 
                                  50: '#e3f2fd',
                                  100: '#bbdefb',
                                  200: '#90caf9',
                                  300: '#64b5f6',
                                  400: '#42a5f5',
                                  500: '#2196f3',
                                  600: '#1e88e5',
                                  700: '#1976d2',
                                  800: '#1565c0',
                                  900: '#0d47a1',
                                  A100: '#82b1ff',
                                  A200: '#448aff',
                                  A400: '#2979ff',
                                  A700: '#2962ff' */

export const StyledIconButton = styled(IconButton)({
    // border: '1px solid grey',
    border: 'none',
    color: 'grey'
});