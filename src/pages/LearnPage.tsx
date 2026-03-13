import AppLayout from "@/components/layout/AppLayout";
import LearningPathMap from "@/components/learn/LearningPathMap";

const LearnPage = () => {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <LearningPathMap />
        </div>
      </div>
    </AppLayout>
  );
};

export default LearnPage;
