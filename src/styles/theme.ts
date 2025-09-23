import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily:'"Courier Prime", monospace',
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
     MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor:'dimgray',
          borderRightWidth:'0.5px'
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          justifyContent:'center'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none', 
          background:'none' 
        },
      },
    },
       MuiCircularProgress: {
      styleOverrides: {
        root: {
          color:'dimgray'
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, 
          transition: 'all 0.5s ease', 
          boxShadow:'none',
          fontSize:'smaller'
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            boxShadow:'none',
            width:'max-content',
            padding:'0.5rem 2rem',
            fontSize: '1rem',
            textWrapMode:'no-wrap',
            color:'inherit',
            backgroundColor:'transparent',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: 'rgba(0, 0, 0, 0.87)',
              color:'white'
            },
            '&:active': {
              transform: 'translateY(0)'
            },
          },
        }
      ]
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6, 
          borderRadius: 3, 
          backgroundColor: '#e0e0e0', 
        },
        bar: {
          borderRadius: 3,
          backgroundColor: '#9e9e9e', 
          transition: 'transform 0.4s linear',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: 'black'
          },
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            borderColor:'rgba(0, 0, 0, 0.87)'
          },
        },
        input: {
          borderColor:'rgba(0, 0, 0, 0.87)',
          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.87)',
            opacity: 0.8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.87)', 
            borderWidth: '2px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.87)', 
            borderWidth: '2px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f', 
          },
        },
        notchedOutline: {
          borderColor: 'darkgray', 
          borderWidth: '1px',
        },
      },
    },
     MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 0.87)',
          '&.Mui-focused': {
            color: 'rgba(0, 0, 0, 0.87)', 
            fontWeight: 600,
          },
          '&.Mui-error': {
            color: '#d32f2f', 
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#ad1457',
    },
    background: {
      default: '#060605ff',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Courier Prime", monospace',
    fontWeightRegular:'100'
  },
  components: {
     MuiContainer: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor:'gray',
          borderRightWidth:'0.5px'
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none', 
          background:'none' 
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          justifyContent:'center'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, 
          transition: 'all 0.5s ease', 
          boxShadow:'none',
          fontSize:'smaller'
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            boxShadow:'none',
            width:'max-content',
            padding:'0.5rem 2rem',
            fontSize: '1rem',
            textWrapMode:'no-wrap',
            color:'inherit',
            backgroundColor:'transparent',
            '&:hover': {
              transform: 'translateY(-1px)',
              backgroundColor: 'darkgray',
              color:'black'
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        }
      ]
    },
   MuiCircularProgress: {
      styleOverrides: {
        root: {
          color:'dimgray'
        },
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: 'white'
          },
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            borderColor:'darkgray'
          },
        },
        input: {
          borderColor:'darkgray',
          '&::placeholder': {
            color: 'darkgray',
            opacity: 0.8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'darkgray', 
            borderWidth: '2px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'darkgray', 
            borderWidth: '2px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f', 
          },
        },
        notchedOutline: {
          borderColor: '#e0e0e0', 
          borderWidth: '1px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 3,
          backgroundColor: '#424242', 
        },
        bar: {
          borderRadius: 3,
          backgroundColor: '#bdbdbd', 
          transition: 'transform 0.4s linear',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'darkgray',
          '&.Mui-focused': {
            color: 'darkgray', 
            fontWeight: 600,
          },
          '&.Mui-error': {
            color: '#d32f2f', 
          },
        },
      },
    },
  },
});
