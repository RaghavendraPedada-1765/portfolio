import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
import MainContainer from "./components/MainContainer";
import SceneBoundary from "./components/Character/SceneBoundary";
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <SceneBoundary>
              <Suspense fallback={<div className="character-container" />}>
                <CharacterModel />
              </Suspense>
            </SceneBoundary>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
