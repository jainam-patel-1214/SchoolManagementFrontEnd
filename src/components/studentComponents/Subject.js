import { StyledButton } from "../../styled-components/styledButton"
import { SubInfo, TableEntry } from "./Home"
import { ErrorSpan, SearchBoxSection, SearchForm, SearchOutputSection, SearchParamSection } from "./SchoolRes"
import { useState, useRef } from "react"
import { toast, ToastContainer } from "react-toastify"

export const SubjectSearch = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [displayData, setDisplayData] = useState(null)

    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "grade":
                setGrade(e.target.value)
                break;
            default:
                break;
        }
    }
    const fetchData = async (e) => {
        e.preventDefault()
        const err = 'Grade/Std not allowed shall be between 1 and 12 inclusive'
        let errOccur = false
        if (grade != null && (grade < 1 || grade > 12)) errOccur = true
        else errOccur = false
        if (errOccur) {
            errorComp.current.style.display = 'block'
            errorComp.current.innerText = err
            return;
        }
        else {
            errorComp.current.innerText = ""
            errorComp.current.style.display = 'none'
        }
        try {
            const apiUrl = 'http://localhost:8090/student/displaySub';
            const queryParams = { "std": grade }
            const url = new URL(apiUrl);
            url.search = new URLSearchParams(queryParams).toString();

            const resp = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const res = await resp.json();
            console.log(res.output);
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
                setDisplayData("no subjects found")
                return
            }
            toast.success("Fetched data successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
            });
            setDisplayData(res.output);
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
        } finally{
            setGrade(null)
            e.target.reset();
        }
    };

    return (
        <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <SearchForm onSubmit={(e) => { fetchData(e) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                        <span>
                            <label htmlFor="std">
                                Provide grade of class you wish to check subject:
                            </label>
                            <input type="number" value={grade||''} name="std" placeholder="Enter standard here" onChange={(e) => { changeHandler(e, "grade") }} />
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
    )
}