import { ToastContainer, toast } from "react-toastify"
import { useState, useEffect, useRef } from "react"
import { StyledButton } from "../../styled-components/styledButton"
import { SubInfo, TableEntry } from "../studentComponents/Home"

export const SubjectLImit = (props)=>{
    const errorComp = useRef(null)
    const buttonComp = useRef(null)
    const [grade, setGrade] = useState(null)
    const [limit, setLimit] = useState(null)
    const [displayData, setDisplayData] = useState()
    return(
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