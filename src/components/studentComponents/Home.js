import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";

export const StudentHomeSection = styled.div`
    display: flex;
    flex-direction: row;
    /* width: 100%; */
    justify-content: space-evenly;
    padding: 1rem;
`
export const StudentInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 45%;
    margin: .5rem;
`
export const SubInfo = styled.table`
    width: 45%;
    border: 1px solid black;
    th{
        border: 1px solid black;
    }
    td{
        border: 1px solid black;
    }
`
export const TableEntry = styled.td`
    text-align: center;
`
export const LabelValue = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`
export const Label = styled.p`
    /* width: 50%; */
`
export const Value = styled.p`
    /* width: 50%; */
`
export const PerformanceWindow = styled.div`
    display: flex;
    margin:10px;
    flex-direction: column;
    align-items: center;

`

export const StudentHomePage = () => {
    const [displayData, setDisplayData] = useState({})
    const [displayReport, setDisplayReport] = useState({})
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const resp = await fetch('http://localhost:8090/student/report', {
                    method: 'GET',
                    credentials: 'include',
                });
                const res = await resp.json();
                console.log(res.output);
                setDisplayReport(res.output);
            } catch (err) {
                console.log(err);
                toast.error(err.error || "Something went wrong", {
                })
            }
        };
        fetchReport()
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch('http://localhost:8090/student/data', {
                    method: 'GET',
                    credentials: 'include',
                });
                const res = await resp.json();
                console.log(res.output);
                setDisplayData(res.output);
            } catch (err) {
                console.log(err);
                toast.error(err.error || "Something went wrong", {

                })
            }
        };
        fetchData()
    }, [])

    return (
        <div>
            <StudentHomeSection>
                < ToastContainer />
                <StudentInfo>
                    <LabelValue>
                        <Label><strong>Standard:</strong></Label>
                        <Value>{displayData.Std}</Value>
                    </LabelValue>
                    <LabelValue>
                        <Label><strong>Password:</strong></Label>
                        <Value>{displayData.Password}</Value>
                    </LabelValue>
                    <LabelValue>
                        <Label><strong>Section:</strong></Label>
                        <Value>{displayData.Section}</Value>
                    </LabelValue>
                </StudentInfo>
                {displayData.SubList?.length > 0 ? <SubInfo>
                    <thead>
                        <tr>
                            <th>Subject Id</th>
                            <th>Name</th>
                            <th>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.SubList?.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <TableEntry>{element.Subid}</TableEntry>
                                    <TableEntry>{element.Subname}</TableEntry>
                                    <TableEntry>{element.Credit}</TableEntry>
                                </tr>
                            )
                        })}
                    </tbody>
                </SubInfo> : <>No Subject Info Found</>}
            </StudentHomeSection>
            <PerformanceWindow>
                <h2>Report Card</h2>
                <div style={{ border: "1px solid black", width: "100%" }}>
                    <div style={{ border: "1px solid black", margin: "10px", padding: "1rem", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                        <h3>Comments</h3>
                        {displayReport.CommentInfo?.length > 0 ? <>
                            <SubInfo style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Teacher Id</th>
                                        <th>Teacher Name</th>
                                        <th>Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayReport.CommentInfo?.map((element, index) => {
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
                        {displayReport.MarkInfo?.length > 0 ? <>
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
                                    {displayReport.MarkInfo?.map((element, index) => {
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
        </div>
    )
}