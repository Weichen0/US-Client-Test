
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/chat';
import NavBar from './components/NavBar';
import UploadPage from './pages/upload';
import HomePage from './pages/home';
import NestChatPage from './pages/nestchat';
import SignInPage from './pages/signIn';
import BillingPage from './pages/billing';
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
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/billing" element={<BillingPage />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
