import styled from "styled-components";
export const StyledNavbar = styled.div`
    padding: 5px 20px;
    background: rgba(106, 106, 106, 0.04);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: auto;
    margin-bottom: 1rem;
    position: sticky;
    top: 1rem;
    border-radius: 50px;
    `
export const StyledNavbarSubTabs = styled.div`
    display: none;
    background: #f1f1f1ff;
    backdrop-filter: blur(20px);
    width: max-content;
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
    &:hover{
        background-color: #e3e3e3ff;
    }
    /* margin-top: 1rem; */
`
export const StyledNavbarTabs = styled.div`
        background: whitesmoke;
        vertical-align: middle;
        padding: 10px;
        display: inline-block;
        cursor: pointer;
        border: none;
        position: relative;
        margin-right: 10px;
        svg {
        transition: transform 0.3s ease;
        }

        &:hover svg {
            transform: rotateZ(180deg);
        }

        &:hover ${StyledNavbarSubTabs} {
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 10;
        }
    `