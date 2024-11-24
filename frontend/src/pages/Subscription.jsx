import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from '../utils/axios';

const Subscription = () => {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'monthly',
      title: '月度会员',
      price: '￥29.9',
      period: '每月',
      features: [
        '无限制提问次数',
        '优先响应',
        '历史记录永久保存',
        '高级数据分析',
      ],
    },
    {
      id: 'yearly',
      title: '年度会员',
      price: '￥299',
      period: '每年',
      features: [
        '无限制提问次数',
        '优先响应',
        '历史记录永久保存',
        '高级数据分析',
        '专属客服支持',
        '每月可获得5次GPT-4提问',
      ],
      recommended: true,
    },
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/subscriptions/create-checkout', {
        planId,
      });
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('订阅失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" textAlign="center" gutterBottom>
        选择您的订阅计划
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        解锁所有高级功能，享受无限制的AI模型对比体验
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                transform: plan.recommended ? 'scale(1.05)' : 'none',
                border: plan.recommended ? '2px solid #2196f3' : 'none',
              }}
            >
              {plan.recommended && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: -32,
                    background: '#2196f3',
                    color: 'white',
                    py: 1,
                    px: 4,
                    transform: 'rotate(45deg)',
                  }}
                >
                  推荐
                </Box>
              )}
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  {plan.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                  <Typography variant="h3">{plan.price}</Typography>
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    /{plan.period}
                  </Typography>
                </Box>
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 4 }}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : '立即订阅'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Subscription; 