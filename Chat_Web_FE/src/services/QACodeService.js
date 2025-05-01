const QaCodeService = {
    async getUserBySessionId(sessionId) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/qacode/${sessionId}`);
        
        if (response.status === 404) {
          console.warn('Không tìm thấy user với sessionId:', sessionId);
          return null;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Lỗi khi gọi API getUserBySessionId:', error);
        throw error;
      }
    }
  };
  
  export default QaCodeService;
  