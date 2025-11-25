import { ToastContainer, toast } from "react-toastify"
import { useState, useRef } from "react"
import { StyledButton } from "../../styled-components/styledButton"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchParamSection } from "../studentComponents/SchoolRes"

export const SubjectLImit = (props)=>{
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [limit, setLimit] = useState(null)
    const [displayData, setDisplayData] = useState()

    const setSubLim = async(e)=>{
        e.preventDefault()
        try {
            const temp = { "std": grade, "limit": limit}
            console.log(temp);
            await fetch(`http://localhost:8090/${props.roleOfPerson}/setSubLimit`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(temp)
            }).then(async (res) => {
                const result = await res.json()
                if (result.output) {
                    successToast(result.output)
                    emptystates()
                }
                if (result.error) {
                    errorToast(result.error);
                }
            }).catch(e => {
                console.log(e.error);
                errorToast(e.error);
            })
        } catch (error) {
            console.log(error);
            errorToast(error.error);
        }
        e.target.reset()
    }

    const changeHandler = (e,type)=>{
        e.preventDefault()
        switch (type) {
            case "grade":
                setGrade(Number(e.target.value))
                break;
            case "limit":
                setLimit(Number(e.target.value))
                break;
            default:
                break;
        }
    }
    const emptystates = ()=>{
        setGrade(null)
        setLimit(null)
    }
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
    return(
        <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <div>
                    <SearchForm action="" onSubmit={(e) => { setSubLim(e) }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            {/* {viewByStd,viewBySection,minPercent,maxPercent} */}
                            <span>
                                <label htmlFor="lim">
                                    Provide limit od subjects to be taken;
                                </label>
                                <input type="number" name="lim" placeholder="Enter limit here" onChange={(e) => { changeHandler(e, "limit") }} />
                            </span>
                            <span>
                                <label htmlFor="std">
                                    Provide grade of class you wish to set limit:
                                </label>
                                <input type="text" name="std" placeholder="Enter grade here" maxLength={2} onChange={(e) => { changeHandler(e, "grade") }} />
                            </span>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </SearchForm>
                </div>
            </SearchParamSection>
            {typeof(displayData) === "string" ? <span style={{ background: "#fa6c61", padding: "5px" }}>{displayData}</span> : <></>}
        </SearchBoxSection>
    )
}