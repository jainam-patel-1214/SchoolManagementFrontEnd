import { Navbar } from './components/Navbar'
import { SignIn } from './components/Signin'
import { StudentHomePage } from './components/studentComponents/Home'
import { SchoolResult } from './components/studentComponents/SchoolRes'
import { SubjectSearch } from './components/studentComponents/Subject'
import { TeacherHome } from './components/teacherComponents/Home'
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
      </Route>
      {/* <Route path='app/admin'>
      </Route> */}
    </Routes>
  )
}

export default App
