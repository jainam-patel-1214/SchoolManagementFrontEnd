import styled from "styled-components"
import { useState, useEffect } from "react"
import { Label, LabelValue, PerformanceWindow, StudentHomeSection, StudentInfo, SubInfo, TableEntry, Value } from "../studentComponents/Home"
import { ToastContainer, toast } from "react-toastify"
export const TeacherHome = (props) => {
    const [displayData, setDisplayData] = useState({})
    const [displayReport, setDisplayReport] = useState({})

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const resp = await fetch(`http://localhost:8090/${props.roleOfPerson}/displayPerformance`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const res = await resp.json();
                console.log("performance", res.output);
                setDisplayReport(res.output);
            } catch (err) {
                console.log(err);
                toast.error(err.error || "Something went wrong", {
                })
            }
        };
        const fetchData = async () => {
            try {
                const resp = await fetch(`http://localhost:8090/${props.roleOfPerson}/data`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const res = await resp.json();
                console.log("data", res.output);
                setDisplayData(res.output);
            } catch (err) {
                console.log(err);
                toast.error(err.error || "Something went wrong", {

                })
            }
        };
        fetchData()
        fetchReport()
    }, []);
    // useEffect(() => {

    // }, [])

    return (
        <div>
            <StudentHomeSection>
                < ToastContainer />
                <StudentInfo style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <LabelValue>
                            <Label><strong>Id:</strong></Label>
                            <Value>{displayData.Id}</Value>
                        </LabelValue>
                        <LabelValue>
                            <Label><strong>Name:</strong></Label>
                            <Value>{displayData.Name}</Value>
                        </LabelValue>
                        <LabelValue>
                            <Label><strong>Password:</strong></Label>
                            <Value>{displayData.Password}</Value>
                        </LabelValue>
                        {/* </div>
                    <div style={{display:"flex",justifyContent:"space-evenly"}}> */}
                        <LabelValue>
                            <Label><strong>Subject allocated Id:</strong></Label>
                            <Value>{displayData.SubId}</Value>
                        </LabelValue>
                        <LabelValue>
                            <Label><strong>Class Allocated:</strong></Label>
                            <Value>{displayData.Std + displayData.Section}</Value>
                        </LabelValue>
                    </div>
                </StudentInfo>
            </StudentHomeSection>
            <PerformanceWindow>
                <h2>Performance among peers</h2>
                <div style={{ border: "1px solid black", width: "100%" }}>
                    <div style={{ border: "1px solid black", margin: "10px", padding: "1rem", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                        <h3>Compare Your Stats</h3>
                        {displayReport?.length > 0 ? <>
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
                                    {displayReport?.map((element, index) => {
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
                        </> : <>No performance report</>}
                    </div>
                </div>
            </PerformanceWindow>
        </div>
    )
}
