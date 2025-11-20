import styled from "styled-components"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { Label, LabelValue, PerformanceWindow, StudentInfo, SubInfo, TableEntry, Value } from "../studentComponents/Home"
import { Fragment, useEffect, useRef, useState } from "react"

export const TeacherInputTabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: .5rem;
    align-items: center;
`


const fetchData = async (e, grNo, setter, setDisplayData, apiUrl, methodtype,dataObj,todo) => {
    e.preventDefault()
    try {
        let resp;
        if (methodtype === "GET") {
            resp = await fetch(apiUrl + "?" + new URLSearchParams({ "studId": grNo }), {
                method: 'GET',
                credentials: 'include',
            });
        } else {
            let bodyObj = {}
            switch (todo) {
                case "addStud":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key,value);
                        if (value!==null && value!==undefined) {
                            bodyObj[key] = value
                        }
                    }
                    bodyObj['grNo'] = grNo
                    bodyObj['userRole']="student"
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "editStud":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key,value);
                        if (value!==null && value!==undefined) {
                            bodyObj[key] = value
                        }
                    }
                    bodyObj['grNo'] = grNo
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "delStud":
                    console.log(apiUrl,methodtype,{"grNo":grNo});
                    
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({"grNo":grNo})
                    })
                    break;
                default:
                    break;
            }
        }
        const res = await resp.json();
        console.log(typeof(res.output));

        if (res.output) {
            setDisplayData(res.output)
            if (methodtype==="PUT") {
                successToast("updated data successfully")
            }
            if (methodtype==="DELETE") {
                successToast("deleted student successfully")
            }
            if (methodtype==="POST") {
                successToast("created student successfully")
            }
            if (methodtype==="GET") {
                successToast("fetched data successfully")   
            }
            setter(null)
            return
        }
        if (res.error) {
            errorToast(res.error)
            setter(null)
            return
        }
    } catch (err) {
        // console.log(err.error);
        errorToast(err.error)
    } finally {
        e.target.reset();
    }
};

const successToast = (str) => {
    toast.success(str || "fetch successful", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
const errorToast = (str) => {
    toast.error(str || "Something went wrong", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const StudentTab = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setGrNo(e.target.value)
    }

    useEffect(() => {
        let flag = false
        if ((grNo < 0 || grNo > 99999999) && grNo!==null && grNo!==undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid GrNO"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [grNo])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, 'http://localhost:8090/teacher/displayStud', 'GET',{},"fetch data") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="std">
                                    Provide gr no of student to edit data:
                                </label>
                                <input type="number" name="grNo" required placeholder="Enter Gr No here" onChange={(e) => { changeHandler(e) }} />
                            </span>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {(displayData === undefined || displayData === null) ? <></> :
                        <>{(typeof displayData === 'string') ? <span style={{ padding: "10px" }}>{displayData}</span> :
                            <Fragment>
                                <StudentInfo>
                                    <LabelValue>
                                        <Label><strong>Name:</strong></Label>
                                        <Value>{displayData.StudData.Name}</Value>
                                    </LabelValue>
                                    <LabelValue>
                                        <Label><strong>Standard:</strong></Label>
                                        <Value>{displayData.StudData.Std}</Value>
                                    </LabelValue>
                                    <LabelValue>
                                        <Label><strong>Password:</strong></Label>
                                        <Value>{displayData.StudData.Password}</Value>
                                    </LabelValue>
                                    <LabelValue>
                                        <Label><strong>Section:</strong></Label>
                                        <Value>{displayData.StudData.Section}</Value>
                                    </LabelValue>
                                </StudentInfo>
                                <PerformanceWindow>
                                    <h2>Report Card</h2>
                                    <div style={{ border: "1px solid black", width: "100%" }}>
                                        <div style={{ border: "1px solid black", margin: "10px", padding: "1rem", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                            <h3>Comments</h3>
                                            {displayData.CommentInfo?.length > 0 ? <>
                                                <SubInfo style={{ width: "100%" }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Teacher Id</th>
                                                            <th>Teacher Name</th>
                                                            <th>Review</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayData.CommentInfo?.map((element, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <TableEntry>{element.tId}</TableEntry>
                                                                    <TableEntry>{element.tName}</TableEntry>
                                                                    <TableEntry>{element.comment}</TableEntry>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </SubInfo>
                                            </> : <>No review made by any teacher</>}
                                        </div>
                                        <div style={{ border: "1px solid black", margin: "10px", padding: "1rem", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                            <h3>Performance</h3>
                                            {displayData.MarkInfo?.length > 0 ? <>
                                                <SubInfo style={{ width: "100%" }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Subject Id</th>
                                                            <th>Subject Name</th>
                                                            <th>Practical Marks</th>
                                                            <th>Theory Marks</th>
                                                            <th>Grade</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayData.MarkInfo?.map((element, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <TableEntry>{element.subId}</TableEntry>
                                                                    <TableEntry>{element.subjectName}</TableEntry>
                                                                    <TableEntry>{element.practicalMM}</TableEntry>
                                                                    <TableEntry>{element.theoryMM}</TableEntry>
                                                                    <TableEntry>{element.grade}</TableEntry>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </SubInfo>
                                            </> : <>No entry of marks scroed in exam by any teacher</>}
                                        </div>
                                    </div>
                                </PerformanceWindow>
                            </Fragment>
                        }</>
                    }
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}

export const StudentEditTab = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [std, setStd] = useState(null)
    const [section, setSection] = useState(null)
    const [name, setName] = useState(null)
    const [pwd, setPwd] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "password":
                setPwd(e.target.value)
                break;
            case "name":
                setName(e.target.value)
                break;
            case "grno":
                setGrNo(Number(e.target.value))
                break;
            case "section":
                setSection(e.target.value)
                break;
            case "std":
                setStd(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const errarr = ["invalid gr no","passwords are needed to be 8 digits","standard shall have range of 1 - 12"]
        let flagarr = [false,false,false]
        if (pwd!==undefined&&pwd!==null&&(pwd.toString().length!==8)) flagarr[1] = true
        if ((grNo<0||grNo>99999999)&&grNo!==undefined&&grNo!==null) flagarr[0] = true
        if ((std<1||std>12)&&std!==undefined&&std!==null) flagarr[2] = true

        let errstr = ""
        let anyErr = false
        flagarr.forEach((v,i)=>{
            if (v) {
                errstr += (errarr[i]+", ")
                anyErr = true
            }
        })

        if (anyErr) {
            errorComp.current.innerText = errstr
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        }else{
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }

    }, [pwd,std,grNo])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, 'http://localhost:8090/teacher/updateStud', 'PUT',{"studName":name,"studPwd":pwd,"section":section,"std":std},"editStud") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="section">
                                    Provide Gr NO for student you wish to update data:
                                </label>
                                <input type="number" name="grno" required placeholder="Enter Gr No here" maxLength={8} minLength={8} onChange={(e) => { changeHandler(e, "grno") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Only fill the fields you wish to update data:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="password">Provide new password here: </label>
                            <span>
                                <input type="password" name="password" placeholder="Password" maxLength={8} onChange={(e) => { changeHandler(e, "password") }} />
                            </span>
                            <label htmlFor="sname">
                                    Provide updated name here:
                            </label>
                            <span>
                            <input type="text" name="sname" placeholder="Name" onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <TeacherInputTabContainer>
                            <label htmlFor="section">Provide new section here: </label>
                            <span>
                                <input type="text" name="section" placeholder="Section" maxLength={2} onChange={(e) => { changeHandler(e, "section") }} />
                            </span>
                            <label htmlFor="std">
                                    Provide updated standard here:
                            </label>
                            <span>
                            <input type="number" name="std" placeholder="Standard" onChange={(e) => { changeHandler(e, "std") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {typeof(displayData)==="string"?<div style={{padding:"10px"}}>{displayData}</div>:<></>}
                </SearchOutputSection>
                </SearchBoxSection>
        </div>
    )
}

export const StudentDelTab = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setGrNo(Number(e.target.value))
    }

    useEffect(() => {
        console.log(grNo);
        
        let flag = false
        if ((grNo < 0 || grNo > 99999999) && grNo!==null && grNo!==undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid GrNO"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [grNo])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, 'http://localhost:8090/teacher/delStudent', 'DELETE',{},"delStud") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="std">
                                    Provide gr no of student to delete:
                                </label>
                                <input type="number" name="grNo" required placeholder="Enter Gr No here" onChange={(e) => { changeHandler(e) }} />
                            </span>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {typeof(displayData)==="string"?<div style={{padding:"10px"}}>{displayData}</div>:<></>}
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}

export const StudentAddTab = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [std, setStd] = useState(null)
    const [section, setSection] = useState(null)
    const [name, setName] = useState(null)
    const [pwd, setPwd] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "password":
                setPwd(e.target.value)
                break;
            case "name":
                setName(e.target.value)
                break;
            case "grno":
                setGrNo(Number(e.target.value))
                break;
            case "section":
                setSection(e.target.value)
                break;
            case "std":
                setStd(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const errarr = ["invalid gr no","passwords are needed to be 8 digits","standard shall have range of 1 - 12"]
        let flagarr = [false,false,false]
        if (pwd!==undefined&&pwd!==null&&(pwd.toString().length!==8)) flagarr[1] = true
        if ((grNo<0||grNo>99999999)&&grNo!==undefined&&grNo!==null) flagarr[0] = true
        if ((std<1||std>12)&&std!==undefined&&std!==null) flagarr[2] = true

        let errstr = ""
        let anyErr = false
        flagarr.forEach((v,i)=>{
            if (v) {
                errstr += (errarr[i]+", ")
                anyErr = true
            }
        })

        if (anyErr) {
            errorComp.current.innerText = errstr
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        }else{
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }

    }, [pwd,std,grNo])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, 'http://localhost:8090/teacher/createStud', 'POST',{"studName":name,"studPwd":pwd,"section":section,"std":std},"addStud") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="section">
                                    Provide Gr NO for student:
                                </label>
                                <input type="number" required name="grno" placeholder="Enter Gr No here" maxLength={8} onChange={(e) => { changeHandler(e, "grno") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Fill further details for the student below:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="password">Provide password here: </label>
                            <span>
                                <input type="password" required name="password" placeholder="Password" maxLength={8} onChange={(e) => { changeHandler(e, "password") }} />
                            </span>
                            <label htmlFor="sname">
                                    Provide name here:
                            </label>
                            <span>
                            <input type="text" name="sname" required placeholder="Name" onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <TeacherInputTabContainer>
                            <label htmlFor="section">Provide section here: </label>
                            <span>
                                <input type="text" name="section" required placeholder="Section" maxLength={2} onChange={(e) => { changeHandler(e, "section") }} />
                            </span>
                            <label htmlFor="std">
                                    Provide standard here:
                            </label>
                            <span>
                            <input type="number" name="std" required placeholder="Standard" onChange={(e) => { changeHandler(e, "std") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {typeof(displayData)==="string"?<div style={{padding:"10px"}}>{displayData}</div>:<></>}
                </SearchOutputSection>
                </SearchBoxSection>
        </div>
    )
}