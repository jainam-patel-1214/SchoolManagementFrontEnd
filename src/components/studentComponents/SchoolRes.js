import { ToastContainer, toast } from "react-toastify"
import styled from "styled-components"
import { useState, useEffect, useRef } from "react"
import { StyledButton } from "../../styled-components/styledButton"
import { SubInfo, TableEntry } from "./Home"

export const SearchBoxSection = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
`
export const SearchParamSection = styled.div`
    width: 100%;
    border: 2px double blue;
    display: flex;
    flex-direction: column;
`
export const SearchOutputSection = styled.div`
    margin-top: .5rem;
`
export const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  span input {
    margin: 15px;
    border: 1px solid grey;
    padding: 10px;
    border-radius: 5px;
  }

  span input::placeholder {
    color: #b5b5b5;
    /* padding: 5px; */
  }
`;
export const ErrorSpan = styled.div`
    color: red;
    background-color: #ffbbbb;
    width: fit-content;
    padding: 10px;
    margin-left: 1rem;
    display: none;
`


export const SchoolResult = () => {
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [section, setSection] = useState('')
    const [grade, setGrade] = useState(null)
    const [minMark, setMinMark] = useState(null)
    const [maxMark, setMaxMark] = useState(null)
    const [displayData, setDisplayData] = useState()

    useEffect(() => {
        const err = ['Max mark not allowed more than 100 or less than 0\n', 'Min mark not allowed less than 0 or greater than 100 \n', 'Grade/Std not allowed shall be between 1 and 12 inclusive \n', 'Min mark shall be less than max mark \n']
        let arr = [false, false, false, false]

        if (maxMark != null && (maxMark > 100 || maxMark < 0)) arr[0] = true
        else arr[0] = false
        if (minMark != null && (minMark < 0 || minMark > 100)) arr[1] = true
        else arr[1] = false
        if (grade != null && (grade < 1 || grade > 12)) arr[2] = true
        else arr[2] = false
        if (minMark != null && maxMark != null && maxMark <= minMark) arr[3] = true
        else arr[3] = false

        let ErrStr = ""
        arr.forEach((val, index) => {
            if (val === true) {
                console.log("value,index", val, index, grade, typeof (minMark), minMark, typeof (maxMark), maxMark);
                ErrStr += err[index]
            }
            console.log("stringgg", ErrStr);
        })
        if (arr[0] === true || arr[1] === true || arr[2] === true || arr[3] === true) {
            errorComp.current.style.display = 'block'
            errorComp.current.innerText = ErrStr
            buttonComp.current.setAttribute("disabled", true)
            buttonComp.current.style.cursor = "not-allowed"
        }
        else {
            errorComp.current.innerText = ""
            buttonComp.current.style.cursor = "pointer"
            errorComp.current.style.display = 'none'
            buttonComp.current.removeAttribute("disabled")
        }
    }, [maxMark, minMark, grade])

    const changeHandler = (e, type) => {
        e.preventDefault()
        switch (type) {
            case "section":
                setSection(e.target.value)
                break;
            case "grade":
                setGrade(Number(e.target.value))
                break;
            case "min":
                setMinMark(Number(e.target.value))
                break;
            case "max":
                setMaxMark(Number(e.target.value))
                break;
            default:
                break;
        }
    }

    const fetchData = async (e) => {
        e.preventDefault()
        try {
            const apiUrl = 'http://localhost:8090/student/display';
            const queryParams = { "viewByStd": grade, "viewBySection": section, "minPercent": minMark, "maxPercent": maxMark }
            const url = new URL(apiUrl);
            url.search = new URLSearchParams(queryParams).toString();

            const resp = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            const res = await resp.json();
            console.log(res.output);
            setDisplayData(res.output);
        } catch (err) {
            console.log(err);
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
        } finally {
            e.target.reset();
        }
    };

    return (
        <SearchBoxSection>
            < ToastContainer />
            <SearchParamSection>
                <div>
                    <SearchForm action="" onSubmit={(e) => { fetchData(e) }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", alignItems: "center" }}>
                            <span>
                                <label htmlFor="section">
                                    Provide Class Section:
                                </label>
                                <input type="text" name="section" placeholder="Enter section here" maxLength={2} onChange={(e) => { changeHandler(e, "section") }} />
                            </span>
                            {/* {viewByStd,viewBySection,minPercent,maxPercent} */}
                            <span>
                                <label htmlFor="std">
                                    Provide grade of class you wish to check result:
                                </label>
                                <input type="number" name="std" placeholder="Enter standard here" onChange={(e) => { changeHandler(e, "grade") }} />
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", margin: "1rem", alignItems: "center" }}>
                            <label htmlFor="minpercent">Enter a range of marks you wish to filter : </label>
                            <span>
                                <input type="number" name="minpercent" placeholder="min percentage" onChange={(e) => { changeHandler(e, "min") }} />
                                <input type="number" name="maxpercent" placeholder="max percentage" onChange={(e) => { changeHandler(e, "max") }} />
                            </span>
                        </div>
                        <ErrorSpan id="minmaxerror" ref={errorComp}></ErrorSpan>
                        <div>
                            <StyledButton ref={buttonComp} type="submit">Submit</StyledButton>
                        </div>
                    </SearchForm>
                </div>
            </SearchParamSection>
            {displayData === "no result found" ? <span style={{ background: "#fa6c61", padding: "5px" }}>No Results Found</span> : <SearchOutputSection>
                <SubInfo style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Standard</th>
                            <th>Section</th>
                            <th>Subject Name</th>
                            <th>Practical Marks</th>
                            <th>Theory Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData?.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <TableEntry>{element.studentName}</TableEntry>
                                    <TableEntry>{element.standard}</TableEntry>
                                    <TableEntry>{element.section}</TableEntry>
                                    <TableEntry>{element.subject}</TableEntry>
                                    <TableEntry>{element.practicalMarks}</TableEntry>
                                    <TableEntry>{element.theoryMarks}</TableEntry>
                                    <TableEntry>{element.grade}</TableEntry>
                                </tr>
                            )
                        })}
                    </tbody>
                </SubInfo>
            </SearchOutputSection>}
        </SearchBoxSection>
    )
}