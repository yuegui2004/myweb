import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { useNotification } from '../hooks/useNotification';

const Compare = () => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = useNotification();
  const user = useSelector(state => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/questions', { content: question });
      setResponses(data.responses);
    } catch (error) {
      notify.error(error.response?.data?.detail || '获取AI回答失败');
    } finally {
      setLoading(false);
    }
  };

  const ChatGPTResponseCard = ({ response }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            ChatGPT
          </Typography>
          <Chip 
            label={response.model} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {response.content}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Tokens: {response.usage?.total_tokens || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            响应时间: {new Date(response.created * 1000).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const GeminiResponseCard = ({ response }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gemini
          </Typography>
          <Chip 
            label={response.model} 
            size="small" 
            color="secondary" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {response.content}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {response.safety_ratings && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              安全评级:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {response.safety_ratings.map((rating, index) => (
                <Chip
                  key={index}
                  label={`${rating.category}: ${rating.probability}`}
                  size="small"
                  color={rating.probability === 'NEGLIGIBLE' ? 'success' : 'warning'}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            完成原因: {response.finish_reason}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            响应时间: {new Date(response.created * 1000).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const KimiResponseCard = ({ response }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Kimi
          </Typography>
          <Chip 
            label={response.model}
            size="small" 
            color="info" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {response.content}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Token使用情况:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Chip
              label={`提示词: ${response.usage?.prompt_tokens || 0}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`完成: ${response.usage?.completion_tokens || 0}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`总计: ${response.usage?.total_tokens || 0}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            ID: {response.id?.slice(-6)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            完成原因: {response.finish_reason}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            响应时间: {new Date(response.created * 1000).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const ErnieResponseCard = ({ response }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            文心一言
          </Typography>
          <Chip 
            label={response.model}
            size="small" 
            color="warning" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {response.content}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Token使用情况:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Chip
              label={`提示词: ${response.usage?.prompt_tokens || 0}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`完成: ${response.usage?.completion_tokens || 0}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`总计: ${response.usage?.total_tokens || 0}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            ID: {response.id?.slice(-6)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            状态标识: {response.flag}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            完成原因: {response.finish_reason}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            响应时间: {new Date(response.created * 1000).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入您的问题..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !question}
          sx={{ mb: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : '获取AI回答'}
        </Button>
      </form>

      {responses && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <ChatGPTResponseCard response={responses.chatgpt} />
          </Grid>
          <Grid item xs={12} md={3}>
            <GeminiResponseCard response={responses.gemini} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KimiResponseCard response={responses.kimi} />
          </Grid>
          <Grid item xs={12} md={3}>
            <ErnieResponseCard response={responses.ernie} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Compare; 