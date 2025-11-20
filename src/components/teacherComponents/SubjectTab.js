import styled from "styled-components"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { SubInfo, TableEntry } from "../studentComponents/Home"
import { useEffect, useRef, useState } from "react"

export const TeacherInputTabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: .5rem;
    align-items: center;
`


const fetchData = async (e, grade, setGrade, setDisplayData, apiUrl, methodtype,dataObj,todo) => {
    e.preventDefault()
    try {
        let resp;
        if (methodtype === "GET") {
            resp = await fetch(apiUrl + "?" + new URLSearchParams({ "std": grade }), {
                method: 'GET',
                credentials: 'include',
            });
        } else {
            let bodyObj = {}
            switch (todo) {
                case "addSub":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key,value);
                        if (value!==null && value!==undefined) {
                            bodyObj[key] = value
                        }
                    }
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "editSub":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key,value);
                        if (value!==null && value!==undefined) {
                            bodyObj[key] = value
                        }
                    }
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "delSub":
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({"subId":grade})
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
            if (methodtype==="PUT") {
                successToast("updated data successfully")
            }
            if (methodtype==="DELETE") {
                successToast("deleted subject successfully")
            }
            if (methodtype==="POST") {
                successToast("created subject successfully")
            }
            if (methodtype==="GET") {
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

export const SubTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setGrade(Number(e.target.value))
    }

    useEffect(() => {
        let flag = false
        if ((grade < 1 || grade > 12) && grade!==null && grade!==undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid Grade. Grade are allowed only from 1 to 12"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [grade])

    return (
        <div>
            <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <SearchForm onSubmit={(e) => { fetchData(e,grade,setGrade,setDisplayData,`http://localhost:8090/${props.roleOfPerson}/displaySub`,"GET",{},"fetch data") }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                        <span>
                            <label htmlFor="std">
                                Provide grade of class you wish to check subject:
                            </label>
                            <input type="number" name="std" placeholder="Enter standard here" onChange={(e) => { changeHandler(e, "grade") }} />
                        </span>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </div>
                    <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                </SearchForm>
            </SearchParamSection>
            <SearchOutputSection>
                {(typeof displayData === 'string' && displayData === "no subjects found")?<>No Subjects Found</>:
                <SubInfo style={{border:"1px solid black"}}>
                    <thead>
                        <tr>
                            <th>Subject Id</th>
                            <th>Name</th>
                            <th>Standard</th>
                            <th>Credits</th>
                        </tr>
                    </thead>
                        <tbody>
                            {displayData?.map((element, index) => {
                                return (
                                    <tr key={index}>
                                        <TableEntry>{element.subjectId}</TableEntry>
                                        <TableEntry>{element.subjectName}</TableEntry>
                                        <TableEntry>{element.level}</TableEntry>
                                        <TableEntry>{element.credits}</TableEntry>
                                    </tr>
                                )
                            })}
                        </tbody>
                </SubInfo>
                }
            </SearchOutputSection>
        </SearchBoxSection>
        </div>
    )
}

export const SubEditTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [credits, setCredits] = useState(null)
    const [subId, setsubId] = useState(null)
    const [name, setName] = useState(null)
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
                setGrade(Number(e.target.value))
                break;
            case "credits":
                setCredits(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const errarr = ["invalid sub id","invalid grade. Allowed range is 1 - 12"]
        let flagarr = [false,false]
        if ((grade < 1 || grade > 12) && grade!==null && grade!==undefined) flagarr[1] = true
        if ((subId<0||subId>99999999)&&subId!==undefined&&subId!==null) flagarr[0] = true
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
    }, [grade,subId])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grade, setGrade, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/updateSub`, 'PUT',{"subId":subId,"subName":name,"credits":credits,"levelStd":grade},"editSub") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="subid">
                                    Provide SubId for subject you wish to update data:
                                </label>
                                <input type="number" name="subid" required placeholder="Enter Sub Id here" maxLength={8} onChange={(e) => { changeHandler(e, "subid") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Only fill the fields you wish to update data:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="subname">Provide new name here: </label>
                            <span>
                                <input type="text" name="subname" placeholder="Subject Name" maxLength={55} onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                            <label htmlFor="credit">
                                    Provide updated credit here:
                            </label>
                            <span>
                            <input type="number" name="credit" placeholder="Credits" onChange={(e) => { changeHandler(e, "credits") }} />
                            </span>
                            <label htmlFor="std">
                                    Provide updated standard here:
                            </label>
                            <span>
                            <input type="number" name="std" placeholder="Subject Grade" onChange={(e) => { changeHandler(e, "std") }} />
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

export const SubDelTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [subid, setSubId] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e) => {
        e.preventDefault()
        setSubId(Number(e.target.value))
    }

    useEffect(() => {
        let flag = false
        if ((subid < 1 || subid > 99999999) && subid!==null && subid!==undefined) flag = true
        if (flag) {
            errorComp.current.innerText = "Invalid subject id"
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
            errorComp.current.style.display = "block"
        } else {
            buttonComp.current.style.cursor = "pointer"
            buttonComp.current.removeAttribute("disabled")
            errorComp.current.style.display = "none"
        }
    }, [subid])

    return (
        <div>
            <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <SearchForm onSubmit={(e) => { fetchData(e,subid,setSubId,setDisplayData,`http://localhost:8090/${props.roleOfPerson}/delSubject`,"DELETE",{},"delSub") }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                        <span>
                            <label htmlFor="subid">
                                Provide subId of subject you wish to delete:
                            </label>
                            <input type="number" name="subid" placeholder="Enter subId here" onChange={(e) => { changeHandler(e) }} />
                        </span>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </div>
                    <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                </SearchForm>
            </SearchParamSection>
            <SearchOutputSection>
                {(typeof displayData === 'string')?<div style={{padding:"10px"}}>{displayData}</div>:
                <></>
                }
            </SearchOutputSection>
        </SearchBoxSection>
        </div>
    )
}

export const SubAddTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [credits, setCredits] = useState(null)
    const [subId, setsubId] = useState(null)
    const [name, setName] = useState(null)
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
                setGrade(Number(e.target.value))
                break;
            case "credits":
                setCredits(Number(e.target.value))
                break;
            default:
                break;
        }
    }


    useEffect(() => {
        const errarr = ["invalid sub id","invalid grade. Allowed range is 1 - 12"]
        let flagarr = [false,false]
        if ((grade < 1 || grade > 12) && grade!==null && grade!==undefined) flagarr[1] = true
        if ((subId<0||subId>99999999)&&subId!==undefined&&subId!==null) flagarr[0] = true
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
    }, [grade,subId])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grade, setGrade, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/createSub`, 'POST',{"subId":subId,"subName":name,"credits":credits,"levelStd":grade},"addSub") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="subid">
                                    Provide SubId for new subject:
                                </label>
                                <input type="number" name="subid" required placeholder="Enter Sub Id here" maxLength={8} onChange={(e) => { changeHandler(e, "subid") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Fill further mendatory details below:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="subname">Provide subject name here: </label>
                            <span>
                                <input type="text" name="subname" placeholder="Subject Name" maxLength={55} onChange={(e) => { changeHandler(e, "name") }} />
                            </span>
                            <label htmlFor="credit">
                                    Provide credits here:
                            </label>
                            <span>
                            <input type="number" name="credit" placeholder="Credits" onChange={(e) => { changeHandler(e, "credits") }} />
                            </span>
                            <label htmlFor="std">
                                    Provide subject grade here:
                            </label>
                            <span>
                            <input type="number" name="std" placeholder="Subject Grade" onChange={(e) => { changeHandler(e, "std") }} />
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
