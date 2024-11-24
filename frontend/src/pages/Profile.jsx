import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimelineIcon from '@mui/icons-material/Timeline';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const stats = {
    totalQuestions: 156,
    todayQuestions: 8,
    remainingQuota: user?.subscription_type === 'free' ? 5 - 8 : '无限制',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 用户信息卡片 */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <AccountCircleIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" textAlign="center" gutterBottom>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Chip
                  label={user?.subscription_type === 'premium' ? '高级会员' : '免费用户'}
                  color={user?.subscription_type === 'premium' ? 'primary' : 'default'}
                />
              </Box>
              {user?.subscription_type !== 'premium' && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/subscription')}
                >
                  升级到高级会员
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 使用统计 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <QueryStatsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                使用统计
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography color="text.secondary">总提问次数</Typography>
                    <Typography variant="h4">{stats.totalQuestions}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography color="text.secondary">今日提问</Typography>
                    <Typography variant="h4">{stats.todayQuestions}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography color="text.secondary">剩余额度</Typography>
                    <Typography variant="h4">{stats.remainingQuota}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 