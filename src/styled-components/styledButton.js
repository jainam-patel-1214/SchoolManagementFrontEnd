import styled from "styled-components";

export const StyledButton = styled.button`
    float:right;
    font-size:large;
    padding: 10px;
    background:linear-gradient(to right,#62cff4,#2c67f2);
    color:white;
    width: 250px;
    cursor: pointer;
    border-radius: 25px;
    border: none;
    transition: .3s ease-in;

    &:hover{
        box-shadow: 10px 10px 20px #9d9d9d82;
    }
`

export const StyledInput = styled.input`
    padding: 5px;
    margin: 10px;

`