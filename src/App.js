
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/chat';
import NavBar from './components/NavBar';
import UploadPage from './pages/upload';
import HomePage from './pages/home';
import NestChatPage from './pages/nestchat';
function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <div style={{ maxWidth: 1000, margin: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/nest-chat" element={<NestChatPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
