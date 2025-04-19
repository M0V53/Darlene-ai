import ChatInterface from "@/components/ChatInterface";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>D4RLENE: Hacker AI Companion</title>
        <meta name="description" content="Voice-activated AI hacker companion inspired by Darlene from Mr. Robot" />
      </Helmet>
      <ChatInterface />
    </>
  );
};

export default Home;
