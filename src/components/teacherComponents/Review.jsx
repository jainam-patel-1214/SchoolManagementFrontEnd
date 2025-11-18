import styled from "styled-components"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { useEffect, useRef, useState } from "react"

export const ReviewTab = ()=>{
        const errorComp = useRef(null)
        const buttonComp = useRef(null)
        const inp1 = useRef(null)
        const inp2 = useRef(null)
        const [grNO, setGrNo] = useState(0)
        const [rerender, setrerender] = useState(0)
        const [comment, setComment] = useState("")
    
        const changeHandler = (e, type) => {
            e.preventDefault()
            switch (type) {
                case "grno":
                    setGrNo(Number(e.target.value))
                    break;
                case "comment":
                    setComment(e.target.value)
                    break;
                default:
                    break;
            }
        }
        const fetchData = async (e) => {
                e.preventDefault()
                try {
                    const apiUrl = 'http://localhost:8090/teacher/addReview';
        
                    const resp = await fetch(apiUrl, {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify({"grNo":grNO,"comment":comment})
                    });
                    const res = await resp.json();
                    if (res.output) {
                        toast.success(res.output || "Your review added successfully", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setComment("")
                        setGrNo(null)
                        inp1.current.value = ""
                        inp2.current.value = ""
                        setrerender(0)
                        return
                    }
                    if (res.error) {
                        toast.error(res.error || "Something went wrong", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setComment("")
                        setGrNo(null)
                        inp1.current.value = ""
                        inp2.current.value = ""
                        setrerender(0)
                        return
                    }
                } catch (err) {
                    console.log(err.error);
                    // toast.error(err.error || "Something went wrong", {
                    // })
                    toast.error(err.error || "Something went wrong", {
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
            };

            useEffect(()=>{
                console.log(grNO,comment);
                
                let flag1 = false
                let flag2 = false
                let errarr = ["Please provide a comment to add, ","Invalid GrNO, "]
                if (comment.length<=0) flag1 = true
                if (grNO<=0 || grNO>99999999) flag2 = true
                let errstr = ""
                if (flag1) errstr += errarr[0]
                if (flag2) errstr += errarr[1]
                if ((flag1 || flag2)&&rerender!=0){
                    errorComp.current.innerText = errstr
                    buttonComp.current.setAttribute("disabled", true)
                    buttonComp.current.style.cursor = "not-allowed"
                    errorComp.current.style.display = "block"
                } else{
                    buttonComp.current.style.cursor = "pointer"
                    buttonComp.current.removeAttribute("disabled")
                    errorComp.current.style.display = "none"
                }
                setrerender(1)
            },[grNO,comment])

    return(
        <SearchBoxSection>
                    < ToastContainer />
                    <SearchParamSection>
                        <SearchForm>
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                                <span>
                                    <label htmlFor="std">
                                        Provide Gr NO. of the student:
                                    </label>
                                    <input type="number" name="grno" placeholder="Enter gr. no here" onChange={(e) => { changeHandler(e, "grno") }} ref={inp1}/>
                                    <label htmlFor="std">
                                        Enter a review:
                                    </label>
                                    <input type="text" name="review" placeholder="Provide review here" onChange={(e) => { changeHandler(e, "comment") }} maxLength={254} ref={inp2}/>
                                </span>
                                <div>
                                    <StyledButton ref={buttonComp} onClick={(e) => { fetchData(e) }}>Submit</StyledButton>
                                </div>
                            </div>
                            <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                        </SearchForm>
                    </SearchParamSection>
                </SearchBoxSection>
    )
}