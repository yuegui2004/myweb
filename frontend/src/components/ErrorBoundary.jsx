import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            出错了！
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            抱歉，页面加载出现问题。
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 