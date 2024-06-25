import styled from "styled-components";

export const Button = styled.button`
  color: white;
  padding: 5px 5px;
  width: fit-content;
  // max-width: 180px;
  border: none;
  background: rgb(66,67,68);
  border-radius: 5px;
  font-size: 0.9rem;
  border: 1px solid transparent;
  transition: 0.4s background ease-in;
  cursor: pointer;

  &:hover {
    background-color: white;
    border: 1px solid black;
    color: black;
    transition: 0.3s background ease-in;
  }
`;

export const OutlineButton = styled(Button)`
    background-color: white;
    border: 1px solid black;
    color: black;
    &:hover {
    background-color: black;
    border: 1px solid transparent;
    color: white;
  }
`;