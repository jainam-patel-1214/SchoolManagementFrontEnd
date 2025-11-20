import { Navbar } from './components/Navbar'
import { SignIn } from './components/Signin'
import { StudentHomePage } from './components/studentComponents/Home'
import { SchoolResult } from './components/studentComponents/SchoolRes'
import { SubjectSearch } from './components/studentComponents/Subject'
import { TeacherHome } from './components/teacherComponents/Home'
import { MarkAddTab, MarkEditTab } from './components/teacherComponents/MarkTab'
import { ReviewTab } from './components/teacherComponents/Review'
import { StudentAddTab, StudentDelTab, StudentEditTab, StudentTab } from './components/teacherComponents/StudentsTab'
import { SubAddTab, SubDelTab, SubEditTab, SubTab } from './components/teacherComponents/SubjectTab'
import './index.css'
import { Routes, Route } from 'react-router-dom'

function App() {


  return (
    <Routes>
      <Route index element={<SignIn />}></Route>
      <Route path="signIn" element={<SignIn />}></Route>
      <Route path="app/student" element={<Navbar />}>
        <Route index element={<StudentHomePage />}/>
        <Route path='schoolResult' element={<SchoolResult />}></Route>
        <Route path='searchSubject' element={<SubjectSearch />}></Route>
      </Route>
      <Route path='app/teacher' element={<Navbar />}>
        <Route index element={<TeacherHome />}/>
        <Route path='reviews' element={<ReviewTab />}></Route>
        <Route path='displayStudent' element={<StudentTab />}></Route>
        <Route path='addStudent' element={<StudentAddTab />}></Route>
        <Route path='editStudent' element={<StudentEditTab />}></Route>
        <Route path='deleteStudent' element={<StudentDelTab />}></Route>
        <Route path='displaySubject' element={<SubTab />}></Route>
        <Route path='addSubject' element={<SubAddTab />}></Route>
        <Route path='editSubject' element={<SubEditTab />}></Route>
        <Route path='deleteSubject' element={<SubDelTab />}></Route>
        <Route path='enterMarks' element={<MarkAddTab />}></Route>
        <Route path='editMarks' element={<MarkEditTab />}></Route>
      </Route>
      {/* <Route path='app/admin'>
      </Route> */}
    </Routes>
  )
}

export default App
