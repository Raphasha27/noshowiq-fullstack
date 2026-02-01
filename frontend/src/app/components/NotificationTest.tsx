export default function NotificationTest() {
  const testSignalR = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/overbook', {
        method: 'POST'
      });
      console.log(await response.json());
    } catch (e) {
      console.error("Backend not reachable (Simulated Mode active in Frontend)", e);
    }
  };

  return null; 
}
