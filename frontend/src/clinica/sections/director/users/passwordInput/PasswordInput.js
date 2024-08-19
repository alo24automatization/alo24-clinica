import React, { useState } from "react";
import { InputGroup, Input, Button, InputRightElement } from "@chakra-ui/react";
import Iconeyeoff from "./../image/iconeyeoff.png";
import Iconeyeon from "./../image/iconeyeon.png";

function PasswordInput({ name, changeHandler, keyPressed }) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Parolni kiriting"
        size="sm"
        style={{ borderColor: "#eee", boxShadow: "none" }}
        name={name}
        onChange={changeHandler}
        onKeyUp={keyPressed}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={handleClick}
          style={{
            background: "#fff",
            top: "-4px",
            right: "-15px",
            border: "none",
            boxShadow: "none",
            outline: "none",
          }}
        >
          {show ? (
            <img src={Iconeyeon} style={{ width: "17px" }} alt="" />
          ) : (
            <img src={Iconeyeoff} style={{ width: "17px" }} alt="" />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;
