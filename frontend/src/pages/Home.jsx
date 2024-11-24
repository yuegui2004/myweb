import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompareIcon from '@mui/icons-material/Compare';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <CompareIcon sx={{ fontSize: 40 }} />,
      title: '多模型对比',
      description: '同时获取多个AI模型的回答，直观对比差异',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: '实时响应',
      description: '并行调用API，快速获取所有模型的回答',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: '安全可靠',
      description: '数据加密传输，保护您的隐私安全',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(120deg, #2196f3 0%, #7c4dff 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" gutterBottom>
                AI模型对比平台
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                一站式体验多个主流AI模型的能力差异
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
                onClick={() => navigate('/compare')}
              >
                立即体验
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* 这里可以放置一个动画或图片 */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 