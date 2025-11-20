import { Fragment, useEffect, useState } from "react"
import { NavbarTabs, StyledNavbar, StyledNavbarSubTabs, StyledNavbarTabs } from "../styled-components/styledNav"
import { LineBreak } from "../styled-components/LineBreak"
import getCookie from "../utils/getCookie"
import { Outlet } from "react-router-dom"
import delCookie from "../utils/delCookie"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

export const Navbar = (props) => {
    const navigate = useNavigate()
    const [uName, setuName] = useState('')
    const [urole, setRole] = useState('')
    useEffect(() => {
        const name = getCookie("username")
        setuName(name)
        const role = getCookie("role")
        setRole(role)
    }, [])

    const signOutHandler = async (e) => {
        e.preventDefault()
        const msg = await delCookie("userid", "username", "token", "role")
        console.log("msg", msg);
        if (msg.output != null || msg.output != undefined) {
            toast(msg.output, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            // setTimeout(() => {
                navigate('/signIn')
            // }, 2000);
        }
    }
    const handleNavigation = (loc) => {
        navigate(loc)
    }

    return (
        <Fragment>
            <ToastContainer />
            <StyledNavbar>
                <p style={{ fontSize: "x-large" }}>Welcome <strong>{uName}</strong></p>
                <div>
                    {uName != "" ? <StyledNavbarTabs onClick={(e) => { signOutHandler(e) }} >
                        SignOut
                    </StyledNavbarTabs> : <></>}
                    {urole === "student" ? <StyledNavbarTabs onClick={() => { handleNavigation("schoolResult") }}>
                        School result
                    </StyledNavbarTabs> : <></>}
                    
                    {urole === "teacher"  || urole === "admin" ?
                        <StyledNavbarTabs>
                            Students
                            <StyledNavbarSubTabs>
                                <NavbarTabs style={{ marginTop: "10px" }} onClick={() => {handleNavigation("displayStudent") }}>Display Student</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginTop: "10px" }} onClick={() => {handleNavigation("addStudent") }}>Add Student</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("editStudent")}}>Edit Student</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("deleteStudent")}}>Delete Student</NavbarTabs>
                            </StyledNavbarSubTabs>
                        </StyledNavbarTabs> : <></>
                    }
                    {urole === "teacher" || urole === "admin" ?
                        <StyledNavbarTabs>
                            Subjects
                            <StyledNavbarSubTabs>
                                <NavbarTabs style={{ marginTop: "10px" }} onClick={() => {handleNavigation("displaySubject") }}>List Subject</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginTop: "10px" }} onClick={() => {handleNavigation("addSubject") }}>Add Subject</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("editSubject")}}>Edit Subject</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("deleteSubject")}}>Delete Subject</NavbarTabs>
                                {urole==="admin"?<><LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("setSubjectLimit")}}>Subject Limit</NavbarTabs></>:<></>}
                            </StyledNavbarSubTabs>
                        </StyledNavbarTabs> : <></>
                    }
                    {urole === "teacher" || urole === "admin" ?
                        <StyledNavbarTabs>
                            Exams
                            <StyledNavbarSubTabs>
                                <NavbarTabs style={{ marginTop: "10px" }} onClick={() => {handleNavigation("enterMarks") }}>Add Marks</NavbarTabs>
                                <LineBreak />
                                <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("editMarks")}}>Edit Marks</NavbarTabs>
                            </StyledNavbarSubTabs>
                        </StyledNavbarTabs> : <></>
                    }

                    <StyledNavbarTabs>
                        Profile
                        {urole === "student" ? <StyledNavbarSubTabs>
                            <NavbarTabs style={{ marginTop: "10px" }} onClick={() => { handleNavigation("/app/student") }}>Account</NavbarTabs>
                            <LineBreak />
                            <NavbarTabs style={{ marginBottom: "10px" }} onClick={() => { handleNavigation("searchSubject") }}>Subjects</NavbarTabs>
                        </StyledNavbarSubTabs> : <></>}
                        {urole === "teacher" ? <StyledNavbarSubTabs>
                            <NavbarTabs style={{ marginTop: "10px" }} onClick={() => { handleNavigation(`/app/${props.roleOfPerson}`) }}>Account</NavbarTabs>
                            <LineBreak />
                            <NavbarTabs style={{ marginBottom: "10px" }} onClick={()=>{handleNavigation("reviews")}}>Add Review</NavbarTabs>
                        </StyledNavbarSubTabs> : <></>}
                        {urole === "admin" ? <StyledNavbarSubTabs>
                            <NavbarTabs style={{ marginTop: "10px" }} onClick={() => { handleNavigation(`/app/${props.roleOfPerson}`) }}>Account</NavbarTabs>
                            <LineBreak />
                        </StyledNavbarSubTabs> : <></>}
                    </StyledNavbarTabs>
                </div>
            </StyledNavbar>
            <Outlet></Outlet>
        </Fragment>
    )
}
