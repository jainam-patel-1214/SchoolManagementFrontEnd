import { ErrorSpan, SearchBoxSection, SearchForm, SearchParamSection } from "../studentComponents/SchoolRes"
import { toast, ToastContainer } from "react-toastify"
import { StyledButton } from "../../styled-components/styledButton"
import { useRef, useState } from "react"

export const ReviewTab = (props) => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const inp1 = useRef(null)
    const inp2 = useRef(null)
    const [grNO, setGrNo] = useState(0)
    // const [rerender, setrerender] = useState(0)
    const [comment, setComment] = useState(null)

    const changeHandler = (e, type) => {
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
        let flagarr = [false,false]
        let errarr = ["Please provide a comment to add, ", "Invalid GrNO, "]
        if (comment.length <= 0) flagarr[0] = true
        if (grNO <= 0 || grNO > 99999999) flagarr[1] = true
        let errstr = ""
        flagarr.forEach((v,i)=>{
            if (v==true) {
                errstr += errarr[i]
            }
        })
        if ((flagarr[0] || flagarr[1])) {
            errorComp.current.innerText = errstr
            errorComp.current.style.display = "block"
            return
        } else {
            errorComp.current.innerText = ""
            errorComp.current.style.display = "none"
        }
        try {
            const apiUrl = `http://localhost:8090/${props.roleOfPerson}/addReview`;

            const resp = await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "grNo": grNO, "comment": comment })
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
                return
            }
        } catch (err) {
            console.log(err.error);
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
        } finally{
            setComment(null)
            setGrNo(null)
            e.target.reset();
        }
    }

    return (
        <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <SearchForm onSubmit={(e) => { fetchData(e) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                        <span>
                            <label htmlFor="std">
                                Provide Gr NO. of the student:
                            </label>
                            <input type="number" value={grNO||""} required name="grno" placeholder="Enter gr. no here" onChange={(e) => { changeHandler(e, "grno") }}/>
                            <label htmlFor="std">
                                Enter a review:
                            </label>
                            <input type="text" required name="review" value={comment||""} placeholder="Provide review here" onChange={(e) => { changeHandler(e, "comment") }} maxLength={254}/>
                        </span>
                        <div>
                            <StyledButton ref={buttonComp} >Submit</StyledButton>
                        </div>
                    </div>
                    <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                </SearchForm>
            </SearchParamSection>
        </SearchBoxSection>
    )
}
