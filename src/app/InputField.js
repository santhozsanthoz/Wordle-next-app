'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import { Button, Popover, Typography } from '@mui/material';
import axios from 'axios';
import { specialWords } from './SpecialWords';

function BoxInputs({ separator, length, value, onChange, finVal, currentIndex, setCurrentIndex, indexCurr, openPopover, totalInputFields, setKeyColors, keyColors }) {

  const [isSubmitted, setIsSubmitted] = React.useState(false);


  const isAWord = async (value) => {
    try {
      if(specialWords.includes(value.toUpperCase())) {
        return true;
      }
      const res = await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + value);
      return true;
    } catch (err) {
      return false;
    }
  }

  const reloadPage = () => {
    window.location.reload();
  }

  const getColorForKeyBoard = (index, curColor) => {
    if (curColor == '#79B750') {
      return curColor;
    } else if (finVal[index] == value[index]) {
      return "#79B750";
    } else if (curColor == "#F2C236") {
      return curColor;
    } else if (finVal.includes(value[index])) {
      return "#F2C236";
    }
    return "#A4AEC4";
  }

  const submitVal = async () => {
    if (value.length == 5) {
      if(specialWords.includes(value.toUpperCase()) && finVal == value) {
        setIsSubmitted(true);
        openPopover(<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div>{"You Won!"}</div><div><img src="https://media.tenor.com/ET7xLBoXJMwAAAAM/celebration-confetti.gif" alt="You Won!" width={100} /></div><div><Button style={{ margin: "20px" }} variant="contained" color="success" onClick={reloadPage}>New Game</Button></div></div>);
        setCurrentIndex(-1);
        return;
      }
      if (!await isAWord(value)) {
        openPopover("Word Not Found");
        return;
      }
      setIsSubmitted(true);
      for (let i = 0; i < value.length; i++) {
        setKeyColors((prev) => prev.map(row =>
          row.map(cell => {
            if (cell.key.toLowerCase() === value[i].toLowerCase()) {
              return { ...cell, color: getColorForKeyBoard(i, cell.color) };
            }
            return cell;
          })
        ))
      }

      if (finVal == value) {
        openPopover(<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div>{"You Won!"}</div><div><img src="https://media.tenor.com/ET7xLBoXJMwAAAAM/celebration-confetti.gif" alt="You Won!" width={100} /></div><div><Button style={{ margin: "20px" }} variant="contained" color="success" onClick={reloadPage}>New Game</Button></div></div>);
        setCurrentIndex(-1);
        return;
      }
      setCurrentIndex(currentIndex + 1);
      if (indexCurr == totalInputFields) {
        openPopover(<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div>{"The answer was : "}<b>{finVal.toUpperCase()}</b> </div><div><Button style={{ margin: "20px" }} variant="contained" color="success" onClick={reloadPage}>New Game</Button></div></div>)
      }
    } else {
      openPopover("Too Short...");
      return;
    }
  }
  const inputRefs = React.useRef(new Array(length).fill(null));

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const getColor = (index) => {
    if (!isSubmitted) return ''
    if (value.length != 5) return ''
    try {
      if (finVal[index] == value[index].toLowerCase()) {
        return "#79B750";
      } else if (finVal.includes(value[index].toLowerCase())) {
        return "#F2C236";
      }
    } catch (err) {

    }
    return "#A4AEC4"
  }

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (event, currentIndex) => {
    if (event.key == 'Enter') {
      submitVal();
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev) => {
      const otpArray = prev.split('');
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join('');
    });
    if (currentValue !== '') {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split('');

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' ';
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(''));
    }
  };
  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row", margin: "10px" }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {new Array(length).fill(null).map((_, index) => (
            <React.Fragment key={index}>
              <BaseInput
                slots={{
                  input: InputElement,
                }}
                aria-label={`Digit ${index + 1} of Word`}
                slotProps={{
                  input: {
                    style: { backgroundColor: isSubmitted ? getColor(index) : "#f0f0f0ff" },
                    ref: (ele) => {
                      inputRefs.current[index] = ele;
                    },
                    onDragEnter: () => submitVal(),
                    onKeyDown: (event) => handleKeyDown(event, index),
                    onChange: (event) => handleChange(event, index),
                    onClick: (event) => handleClick(event, index),
                    onPaste: (event) => handlePaste(event, index),
                    value: value[index] ?? '',
                    color: currentIndex == indexCurr ? (isSubmitted ? getColor(index) : '#FBFCFF') : '#FBFCFF',
                    disabled: isSubmitted || currentIndex + 1 != indexCurr
                  },
                }}
              />
              {index === length - 1 ? null : separator}
            </React.Fragment>
          ))}
        </Box>
        {currentIndex + 1 == indexCurr && false && <Button aria-describedby="" variant="contained" color="secondary" style={{ width: "50px", margin: "10px", padding: 0 }} onClick={submitVal}>Check</Button>}
      </div>
    </React.Fragment>
  );
}

BoxInputs.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  value: PropTypes.string.isRequired,
};

export default function InputFields({ finVal, currentIndex, setCurrentIndex, index, openPopover, totalInputFields, setKeyColors, keyColors }) {
  const [otp, setOtp] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <BoxInputs separator={''} value={otp} onChange={setOtp} length={5} finVal={finVal} indexCurr={index} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} openPopover={openPopover} totalInputFields={totalInputFields} setKeyColors={setKeyColors} keyColors={keyColors} />
    </Box>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputElement = styled('input')(
  ({ theme }) => `
  width: 40px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 1000;
  text-transform: uppercase;
  line-height: 1.5;
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`,
);
