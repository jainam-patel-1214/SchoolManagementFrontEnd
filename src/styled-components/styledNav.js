import styled from "styled-components";
export const StyledNavbar = styled.div`
    padding: 10px;
    background: #eee;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    `
export const StyledNavbarSubTabs = styled.div`
    display: none;
    background: #cfcfcf;
    /* padding: 10px; */
    margin-top: 1rem;
    position: absolute;
    left: 0;
    top: 50%;
`
export const NavbarTabs = styled.button`
    padding: 10px;
    background: none;
    border: none;
    cursor: pointer;
    /* margin-top: 1rem; */
`
export const StyledNavbarTabs = styled.div`
        background: lightblue;
        padding: 10px;
        display: inline-block;
        cursor: pointer;
        border: none;
        position: relative;
        margin-right: 10px;
    
        &:hover ${StyledNavbarSubTabs} {
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 10;
        }
    `