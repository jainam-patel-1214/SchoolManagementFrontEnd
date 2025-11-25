import styled from "styled-components"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { PerformanceWindow, SubInfo, TableEntry } from "../studentComponents/Home"
import { useEffect, useRef, useState } from "react"

export const TeacherInputTabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: .5rem;
    align-items: center;
`

const fetchData = async (e, tid, setTid, setDisplayData, apiUrl, methodtype, dataObj, todo) => {
    e.preventDefault()
    try {
        let resp;
        if (methodtype === "GET") {
            resp = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
            });
        } else {
            let bodyObj = {}
            switch (todo) {
                case "addTeach":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key, value);
                        if (value !== null && value !== undefined) {
                            bodyObj[key] = value
                        }
                    }
                    bodyObj["teacherId"]=tid
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "editTeach":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key, value);
                        if (value !== null && value !== undefined) {
                            bodyObj[key] = value
                        }
                    }
                    bodyObj["teacherId"]=tid
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "delTeach":
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ "teacherId": tid })
                    })
                    break;
                default:
                    break;
            }
        }
        const res = await resp.json();
        console.log(res);

        if (res.output) {
            setDisplayData(res.output)
            if (methodtype === "PUT") {
                successToast("updated data successfully")
            }
            if (methodtype === "DELETE") {
                successToast("deleted teacher successfully")
            }
            if (methodtype === "POST") {
                successToast("created teacher successfully")
            }
            if (methodtype === "GET") {
                successToast("fetched data successfully")
            }
            return
        }
        if (res.error) {
            errorToast(res.error)
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

export const TeacherPerformance = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [tid, setTid] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setTid(e.target.value)
    }

    useEffect(() => {
        let flag = false
        if ((tid?.length < 1 || tid?.length > 8) && tid !== null && tid !== undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid teacher's id. Length shall be less than 8"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [tid])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, tid, setTid, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/displayTeacherPerformance/${tid}`, "GET", {}, "fetch data") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="teacherid">
                                    Provide id of teacher you wish to look performance:
                                </label>
                                <input type="text" name="teacherid" placeholder="Enter teacher's id" maxLength={8} onChange={(e) => { changeHandler(e) }} />
                            </span>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {(typeof displayData === 'string') ? <>{displayData}</> :
                        <PerformanceWindow>
                            {displayData?.length > 0 ? <>
                                <h2>Performance among teacher's peers</h2>
                                <div style={{ border: "1px solid black", width: "100%" }}>
                                    <div style={{ border: "1px solid black", margin: "10px", padding: "1rem", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                        <SubInfo style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>Teacher Id</th>
                                                    <th>Teacher Name</th>
                                                    <th>Standard Allocated</th>
                                                    <th>Subject Allocated</th>
                                                    <th>Total Practical Marks</th>
                                                    <th>Total Theory Marks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayData?.map((element, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <TableEntry>{element.Tid}</TableEntry>
                                                            <TableEntry>{element.TName}</TableEntry>
                                                            <TableEntry>{element.StdAllocated}</TableEntry>
                                                            <TableEntry>{element.SubName}</TableEntry>
                                                            <TableEntry>{element.TotalPracticalMarks}</TableEntry>
                                                            <TableEntry>{element.TotalTheoryMarks}</TableEntry>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </SubInfo>
                                    </div>
                                </div>
                            </> : displayData===null||displayData===undefined?<></>:<>No performance data</>}
                        </PerformanceWindow>
                    }
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}

export const TeacherEditTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [tId, setTid] = useState(null)
    const [password, setPassword] = useState(null)
    const [subId, setsubId] = useState(null)
    const [name, setName] = useState(null)
    const [std, setStd] = useState(null)
    const [section, setSection] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "subid":
                setsubId(Number(e.target.value))
                break;
            case "name":
                setName(e.target.value)
                break;
            case "std":
                setStd(Number(e.target.value))
                break;
            case "section":
                setSection(e.target.value)
                break;
            case "tid":
                setTid(e.target.value)
                break;
            case "pwd":
                setPassword(e.target.value)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const regex = /^[A-Za-z ]*$/;
        const errarr = ["invalid teacher id", "password must be 8 digits","name shall only have alphabets","invalid subject id","invalid grade. Allowed range is 1 - 12","invalid section"]
        let flagarr = [false, false,false,false,false]
        if ((tId?.length < 1 || tId?.length > 8) && tId !== null && tId !== undefined) flagarr[0] = true
        if ((subId < 0 || subId > 99999999) && subId !== undefined && subId !== null) flagarr[3] = true
        if ((password?.length!==8) && password !== undefined && password !== null) flagarr[1] = true
        if (!(regex.test(name)) && name !== undefined && name !== null) flagarr[2] = true
        if ((std < 1 || std > 12) && std !== undefined && std !== null) flagarr[4] = true
        if (!(regex.test(section)) && section !== undefined && section !== null) flagarr[5] = true
        let errstr = ""
        let anyErr = false
        flagarr.forEach((v, i) => {
            if (v) {
                errstr += (errarr[i] + ", ")
                anyErr = true
            }
        })

        if (anyErr) {
            errorComp.current.innerText = errstr
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [tId, subId,std,section,name,password])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, tId, setTid, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/editTeacher`, 'PUT', { "subId": subId, "tPwd": password, "tName": name, "stdAllocated": std,"sectionAllocated":section }, "editTeach") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="tid">
                                    Provide Id for teacher you wish to update data:
                                </label>
                                <input type="text" name="tid" required placeholder="Enter Teacher Id here" maxLength={8} onChange={(e) => { changeHandler(e, "tid") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Only fill the fields you wish to update data:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="tname">Provide new name here: </label>
                            <span>
                                <input type="text" name="tname" placeholder="Teacher Name" maxLength={55} onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                            <label htmlFor="pwd">
                                Provide updated password here:
                            </label>
                            <span>
                                <input type="text" maxLength={8} name="pwd" placeholder="New Password" onChange={(e) => { changeHandler(e, "pwd") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <TeacherInputTabContainer>
                            <label htmlFor="subname">Provide new subject assigned: </label>
                            <span>
                                <input type="number" name="subname" placeholder="Subject Id" maxLength={55} onChange={(e) => { changeHandler(e, "subid") }} />
                            </span>
                            <label htmlFor="std">
                                Provide new standard assigned:
                            </label>
                            <span>
                                <input type="number" name="std" placeholder="Standard here" onChange={(e) => { changeHandler(e, "std") }} />
                            </span>
                            <label htmlFor="section">
                                Provide new section assigned:
                            </label>
                            <span>
                                <input type="text" name="section" placeholder="Section here" onChange={(e) => { changeHandler(e, "section") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {typeof (displayData) === "string" ? <div style={{ padding: "10px" }}>{displayData}</div> : <></>}
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}

export const TeacherDelTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [tId, setTid] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setTid(e.target.value)
    }

    useEffect(() => {
        let flag = false
        if ((tId?.length < 1 || tId?.length > 8) && tId !== null && tId !== undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid teacher id"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [tId])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, tId, setTid, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/delTeacher`, "DELETE", {}, "delTeach") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="subid">
                                    Provide id of teacher you wish to delete:
                                </label>
                                <input type="text" name="subid"required placeholder="Enter teacher id here" onChange={(e) => { changeHandler(e) }} />
                            </span>
                            <div>
                                <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                            </div>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {(typeof displayData === 'string') ? <div style={{ padding: "10px" }}>{displayData}</div> :
                        <></>
                    }
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}

export const TeacherAddTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [tId, setTid] = useState(null)
    const [password, setPassword] = useState(null)
    const [subId, setsubId] = useState(null)
    const [name, setName] = useState(null)
    const [std, setStd] = useState(null)
    const [section, setSection] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "subid":
                setsubId(Number(e.target.value))
                break;
            case "name":
                setName(e.target.value)
                break;
            case "std":
                setStd(Number(e.target.value))
                break;
            case "section":
                setSection(e.target.value)
                break;
            case "tid":
                setTid(e.target.value)
                break;
            case "pwd":
                setPassword(e.target.value)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const regex = /^[A-Za-z ]*$/;
        const errarr = ["invalid teacher id", "password must be 8 digits","name shall only have alphabets","invalid subject id","invalid grade. Allowed range is 1 - 12","invalid section"]
        let flagarr = [false, false,false,false,false]
        if ((tId?.length < 1 || tId?.length > 8) && tId !== null && tId !== undefined) flagarr[0] = true
        if ((subId < 0 || subId > 99999999) && subId !== undefined && subId !== null) flagarr[3] = true
        if ((password?.length!==8) && password !== undefined && password !== null) flagarr[1] = true
        if (!(regex.test(name)) && name !== undefined && name !== null) flagarr[2] = true
        if ((std < 1 || std > 12) && std !== undefined && std !== null) flagarr[4] = true
        if (!(regex.test(section)) && section !== undefined && section !== null) flagarr[5] = true
        let errstr = ""
        let anyErr = false
        flagarr.forEach((v, i) => {
            if (v) {
                errstr += (errarr[i] + ", ")
                anyErr = true
            }
        })

        if (anyErr) {
            errorComp.current.innerText = errstr
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [tId, subId,std,section,name,password])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, tId, setTid, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/addTeacher`, 'POST', { "subId": subId, "tPwd": password, "tName": name, "stdAllocated": std,"sectionAllocated":section,"role":"teacher" }, "addTeach") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="tid">
                                    Provide Id for teacher to create:
                                </label>
                                <input type="text" name="tid" required placeholder="Enter Teacher Id here" maxLength={8} onChange={(e) => { changeHandler(e, "tid") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Only fill the fields you wish to update data:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="tname">Provide name here: </label>
                            <span>
                                <input type="text" required name="tname" placeholder="Teacher Name" maxLength={55} onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                            <label htmlFor="pwd">
                                Provide updated password here:
                            </label>
                            <span>
                                <input type="text" required maxLength={8} name="pwd" placeholder="Password here" onChange={(e) => { changeHandler(e, "pwd") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <TeacherInputTabContainer>
                            <label htmlFor="subname">Provide subject to be assigned: </label>
                            <span>
                                <input type="number" name="subname" placeholder="Subject Id" maxLength={55} onChange={(e) => { changeHandler(e, "subid") }} />
                            </span>
                            <label htmlFor="std">
                                Provide standard to be assigned:
                            </label>
                            <span>
                                <input type="number" name="std" placeholder="Standard here" onChange={(e) => { changeHandler(e, "std") }} />
                            </span>
                            <label htmlFor="section">
                                Provide section to be assigned:
                            </label>
                            <span>
                                <input type="text" name="section" placeholder="Section here" onChange={(e) => { changeHandler(e, "section") }} />
                            </span>
                        </TeacherInputTabContainer>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </SearchForm>
                </SearchParamSection>
                <SearchOutputSection>
                    {typeof (displayData) === "string" ? <div style={{ padding: "10px" }}>{displayData}</div> : <></>}
                </SearchOutputSection>
            </SearchBoxSection>
        </div>
    )
}
