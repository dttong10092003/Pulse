import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import UserInfo from "./pages/userInfo/UserInfo";
import { Provider } from 'react-redux';
import { store } from './redux/store';
const App = () => {
  return (
    <Provider store={store}>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/userinfo" element={<UserInfo />} />
      <Route path="/home/*" element={<Home />} /> {/* thêm để quản lý các route con */}
    </Routes>
    </Provider>
  )
}

export default App