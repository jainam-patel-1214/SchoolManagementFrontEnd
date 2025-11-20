import styled from "styled-components"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { useRef, useState,useEffect } from "react"

export const TeacherInputTabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: .5rem;
    align-items: center;
`


const fetchData = async (e, grNo, setter, setDisplayData, apiUrl, methodtype, dataObj, todo) => {
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
                case "addMark":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key, value);
                        if (value !== null && value !== undefined) {
                            bodyObj[key] = value
                        }
                    }
                    bodyObj['grNo'] = grNo
                    console.log(bodyObj);
                    resp = await fetch((apiUrl), {
                        method: methodtype,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bodyObj),
                    });
                    break;
                case "editMark":
                    bodyObj = {}
                    for (const [key, value] of Object.entries(dataObj)) {
                        console.log(key, value);
                        if (value !== null && value !== undefined) {
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
                default:
                    break;
            }
        }
        const res = await resp.json();
        console.log(typeof (res.output));

        if (res.output) {
            setDisplayData(res.output)
            if (methodtype === "PUT") {
                successToast("updated data successfully")
            }
            if (methodtype === "DELETE") {
                successToast("deleted student successfully")
            }
            if (methodtype === "POST") {
                successToast("created student successfully")
            }
            if (methodtype === "GET") {
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

export const MarkEditTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [subid, setsubid] = useState(null)
    const [theory, setTheory] = useState(null)
    const [practical, setPractical] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "sub":
                setsubid(Number(e.target.value))
                break;
            case "theory":
                setTheory(Number(e.target.value))
                break;
            case "grno":
                setGrNo(Number(e.target.value))
                break;
            case "practical":
                setPractical(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const errarr = ["invalid gr no","invalid sub id","theory marks range shall be from 0 to 100","practical marks range shall be from 0 to 20"]
        let flagarr = [false,false,false,false]
        if ((theory<0||theory>80)&&theory!==undefined&&theory!==null) flagarr[2] = true
        if ((practical<0||practical>20)&&practical!==undefined&&practical!==null) flagarr[3] = true
        if (grNo<0||grNo>99999999&&grNo!==undefined&&grNo!==null) flagarr[0] = true
        if ((subid<0||subid>99999999)&&subid!==undefined&&subid!==null) flagarr[1] = true

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

    }, [theory,practical,subid,grNo])

    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/updateMarks`, 'PUT', { "subId": subid, "theoryMarks": theory, "practicalMarks": practical }, "editMark") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="section">
                                    Provide Gr NO for student:
                                </label>
                                <input type="number" required name="grno" placeholder="Enter Gr No here" maxLength={8} onChange={(e) => { changeHandler(e, "grno") }} />
                            </span>
                            <span>
                                <label htmlFor="sid">Provide subject id here: </label>
                                <input type="number" required name="sid" placeholder="Subject id" maxLength={8} onChange={(e) => { changeHandler(e, "sub") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Fill further details which you wish to edit:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="tm">
                                Provide theoritical marks here:
                            </label>
                            <span>
                                <input type="number" name="tm" placeholder="Theoritical Marks" onChange={(e) => { changeHandler(e, "theory") }} />
                            </span>
                            <label htmlFor="pm">Provide practical marks here: </label>
                            <span>
                                <input type="number" name="pm" placeholder="Practical Marks" onChange={(e) => { changeHandler(e, "practical") }} />
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

export const MarkAddTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grNo, setGrNo] = useState(null)
    const [subid, setsubid] = useState(null)
    const [theory, setTheory] = useState(null)
    const [practical, setPractical] = useState(null)
    const [displayData, setDisplayData] = useState(null)
    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "sub":
                setsubid(Number(e.target.value))
                break;
            case "theory":
                setTheory(Number(e.target.value))
                break;
            case "grno":
                setGrNo(Number(e.target.value))
                break;
            case "practical":
                setPractical(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const errarr = ["invalid gr no","invalid sub id","theory marks range shall be from 0 to 100","practical marks range shall be from 0 to 20"]
        let flagarr = [false,false,false,false]
        if ((theory<0||theory>80)&&theory!==undefined&&theory!==null) flagarr[2] = true
        if ((practical<0||practical>20)&&practical!==undefined&&practical!==null) flagarr[3] = true
        if (grNo<0||grNo>99999999&&grNo!==undefined&&grNo!==null) flagarr[0] = true
        if ((subid<0||subid>99999999)&&subid!==undefined&&subid!==null) flagarr[1] = true

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

    }, [theory,practical,subid,grNo])
    return (
        <div>
            <SearchBoxSection>
                < ToastContainer />
                <SearchParamSection>
                    <SearchForm onSubmit={(e) => { fetchData(e, grNo, setGrNo, setDisplayData, `http://localhost:8090/${props.roleOfPerson}/enterMarks`, 'POST', { "subId": subid, "theoryMarks": theory, "practicalMarks": practical }, "addMark") }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="section">
                                    Provide Gr NO for student:
                                </label>
                                <input type="number" required name="grno" placeholder="Enter Gr No here" maxLength={8} onChange={(e) => { changeHandler(e, "grno") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><h3>Fill further details for the student's score:</h3></div>
                        <TeacherInputTabContainer>
                            <label htmlFor="sid">Provide subject id here: </label>
                            <span>
                                <input type="number" required name="sid" placeholder="Subject id" maxLength={8} onChange={(e) => { changeHandler(e, "sub") }} />
                            </span>
                            <label htmlFor="tm">
                                Provide theoritical marks here:
                            </label>
                            <span>
                                <input type="number" name="tm" required placeholder="Theoritical marks" onChange={(e) => { changeHandler(e, "theory") }} />
                            </span>
                            <label htmlFor="pm">Provide practical marks here: </label>
                            <span>
                                <input type="number" name="pm" required placeholder="Practical Marks" onChange={(e) => { changeHandler(e, "practical") }} />
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
