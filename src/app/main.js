'use client';

import { useEffect, useState, useRef } from "react";
import { Typography, Popover } from "@mui/material";
import InputField from "./InputField";
import axios from "axios";
import { Input as BaseInput } from '@mui/base/Input';
import { Box, styled } from '@mui/system';
import { keyColorValues } from "./KeyColorValues";
import { specialWords } from "./SpecialWords";

export default function Home() {
  const totalInputs = [1, 2, 3, 4, 5, 6];
  const [keyColors, setKeyColors] = useState(keyColorValues);
  const inputRefs = useRef(new Array(totalInputs.length).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finVal, setFinVal] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [popMessage, setPopMessage] = useState("");

  const openPopover = (popMessage) => {
    setPopMessage(() => popMessage)
    setAnchorEl(() => true);
  };

  const handlePClose = () => {
    setAnchorEl(null);
    setPopMessage("");
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const getValue = async () => {
    const randomInt = getRandomInt(3);
    if (randomInt % 2 == 0) {
      setFinVal(specialWords[randomInt].toLowerCase());
    } else {
      await axios.get("https://random-word-api.vercel.app/api?words=1&length=5").then((res) => {
        setFinVal(res.data[0])
      }).catch(err => {
        setFinVal("");
        openPopover(<span color="red">Something went wrong</span>);
        console.log(err)
      })
    }
  }

  useEffect(() => {
    getValue();
  }, [])

  return (
    <div >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {totalInputs.map((ind) => <InputField key={ind} index={ind} finVal={finVal} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} openPopover={openPopover} totalInputFields={totalInputs.length} keyColors={keyColors} setKeyColors={setKeyColors} />)}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>{popMessage}</Typography>
      </Popover>
      <div style={{ marginTop: "30px"}}>
        {keyColors.map((row) => <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {row.map((val) =>
            <BaseInput
              slots={{
                input: InputElement,
              }}
              slotProps={{
                input: {
                  style: { backgroundColor: val.color == '' ? "white" : val.color, margin: "5px" },
                  value: val.key,
                  disabled: true
                },
              }}
            />)}
        </div>)}
      </div>

    </div>
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
