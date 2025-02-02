import Background from "./components/Background";
import CircleDrawer from "../shapes/PenTool";

const App = () => {
  return (
    <div className="relative w-full h-screen">
      <Background />
      <CircleDrawer />
    </div>
  );
};

export default App;
