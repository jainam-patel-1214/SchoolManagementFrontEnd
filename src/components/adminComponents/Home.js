import styled from "styled-components"
import { useState, useEffect } from "react"
import { Label, LabelValue, PerformanceWindow, StudentHomeSection, StudentInfo, SubInfo, TableEntry, Value } from "../studentComponents/Home"
import { ToastContainer, toast } from "react-toastify"
export const AdminHome = (props) => {
    const [displayData, setDisplayData] = useState({})

    useEffect(() => {
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
    }, []);
    // useEffect(() => {

    // }, [])

    return (
        <div>
            <StudentHomeSection>
                < ToastContainer />
                <StudentInfo style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "center",alignItems:"center", flexDirection: "column",border: "2px double blue",padding:"1rem" }}>
                        <div>
                            <h3>Credentials:</h3>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly",width: "100%"}}>
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
                        </div>
                    </div>
                </StudentInfo>
            </StudentHomeSection>
        </div>
    )
}
