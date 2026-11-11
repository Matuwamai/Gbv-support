import EducationalSection from "../components/EducationSection";
import AwarenessEducationPage from "./AwarenessEducationPage";

// Awareness and education content for signed-in users (also shown on the landing page).
const LearnPage = () => (
  <div className="mt-12">
    <AwarenessEducationPage />
    <EducationalSection />
  </div>
);

export default LearnPage;
