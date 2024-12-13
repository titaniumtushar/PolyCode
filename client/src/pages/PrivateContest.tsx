import React, { useEffect, useState } from 'react';
import { API_URL } from '../App';
import ProblemSet from './ProblemSet';
import { useNavigate } from 'react-router-dom';

const PrivateContest: React.FC = () => {
  const navigate = useNavigate();
  const [contest, setContest] = useState({});
  const [token, setToken] = useState<string | null>(null);
  
  const [output, setOutput] = useState<string | any[]>(null); // Can be string or array
  const contestId = window.location.pathname.split('/').pop();
  const [error, setError] = useState<any>(null);

  

  
  useEffect(() => {

    
    const joinPrivateContest = async () => {
      try {

        console.log(`${API_URL}/api/user/join/private/contest`);
        const response = await fetch(`${API_URL}/api/user/join/private/contest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `BEARER ${localStorage.getItem('token')}`,
          },
          body:JSON.stringify({contest_id:contestId})
        });

        const data = await response.json();

        
        console.log(data,"this is cooolll");

        if (response.ok && data.token) {
          setToken(data.token);
          const eventSource = new EventSource(`${API_URL}/api/user/join/${data.token}`);

          eventSource.onmessage = (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            console.log(eventData, 'this is data');

            if (eventData.contest) {
              if (new Date().valueOf() / 1000 > eventData.contest.end_time) {
                setError('Contest has ended');
                eventSource.close();
              }

              if (new Date().valueOf() / 1000 < eventData.contest.start_time) {
                setError('Contest has not started');
                eventSource.close();
              }

              setContest(eventData.contest);
            }
          };

          eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();
          };

          return () => {
            eventSource.close();
          };
        } else {
          setError(data.message || 'Failed to join the contest');
        }
      } catch (err) {
        console.log(err);
        console.error('Error joining private contest:', err);
        setError('Error joining private contest');
      }
    };

  
      joinPrivateContest();
    
  }, []);

  return (
    <>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <div style={styles.container}>
            {/* Part 1: Sidebar */}
            <div style={styles.sidebar}>
              <h4 style={styles.sectionHeader}>Submission Results</h4>

              {output ? (
                Array.isArray(output) ? (
                  // Handle output as an array
                  output.map((out, index) => (
                    <div key={index} style={styles.outputBlock}>
                      <span style={styles.outputLabel}>Output {index + 1}:</span>
                      <pre style={styles.outputText}>{JSON.stringify(out, null, 2)}</pre>
                    </div>
                  ))
                ) : (
                  // Handle output as a single string
                  <div style={styles.outputBlock}>
                    <span style={styles.outputLabel}>Output:</span>
                    <pre style={styles.outputText}>{output}</pre>
                  </div>
                )
              ) : (
                <p style={styles.noResults}>No results to display yet.</p>
              )}
            </div>

            {/* Part 2 and 3: Main Content */}
            <div style={styles.mainContent}>
              {/* Part 2: ProblemSet */}
              <div style={styles.problemSet}>
                {contest && (
                  <ProblemSet
                    questions={contest.question_set || []}
                    token={token}
                    setOutput={setOutput}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#1f1f1f',
    color: '#f9f9f9',
  },
  sidebar: {
    flex: '1',
    padding: '20px',
    borderRight: '1px solid #333',
    backgroundColor: '#252525',
    overflowY: 'auto',
  },
  mainContent: {
    flex: '3',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  problemSet: {
    flex: '2',
    padding: '20px',
    borderBottom: '1px solid #333',
    backgroundColor: '#1f1f1f',
  },
  sectionHeader: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#22c55e',
  },
  outputBlock: {
    padding: '10px',
    backgroundColor: '#333',
    borderRadius: '4px',
    marginTop: '15px',
  },
  outputLabel: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#808080',
  },
  outputText: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#f9f9f9',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  noResults: {
    fontSize: '14px',
    color: '#808080',
  },
};

export default PrivateContest;
