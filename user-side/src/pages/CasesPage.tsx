import { useEffect, useState } from "react";

interface User {
  name: string;
}

interface Post {
  content: string;
}

interface AssignedTo {
  name: string;
  contact: string;
}

interface CaseItem {
  id: number;
  user: User;
  post: Post;
  status: "PENDING" | "RESOLVED";
  assignedTo?: AssignedTo;
}

const CasePage = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = `https://gbv-support.onrender.com/api`;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cases`);
        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }
        const data: CaseItem[] = await response.json();
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [API_BASE_URL]);

  if (loading) return <p className="text-center mt-4">Loading cases...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold text-purple-600 text-center mb-4">Reported Cases</h1>
      {cases.length === 0 ? (
        <p className="text-center">No cases reported yet.</p>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white p-4 rounded shadow-md border">
              <h2 className="text-lg font-semibold">Case ID: {caseItem.id}</h2>
              <p><strong>Reported By:</strong> {caseItem.user.name}</p>
              <p><strong>Post:</strong> {caseItem.post.content}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-white ${caseItem.status === 'PENDING' ? 'bg-yellow-500' : 'bg-green-500'}`}>{caseItem.status}</span></p>
              {caseItem.assignedTo && (
                <p><strong>Assigned To:</strong> {caseItem.assignedTo.name} ({caseItem.assignedTo.contact})</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CasePage;